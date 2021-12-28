import { useState } from "react";
import "./App.css";

function App() {
  const [repoOwner, setRepoOwner] = useState("");
  const [repoName, setRepoName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [prs, setPrs] = useState([]);
  const fetchPrInfo = (e) => {
    e.preventDefault();
    if (repoName && repoOwner) {
      setPrs([]);
      setLoading(true);
      setError(null);
      fetch(
        `http://localhost:3131/api/github?repoOwner=${encodeURIComponent(
          repoOwner
        )}&repoName=${encodeURIComponent(repoName)}`
      )
        .then(isSuccessfulResponse)
        .then((data) => {
          setLoading(false);
          setPrs(data.commitData);
        })
        .catch(() => {
          setLoading(false);
          setError(true);
        });
    }
  };

  return (
    <>
      <form className="form-container" onSubmit={fetchPrInfo}>
        <input
          required
          type="text"
          placeholder="Repository Owner"
          name="repoOwner"
          value={repoOwner}
          onChange={(e) => setRepoOwner(e.target.value)}
        />
        <input
          required
          type="text"
          placeholder="Repository Name"
          name="repoName"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
        />
        <button type="submit">Look for Commit Data</button>
      </form>

      {loading && <p>Loading Pull Request Info...</p>}

      {error && <p>There was an error retrieving pull request info.</p>}

      {!loading &&
        prs &&
        prs.map((pr, i) => {
          return (
            <div className="pr-card" key={i}>
              <p>Title: {pr.title}</p>
              <p>Author: {pr.author}</p>
              <p>Commit Count: {pr.commitCount}</p>
            </div>
          );
        })}
    </>
  );
}

function isSuccessfulResponse(response) {
  return response.ok
    ? response.json()
    : Promise.reject(new Error("Failed to load data from server"));
}

export default App;
