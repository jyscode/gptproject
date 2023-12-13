const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

// 웹 페이지 가져오기
async function getWebPage(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("웹 페이지를 가져오는 중 에러:", error.message);
    return null;
  }
}

// 특정 요소 가져오기
function getElements(html, selector) {
  const $ = cheerio.load(html);
  return $(selector);
}

// 예제 URL

const prefix = "https://www.jobkorea.co.kr";

async function crawlAndSaveLinks(
  divname,
  prefix,
  maxLinks = 10,
  filePath = "links.txt"
) {
  const url =
    "https://www.jobkorea.co.kr/Top100/?Main_Career_Type=1&Search_Type=1&BizJobtype_Bctgr_Code=10031&BizJobtype_Bctgr_Name=%EA%B0%9C%EB%B0%9C%C2%B7%EB%8D%B0%EC%9D%B4%ED%84%B0&BizJobtype_Code=1000229&BizJobtype_Name=%EB%B0%B1%EC%97%94%EB%93%9C%EA%B0%9C%EB%B0%9C%EC%9E%90&Major_Big_Code=0&Major_Big_Name=%EC%A0%84%EC%B2%B4&Major_Code=0&Major_Name=%EC%A0%84%EC%B2%B4&Edu_Level_Code=9&Edu_Level_Name=%EC%A0%84%EC%B2%B4&Edu_Level_Name=%EC%A0%84%EC%B2%B4&MidScroll=&duty-depth1=on";
  // 웹 페이지 가져오기
  const html = await getWebPage(url);

  if (!html) {
    console.error("웹 페이지를 가져오지 못했습니다.");
    return;
  }

  div = `${divname} a`;

  // 특정 div 내의 다른 div 하위의 a 태그의 href 값 가져오기
  const links = getElements(html, div);
  const $ = cheerio.load(html);

  // 각 링크의 href 속성을 배열에 저장하고 앞에 특정 문자열 추가
  const linkArray = links
    .map((index, element) => prefix + $(element).attr("href"))
    .get();

  const filtered = linkArray.filter((link) => link.includes("TpGb"));
  // console.log(filtered);
  // 최대 링크 개수만큼 추출
  const slicedLinks = filtered.slice(0, maxLinks);

  // 기존 파일 읽기
  let existingLinks = [];
  if (fs.existsSync(filePath)) {
    existingLinks = fs
      .readFileSync(filePath, "utf-8")
      .split("\n")
      .filter(Boolean);
  }

  console.log(existingLinks);

  // 중복 링크 제거
  const uniqueLinks = slicedLinks.filter((link) => {
    var count = 0;
    const linkWithoutQuery = link.split("?")[0]; // '?' 이전의 문자열만 비교
    existingLinks.filter((link) => {
      if (link.includes(linkWithoutQuery)) {
        count = count + 1;
      }
    });
    return count > 0 ? false : true;
  });

  console.log(uniqueLinks);

  const sumLinks = [...existingLinks, ...uniqueLinks];

  // 링크들을 텍스트 파일에 추가
  fs.writeFileSync(filePath, sumLinks.join("\n"), "utf-8");

  console.log(
    `${url}에서 ${uniqueLinks.length}개의 링크가 ${filePath} 파일에 추가되었습니다.`
  );
}

const noex = ".devSarterTab";
const ex = ".devCareerTab";
// 각 웹 사이트에서 크롤링 및 파일 저장
crawlAndSaveLinks(noex, prefix, 10);
crawlAndSaveLinks(ex, prefix, 10);
// crawlAndSaveLinks(ex, prefix, 10);
// // 웹 페이지 가져오기
// getWebPage(url).then((html) => {
//   if (html) {
//     // div 내의 a 태그의 href 값 가져오기
//     const links = getElements(html, "#devTypeTab_1 .tit a");

//     const linkArray = links
//       .map((index, element) => prefix + $(element).attr("href"))
//       .get();

//     // 처음 10개의 링크만 추출
//     const slicedLinks = linkArray.slice(0, 10);

//     const filePath = "links.txt";
//     let existingLinks = [];
//     if (fs.existsSync(filePath)) {
//       existingLinks = fs
//         .readFileSync(filePath, "utf-8")
//         .split("\n")
//         .filter(Boolean);
//     }

//     // 중복 링크 제거
//     const uniqueLinks = Array.from(new Set([...existingLinks, ...slicedLinks]));

//     // 링크들을 텍스트 파일에 추가
//     fs.writeFileSync(filePath, uniqueLinks.join("\n"), "utf-8");

//     // 링크들을 텍스트 파일로 저장

//     console.log(`처음 10개의 링크가 ${filePath} 파일에 저장되었습니다.`);

//     // // 각 링크의 href 속성 출력
//     // links.each((index, element) => {
//     //   if (index < 10) {
//     //     const link = "https://www.jobkorea.co.kr" + $(element).attr("href");
//     //     console.log(`링크 ${index + 1}: ${link}`);
//     //   }
//     // });
//   }
// });
