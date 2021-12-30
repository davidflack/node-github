import { AxiosResponse } from "axios";
import { Request } from "express";
import { axiosInstance as axios } from "../../config";

export interface GithubPullRequestModel {
  id: number;
  number: number;
  title: string;
  user: { login: string };
}

export function validateRequest(req: Request): Promise<string> {
  if (
    !req.query.repoOwner ||
    !req.query.repoName ||
    !String(req.query.repoOwner) ||
    !String(req.query.repoName)
  ) {
    return Promise.reject(
      new Error(
        'Query parameters "repoOwner" (string) and "repoName" (string) are required.'
      )
    );
  } else if (req.query.page && !Number(req.query.page)) {
    return Promise.reject(
      new Error('Optional query parameter "page" must be a number.')
    );
  }
  const defaultPage = Number(req.query.page)
    ? encodeURIComponent(Number(req.query.page))
    : encodeURIComponent(1);
  const repoOwner = encodeURIComponent(String(req.query.repoOwner));
  const repoName = encodeURIComponent(String(req.query.repoName));
  return Promise.resolve(`/${repoOwner}/${repoName}/pulls?page=${defaultPage}`);
}

export function requestPRInfo(url: string) {
  return axios.get(url);
}

export function extractErrorStatusCode(err: { response?: { status: number } }) {
  return err.response?.status ? err.response.status : 500;
}

export function trimQueryParamsFromUrl(url: string) {
  return url.split("?")[0];
}

export function generateCommitRequestUrls(
  response: AxiosResponse<GithubPullRequestModel[], any>
) {
  const prUrl = response?.config?.url
    ? trimQueryParamsFromUrl(response.config.url)
    : null;

  if (prUrl) {
    return Promise.resolve(
      response.data.map((pr) => prUrl + `/${pr.number}/commits`)
    );
  }
  return Promise.reject(new Error("Unable to parse base PR url."));
}

export function initiateCommitRequests(commitUrls: string[]) {
  return Promise.all(commitUrls.map((url) => axios.get(url)));
}

export function calculateCommitNumber(
  githubResponses: AxiosResponse[]
): number[] {
  return githubResponses.map((res) => res.data.length);
}

export function requestCommitInfo(
  prResponse: AxiosResponse<GithubPullRequestModel[], any>
) {
  const prDetails = prResponse.data.map(
    ({ id, number, title, user: { login } }) => {
      return { id, number, title, author: login };
    }
  );
  return generateCommitRequestUrls(prResponse)
    .then(initiateCommitRequests)
    .then(calculateCommitNumber)
    .then((commitCounts) => {
      const formattedCommits = commitCounts.map((commitCount, i) => {
        const { id: prId, number: prNumber, author, title } = prDetails[i];
        return {
          prId,
          prNumber,
          author,
          title,
          commitCount,
        };
      });
      return Promise.resolve(formattedCommits);
    })
    .catch((e) =>
      Promise.reject(new Error(`Failed processing commit info: ${e}`))
    );
}
