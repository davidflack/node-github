import axios, { AxiosRequestHeaders } from "axios";
import dotenv from "dotenv";

dotenv.config();

const headers: AxiosRequestHeaders = process.env.GITHUB_TOKEN
  ? {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    }
  : {};

export default axios.create({
  baseURL: "https://api.github.com/repos",
  headers,
});
