import { useState, useEffect } from "react";
import "./App.css";
import card_data from "./card_data";

import similar_categories from "./similar_categories";
import mentors_data from "./random_mentors";

const API = "https://matchmaking-api.onrender.com/matches";

const getSimilarCategory = (category) => {
  const similarCategory = similar_categories[category];

  console.log("similarCategory", similarCategory);

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

  const [asked, setAsked] = useState([card]);

  const [matches, setMatches] = useState([]);

  const nextSkillInterest = () => {
    const nextSkillInterest = skillsInterests.shift();

    if (nextSkillInterest) {
      setSkillsInterests(skillsInterests);

      setCard(nextSkillInterest);
      setAsked([...asked, nextSkillInterest]);
    } else {
      let similarCategory = getSimilarCategory(category);
      console.log("similarCategory", similarCategory);
      console.log("asked", asked);
      while (asked.includes(similarCategory)) {
        similarCategory = getSimilarCategory(category);
      }

      setCard(similarCategory);
      setCategory(similarCategory);
      setAsked([...asked, similarCategory]);
    }
  };

  const likeChecked = () => {
    if (categories.includes(card)) {
      let randomSkillsInterests = getRandomSkillsInterests(card);

      const firstSkillInterest = randomSkillsInterests.shift();
      setCard(firstSkillInterest);

      setSkillsInterests(randomSkillsInterests);
      setAsked([...asked, randomSkillsInterests[0]]);
    } else {
      if (counter == 10) {
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
    if (categories.includes(card)) {
      let similarCategory = getSimilarCategory(card);
      console.log("similarCategory", similarCategory);
      console.log("asked", asked);
      while (asked.includes(similarCategory)) {
        console.log("asked", asked);
        similarCategory = getSimilarCategory(card);
      }

      setCard(similarCategory);
      setCategory(similarCategory);
      setAsked([...asked, similarCategory]);
    } else {
      nextSkillInterest();
    }
  };

  useEffect(() => {
    if (stop) {
      const postMatch = async () => {
        fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(menteeData),
          mode: "cors",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            if (data["matches"].length > 0) {
              const matches_data = data["matches"].map((match) => {
                return {
                  mentor: match["mentor"],
                  data: mentors_data[match["mentor"]],
                };
              });
              setMatches(matches_data);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      };

      postMatch();
    }
  }, [stop]);

  return (
    <>
      <div className="App">
        <h1>matchmaking</h1>

        {matches.length > 0 ? (
          <div>
            <h2>Matches</h2>
            <p>
              {" "}
              <ol>
                {matches.map((match) => (
                  <li key={match}>
                    {match["mentor"]}
                    <br />
                    Categories
                    <ul>
                      {match["data"]["categories"].map((category) => (
                        <li key={category}>{category}</li>
                      ))}
                    </ul>
                    <br />
                    Skills
                    <ul>
                      {match["data"]["skills"].map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                    <br />
                    Interests
                    <ul>
                      {match["data"]["interests"].map((interest) => (
                        <li key={interest}>{interest}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </p>
          </div>
        ) : (
          <div>
            <h2>Category: {category} </h2>

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
        )}

        <h2>Your likes</h2>
        <p>
          {" "}
          {menteeData.map((item) => (
            <li key={item}>{item}</li>
          ))}{" "}
        </p>
      </div>
    </>
  );
}

export default App;
