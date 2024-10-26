import { differenceInCalendarDays } from "date-fns";
import { authorSlugSchema } from "./author.shape";
import { ENV } from "./env";
import { fetchData } from "./fetch";
import { PackageService } from "./package.service";
import { AllAuthorsMap, PackageAuthor } from "./types";

export class AuthorService {
  private static allAuthors: AllAuthorsMap = {};

  static async getAuthor(authorId: string) {
    authorSlugSchema.parse(authorId);

    if (Object.keys(this.allAuthors).length === 0) {
      const url = ENV.VITE_AP_PKGS_URL;
      this.allAuthors = await fetchData<AllAuthorsMap>(url);
    }

    if (!this.allAuthors[authorId]) {
      throw new Error("Author not found");
    }

    const authorPackageSlugs = this.allAuthors[authorId];
    const allPackages = await PackageService.getAllOverviewPackages();

    const authorPackages = authorPackageSlugs
      .map((name) => allPackages.find((p) => p.name === name)!)
      .filter(Boolean);

    const otherAuthors = authorPackages
      .map((p) => p.author_names)
      .flat()
      .filter((name, i, arr) => name !== authorId && arr.indexOf(name) === i);

    const activeEventType = this.getEventForAuthor(authorId);

    return {
      authorId,
      packages: authorPackages,
      otherAuthors,
      activeEventType,
    };
  }

  private static getEventForAuthor(authorId: string) {
    // TODO: move to data-generation.
    const events: Record<
      string,
      [{ day: string; month: string; type: string }]
    > = {
      "Lukas Schönmann": [{ day: "04", month: "11", type: "birthday" }],
    };
    // TODO: Fatal flaw: this will use the server-time as the current time.
    const now = new Date();
    return events[authorId]?.find(
      ({ day, month }) =>
        Math.abs(
          differenceInCalendarDays(
            now,
            new Date(`${now.getFullYear()}-${month}-${day}`),
          ),
        ) <= 2,
    )?.type;
  }
}
