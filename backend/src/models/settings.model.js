const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const settingsSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    expiringWindowDays: {
      type: Number,
      default: 10,
    },
    graceEnabled: {
      type: Boolean,
      default: false,
    },
    graceDays: {
      type: Number,
      enum: [5, 10, 15, 20, 25],
      default: 5,
    },
    remind10Days: {
      type: Boolean,
      default: true,
    },
    remind7Days: {
      type: Boolean,
      default: false,
    },
    remind3Days: {
      type: Boolean,
      default: true,
    },
    remind1Day: {
      type: Boolean,
      default: true,
    },
    reminderTemplate: {
      type: String,
      default:
        "Hello {name}, your Niger Today TV subscription will expire on {date}. Please renew to continue your service uninterrupted.",
    },
    timezone: {
      type: String,
      default: "Asia/Dhaka",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

settingsSchema.plugin(toJSON);

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;

