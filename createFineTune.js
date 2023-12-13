const { OpenAI } = require("openai");
const fileId = require("./fileId.js");
require("dotenv").config();
const apiKey = process.env.API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
});

// console.log(fileId);
async function createFineTune(fileId) {
  console.log(fileId);
  const fineTune = await openai.fineTuning.jobs
    .create({ training_file: fileId, model: "gpt-3.5-turbo" })
    .catch((err) => {
      if (err instanceof OpenAI.APIError) {
        console.log(err.status); // 400
        console.log(err.name); // BadRequestError
        console.log(err.headers); // {server: 'nginx', ...}
      } else {
        throw err;
      }
    });
  console.log("response: ", fineTune);
}

createFineTune(fileId);
