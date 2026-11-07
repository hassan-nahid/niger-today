const { Settings } = require("../models");

/**
 * Calculate expiring window days directly from the 7, 3, 1 day reminder toggles
 * @param {Object} settings
 * @returns {number}
 */
const calculateWindowDays = (settings) => {
  if (settings.remind7Days) return 7;
  if (settings.remind3Days) return 3;
  if (settings.remind1Day) return 1;
  return 0;
};

/**
 * Get system settings (or create default if not found)
 * @returns {Promise<Settings>}
 */
const getSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      expiringWindowDays: 7,
      graceEnabled: false,
      graceDays: 5,
      remind7Days: true,
      remind3Days: true,
      remind1Day: true,
      reminderTemplate:
        "Hello {name}, your Niger Today TV subscription will expire on {date}. Please renew to continue your service uninterrupted.",
      timezone: "Asia/Dhaka",
    });
  }
  return settings;
};

/**
 * Update system settings
 * @param {Object} updateBody
 * @returns {Promise<Settings>}
 */
const updateSettings = async (updateBody) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(updateBody);
  } else {
    Object.assign(settings, updateBody);
  }

  // Sync expiringWindowDays directly from the 7, 3, 1 day toggles
  settings.expiringWindowDays = calculateWindowDays(settings);
  await settings.save();
  return settings;
};

module.exports = {
  getSettings,
  updateSettings,
  calculateWindowDays,
};

