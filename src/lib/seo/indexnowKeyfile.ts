const INDEXNOW_KEY_PATTERN = /^[a-zA-Z0-9-]{8,128}$/;
const INDEXNOW_TXT_PATH_PATTERN = /\/([a-zA-Z0-9-]{8,128})\.txt\/?$/;

/**
 * App Hosting + trailingSlash can make the IndexNow root rewrite arrive without
 * the query parameter. Accept both the intended query form and the original
 * `/{key}.txt` path so the public verification file stays reachable.
 */
export function resolveRequestedIndexNowKey(url: URL): string {
  const queryKey = url.searchParams.get("key")?.trim() ?? "";
  if (INDEXNOW_KEY_PATTERN.test(queryKey)) return queryKey;

  const pathKey = url.pathname.match(INDEXNOW_TXT_PATH_PATTERN)?.[1] ?? "";
  if (INDEXNOW_KEY_PATTERN.test(pathKey)) return pathKey;

  return "";
}
