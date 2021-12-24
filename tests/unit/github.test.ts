import { Request } from "express";
import { axiosInstance as axios } from "../../config";
import {
  validateRequest,
  requestPRInfo,
  GithubPullRequestModel,
} from "../../apiRoutes/github/helpers";

describe("validateRequest", () => {
  it("rejects promise on bad params", () => {
    const mockBadRequest = {
      query: {
        repoOwnerFAIL: "facebook",
        repoName: "react",
      },
    } as unknown as Request;
    expect(validateRequest(mockBadRequest)).toBeInstanceOf(Promise);
    return validateRequest(mockBadRequest).catch((e) => {
      expect(e).toEqual(
        'Query parameters "repoOwner" (string) and "repoName" (string) are required.'
      );
    });
  });

  it("resolves promise on good params", () => {
    const mockGoodRequest = {
      query: {
        repoOwner: "facebook",
        repoName: "react",
      },
    } as unknown as Request;
    return validateRequest(mockGoodRequest).then((res) => {
      expect(res).toEqual(
        `/${mockGoodRequest.query.repoOwner}/${mockGoodRequest.query.repoName}/pulls`
      );
    });
  });
});

describe("requestPRInfo", () => {
  it("should return PR's", async () => {
    const data: GithubPullRequestModel[] = [
      { id: 1, number: 1, title: "Mock Title", user: { login: "mock author" } },
    ];
    const response = { data };
    const mockGet = jest.spyOn(axios, "get");
    mockGet.mockResolvedValue(response);

    const mockUrl = "https://bogusHost:2";
    const res = await requestPRInfo(mockUrl);
    expect(res).toEqual(response);
    expect(mockGet).toHaveBeenCalledWith(mockUrl);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });
});
