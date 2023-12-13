const express = require("express");
const { OpenAI } = require("openai");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();
const port = 3000;

const apiKey = process.env.API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
});

// Body parser middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// 루트 엔드포인트
app.get("/", (req, res) => {
  res.send("OpenAI ChatGPT Example");
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ChatGPT와의 대화 엔드포인트
app.post("/chat", async (req, res) => {
  const userInput = req.body.userInput;

  try {
    // ChatGPT에 대화 요청
    const response = await openai.chat.completions.create({
      model: "ft:gpt-3.5-turbo-0613:personal::8VILc1wJ",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userInput },
      ],
    });

    // 모델 응답 출력
    const modelResponse = response.choices[0].message.content;
    console.log("모델 응답:", modelResponse);

    // 클라이언트에게 응답 전송
    res.json({ modelResponse });
  } catch (error) {
    console.error("ChatGPT 요청 중 에러:", error.message);
    res.status(500).json({ error: "서비스에 오류가 발생했습니다." });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 포트에서 실행 중입니다.`);
});
