import fetch from "node-fetch";

const API_URL = "http://localhost:4000/chat";
const USER_ID = "appfull01";

const testCases = [
  "mình muốn quà sinh nhật cho bạn gái khoảng 700k",
  "mẫu nào sang hơn",
  "cho mình loại đơn giản hơn, không quá bánh bèo",
  "xem bông tai tầm 500k",
  "nếu phải chọn 1 mẫu hợp nhất thì mẫu nào",
  "mình muốn dây chuyền nhẹ nhàng cho bạn gái khoảng 600k",
  "có mẫu mới nào không",
  "mẫu nào bán chạy",
  "mềm giá hơn chút được không",
  "mình muốn loại dễ đeo đi làm",
  "không sến nhé",
  "cho mình xem nhẫn khoảng 800k",
];

async function callChat(message) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: USER_ID,
      message,
    }),
  });

  const data = await res.json();
  return {
    status: res.status,
    data,
  };
}

async function run() {
  console.log(`Testing chatbot at ${API_URL}\n`);

  for (let i = 0; i < testCases.length; i++) {
    const message = testCases[i];

    console.log("=".repeat(80));
    console.log(`CASE ${i + 1}`);
    console.log(`USER: ${message}`);

    try {
      const result = await callChat(message);

      console.log(`STATUS: ${result.status}`);

      if (!result.data?.ok) {
        console.log("ERROR:", result.data?.error || "Unknown error");
      } else {
        console.log("BOT:");
        console.log(result.data.reply);
      }
    } catch (error) {
      console.log("REQUEST ERROR:", error.message);
    }

    console.log();
  }
}

run();