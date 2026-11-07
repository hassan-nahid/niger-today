export interface AppSettings {
  _id?: string;
  id?: string;
  expiringWindowDays: number; // default 10
  graceEnabled: boolean; // default false
  graceDays: number; // 5 | 10 | 15 | 20 | 25
  remind7Days: boolean;
  remind3Days: boolean;
  remind1Day: boolean;
  reminderTemplate: string;
  timezone: string; // default "Asia/Dhaka"
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateSettingsPayload = Partial<Omit<AppSettings, "_id" | "id" | "createdAt" | "updatedAt">>;

