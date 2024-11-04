import { createGoogleGenerativeAI } from "@ai-sdk/google";
import TTLCache from "@isaacs/ttlcache";
import { generateText } from "ai";
import { hoursToMilliseconds } from "date-fns";
import xss from "xss";

type CacheKey = "trending-packages-summary" | "top-downloads-summary";

export class AIPackageService {
  private static cache = new TTLCache<CacheKey, string>({
    ttl: hoursToMilliseconds(6),
    max: 100,
  });

  static async generateTopDownloadsSummary(context: string) {
    const cachedData = this.cache.get("trending-packages-summary");
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
    ].join(" ");

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

  static async generateTrendsSummary(context: string) {
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
    ].join(" ");

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `${prompt}\n---\n${context}`,
      // Just a safeguard to prevent excessive token usage.
      maxTokens: 8192,
    });

    this.cache.set("trending-packages-summary", text);

    return xss(text);
  }
}
