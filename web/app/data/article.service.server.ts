import { slog } from "../modules/observability.server";
import { articleSlugSchema, PressArticleContentSection } from "./article.shape";
import { supabase } from "./supabase.server";
import { Enums, Tables } from "./supabase.types.generated";

export class ArticleService {
  static async checkNewsArticleExists(
    articleSlug: string,
    articleType?: Enums<"press_article_type"> | (string & {}),
  ): Promise<boolean> {
    articleSlugSchema.parse(articleSlug);

    const query = supabase
      .from("press_articles")
      .select("slug", { head: true, count: "exact" })
      .eq("slug", articleSlug);

    if (articleType) {
      query.eq("type", articleType);
    }

    const { count, error } = await query.maybeSingle();

    if (error) {
      slog.error("Error checking if news article exists", { error });
      return false;
    }

    return count === 1;
  }

  static async getArticleBySlug(
    articleSlug: string,
    articleType?: Enums<"press_article_type"> | (string & {}),
  ) {
    articleSlugSchema.parse(articleSlug);

    const query = supabase
      .from("press_articles")
      .select("*, authors:press_authors!inner(*)")
      .eq("slug", articleSlug);

    if (articleType) {
      query.eq("type", articleType);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      slog.error("Error getting news article by slug", { error });
      return null;
    }

    return {
      ...data,
      authors: data.authors as Tables<"press_authors">[],
      sections: data.sections as PressArticleContentSection[],
    };
  }

  static async getAllArticlePreviews(
    articleType: Enums<"press_article_type"> | (string & {}),
  ) {
    const query = supabase
      .from("press_articles")
      .select(
        [
          "slug",
          "title",
          "subline",
          "created_at",
          "categories",
          "synopsis_html",
          "type",
        ].join(","),
      )
      .order("created_at", { ascending: false });

    if (articleType) {
      query.eq("type", articleType);
    }

    const { data, error } = await query;

    if (error) {
      slog.error("Error getting all news articles", { error });
      return [];
    }

    return data as unknown as Array<
      Pick<
        Tables<"press_articles">,
        | "slug"
        | "title"
        | "subline"
        | "created_at"
        | "categories"
        | "synopsis_html"
        | "type"
      >
    >;
  }
}
