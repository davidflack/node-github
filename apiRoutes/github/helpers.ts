import { AxiosResponse } from "axios";
import { Request } from "express";
import { axiosInstance as axios } from "../../config";

interface GithubPullRequest {
  id: number;
  number: number;
  title: string;
  user: { login: string };
}

export function validateRequest(req: Request): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!req.query.repoOwner || !req.query.repoName) {
      reject(
        'Query parameters "repoOwner" (string) and "repoName" (string) are required.'
      );
    } else {
      resolve(`/${req.query.repoOwner}/${req.query.repoName}/pulls`);
    }
  });
}

export function requestPRInfo(url: string) {
  return axios.get(url);
}

function calculateCommitNumber(githubResponses: AxiosResponse[]): number[] {
  return githubResponses.map((res) => res.data.length);
}

function formatCommitRequestData(
  response: AxiosResponse<GithubPullRequest[], any>
) {
  const prUrl = response.config.url;
  const prDetails = response.data.map(
    ({ id, number, title, user: { login } }) => {
      return { id, number, title, author: login };
    }
  );
  if (prUrl) {
    return Promise.resolve({
      commitUrls: response.data.map((pr) => prUrl + `/${pr.number}/commits`),
      prDetails,
    });
  }
  return Promise.reject("Unable to parse base PR url.");
}

function initiateCommitRequest({ commitUrls }: { commitUrls: string[] }) {
  return Promise.all(commitUrls.map((url) => axios.get(url)));
}

export function requestCommitInfo(
  prResponse: AxiosResponse<GithubPullRequest[], any>
) {
  const prDetails = prResponse.data.map(
    ({ id, number, title, user: { login } }) => {
      return { id, number, title, author: login };
    }
  );
  return formatCommitRequestData(prResponse)
    .then(initiateCommitRequest)
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
