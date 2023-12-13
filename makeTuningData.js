const fs = require("fs");

// 파일 경로 지정
const filePath = "data.json";

// 파일에서 JSON 데이터 읽어오기
try {
  // 파일이 존재하는지 확인
  if (fs.existsSync(filePath)) {
    // 파일을 utf-8 인코딩으로 읽기
    const content = fs.readFileSync(filePath, "utf-8");
    // JSON 문자열을 JavaScript 객체로 변환
    const jsonData = JSON.parse(content);

    // 각 객체를 처리
    jsonData.forEach((obj, index) => {
      console.log(`데이터 ${index + 1}:`);
      console.log(obj);

      // 여기에서 각 객체에 대한 추가 작업을 수행할 수 있습니다.

      const systemMessage = "You are a helpful assistant.";
      const userMessage = obj.name + "라는 회사에 대한 정보를 알려줘";
      const assistantMessage = `${obj.name}라는 회사는 ${obj.flatform}에 등록되어있고, 입사하기 위해선 경력은 ${obj.experience}이고  기술은 ${obj.skill}등이 필요해 `;

      const tuningData = {
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          {
            role: "user",
            content: userMessage,
          },
          {
            role: "assistant",
            content: assistantMessage,
          },
        ],
      };

      const jsonString = JSON.stringify(tuningData);
      fs.appendFileSync("tuningData.jsonl", jsonString + "\n", "utf-8");
    });
  } else {
    console.error("파일이 존재하지 않습니다.");
  }
} catch (error) {
  console.error("파일을 읽는 중 에러:", error.message);
}
