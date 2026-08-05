/**
 * Hardy Homes Trade Partner Portal — database schema (Drizzle ORM / PostgreSQL).
 *
 * Every table is prefixed `tp_` so nothing here can collide with future
 * public-site tables. Nothing in this file is imported by the public marketing
 * pages.
 *
 * Sensitive-data posture:
 *   - Full EIN is never persisted. Only `ein_last4` is stored; the uploaded W-9
 *     is the system of record.
 *   - Bank routing/account numbers are never persisted. ACH setup is tracked as
 *     a completion flag only.
 *   - Session and invitation tokens are stored as SHA-256 hashes, so a database
 *     leak cannot be replayed as a login.
 *   - Uploaded files live in a private Cloudflare R2 bucket, not in this
 *     database. Only opaque object keys are stored.
 */

import { randomUUID } from 'node:crypto'
import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

const id = () =>
  text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID())

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
const updatedAt = () =>
  timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const userRole = pgEnum('tp_user_role', ['ADMIN', 'TRADE_PARTNER'])

/**
 * Company lifecycle. Stored and administrator-controlled. The compliance engine
 * *recommends* transitions; it never silently performs the privileged ones
 * (APPROVED_TO_WORK, PREFERRED, SUSPENDED, DO_NOT_USE).
 */
export const companyStatus = pgEnum('tp_company_status', [
  'INVITED',
  'APPLICATION_STARTED',
  'APPLICATION_SUBMITTED',
  'DOCUMENTATION_PENDING',
  'UNDER_REVIEW',
  'APPROVED_TO_BID',
  'APPROVED_TO_WORK',
  'PROBATIONARY',
  'PREFERRED',
  'SUSPENDED',
  'DO_NOT_USE',
  'INACTIVE_EXPIRED_DOCUMENTS',
])

export const applicationStatus = pgEnum('tp_application_status', [
  'NOT_STARTED',
  'IN_PROGRESS',
  'SUBMITTED',
  'RETURNED_FOR_CORRECTION',
  'APPROVED',
])

export const documentState = pgEnum('tp_document_state', [
  'MISSING',
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'EXPIRED',
  'NOT_APPLICABLE',
  'SUPERSEDED',
])

export const documentCategory = pgEnum('tp_document_category', [
  'TAX_AND_CORPORATE',
  'LICENSING',
  'INSURANCE',
  'AGREEMENTS_AND_POLICIES',
  'OTHER',
])

export const reviewDecision = pgEnum('tp_review_decision', [
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'NOT_APPLICABLE',
])

export const invitationStatus = pgEnum('tp_invitation_status', [
  'PENDING',
  'ACCEPTED',
  'REVOKED',
  'EXPIRED',
])

export const entityType = pgEnum('tp_entity_type', [
  'SOLE_PROPRIETOR',
  'PARTNERSHIP',
  'LLC',
  'S_CORP',
  'C_CORP',
  'NONPROFIT',
  'OTHER',
])

export const contactRole = pgEnum('tp_contact_role', [
  'OWNER_PRINCIPAL',
  'PRIMARY',
  'ESTIMATING',
  'FIELD_SUPERVISOR',
  'ACCOUNTING',
  'EMERGENCY',
])

export const verificationStatus = pgEnum('tp_verification_status', [
  'NOT_VERIFIED',
  'VERIFIED',
  'REJECTED',
])

export const insuranceKind = pgEnum('tp_insurance_kind', [
  'GENERAL_LIABILITY',
  'WORKERS_COMPENSATION',
  'COMMERCIAL_AUTO',
  'UMBRELLA_EXCESS',
])

export const projectKind = pgEnum('tp_project_kind', [
  'COMPARABLE',
  'ACTIVE',
  'COMPLETED_OVER_ONE_YEAR',
])

export const notificationStatus = pgEnum('tp_notification_status', ['SENT', 'FAILED', 'SKIPPED'])

// ---------------------------------------------------------------------------
// Companies
// ---------------------------------------------------------------------------

