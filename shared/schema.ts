import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const permitInquiries = pgTable("permit_inquiries", {
  id: serial("id").primaryKey(),
  projectType: text("project_type").notNull(),
  address: text("address"),
  estimatedFee: integer("estimated_fee"),
  createdAt: text("created_at").notNull(),
});

export const insertPermitInquirySchema = createInsertSchema(permitInquiries).omit({ id: true });
export type InsertPermitInquiry = z.infer<typeof insertPermitInquirySchema>;
export type PermitInquiry = typeof permitInquiries.$inferSelect;
