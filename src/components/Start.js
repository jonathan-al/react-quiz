const Start = ({ numQuestions, dispatch }) => {
  return (
    <div className="start">
      <h2>Welcome to the React Quiz!</h2>
      <h3>{numQuestions} Questions to test your React matery</h3>
      <button
        onClick={() => dispatch({ type: "start" })}
        className="btn btn-ui"
      >{`Let's Start!`}</button>
    </div>
  )
}

export default Start
