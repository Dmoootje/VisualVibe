export const QUOTA_SETTINGS = Object.freeze({
  maxPerEmail24h: 3,
  maxPerDevice24h: 3,
  maxPerIp24h: 12,
  maxPerIp30d: 180,
});

const ALLOWED_PROJECT = "gen-lang-client-0235296023";

export function parseRolloutArgs(argv) {
  const projectIndex = argv.indexOf("--project");
  const projectId = projectIndex >= 0 ? argv[projectIndex + 1] : undefined;
  if (projectId !== ALLOWED_PROJECT) {
    throw new Error(`Gebruik exact --project ${ALLOWED_PROJECT}.`);
  }
  return { projectId, apply: argv.includes("--apply") };
}
