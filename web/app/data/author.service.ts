import { addHours, differenceInCalendarDays } from "date-fns";
import { authorSlugSchema } from "./author.shape";
import { ENV } from "./env";
import { fetchData } from "./fetch";
import { PackageService } from "./package.service";
import { AllAuthorsMap, ExpiringSearchIndex, SearchableAuthor } from "./types";
import MiniSearch from "minisearch";
import { encodeSitemapSymbols } from "../modules/sitemap";

export class AuthorService {
  private static _allAuthors: AllAuthorsMap | undefined = undefined;

  private static _authorsSearchIndex: ExpiringSearchIndex<
    MiniSearch<SearchableAuthor>
  > = {
    index: new MiniSearch({ fields: ["ignore"] }),
    expiresAt: 0,
  };

  static async getAuthor(authorId: string) {
    authorSlugSchema.parse(authorId);

    if (!this._allAuthors) {
      this._allAuthors = await fetchData<AllAuthorsMap>(ENV.VITE_AP_PKGS_URL);
    }

    if (!this._allAuthors[authorId]) {
      throw new Error("Author not found");
    }

    const authorPackageSlugs = this._allAuthors[authorId];
    const allPackages = await PackageService.getAllOverviewPackages();

    const authorPackages = authorPackageSlugs
      .map((name) => allPackages.find((p) => p.name === name)!)
      .filter(Boolean);

    const otherAuthors = authorPackages
      .map((p) => p.author_names)
      .flat()
      .filter((name, i, arr) => name !== authorId && arr.indexOf(name) === i);

    const activeEventType = this.getEventForAuthor(authorId);
    const description = this.generateAuthorDescription(
      authorId,
      authorPackageSlugs,
      otherAuthors,
    );

    return {
      authorId,
      packages: authorPackages,
      otherAuthors,
      activeEventType,
      description,
    };
  }

  static async getAllAuthors() {
    if (!this._allAuthors) {
      this._allAuthors = await fetchData<AllAuthorsMap>(ENV.VITE_AP_PKGS_URL);
    }
    return this._allAuthors;
  }

  static async getAllSitemapAuthors(): Promise<
    Array<[slug: string, lastMod: undefined]>
  > {
    if (!this._allAuthors) {
      this._allAuthors = await fetchData<AllAuthorsMap>(ENV.VITE_AP_PKGS_URL);
    }
    return Object.keys(this._allAuthors).map((name) => [
      this.sanitizeSitemapName(name),
      undefined,
    ]);
  }

  static async searchAuthors(query: string, options?: { limit?: number }) {
    const { limit = 20 } = options || {};

    if (this._authorsSearchIndex.expiresAt < Date.now()) {
      await this.initSearchableAuthorsIndex();
    }

    const hits = this._authorsSearchIndex.index
      .search(query, { fuzzy: 0.3, prefix: true })
      .slice(0, limit);

    return hits || [];
  }

  private static sanitizeSitemapName(name: string) {
    let next = name.trim();
    if (next.startsWith(`"`)) next = next.slice(1);
    if (next.endsWith(`"`)) next = next.slice(0, -1);
    if (next.startsWith("'")) next = next.slice(1);
    if (next.endsWith("'")) next = next.slice(0, -1);
    if (next.endsWith(",")) next = next.slice(0, -1);
    return next.trim();
  }

