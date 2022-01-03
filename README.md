# node-github

This app has a simple REST API and an accompanying client-facing user
interface that enables users to view the amount of commits for open pull requests
in a given GitHub repository.

## _In order to run this application locally, you will need a GitHub personal access token._

- Please follow the directions in the [GitHub documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to generate a personal access token.
- The only token permissions needed are `repo:status` and `public_repo`.

## There are a couple of different ways to run this app locally:

### 1. Via docker-compose

- Add your GitHub personal access token as a server environment variable in line 7 of `docker-compose.yml`. (Replace "your_github_token_here")
- Run `docker-compose up --build -d` in the root directory of the application.
- Visit `http://localhost:3050` in your web browser to interact with the user interface.

### 2. Via the command line

- Create a `.env` file at the `./server` directory
- Add `GITHUB_TOKEN=your_github_token_here` to the file, replaceing "your_github_token_here" with your GitHub personal access token.
- From the `./server` directory, run

```
yarn install
yarn start
```

- From the `./client` directory, run

```
yarn install
yarn start
```

- By default, his will run the UI on `http://localhost:3000` and the REST API at `http://localhost:3131`.
