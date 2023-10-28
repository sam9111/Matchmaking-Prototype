

https://github.com/sam9111/matchmaking-frontend/assets/60708693/cc440de6-1906-4058-b062-a3116ccb13cf



In this project, we start with a set of categories, including STEM and social areas, such as "Computer Science," "Electrical Engineering," and "Mechanical Engineering." Using the "sentence-transformers/all-MiniLM-L6-v2" BERT model and cosine similarity, we identify the top 5 categories similar to each one. The code for this is [here](https://github.com/sam9111/Matchmaking/blob/main/similar_categories.json)

This is the frontend for the project and operates as follows:

- Initialization: A category card is displayed.

- User Interaction:
  If the user likes the category, the system proceeds to the next step.
  If not, another similar category is presented.
- Category Exploration Loop:
  If the user expresses interest, the system presents 5 random skills and interests associated with the liked category on separate cards.
  Afterwards, a new similar category is introduced for exploration.
  The above loop continues until approximately 10 liked skills/interests have been collected for any category.
  
The final data collected includes all liked categories, skills, and interests. This data is compared with information in "random_mentors.json" (hits the [Flask API](https://github.com/sam9111/Matchmaking) where cosine similarity is used to find potential mentor matches).

In summary, the project enables users to offer a dynamic and engaging way to connect with mentors or experts with similar interests and expertise.

This was done for the WWCode Hackathon for Social Good and here is the final prototype [submitted](https://github.com/bcatone/PersonalPowerAI)



https://github.com/sam9111/matchmaking-frontend/assets/60708693/1748bb2e-0f12-476c-a61a-6ad6afc858c1







