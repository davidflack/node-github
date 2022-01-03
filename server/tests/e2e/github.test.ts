import supertest from "supertest";
import app from "../../app";
import { axiosInstance as axios } from "../../config";

jest.setTimeout(60000);
describe("github endpoint e2e", () => {
  const request = supertest(app);
  const githubEndpoint = "/github";

  it("Accurately calculates commit counts for each PR", async () => {
    const repoOwner = encodeURIComponent("nodejs");
    const repoName = encodeURIComponent("node");
    const {
      body: { data: prResponseFromApi },
    } = await request.get(githubEndpoint).query({
      repoOwner,
      repoName,
    });
    const basePrUrl = `/${repoOwner}/${repoName}/pulls`;
    const { data: prDataGithub } = await axios.get(basePrUrl);
    for (let i = 0; i < prDataGithub.length; i++) {
      const commitRes = await axios.get(
        basePrUrl + `/${prDataGithub[i].number}/commits`
      );
      expect(commitRes.data.length).toBe(prResponseFromApi[i].commitCount);
    }
  });
});
