export type GithubRepoByStarsTrendItem = {
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

export type GithubUserByFollowersTrendItem = {
  original: {
    id: number;
    name: string;
    bio?: string;
    login: string;
    avatar_url: string;
    html_url: string;
    followers?: number;
    following?: number;
    public_repos?: number;
  };
  trend: {
    followers: number;
  };
};
