import { useEffect, useReducer } from "react"
import Error from "./Error"
import Header from "./Header"
import Loader from "./Loader"
import Main from "./Main"
import NextButton from "./NextButton"
import Question from "./Question"
import Start from "./Start"

const initialState = {
  questions: [],
  // loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
}

function reducer(state, action) {
  let question

  switch (action.type) {
    case "dataRecieved":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      }
    case "dataFailed":
      return {
        ...state,
        status: "error",
      }
    case "start":
      return {
        ...state,
        status: "active",
      }
    case "newAnswer":
      question = state.questions[state.index]

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      }
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      }
    default:
      throw new Error("action is unkown")
  }
}

// App component
function App() {
  const [data, dispatch] = useReducer(reducer, initialState)
  const { questions, status, index, answer } = data
  const numQuestions = questions.length

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) =>
        dispatch({ type: "dataRecieved", payload: data }),
      )
      .catch(() => dispatch({ type: "dataFailed" }))
  }, [])

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <Start numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  )
}

export default App
