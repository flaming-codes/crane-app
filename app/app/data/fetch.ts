import { ENV } from "./env";

export async function fetchData<T>(href: string, path?: string): Promise<T> {
  return fetch(href + (path || ""), {
    headers: {
      Authorization: `Token ${ENV.VITE_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((res) => res.json());
}
