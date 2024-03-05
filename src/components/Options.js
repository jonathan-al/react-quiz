const Options = ({ question, dispatch, answer }) => {
  const hasAnswered = answer != null
  return (
    <div className="options">
      {question.options.map((option, key) => (
        <button
          className={`btn btn-option ${
            answer === key ? "answer" : ""
          } ${
            hasAnswered
              ? key === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          key={key}
          onClick={() =>
            dispatch({ type: "newAnswer", payload: key })
          }
          disabled={hasAnswered}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default Options
