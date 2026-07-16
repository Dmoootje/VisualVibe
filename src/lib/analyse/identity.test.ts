import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/security/encryption", () => ({
  hmacIdentifier: (value: string, purpose: string) => `${purpose}:${value}`,
}));

import { ipHashFromRequest } from "./identity";

function request(headers: Record<string, string> = {}): Request {
  return new Request("https://visualvibe.media/api/analyse/start", { headers });
}

describe("trusted App Hosting client IP", () => {
  it("hashes the penultimate XFF value from the Google-appended suffix", () => {
    expect(ipHashFromRequest(request({
      "x-forwarded-for": "198.51.100.24, 35.191.0.1",
    }))).toBe("ip-quota:198.51.100.24");
  });

  it("ignores spoofed leading values", () => {
    const trustedSuffix = "198.51.100.24, 35.191.0.1";
    const first = ipHashFromRequest(request({
      "x-forwarded-for": `1.1.1.1, ${trustedSuffix}`,
    }));
    const second = ipHashFromRequest(request({
      "x-forwarded-for": `attacker-controlled, 203.0.113.8, ${trustedSuffix}`,
    }));

    expect(first).toBe("ip-quota:198.51.100.24");
    expect(second).toBe(first);
  });

  it("normalizes a bracketed IPv6 client address before hashing", () => {
    expect(ipHashFromRequest(request({
      "x-forwarded-for": "[2001:0db8:0:0:0:0:0:1], 2001:db8::2",
    }))).toBe("ip-quota:2001:db8::1");
  });

  it("uses the conservative fallback for malformed trusted suffix values", () => {
    expect(ipHashFromRequest(request({
      "x-forwarded-for": "not-an-ip, 35.191.0.1",
    }))).toBe("ip-quota:unknown-ip");
    expect(ipHashFromRequest(request({
      "x-forwarded-for": "198.51.100.24, malformed-proxy",
    }))).toBe("ip-quota:unknown-ip");
  });

  it("does not trust X-Real-IP when XFF is missing", () => {
    expect(ipHashFromRequest(request({
      "x-real-ip": "198.51.100.24",
    }))).toBe("ip-quota:unknown-ip");
  });

  it("uses the same deterministic fallback when the header is missing", () => {
    expect(ipHashFromRequest(request())).toBe("ip-quota:unknown-ip");
    expect(ipHashFromRequest(request())).toBe("ip-quota:unknown-ip");
  });
});
