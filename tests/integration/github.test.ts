import supertest from "supertest";
import app from "../../app";

describe("github endpoint requests", () => {
  it("Bad github request query params returns 400", async () => {
    await supertest(app)
      .get("/api/github/")
      .query({
        badQueryParam: "this won't work",
      })
      .expect(400)
      .then((res) => {
        expect(res.body.error).toBe(
          'Query parameters "repoOwner" (string) and "repoName" (string) are required.'
        );
      });
  });
});
