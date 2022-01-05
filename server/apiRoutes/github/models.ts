export interface GithubPullRequestModel {
  id: number;
  number: number;
  title: string;
  user: { login: string };
}

export interface PRDetail {
  id: number;
  number: number;
  title: string;
  author: string;
}
