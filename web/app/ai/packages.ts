import { createGoogleGenerativeAI } from "@ai-sdk/google";
import TTLCache from "@isaacs/ttlcache";
import { generateObject, generateText } from "ai";
import { hoursToMilliseconds } from "date-fns";
import xss from "xss";
import { z } from "zod";

type CacheKey =
  | "trending-packages-summary"
  | "top-downloads-summary"
  | "r-releases-summary";

export class AIPackageService {
  private static cache = new TTLCache<CacheKey, string>({
    ttl: hoursToMilliseconds(6),
    max: 100,
  });

  static async generateTopDownloadsSummary(
    contextComposer: () => Promise<string>,
  ) {
    const cachedData = this.cache.get("top-downloads-summary");
    if (cachedData) {
      return cachedData;
    }

    const google = createGoogleGenerativeAI();

    const prompt = [
      "You're a world-class summarizer of scientific code packages written in R.",
      "Given the currently most downloaded packages on CRAN and their descriptions below, summarize a concise analysis of the trending TOPICS of those packages.",
      "The goal is to get a birds-eye-view of the current trends. Respond with highly concise, to-the-point, well-written prose.",
      "You MUST respond in HTML-format.",
      "Never use headings or lists.",
      "Never contain <html> or <body> tags.",
    ].join(" ");

    const context = await contextComposer();

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `${prompt}\n---\n${context}`,
      // Just a safeguard to prevent excessive token usage.
      maxTokens: 8192,
      temperature: 0.3,
    });

    this.cache.set("top-downloads-summary", text);

    return xss(text);
  }

  static async generateTrendsSummary(contextComposer: () => Promise<string>) {
    const cachedData = this.cache.get("trending-packages-summary");
    if (cachedData) {
      return cachedData;
    }

    const google = createGoogleGenerativeAI();

    const prompt = [
      "You're a world-class summarizer of scientific code packages written in R.",
      "Given the currently trending packages and their descriptions below, summarize a highly concise analysis of the trending TOPICS of those packages.",
      "The goal is to get a birds-eye-view of the current trends. Respond with concise, to-the-point, well-written prose.",
      "You MUST respond in HTML-format. Never use headings or lists.",
      "Never contain <html> or <body> tags.",
    ].join(" ");

    const context = await contextComposer();

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `${prompt}\n---\n${context}`,
      // Just a safeguard to prevent excessive token usage.
      maxTokens: 8192,
    });

    this.cache.set("trending-packages-summary", text);

    return xss(text);
  }

  static async generateRVersionsSummary(
    contextComposer: () => Promise<string>,
  ): Promise<
    Array<{
      platform: string;
      releases: Array<{
        date: string;
        version: string;
        name: string;
        description: string;
      }>;
    }>
  > {
    const cachedData = this.cache.get("r-releases-summary");
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const google = createGoogleGenerativeAI();

    const prompt = [
      "Given the following HTML content from CRAN's R versions page, structure the key points in a concise, well-written prose.",
      "You HAVE TO respond in JSON format and diligently follow the schema provided below.",
    ].join(" ");

    const context = await contextComposer();

    const json = await generateObject({
      model: google("gemini-1.5-flash"),
      prompt: `${prompt}\n---\n${context}`,
      maxTokens: 8192,
      schema: z.array(
        z.object({
          platform: z.string(),
          releases: z.array(
            z.object({
              version: z.string(),
              date: z.string(),
              name: z.string(),
              description: z.string(),
            }),
          ),
        }),
      ),
    });

    this.cache.set("r-releases-summary", JSON.stringify(json.object));
    return json.object;
  }
}
