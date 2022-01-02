import React from "react";

const PRInfo = ({ title, author, prNumber, commitCount }) => {
  return (
    <>
      <p>Title: {title}</p>
      <p>Author: {author}</p>
      <p>Pull Request Number: {prNumber}</p>
      <p>Commit Count: {commitCount}</p>
    </>
  );
};

export default PRInfo;
