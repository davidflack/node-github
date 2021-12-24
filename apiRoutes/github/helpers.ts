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
  if (!req.query.repoOwner || !req.query.repoName) {
    return Promise.reject(
      'Query parameters "repoOwner" (string) and "repoName" (string) are required.'
    );
  }
  return Promise.resolve(`/${req.query.repoOwner}/${req.query.repoName}/pulls`);
}

export function requestPRInfo(url: string) {
  return axios.get(url);
}

function calculateCommitNumber(githubResponses: AxiosResponse[]): number[] {
  return githubResponses.map((res) => res.data.length);
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
  return Promise.reject("Unable to parse base PR url.");
}

export function initiateCommitRequests(commitUrls: string[]) {
  return Promise.all(commitUrls.map((url) => axios.get(url)));
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
        const pr = prDetails[i];
        return {
          prId: pr.id,
          prNumber: pr.number,
          author: pr.author,
          title: pr.title,
          commitCount: number,
        };
      });
      return formattedCommits;
    })
    .catch(() => Promise.reject("Failed processing commit info"));
}
