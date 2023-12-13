# gptproject

0. .env파일에 gpt api key 넣기
1. 잡코리아에서 크롤링할 링크들 생성 node crawllink.js
2. 해당 링크들의 정보 크롤링 node crawingjs
3. 크롤링한 정보를 가지고 Fine-Tuning을 위한 Data로 변형 node makeTuningDataja
4. Data파일 업로드 node openai-upload.js
5. 업로드한 파일로 Fine-Tuning 작업 node createFineTune.js
6. 설정한 파일을 webeappis에 model에 넣어 실행 node Webapi.js
