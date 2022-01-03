import supertest from "supertest";
import app from "../../app";

describe("github endpoint requests", () => {
  const request = supertest(app);
  const url = "/github";

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
        expect(res.body.data).toBeDefined;
        expect(res.body.data).toBeInstanceOf(Array);
      });
  });
});
