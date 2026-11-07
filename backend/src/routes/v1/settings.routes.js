const express = require("express");
const validate = require("../../middlewares/validate");
const { settingsValidation } = require("../../validations");
const { settingsController } = require("../../controllers");

const router = express.Router();

router
  .route("/")
  .get(settingsController.getSettings)
  .patch(validate(settingsValidation.updateSettings), settingsController.updateSettings);

module.exports = router;

