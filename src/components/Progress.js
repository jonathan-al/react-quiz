import React from "react"

const Progress = ({
  index,
  numQuestion,
  points,
  totalPoints,
  answer,
}) => {
  return (
    <header className="progress">
      <progress
        max={numQuestion}
        value={index + Number(answer !== null)}
      ></progress>
      <p>
        Question <strong>{index + 1}</strong>/{numQuestion - 1}
      </p>
      <p>
        Points <strong>{points}</strong>/{totalPoints}
      </p>
    </header>
  )
}

export default Progress
