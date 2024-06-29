import dotenv from 'dotenv'
import fs from 'fs'
import axios from 'axios'

dotenv.config();

const openaiKey = process.env.OPENAI_API_KEY;
const imagePath = "./images/walk.jpg"

// Function to encode the image
const encodeImage = (imagePath) => {
  const image = fs.readFileSync(imagePath);
  return image.toString('base64');
};

const base64Image = encodeImage(imagePath);

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${openaiKey}`
};

const payload = {
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "what is happening in this images, short response"
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${base64Image}`
          }
        }
      ]
    }
  ],
  max_tokens: 300
};

axios.post("https://api.openai.com/v1/chat/completions", payload, { headers })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error("Error fetching completion:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  });