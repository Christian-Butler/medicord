import { relations } from "drizzle-orm/relations";
import { usersInAuth, profiles, clinicians, clinicianServices, healthcareServices, appointments, auditLogs } from "./schema";

export const profilesRelations = relations(profiles, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [profiles.id],
		references: [usersInAuth.id]
	}),
	appointments: many(appointments),
	auditLogs: many(auditLogs),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	profiles: many(profiles),
}));

export const clinicianServicesRelations = relations(clinicianServices, ({one}) => ({
	clinician: one(clinicians, {
		fields: [clinicianServices.clinicianId],
		references: [clinicians.id]
	}),
	healthcareService: one(healthcareServices, {
		fields: [clinicianServices.healthcareServiceId],
		references: [healthcareServices.id]
	}),
}));

export const cliniciansRelations = relations(clinicians, ({many}) => ({
	clinicianServices: many(clinicianServices),
	appointments: many(appointments),
}));

export const healthcareServicesRelations = relations(healthcareServices, ({many}) => ({
	clinicianServices: many(clinicianServices),
	appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({one}) => ({
	clinician: one(clinicians, {
		fields: [appointments.clinicianId],
		references: [clinicians.id]
	}),
	healthcareService: one(healthcareServices, {
		fields: [appointments.healthcareServiceId],
		references: [healthcareServices.id]
	}),
	profile: one(profiles, {
		fields: [appointments.userId],
		references: [profiles.id]
	}),
}));

export const auditLogsRelations = relations(auditLogs, ({one}) => ({
	profile: one(profiles, {
		fields: [auditLogs.userId],
		references: [profiles.id]
	}),
}));