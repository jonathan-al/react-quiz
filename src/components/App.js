import { useEffect, useReducer } from "react"
import Error from "./Error"
import FinishScreen from "./FinishScreen"
import Footer from "./Footer"
import Header from "./Header"
import Loader from "./Loader"
import Main from "./Main"
import NextButton from "./NextButton"
import Progress from "./Progress"
import Question from "./Question"
import Start from "./Start"
import Timer from "./Timer"

const SECS_PER_QUESTION = 30

const initialState = {
  questions: [],
  status: "loading", // loading, error, ready, active, finished
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
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
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
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
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore
            ? state.points
            : state.highscore,
      }
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
        secondsRemaining: 10,
      }
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status:
          state.secondsRemaining === 0 ? "finished" : state.status,
      }
    default:
      throw new Error("action is unkown")
  }
}

// App component
function App() {
  const [data, dispatch] = useReducer(reducer, initialState)
  const {
    questions,
    status,
    index,
    answer,
    points,
    highscore,
    secondsRemaining,
  } = data
  const numQuestions = questions.length
  const totalPoints = questions.reduce(
    (acc, curValue) => acc + curValue.points,
    0,
  )

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
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              totalPoints={totalPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer
                dispatch={dispatch}
                secondsRemaining={secondsRemaining}
              />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            totalPoints={totalPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  )
}

export default App
