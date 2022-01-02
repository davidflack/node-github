import { useState, useEffect, useRef, useCallback } from "react";
import PRInfo from "./PRInfo";
import "./App.css";

function App() {
  const [repoOwner, setRepoOwner] = useState("");
  const [repoName, setRepoName] = useState("");
  const [shouldRequestMore, setShouldRequestMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prs, setPrs] = useState([]);

  const fetchPrInfo = (e = null) => {
    if (e) {
      e.preventDefault();
    }
    if (repoName && repoOwner && shouldRequestMore) {
      setLoading(true);
      setError(null);
      fetch(
        `http://localhost:3131/api/github?repoOwner=${encodeURIComponent(
          repoOwner
        )}&repoName=${encodeURIComponent(repoName)}&page=${encodeURIComponent(
          pageNumber
        )}`
      )
        .then(isSuccessfulResponse)
        .then(({ data }) => {
          if (data.length === 0) setShouldRequestMore(false);
          setLoading(false);
          setPrs((prevPRs) => prevPRs.concat(data));
        })
        .catch(() => {
          setShouldRequestMore(false);
          setLoading(false);
          setError(true);
        });
    }
  };

  useEffect(() => {
    fetchPrInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const observer = useRef();
  const lastPRRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && shouldRequestMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, shouldRequestMore]
  );

  return (
    <div className="app-container">
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

      {error && <p>There was an error retrieving pull request info.</p>}

      {prs &&
        prs.map((pr, i) => {
          if (i === prs.length - 1) {
            return (
              <div ref={lastPRRef} className="pr-container" key={i}>
                <PRInfo {...pr} />
              </div>
            );
          } else {
            return (
              <div className="pr-container" key={i}>
                <PRInfo {...pr} />
              </div>
            );
          }
        })}

      {loading && <p>Loading Pull Request Info...</p>}
    </div>
  );
}

function isSuccessfulResponse(response) {
  return response.ok
    ? response.json()
    : Promise.reject(new Error("Failed to load data from server"));
}

export default App;
