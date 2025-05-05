import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const timeLogsTable = pgTable("time_logs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  time_in: timestamp("time_in", { withTimezone: true }).notNull(),
});
