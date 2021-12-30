import { AxiosResponse, AxiosError } from "axios";
import { Request } from "express";
import { axiosInstance as axios } from "../../config";

export interface GithubPullRequestModel {
  id: number;
  number: number;
  title: string;
  user: { login: string };
}

export function validateRequest(req: Request): Promise<string> {
  if (!req.query.repoOwner || !req.query.repoName) {
    return Promise.reject(
      new Error(
        'Query parameters "repoOwner" (string) and "repoName" (string) are required.'
      )
    );
  }
  return Promise.resolve(`/${req.query.repoOwner}/${req.query.repoName}/pulls`);
}

export function requestPRInfo(url: string) {
  return axios.get(url);
}

export function extractErrorStatusCode(err: { response?: { status: number } }) {
  return err.response?.status ? err.response.status : 500;
}

export function generateCommitRequestUrls(
  response: AxiosResponse<GithubPullRequestModel[], any>
) {
  const prUrl = response?.config?.url ? response.config.url : null;
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
    .then((commitNumbers) => {
      const formattedCommits = commitNumbers.map((number, i) => {
        const { id: prId, number: prNumber, author, title } = prDetails[i];
        return {
          prId,
          prNumber,
          author,
          title,
          commitCount: number,
        };
      });
      return Promise.resolve(formattedCommits);
    })
    .catch((e) =>
      Promise.reject(new Error(`Failed processing commit info: ${e}`))
    );
}
