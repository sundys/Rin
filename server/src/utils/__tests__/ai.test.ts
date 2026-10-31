import { describe, expect, it } from "bun:test";
import {
    buildExternalAIChatCompletionsUrl,
    normalizeExternalAIBaseUrl,
} from "../ai";

describe("normalizeExternalAIBaseUrl", () => {
    it("removes trailing slash", () => {
        expect(normalizeExternalAIBaseUrl("https://api.openai.com/v1/")).toBe("https://api.openai.com/v1");
    });

    it("removes chat completions suffix", () => {
        expect(normalizeExternalAIBaseUrl("https://api.openai.com/v1/chat/completions")).toBe("https://api.openai.com/v1");
    });

    it("removes chat completions suffix after trimming", () => {
        expect(normalizeExternalAIBaseUrl(" https://api.openai.com/v1/chat/completions/ ")).toBe("https://api.openai.com/v1");
    });
});

describe("buildExternalAIChatCompletionsUrl", () => {
    it("builds standard chat completions URL from base URL", () => {
        expect(buildExternalAIChatCompletionsUrl("openai", "https://api.openai.com/v1")).toBe(
            "https://api.openai.com/v1/chat/completions",
        );
    });

    it("normalizes full chat completions URL before rebuilding", () => {
        expect(buildExternalAIChatCompletionsUrl("openai", "https://api.openai.com/v1/chat/completions")).toBe(
            "https://api.openai.com/v1/chat/completions",
        );
    });

    it("falls back to provider preset when api URL is empty", () => {
        expect(buildExternalAIChatCompletionsUrl("openai", "")).toBe(
            "https://api.openai.com/v1/chat/completions",
        );
    });

    it("falls back to the zhipu preset when api URL is empty", () => {
        expect(buildExternalAIChatCompletionsUrl("zhipu", "")).toBe(
            "https://open.bigmodel.cn/api/paas/v4/chat/completions",
        );
    });

    it("requires an explicit api URL for openai-compatible relays", () => {
        expect(() => buildExternalAIChatCompletionsUrl("openai-compatible", "")).toThrow(
            "API URL not configured",
        );
        expect(buildExternalAIChatCompletionsUrl("openai-compatible", "https://relay.example.com/v1")).toBe(
            "https://relay.example.com/v1/chat/completions",
        );
    });
});
