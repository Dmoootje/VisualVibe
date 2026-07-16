import { createIndexNowKeyfileResponse } from "@/lib/seo/indexnowKeyfileResponse";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ key: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { key } = await params;
  return createIndexNowKeyfileResponse(key.trim());
}
