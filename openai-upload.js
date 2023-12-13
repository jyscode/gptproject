const { OpenAI } = require("openai");
const fs = require("fs");

const apiKey = "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";

const openai = new OpenAI({
  apiKey: apiKey,
});

async function upload() {
  try {
    const response = await openai.files.create({
      file: fs.createReadStream("tuningData.jsonl"),
      purpose: "fine-tune",
    });
    console.log("File ID: ", response.id);
    fs.writeFileSync(
      "./fileId.js",
      `const fileId = "${response.id}";
      module.exports = fileId;`
    );
  } catch (err) {
    console.log("err: ", err);
  }
}

upload();
