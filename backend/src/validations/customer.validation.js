const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createCustomer = {
  body: Joi.object().keys({
    fullName: Joi.string().required().trim(),
    phone: Joi.string().required().trim(),
    email: Joi.string().email().allow("", null).trim(),
    startDate: Joi.date().iso().default(() => new Date()),
    durationMonths: Joi.number().valid(3, 6, 12).required(),
  }),
};

const getCustomers = {
  query: Joi.object().keys({
    search: Joi.string().allow(""),
    status: Joi.string().valid("all", "active", "expiring", "expired"),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectId).required(),
  }),
};

const updateCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      fullName: Joi.string().trim(),
      phone: Joi.string().trim(),
      email: Joi.string().email().allow("", null).trim(),
      startDate: Joi.date().iso(),
      durationMonths: Joi.number().valid(3, 6, 12),
    })
    .min(1),
};

const deleteCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectId).required(),
  }),
};

const renewCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    durationMonths: Joi.number().valid(3, 6, 12).required(),
    startedFrom: Joi.string().valid("expiry", "payment").default("expiry"),
    paymentDate: Joi.date().iso().allow(null),
  }),
};

const sendReminder = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  renewCustomer,
  sendReminder,
};

