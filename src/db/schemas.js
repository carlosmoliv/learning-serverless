const { text, pgTable, timestamp, serial } = require("drizzle-orm/pg-core");

const leadTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  email: text("email"),
  description: text("description").default("Default description..."),
  createdAt: timestamp("created_at").defaultNow(),
});

module.exports.leadTable = leadTable;
