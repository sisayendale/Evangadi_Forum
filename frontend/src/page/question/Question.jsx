//import React from "react";
import { RxDotFilled } from "react-icons/rx";
import style from "./Question.module.css";
//import { Link } from "react-router-dom";
import Header from "../header/Header";
import React, { useContext, useState } from "react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../axios/axiosConfig";
import { AppState } from "../../App";
import Footer from "../footer/Footer";


  export default function Question() {
    const navigate = useNavigate();
    const titleDom = useRef();
    const descriptionDom = useRef();
    //  const lastnameDom = useRef();

     const [successMessage, setSuccessMessage] = useState("");
     const [isButtonClicked, setIsButtonClicked] = useState(false);
    const { user, setUser } = useContext(AppState);
   // console.log(user);
    async function handleSubmit(e) {
      e.preventDefault();

      const titleValue = titleDom.current.value;
      const descriptionValue = descriptionDom.current.value;

      if (!titleValue || !descriptionValue) {
         setIsButtonClicked(true);
         //alert("Please provide all required information");
        return;
      }

      try {
        await axios.post("/questions/postquestion", {
          title: titleValue,
          description: descriptionValue,
          userid: user.userid,
          // userid: userId, // Include userId when posting the question
          // questionid: questionId, // Include questionId when posting the question
        });
        // alert("question posted successfully");
        setSuccessMessage("Question posted successfully");
        navigate("/");
      } catch (error) {
        alert("something went wrong");
        console.log(error);
      }
    }
  
  return (
    <div>
      <div>
        <Header />
      </div>
      <div className={style.Question}>
        <h1>Steps to write a good question</h1>
        <p>
          <RxDotFilled />
          Summerize your problem in a one-line title.
        </p>
        <p>
          <RxDotFilled /> Describe your problem in more detail.
        </p>
        <p>
          <RxDotFilled /> Describe what you tried and what you expected to
          happen.
        </p>
        <p>
          <RxDotFilled /> Review your question and post it to the site
        </p>
      </div>
      <br />
      <br />
      <div className={style.ask}>
        <div className={style.ask_public_question}>
          <h1>Ask a public question</h1>
          <Link className={style.link} to="/">
            go to question page
          </Link>
        </div>
        <br />
        <div className={style.ask_form}>
          <form onSubmit={handleSubmit}>
            <input
              ref={titleDom}
              type="text"
              placeholder="Title"
              className={
                isButtonClicked && !titleDom.current.value.trim()
                  ? style.highlight
                  : ""
              }
            />

            <br />
            <br />
            <textarea
              ref={descriptionDom}
              id="w3review"
              name="w3review"
              rows="7"
              // cols="122"
              placeholder=" Question Describe"
              className={
                isButtonClicked && !descriptionDom.current.value.trim()
                  ? style.highlight
                  : ""
              }></textarea>
            <br />
            <button className={style.btn}>Post your Question</button>
            {/* <button className={style.btn}>Post your Question</button>
            {successMessage && <p>{successMessage}</p>} */}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
