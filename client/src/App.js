import { useState } from "react";
import "./App.css";

function App() {
  const [repoOwner, setRepoOwner] = useState("facebook");
  const [repoName, setRepoName] = useState("react");
  const [prs, setPrs] = useState([]);
  const fetchPrInfo = (e) => {
    e.preventDefault();
    fetch(
      `http://localhost:3131/api/github?repoOwner=${encodeURIComponent(
        repoOwner
      )}&repoName=${encodeURIComponent(repoName)}`
    )
      .then((res) => res.json())
      .then((data) => setPrs(data.commitData));
  };

  return (
    <div className="App">
      <form onSubmit={fetchPrInfo}>
        <input
          type="text"
          name="repoOwner"
          value={repoOwner}
          onChange={(e) => setRepoOwner(e.target.value)}
        />
        <input
          type="text"
          name="repoName"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
        />
        <button type="submit">Look for Commit Data</button>
        {prs.map((pr) => {
          return (
            <div>
              <p>{pr.title}</p>
              <p>{pr.author}</p>
              <p>{pr.commitCount}</p>
            </div>
          );
        })}
      </form>
    </div>
  );
}

export default App;
