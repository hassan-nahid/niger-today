const httpStatus = require("http-status");
const { Customer, Settings } = require("../models");
const ApiError = require("../utils/ApiError");
const emailService = require("./email.service");

/**
 * Calculate expiring window days directly from reminder settings (7, 3, 1 day)
 * @param {Object} settings
 * @returns {number}
 */
const calculateWindowDays = (settings) => {
  if (!settings) return 10;
  if (settings.remind10Days) return 10;
  if (settings.remind7Days) return 7;
  if (settings.remind3Days) return 3;
  if (settings.remind1Day) return 1;
  return 0;
};

/**
 * Create a new customer
 * @param {Object} customerBody
 * @returns {Promise<Customer>}
 */
const createCustomer = async (customerBody) => {
  const startDate = customerBody.startDate ? new Date(customerBody.startDate) : new Date();
  const durationMonths = Number(customerBody.durationMonths) || 3;

  const expiresAt = new Date(startDate);
  expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

  const initialRenewal = {
    periodStart: startDate,
    periodEnd: expiresAt,
    durationMonths,
    type: "initial",
    startedFrom: "payment",
    paymentDate: startDate,
    createdAt: new Date(),
  };

  const customer = await Customer.create({
    ...customerBody,
    startDate,
    durationMonths,
    expiresAt,
    renewals: [initialRenewal],
  });

  return customer;
};

/**
 * Query customers with filter and status
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<Object>}
 */
const queryCustomers = async (filter = {}, options = {}) => {
  const now = new Date();
  const settings = (await Settings.findOne()) || {
    remind7Days: true,
    remind3Days: true,
    remind1Day: true,
    graceEnabled: false,
    graceDays: 5,
  };
  const windowDays = calculateWindowDays(settings);
  const graceDays = settings.graceEnabled ? Number(settings.graceDays) || 0 : 0;

  const windowDate = new Date();
  windowDate.setDate(windowDate.getDate() + windowDays);

  const graceDate = new Date();
  graceDate.setDate(graceDate.getDate() - graceDays);

  const query = {};

  // Text search on name, phone, or email
  if (filter.search && filter.search.trim()) {
    const searchRegex = new RegExp(filter.search.trim(), "i");
    query.$or = [
      { fullName: searchRegex },
      { phone: searchRegex },
      { email: searchRegex },
    ];
  }

  // Filter by subscription status with dynamic settings
  if (filter.status && filter.status !== "all") {
    if (filter.status === "active") {
      query.expiresAt = { $gt: windowDate };
    } else if (filter.status === "expiring") {
      query.expiresAt = { $gte: now, $lte: windowDate };
    } else if (filter.status === "expired") {
      // If grace period is enabled, customer is expired after grace period ends
      query.expiresAt = { $lt: graceDate };
    } else if (filter.status === "grace") {
      query.expiresAt = { $lt: now, $gte: graceDate };
    }
  }

  const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 50;
  const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
  const skip = (page - 1) * limit;

  const totalResults = await Customer.countDocuments(query);
  const customers = await Customer.find(query)
    .sort({ expiresAt: 1 })
    .skip(skip)
    .limit(limit);

  // Format status dynamically based on active 7, 3, 1 day settings
  const formattedCustomers = customers.map((c) => {
    const custObj = c.toJSON();
    const days = custObj.daysRemaining;
    if (days < 0) {
      custObj.status = "expired";
    } else if (days <= windowDays && windowDays > 0) {
      custObj.status = "expiring";
    } else {
      custObj.status = "active";
    }
    return custObj;
  });

  return {
    results: formattedCustomers,
    page,
    limit,
    totalPages: Math.ceil(totalResults / limit) || 1,
    totalResults,
    activeSettings: {
      expiringWindowDays: windowDays,
      graceEnabled: settings.graceEnabled,
      graceDays,
    },
  };
};

/**
 * Get dashboard stats for customers dynamically computed using settings
 * @returns {Promise<Object>}
 */
const getCustomerStats = async () => {
  const now = new Date();
  const settings = (await Settings.findOne()) || {
    remind7Days: true,
    remind3Days: true,
    remind1Day: true,
    graceEnabled: false,
    graceDays: 5,
  };
  const windowDays = calculateWindowDays(settings);
  const graceDays = settings.graceEnabled ? Number(settings.graceDays) || 0 : 0;

  const windowDate = new Date();
  windowDate.setDate(windowDate.getDate() + windowDays);

  const graceDate = new Date();
  graceDate.setDate(graceDate.getDate() - graceDays);

  const [total, active, expiring, expired, inGrace] = await Promise.all([
    Customer.countDocuments({}),
    Customer.countDocuments({ expiresAt: { $gt: windowDate } }),
    Customer.countDocuments({ expiresAt: { $gte: now, $lte: windowDate } }),
    Customer.countDocuments({ expiresAt: { $lt: graceDate } }),
    Customer.countDocuments({ expiresAt: { $lt: now, $gte: graceDate } }),
  ]);

  return {
    total,
    active,
    expiring,
    expired,
    inGrace: settings.graceEnabled ? inGrace : 0,
    settings: {
      expiringWindowDays: windowDays,
      graceEnabled: settings.graceEnabled,
      graceDays,
    },
  };
};

/**
 * Get customer by id
 * @param {ObjectId} id
 * @returns {Promise<Customer>}
 */
const getCustomerById = async (id) => {
  const customer = await Customer.findById(id);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Customer not found");
  }
  const settings = await Settings.findOne();
  const windowDays = calculateWindowDays(settings);
  const custObj = customer.toJSON();
  const days = custObj.daysRemaining;
  if (days < 0) {
    custObj.status = "expired";
  } else if (days <= windowDays && windowDays > 0) {
    custObj.status = "expiring";
  } else {
    custObj.status = "active";
  }
  return custObj;
};

