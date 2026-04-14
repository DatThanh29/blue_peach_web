const API_URL = "http://localhost:4000/chat";

const testCases = [
  {
    id: "gift-700k",
    userId: "eval-user-1",
    message: "mình muốn quà sinh nhật cho bạn gái khoảng 700k",
    expect: {
      shouldMentionAny: ["quà", "tặng", "bạn gái"],
      budget: 700000,
      budgetTolerance: 0.25,
      primaryIntent: "gift",
    },
  },
  {
    id: "elegant-followup",
    userId: "eval-user-1",
    message: "mẫu nào sang hơn",
    expect: {
      shouldMentionAny: ["sang", "thanh lịch", "chỉn chu"],
      primaryIntent: "elegant",
    },
  },
  {
    id: "simple-followup",
    userId: "eval-user-1",
    message: "cho mình loại đơn giản hơn, không quá bánh bèo",
    expect: {
      shouldMentionAny: ["đơn giản", "tối giản", "dễ đeo"],
      primaryIntent: "simple",
    },
  },
  {
    id: "earring-500k",
    userId: "eval-user-2",
    message: "xem bông tai tầm 500k",
    expect: {
      category: "bông tai",
      budget: 500000,
      budgetTolerance: 0.3,
      primaryIntent: "category_budget",
    },
  },
  {
    id: "best-choice",
    userId: "eval-user-1",
    message: "nếu phải chọn 1 mẫu hợp nhất thì mẫu nào",
    expect: {
      shouldMentionAny: ["nghiêng về", "mẫu dự phòng", "chốt"],
      primaryIntent: "decision",
    },
  },
  {
    id: "dailywear",
    userId: "eval-user-3",
    message: "mình muốn loại dễ đeo đi làm",
    expect: {
      shouldMentionAny: ["dễ đeo", "hằng ngày", "đi làm", "phối đồ"],
      primaryIntent: "dailywear",
    },
  },
  {
    id: "cheap-understanding",
    userId: "eval-user-4",
    message: "mềm giá hơn chút được không",
    expect: {
      shouldMentionAny: ["mềm giá", "giá", "ngân sách"],
      primaryIntent: "cheaper",
    },
  },
  {
    id: "new-arrival",
    userId: "eval-user-5",
    message: "có mẫu mới nào không",
    expect: {
      shouldMentionAny: ["mẫu mới", "hàng mới", "mới"],
      primaryIntent: "new",
    },
  },
  {
    id: "hot-products",
    userId: "eval-user-6",
    message: "mẫu nào bán chạy",
    expect: {
      shouldMentionAny: ["bán chạy", "được quan tâm", "khách hỏi nhiều"],
      primaryIntent: "hot",
    },
  },
  {
    id: "ring-800k",
    userId: "eval-user-7",
    message: "cho mình xem nhẫn khoảng 800k",
    expect: {
      category: "nhẫn",
      budget: 800000,
      budgetTolerance: 0.3,
      primaryIntent: "category_budget",
    },
  },
];

function normalizeText(text = "") {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function extractPrices(reply = "") {
  const normalized = String(reply || "");
  const matches = normalized.match(/\d{1,3}(?:\.\d{3})+(?:đ|d)?|\d{5,9}(?:đ|d)?/g) || [];

  return matches
    .map((raw) => {
      const n = Number(String(raw).replace(/[^\d]/g, ""));
      return Number.isFinite(n) ? n : null;
    })
    .filter(Boolean);
}

function hasAnyPhrase(text = "", phrases = []) {
  const n = normalizeText(text);
  return phrases.some((p) => n.includes(normalizeText(p)));
}

function similarity(a = "", b = "") {
  const aa = normalizeText(a);
  const bb = normalizeText(b);

  if (!aa || !bb) return 0;
  if (aa === bb) return 1;

  const aWords = new Set(aa.split(" "));
  const bWords = new Set(bb.split(" "));
  const intersection = [...aWords].filter((w) => bWords.has(w)).length;
  const union = new Set([...aWords, ...bWords]).size;

  return union ? intersection / union : 0;
}

async function callChat(userId, message) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, message }),
  });

  const data = await res.json();
  return { status: res.status, data };
}

