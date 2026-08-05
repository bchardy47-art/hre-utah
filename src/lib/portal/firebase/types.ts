/**
 * Firestore document shapes for the Trade Partner Portal.
 *
 * Design note that matters: these types are deliberately shaped so the pure
 * compliance engine in ../compliance.ts continues to work unchanged. Firestore
 * stores Timestamps, but every repository converts to `Date` at its boundary, so
 * the business rules never learn which database they are sitting on. That is
 * what makes the 40+ existing compliance tests survive this migration intact.
 *
 * Sensitive-data posture is unchanged from the Postgres implementation:
 *   - Full EIN is never persisted; only `einLast4`. The W-9 is the record.
 *   - Bank routing/account numbers are never persisted.
 *   - Invitation tokens are stored as SHA-256 hashes, never raw.
 *   - Files live in Firebase Storage; only the object path is stored here.
 */

// ---------------------------------------------------------------------------
// Enumerations — string unions rather than Postgres enums.
// ---------------------------------------------------------------------------

export const COMPANY_STATUSES = [
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
] as const
export type CompanyStatusValue = (typeof COMPANY_STATUSES)[number]

export const DOCUMENT_STATES = [
  'MISSING',
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'EXPIRED',
  'NOT_APPLICABLE',
  'SUPERSEDED',
] as const
export type DocumentStateValue = (typeof DOCUMENT_STATES)[number]

export const APPLICATION_STATUSES = [
  'NOT_STARTED',
  'IN_PROGRESS',
  'SUBMITTED',
  'RETURNED_FOR_CORRECTION',
  'APPROVED',
] as const
export type ApplicationStatusValue = (typeof APPLICATION_STATUSES)[number]

export const DOCUMENT_CATEGORIES = [
  'TAX_AND_CORPORATE',
  'LICENSING',
  'INSURANCE',
  'AGREEMENTS_AND_POLICIES',
  'OTHER',
] as const
export type DocumentCategoryValue = (typeof DOCUMENT_CATEGORIES)[number]

export const ENTITY_TYPES = [
  'SOLE_PROPRIETOR',
  'PARTNERSHIP',
  'LLC',
  'S_CORP',
  'C_CORP',
  'NONPROFIT',
  'OTHER',
] as const
export type EntityTypeValue = (typeof ENTITY_TYPES)[number]

export const CONTACT_ROLES = [
  'OWNER_PRINCIPAL',
  'PRIMARY',
  'ESTIMATING',
  'FIELD_SUPERVISOR',
  'ACCOUNTING',
  'EMERGENCY',
] as const
export type ContactRoleValue = (typeof CONTACT_ROLES)[number]

export const INVITATION_STATUSES = ['PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED'] as const
export type InvitationStatusValue = (typeof INVITATION_STATUSES)[number]

export const INSURANCE_KINDS = [
  'GENERAL_LIABILITY',
  'WORKERS_COMPENSATION',
  'COMMERCIAL_AUTO',
  'UMBRELLA_EXCESS',
] as const
export type InsuranceKindValue = (typeof INSURANCE_KINDS)[number]

export const PROJECT_KINDS = ['COMPARABLE', 'ACTIVE', 'COMPLETED_OVER_ONE_YEAR'] as const
export type ProjectKindValue = (typeof PROJECT_KINDS)[number]

export const VERIFICATION_STATUSES = ['NOT_VERIFIED', 'VERIFIED', 'REJECTED'] as const
export type VerificationStatusValue = (typeof VERIFICATION_STATUSES)[number]

export const REVIEW_DECISIONS = [
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'NOT_APPLICABLE',
] as const
export type ReviewDecisionValue = (typeof REVIEW_DECISIONS)[number]

export type UserRoleValue = 'ADMIN' | 'TRADE_PARTNER'

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export const COLLECTIONS = {
  users: 'portalUsers',
  companies: 'tradePartnerCompanies',
  contacts: 'tradePartnerContacts',
  invitations: 'tradePartnerInvitations',
  applications: 'tradePartnerApplications',
  licenses: 'tradePartnerLicenses',
  insurance: 'tradePartnerInsurancePolicies',
  projects: 'tradePartnerProjectHistory',
  requirements: 'documentRequirements',
  documents: 'tradePartnerDocuments',
  documentReviews: 'tradePartnerDocumentReviews',
  acknowledgments: 'tradePartnerAcknowledgments',
  statusHistory: 'tradePartnerStatusHistory',
  internalNotes: 'tradePartnerInternalNotes',
  auditEvents: 'tradePartnerAuditEvents',
  reminderActions: 'tradePartnerReminderActions',
} as const

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