/**
 * Update customer by id
 * @param {ObjectId} customerId
 * @param {Object} updateBody
 * @returns {Promise<Customer>}
 */
const updateCustomerById = async (customerId, updateBody) => {
  const customer = await getCustomerById(customerId);

  // If startDate or durationMonths are updated, re-calculate expiresAt
  if (updateBody.startDate || updateBody.durationMonths) {
    const sDate = updateBody.startDate ? new Date(updateBody.startDate) : customer.startDate;
    const dMonths = updateBody.durationMonths ? Number(updateBody.durationMonths) : customer.durationMonths;
    const expiresAt = new Date(sDate);
    expiresAt.setMonth(expiresAt.getMonth() + dMonths);
    customer.expiresAt = expiresAt;
  }

  Object.assign(customer, updateBody);
  await customer.save();
  return customer;
};

/**
 * Delete customer by id
 * @param {ObjectId} customerId
 * @returns {Promise<Customer>}
 */
const deleteCustomerById = async (customerId) => {
  const customer = await getCustomerById(customerId);
  await customer.deleteOne();
  return customer;
};

/**
 * Renew customer subscription
 * @param {ObjectId} customerId
 * @param {Object} renewBody { durationMonths, startedFrom, paymentDate }
 * @returns {Promise<Customer>}
 */
const renewCustomer = async (customerId, renewBody) => {
  const customer = await getCustomerById(customerId);
  const settings = (await Settings.findOne()) || {};
  const now = new Date();
  const durationMonths = Number(renewBody.durationMonths) || 3;
  const startedFrom = renewBody.startedFrom || "expiry";
  const paymentDate = renewBody.paymentDate ? new Date(renewBody.paymentDate) : now;

  const graceDays = settings.graceEnabled ? Number(settings.graceDays) || 0 : 0;
  const inGracePeriod =
    customer.expiresAt &&
    now <= new Date(new Date(customer.expiresAt).getTime() + graceDays * 24 * 60 * 60 * 1000);

  let periodStart;
  if (startedFrom === "payment") {
    periodStart = paymentDate;
  } else {
    // startedFrom === "expiry"
    // If active, expiring soon, OR currently in grace period, maintain continuous service from original expiry
    if (customer.expiresAt && (customer.expiresAt > now || inGracePeriod)) {
      periodStart = new Date(customer.expiresAt);
    } else {
      // Long expired (after grace period ended), start from today
      periodStart = now;
    }
  }

  const periodEnd = new Date(periodStart);
  periodEnd.setMonth(periodEnd.getMonth() + durationMonths);

  const newRenewal = {
    periodStart,
    periodEnd,
    durationMonths,
    type: "renewal",
    startedFrom,
    paymentDate,
    createdAt: new Date(),
  };

  customer.durationMonths = durationMonths;
  customer.expiresAt = periodEnd;
  customer.renewals.push(newRenewal);

  await customer.save();
  return customer;
};

/**
 * Send renewal reminder to customer
 * @param {ObjectId} customerId
 * @returns {Promise<Object>}
 */
const sendCustomerReminder = async (customerId) => {
  const customer = await getCustomerById(customerId);
  const settings = (await Settings.findOne()) || {
    reminderTemplate: "Hello {name}, your Niger Today TV subscription will expire on {date}. Please renew to continue your service.",
  };

  const tz = settings.timezone || "Asia/Dhaka";
  let expiryFormatted = "soon";
  try {
    expiryFormatted = customer.expiresAt
      ? customer.expiresAt.toLocaleDateString("en-US", {
          timeZone: tz,
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "soon";
  } catch {
    expiryFormatted = customer.expiresAt
      ? customer.expiresAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "soon";
  }

  const messageText = settings.reminderTemplate
    .replace(/\{name\}/g, customer.fullName)
    .replace(/\{date\}/g, expiryFormatted);

  if (customer.email) {
    try {
      await emailService.sendEmail(
        customer.email,
        "Subscription Renewal Reminder - Niger Today TV",
        `<p>${messageText}</p>`,
        messageText
      );
    } catch (err) {
      // Don't fail the API call if email delivery fails, return notice
      return {
        success: true,
        reminded: true,
        channel: "email",
        message: "Reminder recorded, but email delivery encountered an issue: " + err.message,
      };
    }
  }

  return {
    success: true,
    reminded: true,
    channel: customer.email ? "email" : "sms/manual",
    recipient: customer.fullName,
    messageText,
  };
};

/**
 * Run automated scheduled reminders based on active settings (remind7Days, remind3Days, remind1Day)
 * @returns {Promise<Object>}
 */
const runAutomatedReminders = async () => {
  const settings = (await Settings.findOne()) || {};
  const { remind7Days, remind3Days, remind1Day } = settings;
  const now = new Date();

  const daysToCheck = [];
  if (remind7Days) daysToCheck.push(7);
  if (remind3Days) daysToCheck.push(3);
  if (remind1Day) daysToCheck.push(1);

  if (daysToCheck.length === 0) {
    return { count: 0, message: "No automated reminder days enabled in settings" };
  }

  const customers = await Customer.find({});
  let sentCount = 0;

  for (const customer of customers) {
    const diffTime = new Date(customer.expiresAt).getTime() - now.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysToCheck.includes(daysLeft)) {
      await sendCustomerReminder(customer._id);
      sentCount++;
    }
  }

  return { count: sentCount, message: `Automated reminders processed for ${sentCount} customer(s)` };
};

module.exports = {
  createCustomer,
  queryCustomers,
  getCustomerStats,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
  renewCustomer,
  sendCustomerReminder,
  runAutomatedReminders,
};

