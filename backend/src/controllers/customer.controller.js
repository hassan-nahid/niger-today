const httpStatus = require("http-status");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { customerService } = require("../services");

const createCustomer = catchAsync(async (req, res) => {
  const customer = await customerService.createCustomer(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Customer Created Successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: customer,
    })
  );
});

const getCustomers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["search", "status"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await customerService.queryCustomers(filter, options);
  res.status(httpStatus.OK).json(
    response({
      message: "Customers Retrieved Successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const getCustomerStats = catchAsync(async (req, res) => {
  const stats = await customerService.getCustomerStats();
  res.status(httpStatus.OK).json(
    response({
      message: "Customer Statistics Retrieved Successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: stats,
    })
  );
});

const getCustomer = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.customerId);
  res.status(httpStatus.OK).json(
    response({
      message: "Customer Retrieved Successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: customer,
    })
  );
});

const updateCustomer = catchAsync(async (req, res) => {
  const customer = await customerService.updateCustomerById(req.params.customerId, req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "Customer Updated Successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: customer,
    })
  );
});

const deleteCustomer = catchAsync(async (req, res) => {
  const customer = await customerService.deleteCustomerById(req.params.customerId);
  res.status(httpStatus.OK).json(
    response({
      message: "Customer Deleted Successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: customer,
    })
  );
});

const renewCustomer = catchAsync(async (req, res) => {
  const customer = await customerService.renewCustomer(req.params.customerId, req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "Subscription Renewed Successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: customer,
    })
  );
});

const sendReminder = catchAsync(async (req, res) => {
  const result = await customerService.sendCustomerReminder(req.params.customerId);
  res.status(httpStatus.OK).json(
    response({
      message: "Reminder Sent Successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const triggerAutomatedReminders = catchAsync(async (req, res) => {
  const result = await customerService.runAutomatedReminders();
  res.status(httpStatus.OK).json(
    response({
      message: "Automated Reminders Triggered",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerStats,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  renewCustomer,
  sendReminder,
  triggerAutomatedReminders,
};