/**
 * Mirrors a Firebase Auth user. Firebase owns the credential; this document owns
 * the portal's authorization facts.
 *
 * Company membership deliberately lives HERE and not only in a custom claim,
 * because membership and company status change and a minted claim would go
 * stale in the user's token until it refreshed.
 */
export type PortalUser = {
  id: string
  /** Firebase Auth UID. Same as `id`. */
  uid: string
  email: string
  name: string
  phone: string | null
  role: UserRoleValue
  companyId: string | null
  isActive: boolean
  emailVerified: boolean
  lastLoginAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type Company = {
  id: string
  status: CompanyStatusValue

  legalName: string
  dba: string | null
  entityType: EntityTypeValue | null
  /** Last four of the EIN only. */
  einLast4: string | null
  einConfirmedAt: Date | null

  businessAddress1: string | null
  businessAddress2: string | null
  businessCity: string | null
  businessState: string | null
  businessZip: string | null
  mailingSameAsBusiness: boolean
  mailingAddress1: string | null
  mailingAddress2: string | null
  mailingCity: string | null
  mailingState: string | null
  mailingZip: string | null

  mainPhone: string | null
  generalEmail: string | null
  website: string | null
  yearEstablished: number | null
  yearsInBusiness: number | null

  primaryTrade: string
  additionalTrades: string[]
  serviceAreas: string[]

  typicalProjectSize: string | null
  largestProject: string | null
  crewSize: number | null
  annualCapacity: string | null
  currentBacklog: string | null
  usesLowerTierSubs: boolean | null
  description: string | null

  archivedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type Contact = {
  id: string
  companyId: string
  role: ContactRoleValue
  name: string
  title: string | null
  email: string | null
  phone: string | null
  createdAt: Date
  updatedAt: Date
}

export type Invitation = {
  id: string
  companyId: string
  email: string
  contactName: string
  contactPhone: string | null
  /** SHA-256 of the token. The raw token is shown once and never stored. */
  tokenHash: string
  status: InvitationStatusValue
  message: string | null
  expiresAt: Date
  sentAt: Date
  lastSentAt: Date
  resendCount: number
  openedAt: Date | null
  acceptedAt: Date | null
  revokedAt: Date | null
  createdById: string | null
  revokedById: string | null
  createdAt: Date
  updatedAt: Date
}

export type Application = {
  id: string
  companyId: string
  status: ApplicationStatusValue
  sectionProgress: Record<string, boolean>
  lastSection: string | null

  submittedAt: Date | null
  returnedAt: Date | null
  returnReason: string | null
  reviewedAt: Date | null
  reviewedById: string | null

  // Section F — applicant disclosures, not adjudicated findings.
  disclosurePendingLitigation: boolean | null
  disclosurePendingLitigationText: string | null
  disclosureBankruptcy: boolean | null
  disclosureBankruptcyText: string | null
  disclosureJudgmentsOrLiens: boolean | null
  disclosureJudgmentsOrLiensText: string | null
  disclosureInsuranceClaims: boolean | null
  disclosureInsuranceClaimsText: string | null
  disclosureOshaCitations: boolean | null
  disclosureOshaCitationsText: string | null
  disclosureSeriousInjuries: boolean | null
  disclosureSeriousInjuriesText: string | null
  disclosureWarrantyDisputes: boolean | null
  disclosureWarrantyDisputesText: string | null
  disclosureAbandonedProjects: boolean | null
  disclosureAbandonedProjectsText: string | null
  disclosureSupplierDisputes: boolean | null
  disclosureSupplierDisputesText: string | null
  disclosureUsesLowerTierSubs: boolean | null
  disclosureUsesLowerTierSubsText: string | null
  disclosureWorkersAuthorized: boolean | null
  disclosureWorkersAuthorizedText: string | null

  // Section G — certification
  certificationVersion: string | null
  certifiedAt: Date | null
  signerName: string | null
  signerTitle: string | null
  signerIpAddress: string | null
  signerUserAgent: string | null

  createdAt: Date
  updatedAt: Date
}

export type License = {
  id: string
  companyId: string
  licenseNumber: string
  classification: string | null
  licensedEntityName: string | null
  qualifierName: string | null
  issueDate: Date | null
  expirationDate: Date | null
  otherInformation: string | null
  everDisciplined: boolean
  disciplineExplanation: string | null
  /** Manual verification only. No automatic DOPL lookup exists. */
  verificationStatus: VerificationStatusValue
  verifiedById: string | null
  verifiedAt: Date | null
  verificationNotes: string | null
  verificationSource: string | null
  createdAt: Date
  updatedAt: Date
}

export type InsurancePolicy = {
  id: string
  companyId: string
  kind: InsuranceKindValue
  carrier: string | null
  policyNumber: string | null
  perOccurrenceLimit: string | null
  aggregateLimit: string | null
  effectiveDate: Date | null
  expirationDate: Date | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export type ProjectReference = {
  id: string
  companyId: string
  kind: ProjectKindValue
  projectName: string | null
  projectType: string | null
  projectLocation: string | null
  contractAmountRange: string | null
  completionDate: Date | null
  scopePerformed: string | null
  referenceName: string
  referenceCompany: string | null
  referencePhone: string | null
  referenceEmail: string | null
  permissionToContact: boolean
  contactedById: string | null
  contactedAt: Date | null
  contactNotes: string | null
  createdAt: Date
  updatedAt: Date
}

/** Configuration, not code. New requirements are documents, not deploys. */
export type DocumentRequirement = {
  id: string
  code: string
  name: string
  category: DocumentCategoryValue
  description: string | null
  isRequired: boolean
  /** Empty means "applies to every trade". */
  applicableTrades: string[]
  /** Empty means "applies to every entity type". */
  applicableEntityTypes: EntityTypeValue[]
  hasExpiration: boolean
  allowNotApplicable: boolean
  blocksBid: boolean
  blocksWork: boolean
  requiresReview: boolean
  isAcknowledgment: boolean
  /** Storage object path of an administrator-uploaded template, if any. */
  templateStoragePath: string | null
  templateFilename: string | null
  templateVersion: string | null
  templateIsDraft: boolean
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type PortalDocument = {
  id: string
  companyId: string
  requirementId: string
  state: DocumentStateValue
  version: number

  originalFilename: string | null
  /**
   * Firebase Storage object path. Never a public URL — download access is minted
   * per request, after authorization.
   */
  storagePath: string | null
  mimeType: string | null
  fileSize: number | null
  checksumSha256: string | null

  effectiveDate: Date | null
  expirationDate: Date | null

  submittedById: string | null
  submittedAt: Date
  reviewedById: string | null
  reviewedAt: Date | null
  rejectionReason: string | null
  adminNotes: string | null
  notApplicableReason: string | null
  notApplicableById: string | null

  /** Replacement chain. History is never destroyed. */
  supersededByDocumentId: string | null

  createdAt: Date
  updatedAt: Date
}

export type DocumentReview = {
  id: string
  documentId: string
  companyId: string
  reviewerId: string
  decision: ReviewDecisionValue
  reason: string | null
  notes: string | null
  createdAt: Date
}

export type Acknowledgment = {
  id: string
  companyId: string
  requirementId: string
  templateVersion: string
  signerName: string
  signerTitle: string | null
  acknowledgedAt: Date
  acknowledgedById: string | null
  ipAddress: string | null
  userAgent: string | null
}

export type StatusHistoryEntry = {
  id: string
  companyId: string
  fromStatus: CompanyStatusValue | null
  toStatus: CompanyStatusValue
  reason: string | null
  changedById: string | null
  changedByName: string | null
  isSystemGenerated: boolean
  createdAt: Date
}

/** Administrator-only. Never returned by a trade-partner-facing read. */
export type InternalNote = {
  id: string
  companyId: string
  documentId: string | null
  authorId: string
  authorName: string
  body: string
  createdAt: Date
}

export type AuditEvent = {
  id: string
  companyId: string | null
  actorUserId: string | null
  actorRole: UserRoleValue | null
  actorLabel: string | null
  action: string
  targetType: string | null
  targetId: string | null
  summary: string
  /** Redacted before write — never a full EIN, policy number, or token. */
  metadata: Record<string, unknown> | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
}

/**
 * Replaces the old notification table.
 *
 * The portal no longer sends email. An administrator opens a prefilled Gmail
 * draft and sends it themselves, so what is recorded here is the *action a
 * person took*, never a delivery claim. `DRAFT_OPENED` means exactly that.
 */
export const REMINDER_ACTION_KINDS = ['DRAFT_OPENED', 'MARKED_HANDLED', 'DISMISSED'] as const
export type ReminderActionKind = (typeof REMINDER_ACTION_KINDS)[number]

export type ReminderAction = {
  id: string
  companyId: string
  /** Set for document-expiry reminders; null for company-level messages. */
  documentId: string | null
  requirementId: string | null
  /** What the message was about, e.g. 'expiration_warning', 'document_rejected'. */
  messageType: string
  /** Threshold this covers: '30' | '14' | '7' | '0' | 'expired' | 'n/a'. */
  threshold: string
  kind: ReminderActionKind
  /**
   * Idempotency key — `${messageType}:${documentId ?? companyId}:${threshold}`.
   * Used as the Firestore document ID so the same reminder cannot be recorded
   * twice, which is what keeps the action queue from repeating itself.
   */
  dedupeKey: string
  toEmail: string
  subject: string
  actorUserId: string | null
  actorName: string | null
  createdAt: Date
}
