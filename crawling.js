const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// 파일에서 링크 읽어오기
function readLinksFromFile(filePath) {
  try {
    // 파일이 존재하는지 확인
    if (fs.existsSync(filePath)) {
      // 파일을 utf-8 인코딩으로 읽기
      const content = fs.readFileSync(filePath, "utf-8");
      // 각 줄을 배열로 분리
      const links = content.split("\n").filter(Boolean);
      return links;
    } else {
      console.error("파일이 존재하지 않습니다.");
      return [];
    }
  } catch (error) {
    console.error("파일을 읽는 중 에러:", error.message);
    return [];
  }
}

// 크롤링할 웹 페이지 URL

const urlList = readLinksFromFile("links.txt");
// const url =
//   "https://www.jobkorea.co.kr/Recruit/GI_Read/43497641?rPageCode=SL&logpath=21";

// const targetSectionId = "JobDescription_JobDescription__VWfcb";

// Axios를 사용하여 HTML 페이지 가져오기
console.log(urlList);

for (const url of urlList) {
  axios
    .get(url)
    .then((response) => {
      // 가져온 HTML을 Cheerio를 사용하여 파싱
      const $ = cheerio.load(response.data);

      const title = $("h3.hd_3").find(".coName").text().trim();

      console.log(title);
      const ddContent = $('dt:contains("스킬") + dd').text().trim();

      const ddContentexper = $('dt:contains("경력") + dd')
        .text()
        .split("\n")
        .join("")
        .trim()
        .replace(/ +/g, " ");

      // 결과 출력
      console.log("스킬에 해당하는 dd 태그의 내용:", ddContent);
      console.log("경력에 해당하는 dt 태그의 내용:", ddContentexper);

      const crawlJson = {
        flatform: "잡코리아",
        name: title,
        skill: ddContent,
        experience: ddContentexper,
      };
      console.log(crawlJson);

      const filePath = "data.json";

      let existingData = [];
      if (fs.existsSync(filePath)) {
        const existingJsonString = fs.readFileSync(filePath, "utf-8");
        existingData = JSON.parse(existingJsonString);
      }

      // 기존 데이터와 새로운 데이터 합치기
      const combinedData = [...existingData, crawlJson];

      // 합친 데이터를 JSON 형식의 문자열로 변환 (쉼표 추가)
      const jsonString = `[${combinedData
        .map((obj) => JSON.stringify(obj, null, 2))
        .join(",\n")}]`;

      // 파일에 JSON 데이터 추가
      fs.writeFileSync(filePath, jsonString, "utf-8");
    })

    .catch((error) => {
      console.error("오류 발생:", error);
    });
}

// document.querySelector("#__next > div.JobDetail_cn__WezJh > div.JobDetail_contentWrapper__DQDB6 > div.JobDetail_relativeWrapper__F9DT5 > div.JobContent_className___ca57 > div.JobContent_descriptionWrapper__SM4UD > section.JobDescription_JobDescription__VWfcb")
//*[@id="container"]/section/div[1]/article/div[1]/h3/text()
