-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"date_of_birth" date,
	"email" text,
	"phone" text,
	"gp_practice_name" text,
	"gp_practice_location" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "clinicians" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"role" text NOT NULL,
	"specialty" text,
	"bio" text,
	"clinic_name" text,
	"location" text,
	"avatar_url" text,
	"rating" numeric(2, 1),
	"years_experience" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "clinicians" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "clinician_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinician_id" uuid NOT NULL,
	"healthcare_service_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "clinician_services_clinician_id_healthcare_service_id_key" UNIQUE("clinician_id","healthcare_service_id")
);
--> statement-breakpoint
CREATE TABLE "healthcare_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"image_url" text,
	"is_bookable" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"healthcare_service_id" uuid,
	"clinician_id" uuid,
	"title" text NOT NULL,
	"appointment_type" text NOT NULL,
	"location" text,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"status" text DEFAULT 'pending' NOT NULL,
	"reason" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"patient_name" text,
	"patient_email" text,
	"patient_phone" text
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinician_services" ADD CONSTRAINT "clinician_services_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "public"."clinicians"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinician_services" ADD CONSTRAINT "clinician_services_healthcare_service_id_fkey" FOREIGN KEY ("healthcare_service_id") REFERENCES "public"."healthcare_services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "public"."clinicians"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_healthcare_service_id_fkey" FOREIGN KEY ("healthcare_service_id") REFERENCES "public"."healthcare_services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Anyone can view active clinicians" ON "clinicians" AS PERMISSIVE FOR SELECT TO public USING ((is_active = true));
*/