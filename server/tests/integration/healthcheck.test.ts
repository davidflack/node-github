import supertest from "supertest";
import app from "../../app";

test("Healthcheck returns 200", async () => {
  await supertest(app)
    .get("/healthcheck")
    .expect(200)
    .then((res) => {
      expect(res.body.message).toEqual("Server is working!");
    });
});