export const companies = pgTable(
  'tp_company',
  {
    id: id(),
    status: companyStatus('status').notNull().default('INVITED'),

    // Section A — company information
    legalName: text('legal_name').notNull(),
    dba: text('dba'),
    entityType: entityType('entity_type'),
    /** Last four of the EIN only. The full number is never stored. */
    einLast4: text('ein_last4'),
    einConfirmedAt: timestamp('ein_confirmed_at', { withTimezone: true }),
    businessAddress1: text('business_address1'),
    businessAddress2: text('business_address2'),
    businessCity: text('business_city'),
    businessState: text('business_state').default('UT'),
    businessZip: text('business_zip'),
    mailingSameAsBusiness: boolean('mailing_same_as_business').notNull().default(true),
    mailingAddress1: text('mailing_address1'),
    mailingAddress2: text('mailing_address2'),
    mailingCity: text('mailing_city'),
    mailingState: text('mailing_state'),
    mailingZip: text('mailing_zip'),
    mainPhone: text('main_phone'),
    generalEmail: text('general_email'),
    website: text('website'),
    yearEstablished: integer('year_established'),
    yearsInBusiness: integer('years_in_business'),
    primaryTrade: text('primary_trade').notNull(),
    additionalTrades: text('additional_trades').array().notNull().default([]),
    /** Utah counties / service areas. */
    serviceAreas: text('service_areas').array().notNull().default([]),
    typicalProjectSize: text('typical_project_size'),
    largestProject: text('largest_project'),
    crewSize: integer('crew_size'),
    annualCapacity: text('annual_capacity'),
    currentBacklog: text('current_backlog'),
    usesLowerTierSubs: boolean('uses_lower_tier_subs'),
    description: text('description'),

    /** Soft delete. Archived companies keep their full audit history. */
    archivedAt: timestamp('archived_at', { withTimezone: true }),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => ({
    statusIdx: index('tp_company_status_idx').on(t.status),
    tradeIdx: index('tp_company_trade_idx').on(t.primaryTrade),
    nameIdx: index('tp_company_name_idx').on(t.legalName),
    archivedIdx: index('tp_company_archived_idx').on(t.archivedAt),
  }),
)

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

export const users = pgTable(
  'tp_user',
  {
    id: id(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    role: userRole('role').notNull(),
    name: text('name').notNull(),
    phone: text('phone'),
    isActive: boolean('is_active').notNull().default(true),

    /** Set for TRADE_PARTNER users. Administrators have no company. */
    companyId: text('company_id').references(() => companies.id, { onDelete: 'cascade' }),

    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    failedLoginCount: integer('failed_login_count').notNull().default(0),
    lockedUntil: timestamp('locked_until', { withTimezone: true }),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => ({
    emailIdx: uniqueIndex('tp_user_email_idx').on(t.email),
    roleIdx: index('tp_user_role_idx').on(t.role),
    companyIdx: index('tp_user_company_idx').on(t.companyId),
  }),
)

/**
 * Opaque, server-issued session. The raw token lives only in an httpOnly
 * cookie; only its SHA-256 hash is stored.
 */
export const sessions = pgTable(
  'tp_session',
  {
    id: id(),
    tokenHash: text('token_hash').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: createdAt(),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    tokenIdx: uniqueIndex('tp_session_token_idx').on(t.tokenHash),
    userIdx: index('tp_session_user_idx').on(t.userId),
    expiresIdx: index('tp_session_expires_idx').on(t.expiresAt),
  }),
)

/**
 * Section B. One person may hold several roles — modelled as several rows
 * sharing an email, not a multi-valued column.
 */
export const contacts = pgTable(
  'tp_contact',
  {
    id: id(),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    role: contactRole('role').notNull(),
    name: text('name').notNull(),
    title: text('title'),
    email: text('email'),
    phone: text('phone'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => ({
    companyRoleIdx: uniqueIndex('tp_contact_company_role_idx').on(t.companyId, t.role),
  }),
)

// ---------------------------------------------------------------------------
// Invitations
// ---------------------------------------------------------------------------

export const invitations = pgTable(
  'tp_invitation',
  {
    id: id(),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    contactName: text('contact_name').notNull(),
    contactPhone: text('contact_phone'),
    /** SHA-256 of the high-entropy token. The raw token is emailed once. */
    tokenHash: text('token_hash').notNull(),
    status: invitationStatus('status').notNull().default('PENDING'),
    message: text('message'),

    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    sentAt: timestamp('sent_at', { withTimezone: true }).notNull().defaultNow(),
    lastSentAt: timestamp('last_sent_at', { withTimezone: true }).notNull().defaultNow(),
    resendCount: integer('resend_count').notNull().default(0),
    /** Best-effort: set when the invite landing page is first rendered. */
    openedAt: timestamp('opened_at', { withTimezone: true }),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),

    createdById: text('created_by_id').references(() => users.id, { onDelete: 'set null' }),
    revokedById: text('revoked_by_id').references(() => users.id, { onDelete: 'set null' }),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => ({
    tokenIdx: uniqueIndex('tp_invitation_token_idx').on(t.tokenHash),
    companyIdx: index('tp_invitation_company_idx').on(t.companyId),
    statusIdx: index('tp_invitation_status_idx').on(t.status),
    expiresIdx: index('tp_invitation_expires_idx').on(t.expiresAt),
  }),
)

// ---------------------------------------------------------------------------
// Application
// ---------------------------------------------------------------------------

/**
 * Tracks the *lifecycle* of the application plus the point-in-time answers that
 * only make sense as an attestation (Sections F and G). Durable company facts
 * (Section A) live on `companies` so the partner has one place to keep them
 * current.
 */
export const applications = pgTable(
  'tp_application',
  {
    id: id(),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    status: applicationStatus('status').notNull().default('NOT_STARTED'),

    /** Section key -> completion state, drives the progress meter. */
    sectionProgress: json('section_progress').$type<Record<string, boolean>>().notNull().default({}),
    lastSection: text('last_section'),

    submittedAt: timestamp('submitted_at', { withTimezone: true }),
    returnedAt: timestamp('returned_at', { withTimezone: true }),
    returnReason: text('return_reason'),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    reviewedById: text('reviewed_by_id').references(() => users.id, { onDelete: 'set null' }),

    // Section F — operational disclosures.
    // Applicant-reported. These are disclosures, not adjudicated findings.
    disclosurePendingLitigation: boolean('disclosure_pending_litigation'),
    disclosurePendingLitigationText: text('disclosure_pending_litigation_text'),
    disclosureBankruptcy: boolean('disclosure_bankruptcy'),
    disclosureBankruptcyText: text('disclosure_bankruptcy_text'),
    disclosureJudgmentsOrLiens: boolean('disclosure_judgments_or_liens'),
    disclosureJudgmentsOrLiensText: text('disclosure_judgments_or_liens_text'),
    disclosureInsuranceClaims: boolean('disclosure_insurance_claims'),
    disclosureInsuranceClaimsText: text('disclosure_insurance_claims_text'),
    disclosureOshaCitations: boolean('disclosure_osha_citations'),
    disclosureOshaCitationsText: text('disclosure_osha_citations_text'),
    disclosureSeriousInjuries: boolean('disclosure_serious_injuries'),
    disclosureSeriousInjuriesText: text('disclosure_serious_injuries_text'),
    disclosureWarrantyDisputes: boolean('disclosure_warranty_disputes'),
    disclosureWarrantyDisputesText: text('disclosure_warranty_disputes_text'),
    disclosureAbandonedProjects: boolean('disclosure_abandoned_projects'),
    disclosureAbandonedProjectsText: text('disclosure_abandoned_projects_text'),
    disclosureSupplierDisputes: boolean('disclosure_supplier_disputes'),
    disclosureSupplierDisputesText: text('disclosure_supplier_disputes_text'),
    disclosureUsesLowerTierSubs: boolean('disclosure_uses_lower_tier_subs'),
    disclosureUsesLowerTierSubsText: text('disclosure_uses_lower_tier_subs_text'),
    disclosureWorkersAuthorized: boolean('disclosure_workers_authorized'),
    disclosureWorkersAuthorizedText: text('disclosure_workers_authorized_text'),

    // Section G — certification
    certificationVersion: text('certification_version'),
    certifiedAt: timestamp('certified_at', { withTimezone: true }),
    signerName: text('signer_name'),
    signerTitle: text('signer_title'),
    /** Captured only at the moment of signature. Never shown to other partners. */
    signerIpAddress: text('signer_ip_address'),
    signerUserAgent: text('signer_user_agent'),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => ({
    companyIdx: uniqueIndex('tp_application_company_idx').on(t.companyId),
    statusIdx: index('tp_application_status_idx').on(t.status),
  }),
)

// ---------------------------------------------------------------------------
// Licensing (Section C)
// ---------------------------------------------------------------------------

export const licenses = pgTable(
  'tp_license',
  {
    id: id(),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),

    licenseNumber: text('license_number').notNull(),
    classification: text('classification'),
    licensedEntityName: text('licensed_entity_name'),
    qualifierName: text('qualifier_name'),
    issueDate: timestamp('issue_date', { withTimezone: true }),
    expirationDate: timestamp('expiration_date', { withTimezone: true }),
    otherInformation: text('other_information'),

    everDisciplined: boolean('ever_disciplined').default(false),
    disciplineExplanation: text('discipline_explanation'),

    /**
     * Manual administrator verification. No automatic DOPL lookup is performed
     * or implied in Version 1.
     */
    verificationStatus: verificationStatus('verification_status').notNull().default('NOT_VERIFIED'),
    verifiedById: text('verified_by_id').references(() => users.id, { onDelete: 'set null' }),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    verificationNotes: text('verification_notes'),
    verificationSource: text('verification_source'),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => ({
    companyIdx: index('tp_license_company_idx').on(t.companyId),
    numberIdx: index('tp_license_number_idx').on(t.licenseNumber),
    expiresIdx: index('tp_license_expires_idx').on(t.expirationDate),
  }),
)

// ---------------------------------------------------------------------------
// Insurance (Section D)
// ---------------------------------------------------------------------------

export const insurancePolicies = pgTable(
  'tp_insurance_policy',
  {
    id: id(),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),

    kind: insuranceKind('kind').notNull(),
    carrier: text('carrier'),
    policyNumber: text('policy_number'),
    perOccurrenceLimit: text('per_occurrence_limit'),
    aggregateLimit: text('aggregate_limit'),
    effectiveDate: timestamp('effective_date', { withTimezone: true }),
    expirationDate: timestamp('expiration_date', { withTimezone: true }),
    notes: text('notes'),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => ({
    companyKindIdx: uniqueIndex('tp_insurance_company_kind_idx').on(t.companyId, t.kind),
    expiresIdx: index('tp_insurance_expires_idx').on(t.expirationDate),
  }),
)

// ---------------------------------------------------------------------------
// Experience and references (Section E)
// ---------------------------------------------------------------------------

/**
 * A past project and the reference who can speak to it. Merged into one table
 * because a reference without a project has no meaning in this workflow.
 */
export const projectReferences = pgTable(
  'tp_project_reference',
  {
    id: id(),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),

    kind: projectKind('kind').notNull(),
    projectName: text('project_name'),
    projectType: text('project_type'),
    projectLocation: text('project_location'),
    contractAmountRange: text('contract_amount_range'),
    completionDate: timestamp('completion_date', { withTimezone: true }),
    scopePerformed: text('scope_performed'),

    referenceName: text('reference_name').notNull(),
    referenceCompany: text('reference_company'),
    referencePhone: text('reference_phone'),
    referenceEmail: text('reference_email'),
    permissionToContact: boolean('permission_to_contact').notNull().default(false),

    /** Administrator reference-check trail. */
    contactedById: text('contacted_by_id').references(() => users.id, { onDelete: 'set null' }),
    contactedAt: timestamp('contacted_at', { withTimezone: true }),
    contactNotes: text('contact_notes'),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => ({
    companyIdx: index('tp_project_company_idx').on(t.companyId),
  }),
)

// ---------------------------------------------------------------------------
// Document requirements and submissions
// ---------------------------------------------------------------------------

/** Configuration, not code. New requirements are rows, not deploys. */
export const documentRequirements = pgTable(
  'tp_document_requirement',
  {
    id: id(),
    /** Stable machine key referenced by the compliance engine. */
    code: text('code').notNull(),

    name: text('name').notNull(),
    category: documentCategory('category').notNull(),
    description: text('description'),

    isRequired: boolean('is_required').notNull().default(true),
    /** Empty array means "applies to every trade". */
    applicableTrades: text('applicable_trades').array().notNull().default([]),
    /** Empty array means "applies to every entity type". */
    applicableEntityTypes: text('applicable_entity_types').array().notNull().default([]),

    hasExpiration: boolean('has_expiration').notNull().default(false),
    allowNotApplicable: boolean('allow_not_applicable').notNull().default(false),
    blocksBid: boolean('blocks_bid').notNull().default(false),
    blocksWork: boolean('blocks_work').notNull().default(true),
    requiresReview: boolean('requires_review').notNull().default(true),
    /**
     * Acknowledgment-only requirements are satisfied by an e-acknowledgment
     * rather than a file upload (Code of Conduct, safety policy, and so on).
     */
    isAcknowledgment: boolean('is_acknowledgment').notNull().default(false),

    /**
     * R2 object key of the administrator-uploaded template/sample, if any.
     * Replaceable without a code change — see the legal boundary in the docs.
     */
    templateStorageKey: text('template_storage_key'),
    templateFilename: text('template_filename'),
    templateVersion: text('template_version'),
    templateIsDraft: boolean('template_is_draft').notNull().default(true),

    sortOrder: integer('sort_order').notNull().default(100),
    isActive: boolean('is_active').notNull().default(true),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => ({
    codeIdx: uniqueIndex('tp_requirement_code_idx').on(t.code),
    categoryIdx: index('tp_requirement_category_idx').on(t.category),
    activeIdx: index('tp_requirement_active_idx').on(t.isActive),
  }),
)

export const documents = pgTable(
  'tp_document',
  {
    id: id(),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    requirementId: text('requirement_id')
      .notNull()
      .references(() => documentRequirements.id, { onDelete: 'restrict' }),

    state: documentState('state').notNull().default('SUBMITTED'),
    version: integer('version').notNull().default(1),

    originalFilename: text('original_filename'),
    /**
     * Opaque private R2 object key. Never rendered to a browser; downloads go
     * through an authorized route that mints a short-lived signed URL.
     */
    storageKey: text('storage_key'),
    mimeType: text('mime_type'),
    fileSize: integer('file_size'),
    checksumSha256: text('checksum_sha256'),

    effectiveDate: timestamp('effective_date', { withTimezone: true }),
    expirationDate: timestamp('expiration_date', { withTimezone: true }),

    submittedById: text('submitted_by_id').references(() => users.id, { onDelete: 'set null' }),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),

    reviewedById: text('reviewed_by_id').references(() => users.id, { onDelete: 'set null' }),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    rejectionReason: text('rejection_reason'),
    adminNotes: text('admin_notes'),

    notApplicableReason: text('not_applicable_reason'),
    notApplicableById: text('not_applicable_by_id').references(() => users.id, {
      onDelete: 'set null',
    }),

    /**
     * Replacement chain. Uploading a new version marks the old one SUPERSEDED
     * and points it at its replacement — history is never destroyed.
     */
    supersededByDocumentId: text('superseded_by_document_id'),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => ({
    companyStateIdx: index('tp_document_company_state_idx').on(t.companyId, t.state),
    companyReqIdx: index('tp_document_company_req_idx').on(t.companyId, t.requirementId),
    expiresIdx: index('tp_document_expires_idx').on(t.expirationDate),
    stateIdx: index('tp_document_state_idx').on(t.state),
  }),
)

/**
 * Every review decision, appended. The current decision is denormalised onto the
 * document for query speed; this table is the audit-grade history.
 */
export const documentReviews = pgTable(
  'tp_document_review',
  {
    id: id(),
    documentId: text('document_id')
      .notNull()
      .references(() => documents.id, { onDelete: 'cascade' }),
    reviewerId: text('reviewer_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    decision: reviewDecision('decision').notNull(),
    reason: text('reason'),
    notes: text('notes'),
    createdAt: createdAt(),
  },
  (t) => ({
    documentIdx: index('tp_document_review_document_idx').on(t.documentId),
  }),
)

/**
 * Electronic acknowledgment of a policy or agreement, pinned to the exact
 * template version the company accepted.
 */
export const acknowledgments = pgTable(
  'tp_acknowledgment',
  {
    id: id(),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    requirementId: text('requirement_id')
      .notNull()
      .references(() => documentRequirements.id, { onDelete: 'restrict' }),

    templateVersion: text('template_version').notNull().default('draft'),
    signerName: text('signer_name').notNull(),
    signerTitle: text('signer_title'),
    acknowledgedAt: timestamp('acknowledged_at', { withTimezone: true }).notNull().defaultNow(),
    acknowledgedById: text('acknowledged_by_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
  },
  (t) => ({
    uniq: uniqueIndex('tp_ack_company_req_version_idx').on(
      t.companyId,
      t.requirementId,
      t.templateVersion,
    ),
    companyIdx: index('tp_ack_company_idx').on(t.companyId),
  }),
)

// ---------------------------------------------------------------------------
// Status, notes, audit, notifications
// ---------------------------------------------------------------------------

export const statusHistory = pgTable(
  'tp_status_history',
  {
    id: id(),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    fromStatus: companyStatus('from_status'),
    toStatus: companyStatus('to_status').notNull(),
    reason: text('reason'),
    changedById: text('changed_by_id').references(() => users.id, { onDelete: 'set null' }),
    /** True when the expiration sweep moved the company, not a person. */
    isSystemGenerated: boolean('is_system_generated').notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => ({
    companyIdx: index('tp_status_history_company_idx').on(t.companyId, t.createdAt),
  }),
)

/**
 * Administrator-only. Never returned by any trade-partner-facing query.
 * Append-only: there is no update path anywhere in the application layer.
 */
export const internalNotes = pgTable(
  'tp_internal_note',
  {
    id: id(),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    /** Set when the note is scoped to a document rather than the company. */
    documentId: text('document_id').references(() => documents.id, { onDelete: 'cascade' }),
    authorId: text('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    body: text('body').notNull(),
    createdAt: createdAt(),
  },
  (t) => ({
    companyIdx: index('tp_note_company_idx').on(t.companyId, t.createdAt),
    documentIdx: index('tp_note_document_idx').on(t.documentId),
  }),
)

/**
 * Append-only audit trail. `action` is a stable string constant (see
 * src/lib/portal/audit.ts) rather than an enum, so Version 2 events do not
 * require a migration.
 */
export const auditEvents = pgTable(
  'tp_audit_event',
  {
    id: id(),
    companyId: text('company_id').references(() => companies.id, { onDelete: 'cascade' }),
    actorUserId: text('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
    actorRole: userRole('actor_role'),
    /** Human-readable actor label, retained even if the user row is removed. */
    actorLabel: text('actor_label'),

    action: text('action').notNull(),
    targetType: text('target_type'),
    targetId: text('target_id'),
    summary: text('summary').notNull(),
    /** Redacted metadata only — never full EIN, policy, or file contents. */
    metadata: json('metadata').$type<Record<string, unknown>>(),

    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: createdAt(),
  },
  (t) => ({
    companyIdx: index('tp_audit_company_idx').on(t.companyId, t.createdAt),
    actionIdx: index('tp_audit_action_idx').on(t.action),
    createdIdx: index('tp_audit_created_idx').on(t.createdAt),
  }),
)

export const notifications = pgTable(
  'tp_notification',
  {
    id: id(),
    companyId: text('company_id').references(() => companies.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    documentId: text('document_id').references(() => documents.id, { onDelete: 'set null' }),

    type: text('type').notNull(),
    toEmail: text('to_email').notNull(),
    subject: text('subject').notNull(),

    /**
     * Idempotency key. The unique index here is what stops the expiration sweep
     * from emailing the same warning twice.
     */
    dedupeKey: text('dedupe_key').notNull(),

    status: notificationStatus('status').notNull().default('SENT'),
    providerId: text('provider_id'),
    error: text('error'),

    sentAt: timestamp('sent_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: createdAt(),
  },
  (t) => ({
    dedupeIdx: uniqueIndex('tp_notification_dedupe_idx').on(t.dedupeKey),
    companyIdx: index('tp_notification_company_idx').on(t.companyId, t.sentAt),
    typeIdx: index('tp_notification_type_idx').on(t.type),
  }),
)

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const companiesRelations = relations(companies, ({ many, one }) => ({
  users: many(users),
  contacts: many(contacts),
  invitations: many(invitations),
  application: one(applications),
  licenses: many(licenses),
  insurance: many(insurancePolicies),
  projects: many(projectReferences),
  documents: many(documents),
  acknowledgments: many(acknowledgments),
  statusHistory: many(statusHistory),
  internalNotes: many(internalNotes),
  auditEvents: many(auditEvents),
  notifications: many(notifications),
}))

export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, { fields: [users.companyId], references: [companies.id] }),
  sessions: many(sessions),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const contactsRelations = relations(contacts, ({ one }) => ({
  company: one(companies, { fields: [contacts.companyId], references: [companies.id] }),
}))

export const invitationsRelations = relations(invitations, ({ one }) => ({
  company: one(companies, { fields: [invitations.companyId], references: [companies.id] }),
  createdBy: one(users, { fields: [invitations.createdById], references: [users.id] }),
}))

export const applicationsRelations = relations(applications, ({ one }) => ({
  company: one(companies, { fields: [applications.companyId], references: [companies.id] }),
}))

export const licensesRelations = relations(licenses, ({ one }) => ({
  company: one(companies, { fields: [licenses.companyId], references: [companies.id] }),
  verifiedBy: one(users, { fields: [licenses.verifiedById], references: [users.id] }),
}))

export const insuranceRelations = relations(insurancePolicies, ({ one }) => ({
  company: one(companies, { fields: [insurancePolicies.companyId], references: [companies.id] }),
}))

export const projectReferencesRelations = relations(projectReferences, ({ one }) => ({
  company: one(companies, { fields: [projectReferences.companyId], references: [companies.id] }),
}))

export const documentRequirementsRelations = relations(documentRequirements, ({ many }) => ({
  documents: many(documents),
  acknowledgments: many(acknowledgments),
}))

export const documentsRelations = relations(documents, ({ one, many }) => ({
  company: one(companies, { fields: [documents.companyId], references: [companies.id] }),
  requirement: one(documentRequirements, {
    fields: [documents.requirementId],
    references: [documentRequirements.id],
  }),
  submittedBy: one(users, { fields: [documents.submittedById], references: [users.id] }),
  reviewedBy: one(users, { fields: [documents.reviewedById], references: [users.id] }),
  reviews: many(documentReviews),
  internalNotes: many(internalNotes),
}))

export const documentReviewsRelations = relations(documentReviews, ({ one }) => ({
  document: one(documents, { fields: [documentReviews.documentId], references: [documents.id] }),
  reviewer: one(users, { fields: [documentReviews.reviewerId], references: [users.id] }),
}))

export const acknowledgmentsRelations = relations(acknowledgments, ({ one }) => ({
  company: one(companies, { fields: [acknowledgments.companyId], references: [companies.id] }),
  requirement: one(documentRequirements, {
    fields: [acknowledgments.requirementId],
    references: [documentRequirements.id],
  }),
}))

export const statusHistoryRelations = relations(statusHistory, ({ one }) => ({
  company: one(companies, { fields: [statusHistory.companyId], references: [companies.id] }),
  changedBy: one(users, { fields: [statusHistory.changedById], references: [users.id] }),
}))

export const internalNotesRelations = relations(internalNotes, ({ one }) => ({
  company: one(companies, { fields: [internalNotes.companyId], references: [companies.id] }),
  document: one(documents, { fields: [internalNotes.documentId], references: [documents.id] }),
  author: one(users, { fields: [internalNotes.authorId], references: [users.id] }),
}))

export const auditEventsRelations = relations(auditEvents, ({ one }) => ({
  company: one(companies, { fields: [auditEvents.companyId], references: [companies.id] }),
  actor: one(users, { fields: [auditEvents.actorUserId], references: [users.id] }),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  company: one(companies, { fields: [notifications.companyId], references: [companies.id] }),
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}))

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type Company = typeof companies.$inferSelect
export type NewCompany = typeof companies.$inferInsert
export type User = typeof users.$inferSelect
export type Session = typeof sessions.$inferSelect
export type Contact = typeof contacts.$inferSelect
export type Invitation = typeof invitations.$inferSelect
export type Application = typeof applications.$inferSelect
export type License = typeof licenses.$inferSelect
export type InsurancePolicy = typeof insurancePolicies.$inferSelect
export type ProjectReference = typeof projectReferences.$inferSelect
export type DocumentRequirement = typeof documentRequirements.$inferSelect
export type PortalDocument = typeof documents.$inferSelect
export type DocumentReviewRow = typeof documentReviews.$inferSelect
export type Acknowledgment = typeof acknowledgments.$inferSelect
export type StatusHistoryRow = typeof statusHistory.$inferSelect
export type InternalNote = typeof internalNotes.$inferSelect
export type AuditEvent = typeof auditEvents.$inferSelect
export type Notification = typeof notifications.$inferSelect

export type CompanyStatusValue = (typeof companyStatus.enumValues)[number]
export type DocumentStateValue = (typeof documentState.enumValues)[number]
export type UserRoleValue = (typeof userRole.enumValues)[number]
export type ApplicationStatusValue = (typeof applicationStatus.enumValues)[number]
export type InvitationStatusValue = (typeof invitationStatus.enumValues)[number]
export type EntityTypeValue = (typeof entityType.enumValues)[number]
export type ContactRoleValue = (typeof contactRole.enumValues)[number]
export type DocumentCategoryValue = (typeof documentCategory.enumValues)[number]
export type InsuranceKindValue = (typeof insuranceKind.enumValues)[number]
export type ProjectKindValue = (typeof projectKind.enumValues)[number]
