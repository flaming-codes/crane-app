export type GithubTrendItem = {
  original: {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string;
    stargazers_count: number;
    watchers: number;
    owner: {
      login: string;
      avatar_url: string;
    };
  };
  trend: {
    stargazers_count: 97;
  };
};
