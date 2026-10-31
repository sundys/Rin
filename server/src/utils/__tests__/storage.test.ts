import { describe, expect, it } from "bun:test";
import { resolveStorageKeyFromPublicUrl } from "../storage";

const env = {
  S3_ACCESS_HOST: "https://img.example.com",
  S3_ENDPOINT: "https://account.r2.cloudflarestorage.com",
  S3_BUCKET: "blog-images",
} as unknown as Env;

describe("resolveStorageKeyFromPublicUrl", () => {
  it("resolves keys from the public access host", () => {
    expect(resolveStorageKeyFromPublicUrl(env, "https://img.example.com/images/a.png")).toBe("images/a.png");
  });

  it("decodes percent-encoded keys", () => {
    expect(resolveStorageKeyFromPublicUrl(env, "https://img.example.com/images/%E4%B8%AD%E6%96%87.png")).toBe(
      "images/中文.png",
    );
  });

  it("resolves keys from the same-origin blob route", () => {
    expect(resolveStorageKeyFromPublicUrl(env, "https://blog.example.com/api/blob/images/a%20b.png")).toBe(
      "images/a b.png",
    );
  });

  it("resolves keys from the S3 endpoint form", () => {
    expect(resolveStorageKeyFromPublicUrl(env, "https://account.r2.cloudflarestorage.com/blog-images/images/x.png")).toBe(
      "images/x.png",
    );
  });

  it("rejects hosts that are not part of the configured storage", () => {
    expect(resolveStorageKeyFromPublicUrl(env, "https://evil.example.com/images/a.png")).toBeNull();
    expect(resolveStorageKeyFromPublicUrl(env, "https://img.example.com.evil.com/images/a.png")).toBeNull();
    expect(resolveStorageKeyFromPublicUrl(env, "https://api.openai.com/v1/a.png")).toBeNull();
  });

  it("rejects relative paths and empty keys", () => {
    expect(resolveStorageKeyFromPublicUrl(env, "./images/local.png")).toBeNull();
    expect(resolveStorageKeyFromPublicUrl(env, "https://img.example.com/")).toBeNull();
  });
});
