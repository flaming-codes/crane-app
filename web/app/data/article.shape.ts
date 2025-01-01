import { z } from "zod";

export const articleSlugSchema = z.string().min(1).max(255);

export type PressArticleContentSection = {
  headline: string;
  fragment: string;
  body: PressArticleContentBody;
};

export type PressArticleContentBody = Array<
  | {
      type: "html";
      value: string;
    }
  | {
      type: "image";
      value: PressArticleContentBodyImage;
    }
>;

export type PressArticleContentBodyImage = {
  src: string;
  caption: string;
};
