import { z } from "zod";
import type { NormalizedPartnerAuditReport } from "@/types/analysis";

function boundedArray<T extends z.ZodTypeAny>(schema: T, limit: number) {
  return z.preprocess(
    (value) => (Array.isArray(value) ? value.slice(0, limit) : value),
    z.array(schema),
  );
}

const boundedScore = z.preprocess(
  (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return value;
    return Math.max(0, Math.min(100, Math.round(number)));
  },
  z.number().min(0).max(100),
);

const boundedInteger = z.preprocess(
  (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return value;
    return Math.max(0, Math.min(10_000_000, Math.trunc(number)));
  },
  z.number().int().min(0).max(10_000_000),
);

const boundedDensity = z.preprocess(
  (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return value;
    return Math.max(0, Math.min(100, number));
  },
  z.number().min(0).max(100),
);

const auditCheckSchema = z.object({
  id: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(300),
  status: z.enum(["pass", "warning", "error"]),
  description: z.string().trim().max(4000),
  advice: z.string().trim().max(4000).optional(),
});

const categorySchema = z.object({
  id: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(300),
  score: boundedScore,
  checks: boundedArray(auditCheckSchema, 100),
});

const issueSchema = z.object({
  id: z.string().trim().min(1).max(120),
  severity: z.enum(["high", "medium", "low"]),
  title: z.string().trim().min(1).max(300),
  explanation: z.string().trim().max(4000),
  recommendation: z.string().trim().max(4000),
});

const strengthSchema = z.object({
  id: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(300),
  explanation: z.string().trim().max(4000),
});

const keywordStatSchema = z.object({
  phrase: z.string().trim().min(1).max(200),
  count: boundedInteger,
  density: boundedDensity,
  locations: boundedArray(z.string().trim().min(1).max(20), 10),
});

const keywordDensitySchema = z.object({
  totalWords: boundedInteger,
  stopWordCount: boundedInteger,
  single: boundedArray(keywordStatSchema, 30),
  double: boundedArray(keywordStatSchema, 25),
  triple: boundedArray(keywordStatSchema, 20),
});

export const partnerAuditReportSchema = z.object({
  schemaVersion: z.literal(1),
  outputLanguage: z.enum(["nl", "en", "fr"]).optional(),
  url: z.string().trim().max(2048).url(),
  overallScore: boundedScore,
  summary: z.string().trim().max(6000),
  categories: boundedArray(categorySchema, 20),
  page: z.object({
    metaTitle: z.string().trim().max(1000).optional(),
    metaDescription: z.string().trim().max(2000).optional(),
    canonical: z.string().trim().max(2048).optional(),
    h1: z.string().trim().max(1000).optional(),
    wordCount: boundedInteger.optional(),
    language: z.string().trim().max(20).optional(),
    indexable: z.boolean().optional(),
  }),
  topIssues: boundedArray(issueSchema, 50),
  strengths: boundedArray(strengthSchema, 50),
  technical: z.object({
    csrDetected: z.boolean().optional(),
    renderedAvailable: z.boolean().optional(),
  }),
  keywordDensity: keywordDensitySchema.optional(),
  stats: z.object({
    totalChecks: boundedInteger,
    passed: boundedInteger,
    warnings: boundedInteger,
    errors: boundedInteger,
  }).optional(),
});

export function parsePartnerAuditReport(input: unknown): NormalizedPartnerAuditReport {
  return partnerAuditReportSchema.parse(input) as NormalizedPartnerAuditReport;
}
