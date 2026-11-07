const express = require("express");
const validate = require("../../middlewares/validate");
const { customerValidation } = require("../../validations");
const { customerController } = require("../../controllers");

const router = express.Router();

// Stats route (MUST be placed before /:customerId)
router.get("/stats", customerController.getCustomerStats);
router.post("/trigger-reminders", customerController.triggerAutomatedReminders);

router
  .route("/")
  .post(validate(customerValidation.createCustomer), customerController.createCustomer)
  .get(validate(customerValidation.getCustomers), customerController.getCustomers);

router
  .route("/:customerId")
  .get(validate(customerValidation.getCustomer), customerController.getCustomer)
  .patch(validate(customerValidation.updateCustomer), customerController.updateCustomer)
  .delete(validate(customerValidation.deleteCustomer), customerController.deleteCustomer);

router.post(
  "/:customerId/renew",
  validate(customerValidation.renewCustomer),
  customerController.renewCustomer
);

router.post(
  "/:customerId/reminder",
  validate(customerValidation.sendReminder),
  customerController.sendReminder
);

module.exports = router;

