import { format, subDays } from 'date-fns';
import { Octokit } from 'octokit';

const instance = new Octokit({
  auth: process.env.VITE_GITHUB_KEY
});

export async function getReposByStars(params?: { created?: string }) {
  const { created = format(subDays(new Date(), 1), 'yyyy-MM-dd') } = params || {};

  const { data } = await instance.rest.search.repos({
    q: `language:R`,
    sort: 'stars',
    order: 'desc',
    per_page: 50
  });

  return {
    ...data,
    items: data.items.map((item) => ({
      id: item.id,
      name: item.name,
      full_name: item.full_name,
      html_url: item.html_url,
      description: item.description,
      stargazers_count: item.stargazers_count,
      watchers: item.watchers,
      owner: {
        login: item.owner?.login,
        avatar_url: item.owner?.avatar_url
      }
    }))
  };
}
