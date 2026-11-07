const Joi = require("joi");

const updateSettings = {
  body: Joi.object()
    .keys({
      expiringWindowDays: Joi.number().integer().min(1).max(30),
      graceEnabled: Joi.boolean(),
      graceDays: Joi.number().valid(5, 10, 15, 20, 25),
      remind7Days: Joi.boolean(),
      remind3Days: Joi.boolean(),
      remind1Day: Joi.boolean(),
      reminderTemplate: Joi.string().allow(""),
      timezone: Joi.string().allow(""),
    })
    .min(1),
};

module.exports = {
  updateSettings,
};

