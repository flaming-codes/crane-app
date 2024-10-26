import { http, HttpResponse } from "msw";
import { ENV } from "../data/env";
import xadmix from "./fixtures/package.xadmix.json";
import GaussSuppression from "./fixtures/package.gauss-surpression.json";
import allAuthors from "./fixtures/author.all.json";
import allPackages from "./fixtures/package.all.json";

export const handlers = [
  http.get(
    `${ENV.VITE_SELECT_PKG_URL.replace("{{id}}", "GaussSuppression")}`,
    () => {
      return HttpResponse.json(GaussSuppression);
    },
  ),
  http.get(ENV.VITE_SELECT_PKG_URL.replace("{{id}}", "xadmix"), () => {
    return HttpResponse.json(xadmix);
  }),
  // Authors map.
  http.get(ENV.VITE_AP_PKGS_URL, () => {
    return HttpResponse.json(allAuthors);
  }),
  // Packages for overview.
  http.get(ENV.VITE_OVERVIEW_PKGS_URL, () => {
    return HttpResponse.json(allPackages);
  }),
];
