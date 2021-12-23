import supertest from "supertest";
import app from "../app";

test("API returns 404 on non-existent route", async () => {
  const badUrl = "/api/someBogusRoute/pleaseFail";
  await supertest(app)
    .get(badUrl)
    .expect(404)
    .then((res) => {
      expect(res.body.message).toEqual("The requested resource was not found.");
      expect(res.body.url).toEqual(badUrl);
    });
});
