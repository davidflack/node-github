import { Request } from "express";
import { AxiosResponse } from "axios";
import { axiosInstance as axios } from "../../config";
import {
  GithubPullRequestModel,
  validateRequest,
  requestPRInfo,
  generateCommitRequestUrls,
  initiateCommitRequests,
  calculateCommitNumber,
  extractErrorStatusCode,
} from "../../apiRoutes/github/helpers";

beforeEach(() => jest.clearAllMocks());

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
      expect(e.message).toEqual(
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

describe("generateCommitRequestUrls", () => {
  it("should generate url's when given response.config.url", () => {
    const mockPrUrl = "/mocking/pr/url";
    const mockPrData = [
      { id: 1, number: 1, title: "one", user: { login: "authorOne" } },
      { id: 2, number: 2, title: "two", user: { login: "authorTwo" } },
    ];
    const prResponse = {
      config: {
        url: mockPrUrl,
      },
      data: mockPrData,
    } as AxiosResponse<GithubPullRequestModel[], any>;
    return generateCommitRequestUrls(prResponse).then((res) => {
      expect(res).toBeInstanceOf(Array);
      expect(res.length).toBe(mockPrData.length);
      mockPrData.forEach((item, i) =>
        expect(res[i]).toBe(mockPrUrl + `/${item.number}/commits`)
      );
    });
  });

  it("should reject when given no response.config.url", () => {
    const prResponse = {
      config: {},
    } as AxiosResponse<GithubPullRequestModel[], any>;
    return generateCommitRequestUrls(prResponse).catch((e) => {
      expect(e.message).toBe("Unable to parse base PR url.");
    });
  });
});

describe("initiateCommitRequests", () => {
  it("fires an axios get request for every url", async () => {
    const mockGet = jest.spyOn(axios, "get");
    const mockUrls = ["url1", "url2", "url3", "url4", "url5"];
    await initiateCommitRequests(mockUrls);
    expect(mockGet).toHaveBeenCalledTimes(mockUrls.length);
    mockUrls.forEach((url) => {
      expect(mockGet).toHaveBeenCalledWith(url);
    });
  });
});

describe("calculateCommitNumber", () => {
  it("accurately calculates number of commits", () => {
    const mockCommitDataOne = [
      { mockData: "fakeCommitOne" },
      { mockData: "fakeCommitTwo" },
    ];
    const mockCommitDataTwo = [{ mockData: "fakeCommitOne" }];
    const prResponse = [
      {
        data: mockCommitDataOne,
      },
      { data: mockCommitDataTwo },
    ] as AxiosResponse[];
    expect(calculateCommitNumber(prResponse)).toEqual([2, 1]);
  });
});

describe("extractErrorStatusCode", () => {
  it("should return status code when defined in params", () => {
    const statusCode = 400;
    const error = { response: { status: statusCode } };
    expect(extractErrorStatusCode(error)).toBe(statusCode);
  });

  it("should return 500 when no status code is defined", () => {
    const error = {};
    expect(extractErrorStatusCode(error)).toBe(500);
  });
});
