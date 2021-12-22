import { AxiosResponse } from "axios";
import { Request } from "express";
import { axiosInstance as axios } from "../../config";

interface GithubPullRequest {
  number: number;
}

type GithubQueryParams = {
  repoOwner: any;
  repoName: any;
};

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

export function convertPRNumbersToUrls(
  response: AxiosResponse<GithubPullRequest[], any>
) {
  const url = response.config.url;
  if (url) {
    return response.data.map((pr) => url + `/${pr.number}/commits`);
  }
  return Promise.reject("Unable to parse base PR url.");
}

export function convertUrlsToAxiosRequests(urls: string[]) {
  return urls.map((url) => axios.get(url));
}

export function requestCommitDetails(urls: Promise<AxiosResponse<any, any>>[]) {
  return Promise.all(urls);
}

export function calculateCommitNumber(githubResponses: AxiosResponse[]) {
  return githubResponses.map((res) => res.data);
}
