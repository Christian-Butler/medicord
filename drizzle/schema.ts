import { pgTable, foreignKey, uuid, text, date, timestamp, pgPolicy, numeric, integer, boolean, unique, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const profiles = pgTable("profiles", {
	id: uuid().primaryKey().notNull(),
	fullName: text("full_name").notNull(),
	dateOfBirth: date("date_of_birth"),
	email: text(),
	phone: text(),
	gpPracticeName: text("gp_practice_name"),
	gpPracticeLocation: text("gp_practice_location"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [users.id],
			name: "profiles_id_fkey"
		}).onDelete("cascade"),
]);

export const clinicians = pgTable("clinicians", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fullName: text("full_name").notNull(),
	role: text().notNull(),
	specialty: text(),
	bio: text(),
	clinicName: text("clinic_name"),
	location: text(),
	avatarUrl: text("avatar_url"),
	rating: numeric({ precision: 2, scale:  1 }),
	yearsExperience: integer("years_experience"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Anyone can view active clinicians", { as: "permissive", for: "select", to: ["public"], using: sql`(is_active = true)` }),
]);

export const clinicianServices = pgTable("clinician_services", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clinicianId: uuid("clinician_id").notNull(),
	healthcareServiceId: uuid("healthcare_service_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.clinicianId],
			foreignColumns: [clinicians.id],
			name: "clinician_services_clinician_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.healthcareServiceId],
			foreignColumns: [healthcareServices.id],
			name: "clinician_services_healthcare_service_id_fkey"
		}).onDelete("cascade"),
	unique("clinician_services_clinician_id_healthcare_service_id_key").on(table.clinicianId, table.healthcareServiceId),
]);

export const healthcareServices = pgTable("healthcare_services", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	category: text().notNull(),
	description: text(),
	imageUrl: text("image_url"),
	isBookable: boolean("is_bookable").default(true),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const appointments = pgTable("appointments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	healthcareServiceId: uuid("healthcare_service_id"),
	clinicianId: uuid("clinician_id"),
	title: text().notNull(),
	appointmentType: text("appointment_type").notNull(),
	location: text(),
	startsAt: timestamp("starts_at", { withTimezone: true, mode: 'string' }).notNull(),
	endsAt: timestamp("ends_at", { withTimezone: true, mode: 'string' }),
	status: text().default('pending').notNull(),
	reason: text(),
	notes: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	patientName: text("patient_name"),
	patientEmail: text("patient_email"),
	patientPhone: text("patient_phone"),
}, (table) => [
	foreignKey({
			columns: [table.clinicianId],
			foreignColumns: [clinicians.id],
			name: "appointments_clinician_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.healthcareServiceId],
			foreignColumns: [healthcareServices.id],
			name: "appointments_healthcare_service_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "appointments_user_id_fkey"
		}).onDelete("cascade"),
]);

export const auditLogs = pgTable("audit_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	action: text().notNull(),
	entityType: text("entity_type").notNull(),
	entityId: uuid("entity_id"),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "audit_logs_user_id_fkey"
		}).onDelete("set null"),
]);