  private static async initSearchableAuthorsIndex() {
    this._authorsSearchIndex = {
      expiresAt: addHours(Date.now(), 12).getTime(),
      index: new MiniSearch({
        idField: "name",
        fields: ["name"],
        storeFields: ["name", "slug", "totalPackages"],
      }),
    };

    const authors = await this.getAllAuthors();
    const searchableAuthors: SearchableAuthor[] = Object.entries(authors).map(
      ([name, packageNames]) => ({
        name,
        slug: encodeSitemapSymbols(encodeURIComponent(name)),
        totalPackages: Array.isArray(packageNames)
          ? packageNames.length
          : undefined,
      }),
    );

    this._authorsSearchIndex.index.addAll(searchableAuthors);
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

  private static generateAuthorDescription(
    authorName: string,
    packages: string[],
    otherAuthors: string[],
  ): string {
    const packageCount = packages.length;
    const otherAuthorCount = otherAuthors.length;

    let packageDescription = "";
    let authorDescription = "";

    // Helper function to join author names naturally with 'and'
    function joinAuthors(authors: string[]): string {
      if (authors.length === 0) return "";
      if (authors.length === 1) return authors[0];
      return `${authors.slice(0, -1).join(", ")} and ${authors[authors.length - 1]}`;
    }

    // Helper function to randomly select from an array of strings
    function getRandomDescription(descriptions: string[]): string {
      return descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    // Generate package description
    if (packageCount === 1) {
      const descriptions = [
        `${authorName} has worked on just 1 package so far. But hey, every journey starts with a single step, right? This package might just be the beginning of something legendary!`,
        `${authorName} is starting small with 1 package. Rome wasn't built in a day, and neither is a great portfolio!`,
        `With 1 package under their belt, ${authorName} is just getting started. Great things often have humble beginnings!`,
      ];
      packageDescription = getRandomDescription(descriptions);
    } else if (packageCount === 2) {
      const descriptions = [
        `${authorName} has worked on 2 packages so far. Two's company, but it looks like ${authorName} is just getting warmed up!`,
        `Two packages down, and ${authorName} is picking up steam. Just getting started!`,
        `${authorName} has got 2 packages done. They say good things come in pairs, and this could be the start of a streak!`,
      ];
      packageDescription = getRandomDescription(descriptions);
    } else if (packageCount === 3) {
      const descriptions = [
        `${authorName} has worked on 3 packages. Three's a charm, and it seems like ${authorName} is finding their stride!`,
        `Three packages in, and ${authorName} is just getting started. Momentum is building!`,
        `${authorName} has completed 3 packages. That's enough to show some serious dedication!`,
      ];
      packageDescription = getRandomDescription(descriptions);
    } else if (packageCount === 4) {
      const descriptions = [
        `${authorName} has worked on 4 packages. That's some solid dedication, and ${authorName} is starting to build a nice little portfolio!`,
        `Four packages in the books! ${authorName} is on a roll and showing no signs of slowing down.`,
        `${authorName} has completed 4 packages, and it looks like they're just getting started. Keep an eye out for more!`,
      ];
      packageDescription = getRandomDescription(descriptions);
    } else if (packageCount === 5) {
      const descriptions = [
        `${authorName} has worked on 5 packages. High five to ${authorName}! That's a respectable number of projects!`,
        `Five packages done, and ${authorName} is proving to be a force to be reckoned with.`,
        `${authorName} has hit 5 packages. That's some impressive dedication right there!`,
      ];
      packageDescription = getRandomDescription(descriptions);
    } else if (packageCount > 5 && packageCount <= 10) {
      const descriptions = [
        `${authorName} has been quite busy, working on ${packageCount} packages. You could say ${authorName} is on a coding spree! Keep up the great work!`,
        `${authorName} has worked on ${packageCount} packages so far. That's a lot of coding! Clearly, ${authorName} is on a mission.`,
        `With ${packageCount} packages completed, ${authorName} is proving to be quite the prolific developer. Keep it up!`,
      ];
      packageDescription = getRandomDescription(descriptions);
    } else if (packageCount > 10 && packageCount <= 15) {
      const descriptions = [
        `${authorName} has worked on ${packageCount} packages so far. Wow, ${authorName} is really cranking out the code—this is dedication on another level!`,
        `Impressive! ${authorName} has worked on ${packageCount} packages, showing some serious commitment to the craft.`,
        `${authorName} has ${packageCount} packages under their belt. That's not just dedication, it's a passion for coding!`,
      ];
      packageDescription = getRandomDescription(descriptions);
    } else if (packageCount > 15 && packageCount <= 20) {
      const descriptions = [
        `${authorName} has worked on ${packageCount} packages. That's an impressive feat! ${authorName} must have some serious passion for coding.`,
        `With ${packageCount} packages completed, ${authorName} is showing some serious coding chops. The future looks bright!`,
        `${authorName} has put out ${packageCount} packages—clearly, they're unstoppable. Keep those packages coming!`,
      ];
      packageDescription = getRandomDescription(descriptions);
    } else if (packageCount > 20) {
      const descriptions = [
        `${authorName} has been on fire, working on ${packageCount} packages to date. Honestly, does ${authorName} even sleep? This is some serious dedication!`,
        `${authorName} has completed over ${packageCount} packages! The dedication here is off the charts—clearly a coding superstar!`,
        `${authorName} has worked on ${packageCount} packages, which is nothing short of amazing. Who needs sleep when you've got code to write?`,
      ];
      packageDescription = getRandomDescription(descriptions);
    } else {
      packageDescription = `${authorName} hasn't worked on any packages yet, but stay tuned! Great things often start with a bit of patience.`;
    }

    // Generate author collaboration description
    if (otherAuthorCount === 0) {
      const descriptions = [
        ` A true lone wolf! ${authorName} prefers to code solo, blazing their own trail through the wilderness of software development.`,
        ` ${authorName} is going solo on this one. No distractions, just pure, undiluted coding power!`,
        ` No other authors involved—${authorName} likes to fly solo, and it shows in their work!`,
      ];
      authorDescription = getRandomDescription(descriptions);
    } else if (otherAuthorCount === 1) {
      const descriptions = [
        ` ${authorName} has collaborated with 1 other author: ${joinAuthors(otherAuthors)}. Just the two of them, like a dynamic duo, making magic happen!`,
        ` ${authorName} worked with ${joinAuthors(otherAuthors)} on this project. A perfect partnership for some great results!`,
        ` One collaborator: ${joinAuthors(otherAuthors)}. ${authorName} knows how to pick the right partner to get the job done!`,
      ];
      authorDescription = getRandomDescription(descriptions);
    } else if (otherAuthorCount === 2) {
      const descriptions = [
        ` ${authorName} has worked alongside 2 other authors: ${joinAuthors(otherAuthors)}. A trio of talent! Three heads are better than one, after all.`,
        ` ${authorName} teamed up with ${joinAuthors(otherAuthors)}. Three developers tackling the challenge together—what could be better?`,
        ` Three minds working as one—${authorName} and ${joinAuthors(otherAuthors)} brought their skills together for a stellar outcome.`,
      ];
      authorDescription = getRandomDescription(descriptions);
    } else if (otherAuthorCount === 3) {
      const descriptions = [
        ` ${authorName} has worked with 3 other authors: ${joinAuthors(otherAuthors)}. Four brilliant minds coming together—what could go wrong?`,
        ` ${authorName} and their 3 collaborators—${joinAuthors(otherAuthors)}—made a fantastic team. Four is definitely not a crowd when it comes to coding!`,
        ` Working with 3 others, ${authorName} and ${joinAuthors(otherAuthors)} showed that teamwork makes the dream work!`,
      ];
      authorDescription = getRandomDescription(descriptions);
    } else if (otherAuthorCount === 4) {
      const descriptions = [
        ` ${authorName} has collaborated with 4 other authors: ${joinAuthors(otherAuthors)}. Five people, five different ideas—sounds like a lot of fun!`,
        ` ${authorName} worked with 4 other talented individuals—${joinAuthors(otherAuthors)}. Five coders, one goal, endless possibilities!`,
        ` Four collaborators joined ${authorName} on this project, making for a team of five. With ${joinAuthors(otherAuthors)}, the possibilities were endless!`,
      ];
      authorDescription = getRandomDescription(descriptions);
    } else if (otherAuthorCount === 5) {
      const descriptions = [
        ` ${authorName} has worked alongside 5 other authors: ${joinAuthors(otherAuthors)}. Six people coding together—it's like a party, but with more bugs and commits!`,
        ` ${authorName} and 5 others—${joinAuthors(otherAuthors)}—teamed up to tackle the challenge. A party of six, ready to conquer the code!`,
        ` With 5 collaborators, ${authorName} and ${joinAuthors(otherAuthors)} brought the energy of a six-person team to the project. It was an adventure!`,
      ];
      authorDescription = getRandomDescription(descriptions);
    } else if (otherAuthorCount > 5 && otherAuthorCount <= 10) {
      const descriptions = [
        ` ${authorName} has joined forces with over ${otherAuthorCount} authors, making it a true team effort. Imagine all those brainstorming sessions—must've been epic!`,
        ` ${authorName} worked with ${otherAuthorCount} other authors. That's a lot of creative energy! No wonder the results were fantastic.`,
        ` Collaborating with ${otherAuthorCount} other authors, ${authorName} experienced the power of teamwork. The more, the merrier—especially in coding!`,
      ];
      authorDescription = getRandomDescription(descriptions);
    } else if (otherAuthorCount > 10 && otherAuthorCount <= 15) {
      const descriptions = [
        ` ${authorName} has worked with ${otherAuthorCount} other authors. That's a whole squad of coders! It must be like managing a small battalion of creativity and caffeine.`,
        ` ${authorName} teamed up with ${otherAuthorCount} others, making it a large and lively crew of coders. The synergy must have been amazing!`,
        ` ${authorName} collaborated with ${otherAuthorCount} other developers. That's like an entire class of coding geniuses coming together!`,
      ];
      authorDescription = getRandomDescription(descriptions);
    } else if (otherAuthorCount > 15 && otherAuthorCount <= 20) {
      const descriptions = [
        ` ${authorName} has collaborated with ${otherAuthorCount} other authors. That's a huge network of talent—imagine all those lines of communication and brilliant ideas flying around!`,
        ` With ${otherAuthorCount} collaborators, ${authorName} was part of a truly massive undertaking. It takes a village to code something great!`,
        ` ${authorName} and ${otherAuthorCount} other talented individuals worked together, forming a powerhouse of developers. That's some serious talent!`,
      ];
      authorDescription = getRandomDescription(descriptions);
    } else if (otherAuthorCount > 20) {
      const descriptions = [
        ` ${authorName} has collaborated with a whopping ${otherAuthorCount} other authors. It's basically a small army of coders! Who knew package development could be such a social event?`,
        ` ${authorName} worked with over ${otherAuthorCount} collaborators. That's a huge group of developers—almost like a coding festival!`,
        ` ${authorName} teamed up with ${otherAuthorCount} other developers, making this project a gigantic collaborative effort. The coding world is a better place for it!`,
      ];
      authorDescription = getRandomDescription(descriptions);
    }

    return packageDescription + authorDescription;
  }
}