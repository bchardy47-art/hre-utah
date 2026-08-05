CREATE TYPE "public"."tp_application_status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'RETURNED_FOR_CORRECTION', 'APPROVED');--> statement-breakpoint
CREATE TYPE "public"."tp_company_status" AS ENUM('INVITED', 'APPLICATION_STARTED', 'APPLICATION_SUBMITTED', 'DOCUMENTATION_PENDING', 'UNDER_REVIEW', 'APPROVED_TO_BID', 'APPROVED_TO_WORK', 'PROBATIONARY', 'PREFERRED', 'SUSPENDED', 'DO_NOT_USE', 'INACTIVE_EXPIRED_DOCUMENTS');--> statement-breakpoint
CREATE TYPE "public"."tp_contact_role" AS ENUM('OWNER_PRINCIPAL', 'PRIMARY', 'ESTIMATING', 'FIELD_SUPERVISOR', 'ACCOUNTING', 'EMERGENCY');--> statement-breakpoint
CREATE TYPE "public"."tp_document_category" AS ENUM('TAX_AND_CORPORATE', 'LICENSING', 'INSURANCE', 'AGREEMENTS_AND_POLICIES', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."tp_document_state" AS ENUM('MISSING', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED', 'NOT_APPLICABLE', 'SUPERSEDED');--> statement-breakpoint
CREATE TYPE "public"."tp_entity_type" AS ENUM('SOLE_PROPRIETOR', 'PARTNERSHIP', 'LLC', 'S_CORP', 'C_CORP', 'NONPROFIT', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."tp_insurance_kind" AS ENUM('GENERAL_LIABILITY', 'WORKERS_COMPENSATION', 'COMMERCIAL_AUTO', 'UMBRELLA_EXCESS');--> statement-breakpoint
CREATE TYPE "public"."tp_invitation_status" AS ENUM('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."tp_notification_status" AS ENUM('SENT', 'FAILED', 'SKIPPED');--> statement-breakpoint
CREATE TYPE "public"."tp_project_kind" AS ENUM('COMPARABLE', 'ACTIVE', 'COMPLETED_OVER_ONE_YEAR');--> statement-breakpoint
CREATE TYPE "public"."tp_review_decision" AS ENUM('UNDER_REVIEW', 'APPROVED', 'REJECTED', 'NOT_APPLICABLE');--> statement-breakpoint
CREATE TYPE "public"."tp_user_role" AS ENUM('ADMIN', 'TRADE_PARTNER');--> statement-breakpoint
CREATE TYPE "public"."tp_verification_status" AS ENUM('NOT_VERIFIED', 'VERIFIED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "tp_acknowledgment" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"requirement_id" text NOT NULL,
	"template_version" text DEFAULT 'draft' NOT NULL,
	"signer_name" text NOT NULL,
	"signer_title" text,
	"acknowledged_at" timestamp with time zone DEFAULT now() NOT NULL,
	"acknowledged_by_id" text,
	"ip_address" text,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "tp_application" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"status" "tp_application_status" DEFAULT 'NOT_STARTED' NOT NULL,
	"section_progress" json DEFAULT '{}'::json NOT NULL,
	"last_section" text,
	"submitted_at" timestamp with time zone,
	"returned_at" timestamp with time zone,
	"return_reason" text,
	"reviewed_at" timestamp with time zone,
	"reviewed_by_id" text,
	"disclosure_pending_litigation" boolean,
	"disclosure_pending_litigation_text" text,
	"disclosure_bankruptcy" boolean,
	"disclosure_bankruptcy_text" text,
	"disclosure_judgments_or_liens" boolean,
	"disclosure_judgments_or_liens_text" text,
	"disclosure_insurance_claims" boolean,
	"disclosure_insurance_claims_text" text,
	"disclosure_osha_citations" boolean,
	"disclosure_osha_citations_text" text,
	"disclosure_serious_injuries" boolean,
	"disclosure_serious_injuries_text" text,
	"disclosure_warranty_disputes" boolean,
	"disclosure_warranty_disputes_text" text,
	"disclosure_abandoned_projects" boolean,
	"disclosure_abandoned_projects_text" text,
	"disclosure_supplier_disputes" boolean,
	"disclosure_supplier_disputes_text" text,
	"disclosure_uses_lower_tier_subs" boolean,
	"disclosure_uses_lower_tier_subs_text" text,
	"disclosure_workers_authorized" boolean,
	"disclosure_workers_authorized_text" text,
	"certification_version" text,
	"certified_at" timestamp with time zone,
	"signer_name" text,
	"signer_title" text,
	"signer_ip_address" text,
	"signer_user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tp_audit_event" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text,
	"actor_user_id" text,
	"actor_role" "tp_user_role",
	"actor_label" text,
	"action" text NOT NULL,
	"target_type" text,
	"target_id" text,
	"summary" text NOT NULL,
	"metadata" json,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tp_company" (
	"id" text PRIMARY KEY NOT NULL,
	"status" "tp_company_status" DEFAULT 'INVITED' NOT NULL,
	"legal_name" text NOT NULL,
	"dba" text,
	"entity_type" "tp_entity_type",
	"ein_last4" text,
	"ein_confirmed_at" timestamp with time zone,
	"business_address1" text,
	"business_address2" text,
	"business_city" text,
	"business_state" text DEFAULT 'UT',
	"business_zip" text,
	"mailing_same_as_business" boolean DEFAULT true NOT NULL,
	"mailing_address1" text,
	"mailing_address2" text,
	"mailing_city" text,
	"mailing_state" text,
	"mailing_zip" text,
	"main_phone" text,
	"general_email" text,
	"website" text,
	"year_established" integer,
	"years_in_business" integer,
	"primary_trade" text NOT NULL,
	"additional_trades" text[] DEFAULT '{}' NOT NULL,
	"service_areas" text[] DEFAULT '{}' NOT NULL,
	"typical_project_size" text,
	"largest_project" text,
	"crew_size" integer,
	"annual_capacity" text,
	"current_backlog" text,
	"uses_lower_tier_subs" boolean,
	"description" text,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tp_contact" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"role" "tp_contact_role" NOT NULL,
	"name" text NOT NULL,
	"title" text,
	"email" text,
	"phone" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tp_document_requirement" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"category" "tp_document_category" NOT NULL,
	"description" text,
	"is_required" boolean DEFAULT true NOT NULL,
	"applicable_trades" text[] DEFAULT '{}' NOT NULL,
	"applicable_entity_types" text[] DEFAULT '{}' NOT NULL,
	"has_expiration" boolean DEFAULT false NOT NULL,
	"allow_not_applicable" boolean DEFAULT false NOT NULL,
	"blocks_bid" boolean DEFAULT false NOT NULL,
	"blocks_work" boolean DEFAULT true NOT NULL,
	"requires_review" boolean DEFAULT true NOT NULL,
	"is_acknowledgment" boolean DEFAULT false NOT NULL,
	"template_storage_key" text,
	"template_filename" text,
	"template_version" text,
	"template_is_draft" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 100 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tp_document_review" (
	"id" text PRIMARY KEY NOT NULL,
	"document_id" text NOT NULL,
	"reviewer_id" text NOT NULL,
	"decision" "tp_review_decision" NOT NULL,
	"reason" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tp_document" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"requirement_id" text NOT NULL,
	"state" "tp_document_state" DEFAULT 'SUBMITTED' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"original_filename" text,
	"storage_key" text,
	"mime_type" text,
	"file_size" integer,
	"checksum_sha256" text,
	"effective_date" timestamp with time zone,
	"expiration_date" timestamp with time zone,
	"submitted_by_id" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_by_id" text,
	"reviewed_at" timestamp with time zone,
	"rejection_reason" text,
	"admin_notes" text,
	"not_applicable_reason" text,
	"not_applicable_by_id" text,
	"superseded_by_document_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tp_insurance_policy" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"kind" "tp_insurance_kind" NOT NULL,
	"carrier" text,
	"policy_number" text,
	"per_occurrence_limit" text,
	"aggregate_limit" text,
	"effective_date" timestamp with time zone,
	"expiration_date" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tp_internal_note" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"document_id" text,
	"author_id" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tp_invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"email" text NOT NULL,
	"contact_name" text NOT NULL,
	"contact_phone" text,
	"token_hash" text NOT NULL,
	"status" "tp_invitation_status" DEFAULT 'PENDING' NOT NULL,
	"message" text,
	"expires_at" timestamp with time zone NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resend_count" integer DEFAULT 0 NOT NULL,
	"opened_at" timestamp with time zone,
	"accepted_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_by_id" text,
	"revoked_by_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tp_license" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"license_number" text NOT NULL,
	"classification" text,
	"licensed_entity_name" text,
	"qualifier_name" text,
	"issue_date" timestamp with time zone,
	"expiration_date" timestamp with time zone,
	"other_information" text,
	"ever_disciplined" boolean DEFAULT false,
	"discipline_explanation" text,
	"verification_status" "tp_verification_status" DEFAULT 'NOT_VERIFIED' NOT NULL,
	"verified_by_id" text,
	"verified_at" timestamp with time zone,
	"verification_notes" text,
	"verification_source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tp_notification" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text,
	"user_id" text,
	"document_id" text,
	"type" text NOT NULL,
	"to_email" text NOT NULL,
	"subject" text NOT NULL,
	"dedupe_key" text NOT NULL,
	"status" "tp_notification_status" DEFAULT 'SENT' NOT NULL,
	"provider_id" text,
	"error" text,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tp_project_reference" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"kind" "tp_project_kind" NOT NULL,
	"project_name" text,
	"project_type" text,
	"project_location" text,
	"contract_amount_range" text,
	"completion_date" timestamp with time zone,
	"scope_performed" text,
	"reference_name" text NOT NULL,
	"reference_company" text,
	"reference_phone" text,
	"reference_email" text,
	"permission_to_contact" boolean DEFAULT false NOT NULL,
	"contacted_by_id" text,
	"contacted_at" timestamp with time zone,
	"contact_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tp_session" (
	"id" text PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tp_status_history" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"from_status" "tp_company_status",
	"to_status" "tp_company_status" NOT NULL,
	"reason" text,
	"changed_by_id" text,
	"is_system_generated" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tp_user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "tp_user_role" NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"company_id" text,
	"last_login_at" timestamp with time zone,
	"failed_login_count" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tp_acknowledgment" ADD CONSTRAINT "tp_acknowledgment_company_id_tp_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."tp_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_acknowledgment" ADD CONSTRAINT "tp_acknowledgment_requirement_id_tp_document_requirement_id_fk" FOREIGN KEY ("requirement_id") REFERENCES "public"."tp_document_requirement"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_acknowledgment" ADD CONSTRAINT "tp_acknowledgment_acknowledged_by_id_tp_user_id_fk" FOREIGN KEY ("acknowledged_by_id") REFERENCES "public"."tp_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_application" ADD CONSTRAINT "tp_application_company_id_tp_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."tp_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_application" ADD CONSTRAINT "tp_application_reviewed_by_id_tp_user_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."tp_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_audit_event" ADD CONSTRAINT "tp_audit_event_company_id_tp_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."tp_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_audit_event" ADD CONSTRAINT "tp_audit_event_actor_user_id_tp_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."tp_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_contact" ADD CONSTRAINT "tp_contact_company_id_tp_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."tp_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_document_review" ADD CONSTRAINT "tp_document_review_document_id_tp_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."tp_document"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_document_review" ADD CONSTRAINT "tp_document_review_reviewer_id_tp_user_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."tp_user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_document" ADD CONSTRAINT "tp_document_company_id_tp_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."tp_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_document" ADD CONSTRAINT "tp_document_requirement_id_tp_document_requirement_id_fk" FOREIGN KEY ("requirement_id") REFERENCES "public"."tp_document_requirement"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_document" ADD CONSTRAINT "tp_document_submitted_by_id_tp_user_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."tp_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_document" ADD CONSTRAINT "tp_document_reviewed_by_id_tp_user_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."tp_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_document" ADD CONSTRAINT "tp_document_not_applicable_by_id_tp_user_id_fk" FOREIGN KEY ("not_applicable_by_id") REFERENCES "public"."tp_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_insurance_policy" ADD CONSTRAINT "tp_insurance_policy_company_id_tp_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."tp_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_internal_note" ADD CONSTRAINT "tp_internal_note_company_id_tp_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."tp_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_internal_note" ADD CONSTRAINT "tp_internal_note_document_id_tp_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."tp_document"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_internal_note" ADD CONSTRAINT "tp_internal_note_author_id_tp_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."tp_user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_invitation" ADD CONSTRAINT "tp_invitation_company_id_tp_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."tp_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_invitation" ADD CONSTRAINT "tp_invitation_created_by_id_tp_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."tp_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_invitation" ADD CONSTRAINT "tp_invitation_revoked_by_id_tp_user_id_fk" FOREIGN KEY ("revoked_by_id") REFERENCES "public"."tp_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_license" ADD CONSTRAINT "tp_license_company_id_tp_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."tp_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_license" ADD CONSTRAINT "tp_license_verified_by_id_tp_user_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."tp_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_notification" ADD CONSTRAINT "tp_notification_company_id_tp_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."tp_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_notification" ADD CONSTRAINT "tp_notification_user_id_tp_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tp_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_notification" ADD CONSTRAINT "tp_notification_document_id_tp_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."tp_document"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_project_reference" ADD CONSTRAINT "tp_project_reference_company_id_tp_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."tp_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_project_reference" ADD CONSTRAINT "tp_project_reference_contacted_by_id_tp_user_id_fk" FOREIGN KEY ("contacted_by_id") REFERENCES "public"."tp_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_session" ADD CONSTRAINT "tp_session_user_id_tp_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tp_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_status_history" ADD CONSTRAINT "tp_status_history_company_id_tp_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."tp_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_status_history" ADD CONSTRAINT "tp_status_history_changed_by_id_tp_user_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."tp_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tp_user" ADD CONSTRAINT "tp_user_company_id_tp_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."tp_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "tp_ack_company_req_version_idx" ON "tp_acknowledgment" USING btree ("company_id","requirement_id","template_version");--> statement-breakpoint
CREATE INDEX "tp_ack_company_idx" ON "tp_acknowledgment" USING btree ("company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tp_application_company_idx" ON "tp_application" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "tp_application_status_idx" ON "tp_application" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tp_audit_company_idx" ON "tp_audit_event" USING btree ("company_id","created_at");--> statement-breakpoint
CREATE INDEX "tp_audit_action_idx" ON "tp_audit_event" USING btree ("action");--> statement-breakpoint
CREATE INDEX "tp_audit_created_idx" ON "tp_audit_event" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "tp_company_status_idx" ON "tp_company" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tp_company_trade_idx" ON "tp_company" USING btree ("primary_trade");--> statement-breakpoint
CREATE INDEX "tp_company_name_idx" ON "tp_company" USING btree ("legal_name");--> statement-breakpoint
CREATE INDEX "tp_company_archived_idx" ON "tp_company" USING btree ("archived_at");--> statement-breakpoint
CREATE UNIQUE INDEX "tp_contact_company_role_idx" ON "tp_contact" USING btree ("company_id","role");--> statement-breakpoint
CREATE UNIQUE INDEX "tp_requirement_code_idx" ON "tp_document_requirement" USING btree ("code");--> statement-breakpoint
CREATE INDEX "tp_requirement_category_idx" ON "tp_document_requirement" USING btree ("category");--> statement-breakpoint
CREATE INDEX "tp_requirement_active_idx" ON "tp_document_requirement" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "tp_document_review_document_idx" ON "tp_document_review" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "tp_document_company_state_idx" ON "tp_document" USING btree ("company_id","state");--> statement-breakpoint
CREATE INDEX "tp_document_company_req_idx" ON "tp_document" USING btree ("company_id","requirement_id");--> statement-breakpoint
CREATE INDEX "tp_document_expires_idx" ON "tp_document" USING btree ("expiration_date");--> statement-breakpoint
CREATE INDEX "tp_document_state_idx" ON "tp_document" USING btree ("state");--> statement-breakpoint
CREATE UNIQUE INDEX "tp_insurance_company_kind_idx" ON "tp_insurance_policy" USING btree ("company_id","kind");--> statement-breakpoint
CREATE INDEX "tp_insurance_expires_idx" ON "tp_insurance_policy" USING btree ("expiration_date");--> statement-breakpoint
CREATE INDEX "tp_note_company_idx" ON "tp_internal_note" USING btree ("company_id","created_at");--> statement-breakpoint
CREATE INDEX "tp_note_document_idx" ON "tp_internal_note" USING btree ("document_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tp_invitation_token_idx" ON "tp_invitation" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "tp_invitation_company_idx" ON "tp_invitation" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "tp_invitation_status_idx" ON "tp_invitation" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tp_invitation_expires_idx" ON "tp_invitation" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "tp_license_company_idx" ON "tp_license" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "tp_license_number_idx" ON "tp_license" USING btree ("license_number");--> statement-breakpoint
CREATE INDEX "tp_license_expires_idx" ON "tp_license" USING btree ("expiration_date");--> statement-breakpoint
CREATE UNIQUE INDEX "tp_notification_dedupe_idx" ON "tp_notification" USING btree ("dedupe_key");--> statement-breakpoint
CREATE INDEX "tp_notification_company_idx" ON "tp_notification" USING btree ("company_id","sent_at");--> statement-breakpoint
CREATE INDEX "tp_notification_type_idx" ON "tp_notification" USING btree ("type");--> statement-breakpoint
CREATE INDEX "tp_project_company_idx" ON "tp_project_reference" USING btree ("company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tp_session_token_idx" ON "tp_session" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "tp_session_user_idx" ON "tp_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tp_session_expires_idx" ON "tp_session" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "tp_status_history_company_idx" ON "tp_status_history" USING btree ("company_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "tp_user_email_idx" ON "tp_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "tp_user_role_idx" ON "tp_user" USING btree ("role");--> statement-breakpoint
CREATE INDEX "tp_user_company_idx" ON "tp_user" USING btree ("company_id");