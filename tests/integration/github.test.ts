import supertest from "supertest";
import app from "../../app";

describe("github endpoint requests", () => {
  const request = supertest(app);
  const url = "/api/github";

  it("Bad github request query params returns error", async () => {
    await request
      .get(url)
      .query({
        badQueryParam: "this won't work",
      })
      .expect(500)
      .then((res) => {
        expect(res.body.error).toBe(
          'Query parameters "repoOwner" (string) and "repoName" (string) are required.'
        );
      });
  });

  it("Properly formatted github request returns 200", async () => {
    await request
      .get(url)
      .query({
        repoOwner: "facebook",
        repoName: "react",
      })
      .expect(200)
      .then((res) => {
        expect(res.body.commitData).toBeDefined;
        expect(res.body.commitData).toBeInstanceOf(Array);
      });
  });
});
