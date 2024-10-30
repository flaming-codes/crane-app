import { BASE_URL } from "../modules/app";

export class ArticleService {
  static async checkNewsArticleExists(
    articleSlug: string,
    requestUrl?: string,
  ): Promise<boolean> {
    const url = `${requestUrl || BASE_URL}/press/news/${encodeURIComponent(articleSlug)}`;
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  }
}
