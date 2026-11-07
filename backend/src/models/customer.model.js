const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const renewalSchema = mongoose.Schema(
  {
    periodStart: {
      type: Date,
      required: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    durationMonths: {
      type: Number,
      required: true,
      enum: [3, 6, 12],
    },
    type: {
      type: String,
      required: true,
      enum: ["initial", "renewal"],
      default: "initial",
    },
    startedFrom: {
      type: String,
      required: true,
      enum: ["expiry", "payment"],
      default: "expiry",
    },
    paymentDate: {
      type: Date,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const customerSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    durationMonths: {
      type: Number,
      required: true,
      enum: [3, 6, 12],
      default: 3,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    renewals: [renewalSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add text search index for fullName and phone
customerSchema.index({ fullName: "text", phone: "text" });

// Virtuals for frontend convenience
customerSchema.virtual("name").get(function () {
  return this.fullName;
});

customerSchema.virtual("expiryDate").get(function () {
  return this.expiresAt ? this.expiresAt.toISOString().split("T")[0] : "";
});

customerSchema.virtual("daysRemaining").get(function () {
  if (!this.expiresAt) return 0;
  const now = new Date();
  const diffTime = new Date(this.expiresAt).getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

customerSchema.virtual("status").get(function () {
  const days = this.daysRemaining;
  if (days < 0) return "expired";
  if (days <= 10) return "expiring";
  return "active";
});

customerSchema.virtual("initials").get(function () {
  if (!this.fullName) return "CU";
  const parts = this.fullName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
});

// Auto-calculate expiresAt and default initial renewal on validation
customerSchema.pre("validate", function (next) {
  if (this.startDate && this.durationMonths && !this.expiresAt) {
    const end = new Date(this.startDate);
    end.setMonth(end.getMonth() + Number(this.durationMonths));
    this.expiresAt = end;
  }

  // Ensure initial renewal is present
  if (!this.renewals || this.renewals.length === 0) {
    const periodStart = this.startDate ? new Date(this.startDate) : new Date();
    const periodEnd = this.expiresAt
      ? new Date(this.expiresAt)
      : (() => {
          const d = new Date(periodStart);
          d.setMonth(d.getMonth() + Number(this.durationMonths || 3));
          return d;
        })();

    this.renewals = [
      {
        periodStart,
        periodEnd,
        durationMonths: this.durationMonths || 3,
        type: "initial",
        startedFrom: "payment",
        paymentDate: periodStart,
        createdAt: new Date(),
      },
    ];
  }

  next();
});

// Add plugins
customerSchema.plugin(toJSON);
customerSchema.plugin(paginate);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;

