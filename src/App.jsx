import { useState, useEffect } from "react";
import "./App.css";
import card_data from "./card_data";

import similar_categories from "./similar_categories";

const API = "https://matchmaking-api.onrender.com/matches";

const getSimilarCategory = (category) => {
  const similarCategory = similar_categories[category];

  return similarCategory[Math.floor(Math.random() * similarCategory.length)];
};

const getRandomSkillsInterests = (category) => {
  const skillsInterests = card_data[category]["skills"].concat(
    card_data[category]["interests"]
  );

  const randomSkillsInterests = [];

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * skillsInterests.length);

    randomSkillsInterests.push(skillsInterests[randomIndex]);

    skillsInterests.splice(randomIndex, 1);
  }

  return randomSkillsInterests;
};

const categories = Object.keys(card_data);

function App() {
  const [card, setCard] = useState(Object.keys(card_data)[0]);
  const [skillsInterests, setSkillsInterests] = useState([]);

  const [menteeData, setMenteeData] = useState([]);

  const [counter, setCounter] = useState(0);

  const [category, setCategory] = useState(Object.keys(card_data)[0]);

  const [stop, setStop] = useState(false);

  const [asked, setAsked] = useState([]);

  const nextSkillInterest = () => {
    const nextSkillInterest = skillsInterests.shift();

    console.log("nextSkillInterest", nextSkillInterest);
    console.log("skillsInterests after popping", skillsInterests);

    if (nextSkillInterest) {
      setSkillsInterests(skillsInterests);

      setCard(nextSkillInterest);
      setAsked([...asked, nextSkillInterest]);
    } else {
      const similarCategory = getSimilarCategory(category);

      setCard(similarCategory);
      setCategory(similarCategory);
      setAsked([...asked, similarCategory]);
    }
  };

  const likeChecked = () => {
    console.log("liked card", card);

    console.log("counter", counter);
    console.log("menteeData", menteeData);

    if (categories.includes(card)) {
      let randomSkillsInterests = getRandomSkillsInterests(card);

      while (asked.filter((item) => randomSkillsInterests.includes(item)) > 0) {
        randomSkillsInterests = getRandomSkillsInterests(card);
      }

      console.log("randomSkillsInterests", randomSkillsInterests);

      const firstSkillInterest = randomSkillsInterests.shift();
      setCard(firstSkillInterest);

      setSkillsInterests(randomSkillsInterests);
      setAsked([...asked, randomSkillsInterests[0]]);
    } else {
      if (counter == 5) {
        setCounter(0);
        setCard(menteeData);
        setStop(true);
        return;
      } else {
        setCounter(counter + 1);
      }

      nextSkillInterest();
    }
    setMenteeData([...menteeData, card]);
  };

  const dislikeChecked = () => {
    console.log("disliked card", card);

    console.log("counter", counter);
    console.log("menteeData", menteeData);

    if (categories.includes(card)) {
      let similarCategory = getSimilarCategory(card);

      while (asked.includes(similarCategory)) {
        similarCategory = getSimilarCategory(card);
      }

      setCard(similarCategory);
      setAsked([...asked, similarCategory]);
    } else {
      nextSkillInterest();
    }
  };

  useEffect(() => {
    const postMatch = async () => {
      fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(menteeData),
        mode: "cors",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    postMatch();
  }, [stop]);

  return (
    <>
      <div className="App">
        <p> {card} </p>

        {!stop && (
          <div>
            <label>Like</label>
            <input
              type="checkbox"
              name="like"
              value="like"
              onClick={() => {
                likeChecked();
                // uncheck
                document.getElementsByName("like")[0].checked = false;
              }}
            />

            <label>Dislike</label>

            <input
              type="checkbox"
              name="dislike"
              value="dislike"
              onClick={() => {
                dislikeChecked();
                // uncheck
                document.getElementsByName("dislike")[0].checked = false;
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
