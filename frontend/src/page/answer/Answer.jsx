import style from "./Answer.module.css";
import Header from "../header/Header";
import React, { useState, useEffect, useContext } from "react";
import { useRef } from "react";
import { Link, useParams } from "react-router-dom";

import axios from "../../axios/axiosConfig";
import { AppState } from "../../App";
import Footer from "../footer/Footer";
import { FaRegUserCircle } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

export default function Answer() {
  const { user } = useContext(AppState);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const answerDom = useRef();
  const { questionid } = useParams();
  const [question, setQuestion] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  // const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isTextAreaEmpty, setIsTextAreaEmpty] = useState(false);

  useEffect(() => {
    // Fetch data from localStorage on component mount
    const storedAnswers = localStorage.getItem("answers");
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5500/api/answers/getallanswer/${questionid}`
        );
        setAnswers(response.data);

        const questionResponse = await axios.get(
          "http://localhost:5500/api/questions/getallquestions"
        );
        let singleQuestion = questionResponse.data.find(
          (question) => question.questionid === questionid
        );
        setQuestion(singleQuestion);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [questionid]); // Fetch data when questionid changes

  const handleSubmit = async (e) => {
    e.preventDefault();

    const answerValue = answerDom.current.value;

    if (!answerValue) {
      setIsTextAreaEmpty(true);
      // alert("Please provide all required information");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5500/api/answers/postanswer/${questionid}`,
        {
          answer: answerValue,
          userid: user.userid,
        }
      );

      const newAnswerData = {
        answer: answerValue,
        username: user.username,
      };

      // Update local storage with the new answer
      const updatedAnswers = [newAnswerData, ...answers];

      localStorage.setItem("answers", JSON.stringify(updatedAnswers));

      setAnswers(updatedAnswers);
      setNewAnswer("");

      //alert("Answer posted successfully!");
      setSuccessMessage("Answer posted successfully!");
    } catch (error) {
      console.error("Error posting answer:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className={style.title}>
        <h1>Question</h1>
        <br />
        <h1 className={style.Question1}>
          <FaArrowRight size={12} /> {question.title}
        </h1>

        <h3 className={style.Question1} style={{ padding: "10px 0" }}>
          <FaArrowRight size={12} /> {question.description}
        </h3>
        <hr />
        <h2 className={style.answersFromCommunity}>
          Answers From the Community
        </h2>
        <hr />
        <ul>
          <br />
          {answers.map((answer, index) => (
            <div key={index}>
              <div key={index}>
                <div>
                  <div className={style.circle}>
                    <FaRegUserCircle className={style.icon} size={70} />
                  </div>
                </div>
              </div>
              <li className={style.userAnswer} key={index}>
                <h2>{answer.username}</h2>
                <div>
                  <h4>{answer.answer}</h4>
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>

      {successMessage && (
        <h4 style={{ color: "green", fontWeight: "bold", textAlign: "center" }}>
          {successMessage}
        </h4>
      )}
      <div className={style.answer}>
        <div className={style.answer_public_question}>
          <h1>Answer the top question</h1>
          <br />
          <Link className={style.link} to="/">
            Go to question page
          </Link>
        </div>
        <br />

        <div className={style.answer_form}>
          <form onSubmit={handleSubmit}>
            <textarea
              ref={answerDom}
              onChange={(e) => {
                setNewAnswer(e.target.value);
                setIsTextAreaEmpty(e.target.value === "");
              }}
              value={newAnswer}
              rows="7"
              placeholder="Your answer"
              style={{ borderColor: isTextAreaEmpty ? "red" : "" }} // Highlight border if textarea is empty
            ></textarea>
            <br />
            <button className={style.btn} type="submit">
              Post your Answer
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