function evaluateReply(testCase, reply, allRepliesBefore = []) {
  const issues = [];
  const strengths = [];
  const normalizedReply = normalizeText(reply);
  const prices = extractPrices(reply);

  if (!reply || !reply.trim()) {
    issues.push("Reply rỗng");
    return { score: 0, issues, strengths, prices };
  }

  if (testCase.expect?.shouldMentionAny) {
    const ok = hasAnyPhrase(reply, testCase.expect.shouldMentionAny);
    if (ok) {
      strengths.push("Có bám đúng intent chính trong wording");
    } else {
      issues.push(
        `Không nhắc rõ các tín hiệu mong đợi: ${testCase.expect.shouldMentionAny.join(", ")}`
      );
    }
  }

  if (testCase.expect?.category) {
    const ok = normalizedReply.includes(normalizeText(testCase.expect.category));
    if (ok) {
      strengths.push(`Có nhắc đúng category: ${testCase.expect.category}`);
    } else {
      issues.push(`Không thấy nhắc rõ category mong đợi: ${testCase.expect.category}`);
    }
  }

  if (testCase.expect?.budget) {
    const budget = testCase.expect.budget;
    const tolerance = testCase.expect.budgetTolerance ?? 0.25;

    if (!prices.length) {
      issues.push("Không trích được giá nào trong reply");
    } else {
      const within = prices.some((p) => Math.abs(p - budget) / budget <= tolerance);
      if (within) {
        strengths.push("Có ít nhất một mức giá sát ngân sách");
      } else {
        issues.push(
          `Không thấy giá nào sát ngân sách mục tiêu ${budget.toLocaleString("vi-VN")}đ`
        );
      }
    }
  }

  if (allRepliesBefore.length) {
    const duplicate = allRepliesBefore.find((r) => similarity(r, reply) >= 0.9);
    if (duplicate) {
      issues.push("Reply quá giống một reply trước đó");
    }
  }

  if (normalizedReply.length < 40) {
    issues.push("Reply hơi ngắn, có thể thiếu lý do tư vấn");
  } else {
    strengths.push("Reply đủ độ dài cơ bản");
  }

  const numberedItems = (reply.match(/\n?\s*\d+\./g) || []).length;
  if (testCase.expect?.primaryIntent !== "decision") {
    if (numberedItems >= 2) {
      strengths.push("Có đưa ra nhiều lựa chọn để so sánh");
    } else {
      issues.push("Ít lựa chọn, chưa đủ cảm giác tư vấn");
    }
  }

  let score = 8;
score += Math.min(strengths.length * 0.6, 2);
score -= issues.length * 1.8;

if (
  testCase.expect?.category &&
  !normalizedReply.includes(normalizeText(testCase.expect.category))
) {
  score -= 1.5;
}

if (testCase.expect?.budget && !prices.length) {
  score -= 1.5;
}

score = Math.max(0, Math.min(10, Number(score.toFixed(1))));

  return { score, issues, strengths, prices };
}

async function run() {
  console.log(`Evaluating chatbot at ${API_URL}\n`);

  const results = [];
  const previousReplies = [];

  for (const testCase of testCases) {
    console.log("=".repeat(100));
    console.log(`CASE: ${testCase.id}`);
    console.log(`USER: ${testCase.message}`);

    try {
      const { status, data } = await callChat(testCase.userId, testCase.message);

      if (!data?.ok) {
        console.log(`STATUS: ${status}`);
        console.log(`ERROR: ${data?.error || "Unknown error"}`);

        results.push({
          id: testCase.id,
          status,
          ok: false,
          score: 0,
          issues: [data?.error || "Request failed"],
          strengths: [],
        });
        continue;
      }

      const reply = data.reply || "";
      const evaluation = evaluateReply(testCase, reply, previousReplies);

      previousReplies.push(reply);

      console.log(`STATUS: ${status}`);
      console.log(`SCORE: ${evaluation.score}/10`);
      console.log("BOT:");
      console.log(reply);
      console.log("\nStrengths:");
      if (evaluation.strengths.length) {
        for (const item of evaluation.strengths) {
          console.log(`- ${item}`);
        }
      } else {
        console.log("- None");
      }

      console.log("Issues:");
      if (evaluation.issues.length) {
        for (const item of evaluation.issues) {
          console.log(`- ${item}`);
        }
      } else {
        console.log("- None");
      }

      console.log(
        `Extracted prices: ${
          evaluation.prices.length
            ? evaluation.prices.map((p) => `${p.toLocaleString("vi-VN")}đ`).join(", ")
            : "None"
        }`
      );

      results.push({
        id: testCase.id,
        status,
        ok: true,
        score: evaluation.score,
        issues: evaluation.issues,
        strengths: evaluation.strengths,
      });
    } catch (error) {
      console.log(`REQUEST ERROR: ${error.message}`);
      results.push({
        id: testCase.id,
        status: 0,
        ok: false,
        score: 0,
        issues: [error.message],
        strengths: [],
      });
    }

    console.log();
  }

  console.log("=".repeat(100));
  console.log("SUMMARY\n");

  const valid = results.filter((r) => r.ok);
  const avg =
    valid.length > 0
      ? (valid.reduce((sum, r) => sum + r.score, 0) / valid.length).toFixed(2)
      : "0.00";

  console.log(`Total cases: ${results.length}`);
  console.log(`Successful cases: ${valid.length}`);
  console.log(`Average score: ${avg}/10\n`);

  console.log("Low-score cases (< 7):");
  const low = valid.filter((r) => r.score < 7);
  if (!low.length) {
    console.log("- None");
  } else {
    for (const item of low) {
      console.log(`- ${item.id}: ${item.score}/10`);
      for (const issue of item.issues) {
        console.log(`  • ${issue}`);
      }
    }
  }
}

run();