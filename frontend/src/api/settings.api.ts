import { apiClient } from "./axios";
import type { AppSettings, UpdateSettingsPayload } from "../types/settings";

/**
 * 1. Fetch system & reminder settings
 */
export const getSettingsApi = async (): Promise<AppSettings> => {
  const response = await apiClient.get("/settings");
  const data = response.data?.data?.attributes || response.data?.data || response.data;
  return {
    _id: data?._id,
    id: data?.id || data?._id,
    expiringWindowDays: data?.expiringWindowDays ?? 10,
    graceEnabled: data?.graceEnabled ?? false,
    graceDays: data?.graceDays ?? 5,
    remind10Days: data?.remind10Days ?? true,
    remind7Days: data?.remind7Days ?? false,
    remind3Days: data?.remind3Days ?? true,
    remind1Day: data?.remind1Day ?? true,
    reminderTemplate:
      data?.reminderTemplate ||
      "Hi {{customerName}}, your Niger Today TV subscription expires on {{expiryDate}}. Please renew to keep watching uninterrupted.",
    timezone: data?.timezone || "Asia/Dhaka",
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
  };
};

/**
 * 2. Update system & reminder settings
 */
export const updateSettingsApi = async (payload: UpdateSettingsPayload): Promise<AppSettings> => {
  const response = await apiClient.patch("/settings", payload);
  const data = response.data?.data?.attributes || response.data?.data || response.data;
  return {
    _id: data?._id,
    id: data?.id || data?._id,
    expiringWindowDays: data?.expiringWindowDays ?? 10,
    graceEnabled: data?.graceEnabled ?? false,
    graceDays: data?.graceDays ?? 5,
    remind10Days: data?.remind10Days ?? true,
    remind7Days: data?.remind7Days ?? false,
    remind3Days: data?.remind3Days ?? true,
    remind1Day: data?.remind1Day ?? true,
    reminderTemplate: data?.reminderTemplate || "",
    timezone: data?.timezone || "Asia/Dhaka",
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
  };
};

