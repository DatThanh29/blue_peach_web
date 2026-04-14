import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import {
  getOrCreateSession,
  getRecentMessages,
} from "./services/session.js";
import { supabase } from "./services/supabase.js";
import {
  searchProducts,
  extractShoppingContext,
  recommendProducts,
  mergeShoppingContext,
} from "./services/product.js";
import {
  findOrdersByUserId,
  findOrderByOrderId,
} from "./services/order.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",").map((s) => s.trim()) || "*",
    credentials: true,
  })
);
app.use(express.json());

function normalizeText(text = "") {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function includesPhrase(text = "", phrases = []) {
  return phrases.some((phrase) => text.includes(phrase));
}

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function includesAny(source = [], targets = []) {
  return targets.some((item) => source.includes(item));
}

function getProductIdentity(product = {}) {
  return product.ma_san_pham || product.sku || product.ten_san_pham || null;
}

function isOrderLookupMessage(message = "") {
  const text = normalizeText(message);

  return includesPhrase(text, [
    "don hang",
    "ma don",
    "kiem tra don",
    "trang thai don",
    "theo doi don",
    "xem don hang",
    "kiem tra order",
    "order cua toi",
  ]);
}

function isHandoverMessage(message = "") {
  const text = normalizeText(message);

  return includesPhrase(text, [
    "gap nhan vien",
    "tu van vien",
    "nguoi that",
    "khong hai long",
    "khieu nai",
    "muon gap shop",
    "gap admin",
    "noi chuyen voi nguoi",
    "cho toi gap nhan vien",
  ]);
}

function extractOrderId(message = "") {
  const text = String(message).trim();

  const uuidMatch = text.match(
    /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\b/
  );

  if (uuidMatch) return uuidMatch[0];

  return null;
}

function isValidUuid(value = "") {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
    value
  );
}

function simplifyProductName(name = "", options = {}) {
  const { keepCategory = false } = options;

  let result = String(name || "");

  result = result.replace(/blue peach/gi, "");
  result = result.replace(/bạc\s*925/gi, "");

  if (!keepCategory) {
    result = result.replace(/dây chuyền/gi, "");
    result = result.replace(/lắc tay/gi, "");
    result = result.replace(/nhẫn/gi, "");
    result = result.replace(/bông tai/gi, "");
    result = result.replace(/khuyên tai/gi, "");
  }

  result = result.replace(/\b[A-Z]{1,4}\d{2,5}\b/g, "");
  result = result.replace(/\s+/g, " ").trim();

  if (!result) return String(name || "").trim();
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function getPreviousShoppingContext(messages = []) {
  const reversed = [...messages].reverse();

  for (const msg of reversed) {
    if (msg.role === "assistant" && msg.metadata?.shoppingContext) {
      return msg.metadata.shoppingContext;
    }
  }

  return null;
}

function getPreviousRecommendedProductIds(messages = []) {
  const ids = [];

  for (const msg of messages) {
    if (msg.role === "assistant" && Array.isArray(msg.metadata?.products)) {
      for (const product of msg.metadata.products) {
        const id = getProductIdentity(product);
        if (id) ids.push(id);
      }
    }
  }

  return ids;
}

function getLastAssistantReply(messages = []) {
  const reversed = [...messages].reverse();

  for (const msg of reversed) {
    if (msg.role === "assistant" && msg.content) {
      return msg.content;
    }
  }

  return "";
}

function getLastAssistantMetadata(messages = []) {
  const reversed = [...messages].reverse();

  for (const msg of reversed) {
    if (msg.role === "assistant" && msg.metadata) {
      return msg.metadata;
    }
  }

  return null;
}

function detectReplyMode(shoppingContext = {}) {
  if (shoppingContext?.decisionIntent) return "decision";
  if (shoppingContext?.hotIntent) return "hot";
  if (shoppingContext?.newArrivalIntent) return "new";
  if (shoppingContext?.refineIntent?.moreElegant) return "elegant";
  if (shoppingContext?.refineIntent?.softer) return "soft";
  if (shoppingContext?.refineIntent?.simpler) return "simple";
  if (shoppingContext?.refineIntent?.cheaper) return "cheaper";
  if (shoppingContext?.giftIntent?.isGift) return "gift";
  if (shoppingContext?.trendIntent) return "trend";
  return "default";
}

function hasStrongShoppingReset(message = "", currentShoppingContext = {}) {
  const text = normalizeText(message);

  if (
    includesPhrase(text, [
      "minh muon",
      "toi muon",
      "muon mua",
      "tim qua",
      "qua sinh nhat",
      "tang ban gai",
      "ban chay",
      "mau moi",
      "moi ve",
      "xem mau khac",
      "doi sang",
      "xem nhom khac",
    ])
  ) {
    return true;
  }

  if (
    currentShoppingContext?.categoryKeyword ||
    currentShoppingContext?.decisionIntent ||
    currentShoppingContext?.hotIntent ||
    currentShoppingContext?.newArrivalIntent
  ) {
    return true;
  }

  return false;
}

function shouldResetShoppingContext(
  message = "",
  previousShoppingContext = null,
  currentShoppingContext = {}
) {
  if (!previousShoppingContext) return true;

  const text = normalizeText(message);

  if (
    includesPhrase(text, [
      "doi chu de",
      "xem mau khac",
      "doi sang",
      "xem loai khac",
      "khong phai mau nay",
      "bo qua nhom nay",
    ])
  ) {
    return true;
  }

  const categoryChanged =
    currentShoppingContext?.categoryKeyword &&
    previousShoppingContext?.categoryKeyword &&
    currentShoppingContext.categoryKeyword !==
      previousShoppingContext.categoryKeyword;

  if (categoryChanged) return true;

  const recipientChanged =
    currentShoppingContext?.giftIntent?.recipient &&
    previousShoppingContext?.giftIntent?.recipient &&
    currentShoppingContext.giftIntent.recipient !==
      previousShoppingContext.giftIntent.recipient;

  if (recipientChanged) return true;

  if (
    hasStrongShoppingReset(message, currentShoppingContext) &&
    !currentShoppingContext?.refineIntent?.softer &&
    !currentShoppingContext?.refineIntent?.moreElegant &&
    !currentShoppingContext?.refineIntent?.simpler &&
    !currentShoppingContext?.refineIntent?.cheaper
  ) {
    return true;
  }

  return false;
}

function detectConversationStage(
  assistantHistory = [],
  shoppingContext = {},
  cleanMessage = "",
  previousShoppingContext = null
) {
  if (
    shouldResetShoppingContext(
      cleanMessage,
      previousShoppingContext,
      shoppingContext
    )
  ) {
    return "first";
  }

  const relevantReplies = assistantHistory.filter((msg) => {
    const intent = msg.metadata?.intent;
    return intent === "product_recommendation" || intent === "best_choice";
  }).length;

  if (relevantReplies <= 1) return "second";
  return "later";
}

function pickVariant(list = [], seed = 0) {
  if (!list.length) return "";
  return list[Math.abs(seed) % list.length];
}

function hashSeed(input = "") {
  return [...String(input)].reduce(
    (acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1),
    0
  );
}

function buildIntro(shoppingContext = {}, stage = "first", seedSource = "") {
  const mode = detectReplyMode(shoppingContext);

  const introMap = {
    hot: {
      first: [
        "Đây là vài mẫu bán chạy bên mình, mình ưu tiên chọn nhóm đang có sẵn hàng khá tốt nhé:",
        "Mình gợi ý vài mẫu đang được khách quan tâm nhiều, đồng thời shop cũng đang có hàng khá tốt:",
        "Nếu bạn muốn xem nhóm bán chạy, mình chọn nhanh vài mẫu nổi bật và dễ chốt như sau:",
      ],
      second: [
        "Mình lọc tiếp một nhóm bán chạy đáng tham khảo hơn như sau:",
        "Có nhé, đây là vài mẫu bán chạy khác đang khá ổn để bạn xem thêm:",
        "Mình chọn lại nhóm bán chạy theo hướng dễ chốt hơn nhé:",
      ],
      later: [
        "Có thêm vài mẫu bán chạy khác để bạn so sánh nhé:",
        "Mình gợi ý thêm một nhóm bán chạy khác để bạn cân nhắc:",
        "Bạn có thể xem thêm nhóm bán chạy này nữa nhé:",
      ],
    },
    new: {
      first: [
        "Đây là vài mẫu mới bên mình, mình ưu tiên nhóm đang có sẵn hàng tốt để bạn dễ chọn nhé:",
        "Nếu bạn muốn xem hàng mới, mình chọn nhanh vài mẫu mới đáng tham khảo như sau:",
        "Mình gợi ý vài mẫu mới về, khá dễ chọn trong thời điểm này:",
      ],
      second: [
        "Mình lọc tiếp thêm một nhóm mẫu mới để bạn tham khảo nhé:",
        "Có nhé, đây là vài mẫu mới khác đang khá ổn:",
        "Mình chọn lại một nhóm hàng mới dễ xem hơn cho bạn nhé:",
      ],
      later: [
        "Có thêm vài mẫu mới khác để bạn cân nhắc nhé:",
        "Mình gợi ý thêm một nhóm hàng mới khác để bạn xem:",
        "Bạn có thể tham khảo thêm nhóm mẫu mới này nhé:",
      ],
    },
    gift: {
      first: [
        "Mình gợi ý vài mẫu khá hợp để làm quà trong tầm giá này nhé:",
        "Trong khoảng ngân sách này, mình thấy vài mẫu khá hợp để tặng:",
        "Nếu chọn quà tặng trong tầm này thì mình nghiêng về các mẫu sau:",
      ],
      second: [
        "Có nhé, mình lọc lại theo hướng hợp quà tặng hơn một chút như sau:",
        "Mình chọn lại vài mẫu cùng tầm giá nhưng hợp để tặng hơn nhé:",
        "Dựa trên nhu cầu làm quà, mình lọc lại 3 mẫu đáng cân nhắc hơn:",
      ],
      later: [
        "Mình lọc tiếp cho bạn một nhóm khác trong cùng tầm giá nhé:",
        "Có thêm vài lựa chọn nữa khá ổn cho nhu cầu này:",
        "Mình chọn thêm một nhóm khác để bạn dễ so sánh hơn:",
      ],
    },
    soft: {
      first: [
        "Nếu bạn thích kiểu nhẹ nhàng thì mình gợi ý các mẫu sau:",
        "Mình ưu tiên các mẫu thanh mảnh, nữ tính hơn cho bạn nhé:",
        "Nếu muốn nhẹ nhàng hơn, mình sẽ chọn các mẫu mềm và dễ đeo hơn:",
      ],
      second: [
        "Có nhé, nếu muốn nhẹ nhàng hơn thì mình ưu tiên các mẫu thanh mảnh và dịu hơn:",
        "Mình lọc lại theo hướng nữ tính, mềm và dễ phối đồ hơn như sau:",
        "Nhóm này sẽ thiên về cảm giác nhẹ nhàng và tinh tế hơn:",
      ],
      later: [
        "Mình chọn tiếp một nhóm nhẹ nhàng hơn để bạn so sánh nhé:",
        "Có thêm vài mẫu cùng gu nhẹ nhàng mà khá dễ tặng:",
        "Nếu theo hướng dịu dàng hơn thì nhóm này cũng khá hợp:",
      ],
    },
    elegant: {
      first: [
        "Nếu bạn muốn kiểu sang hơn một chút thì có thể tham khảo các mẫu sau:",
        "Mình chọn theo hướng tinh tế và nổi bật hơn một chút nhé:",
        "Nếu ưu tiên cảm giác sang và chỉn chu hơn, bạn có thể xem nhóm này:",
      ],
      second: [
        "Nếu muốn sang hơn một chút thì mình lọc lại theo hướng tinh tế và nổi bật hơn:",
        "Mình đổi sang nhóm nhìn thanh lịch và cao cấp hơn một chút nhé:",
        "Nhóm này sẽ hợp nếu bạn muốn món quà trông sang và chỉn chu hơn:",
      ],
      later: [
        "Mình chọn thêm vài mẫu sang hơn để bạn dễ cân nhắc nhé:",
        "Có thêm một nhóm nhìn nổi bật và tinh tế hơn như sau:",
        "Nếu bạn vẫn muốn đẩy lên hướng sang hơn, nhóm này khá hợp:",
      ],
    },
    simple: {
      first: [
        "Nếu bạn thích kiểu tối giản thì mình gợi ý các mẫu sau:",
        "Mình chọn theo hướng đơn giản, dễ đeo hằng ngày hơn nhé:",
        "Nhóm này sẽ thiên về kiểu tối giản và dễ phối đồ:",
      ],
      second: [
        "Mình lọc lại theo hướng tối giản và dễ đeo hằng ngày hơn nhé:",
        "Nếu muốn đơn giản hơn thì nhóm này sẽ hợp hơn:",
        "Mình đổi sang các mẫu gọn và dễ dùng hơn một chút như sau:",
      ],
      later: [
        "Có thêm vài mẫu tối giản khác để bạn so sánh nhé:",
        "Nhóm này cũng cùng kiểu đơn giản nhưng nhìn khá xinh:",
        "Nếu vẫn muốn gọn hơn nữa thì bạn có thể xem nhóm này:",
      ],
    },
    cheaper: {
      first: [
        "Nếu bạn muốn mềm giá hơn thì mình gợi ý các mẫu sau:",
        "Mình lọc sang nhóm dễ chọn hơn về giá nhé:",
        "Nếu ưu tiên tiết kiệm hơn một chút thì bạn có thể tham khảo:",
      ],
      second: [
        "Có nhé, mình lọc lại các mẫu mềm giá hơn một chút như sau:",
        "Mình chuyển sang nhóm dễ chịu hơn về giá nhưng vẫn hợp để tặng:",
        "Nếu cần hạ ngân sách xuống một chút thì nhóm này khá ổn:",
      ],
      later: [
        "Mình chọn thêm vài mẫu giá mềm để bạn dễ cân nhắc nhé:",
        "Có thêm một nhóm dễ mua hơn trong tầm giá thấp hơn:",
        "Nếu muốn tối ưu ngân sách hơn thì bạn có thể xem nhóm này:",
      ],
    },
    trend: {
      first: [
        "Mình gợi ý vài mẫu đang được quan tâm nhé:",
        "Đây là một số mẫu đang được nhiều bạn để ý:",
        "Nếu bạn muốn xem các mẫu nổi bật gần đây thì có thể tham khảo:",
      ],
      second: [
        "Mình lọc lại vài mẫu đang được chú ý hơn nhé:",
        "Có nhé, đây là nhóm đang khá được quan tâm:",
        "Nếu theo hướng các mẫu hot hơn, mình gợi ý nhóm này:",
      ],
      later: [
        "Có thêm vài mẫu nổi bật khác để bạn xem nhé:",
        "Mình chọn thêm một nhóm đang được chú ý khá nhiều:",
        "Bạn có thể xem thêm nhóm này nếu muốn tham khảo nhiều mẫu hot hơn:",
      ],
    },
    default: {
      first: [
        "Mình gợi ý một vài mẫu phù hợp nhé:",
        "Bạn có thể tham khảo nhanh mấy mẫu sau:",
        "Mình chọn nhanh vài mẫu khá hợp cho nhu cầu này nhé:",
      ],
      second: [
        "Mình lọc lại cho sát nhu cầu hơn như sau nhé:",
        "Dựa trên điều bạn vừa nói, mình chọn lại 3 mẫu này:",
        "Mình tinh chỉnh lại gợi ý để sát hơn một chút nhé:",
      ],
      later: [
        "Có thêm vài mẫu khác để bạn cân nhắc nhé:",
        "Mình gợi ý thêm một nhóm khác để bạn so sánh:",
        "Bạn có thể xem thêm nhóm này nếu muốn mở rộng lựa chọn:",
      ],
    },
  };

  const group = introMap[mode] || introMap.default;
  const variants = group[stage] || group.first;
  const seed = hashSeed(`${mode}-${stage}-${seedSource}`);

  return pickVariant(variants, seed);
}

function buildFollowUp(shoppingContext = {}, stage = "first") {
  if (shoppingContext?.decisionIntent) {
    return "Nếu muốn, mình có thể chốt tiếp cho bạn theo tiêu chí: đẹp nhất, sang nhất hoặc an toàn nhất để tặng.";
  }

  if (shoppingContext?.hotIntent) {
    return stage === "first"
      ? "Nếu muốn, mình có thể lọc tiếp nhóm bán chạy theo dây chuyền, lắc tay hay bông tai."
      : "Bạn muốn mình lọc tiếp nhóm bán chạy theo kiểu nhẹ nhàng, sang hơn hay mềm giá hơn?";
  }

  if (shoppingContext?.newArrivalIntent) {
    return stage === "first"
      ? "Nếu thích, mình có thể lọc tiếp mẫu mới theo kiểu nhẹ nhàng, sang hơn hoặc dễ đeo hằng ngày."
      : "Bạn muốn mình chọn tiếp nhóm hàng mới theo phong cách nào hơn?";
  }

  if (shoppingContext?.refineIntent?.softer) {
    return stage === "first"
      ? "Nếu muốn, mình có thể lọc tiếp kiểu thanh mảnh hơn hoặc có đá sáng nhẹ hơn."
      : "Bạn muốn mình chọn tiếp kiểu nhẹ nhàng nhưng sang hơn, hay nhẹ nhàng và tối giản hơn?";
  }

  if (shoppingContext?.refineIntent?.moreElegant) {
    return stage === "first"
      ? "Nếu thích, mình có thể lọc tiếp kiểu sang hơn nhưng vẫn trẻ trung."
      : "Bạn muốn mình chọn tiếp kiểu sang hơn theo hướng thanh lịch hay nổi bật hơn một chút?";
  }

  if (shoppingContext?.refineIntent?.simpler) {
    return stage === "first"
      ? "Mình có thể lọc tiếp các mẫu tối giản hơn hoặc dễ đeo đi học, đi làm."
      : "Bạn muốn mình chọn tiếp kiểu đơn giản hơn nữa hay vẫn giữ cảm giác nữ tính một chút?";
  }

  if (shoppingContext?.refineIntent?.cheaper) {
    return "Nếu cần, mình có thể lọc tiếp một nhóm mềm giá hơn nhưng vẫn hợp để tặng.";
  }

  if (shoppingContext?.giftIntent?.isGift) {
    return stage === "first"
      ? "Bạn muốn mình lọc tiếp theo kiểu nhẹ nhàng, sang hơn hay đúng ngân sách hơn nữa không?"
      : "Nếu muốn, mình có thể chọn tiếp một nhóm hợp quà tặng hơn theo đúng gu của bạn.";
  }

  if (shoppingContext?.styles?.length) {
    return "Nếu muốn, mình có thể lọc tiếp theo kiểu tối giản, nữ tính hoặc dễ đeo hằng ngày.";
  }

  if (!shoppingContext?.categoryKeyword) {
    return "Bạn muốn mình lọc kỹ hơn theo dây chuyền, lắc tay, nhẫn hay bông tai không?";
  }

  if (!shoppingContext?.budget) {
    return "Bạn muốn mình gợi ý thêm theo một khoảng giá cụ thể không?";
  }

  return "Nếu muốn, mình gợi ý thêm vài mẫu cùng kiểu hoặc cùng tầm giá cho bạn.";
}

function removeRepeatedProducts(
  products = [],
  previousIds = [],
  minKeep = 3,
  maxRepeated = 1
) {
  if (!products.length) return [];

  const previousSet = new Set(previousIds);

  const fresh = products.filter((p) => !previousSet.has(getProductIdentity(p)));
  const repeated = products.filter((p) =>
    previousSet.has(getProductIdentity(p))
  );

  if (fresh.length >= minKeep) {
    return fresh;
  }

  return [...fresh, ...repeated.slice(0, maxRepeated)];
}

function filterProductsByContext(products = [], shoppingContext = {}) {
  if (!products.length) return [];

  return products.filter((p) => {
    const recipientTags = p.recipient_tags || [];
    const useCaseTags = p.use_case_tags || [];
    const category = normalizeText(p.ten_danh_muc_tam || "");
    const name = normalizeText(p.ten_san_pham || "");

    if (shoppingContext?.giftIntent?.recipient === "bạn gái") {
      if (recipientTags.includes("trẻ_em")) return false;
      if (category.includes("tre em")) return false;
      if (name.includes("tre em")) return false;
    }

    if (shoppingContext?.giftIntent?.recipient === "vợ") {
      if (recipientTags.includes("trẻ_em")) return false;
    }

    if (shoppingContext?.refineIntent?.simpler) {
      if (includesAny(p.motif_tags || [], ["tim_to", "no_to"])) return false;
    }

    if (shoppingContext?.refineIntent?.moreElegant) {
      if (includesAny(p.motif_tags || [], ["chuong", "tre_em"])) return false;
    }

    if (
      shoppingContext?.categoryKeyword &&
      p.ten_danh_muc_tam &&
      normalizeText(shoppingContext.categoryKeyword) !== category &&
      !normalizeText(name).includes(normalizeText(shoppingContext.categoryKeyword))
    ) {
      // không hard reject hoàn toàn để tránh làm mất dữ liệu nếu mapping category chưa sạch
    }

    if (
      shoppingContext?.giftIntent?.isGift &&
      recipientTags.length &&
      shoppingContext?.giftIntent?.recipient === "mẹ" &&
      recipientTags.includes("trẻ_em")
    ) {
      return false;
    }

    if (
      shoppingContext?.giftIntent?.isGift &&
      useCaseTags.length &&
      useCaseTags.includes("trẻ_em")
    ) {
      return false;
    }

    return true;
  });
}

function diversifyProducts(products = [], shoppingContext = {}) {
  if (!products.length) return [];

  const mode = detectReplyMode(shoppingContext);

  const scored = [...products].sort((a, b) => {
    const scoreA = Number(a.recommendation_score || 0);
    const scoreB = Number(b.recommendation_score || 0);

    const textA =
      `${a.ten_san_pham || ""} ${a.mo_ta_san_pham || ""} ${a.mo_ta_ngan || ""}`.toLowerCase();
    const textB =
      `${b.ten_san_pham || ""} ${b.mo_ta_san_pham || ""} ${b.mo_ta_ngan || ""}`.toLowerCase();

    let boostA = 0;
    let boostB = 0;

    if (mode === "soft") {
      if (/hoa|la|moon|trang|no|manh|nhe|thanh/.test(normalizeText(textA))) boostA += 1.2;
      if (/hoa|la|moon|trang|no|manh|nhe|thanh/.test(normalizeText(textB))) boostB += 1.2;
    }

    if (mode === "elegant") {
      if (/stone|premium|oval|shine|da|ngoc|lux|star|cao cap|thanh lich/.test(normalizeText(textA))) boostA += 1.5;
      if (/stone|premium|oval|shine|da|ngoc|lux|star|cao cap|thanh lich/.test(normalizeText(textB))) boostB += 1.5;

      if (/butterfly|co 4 la|no/.test(normalizeText(textA))) boostA -= 0.8;
      if (/butterfly|co 4 la|no/.test(normalizeText(textB))) boostB -= 0.8;
    }

    if (mode === "simple") {
      if (/tron|basic|simple|mini|manh|toi gian|gon/.test(normalizeText(textA))) boostA += 1.2;
      if (/tron|basic|simple|mini|manh|toi gian|gon/.test(normalizeText(textB))) boostB += 1.2;
    }

    if (mode === "cheaper") {
      const priceA = Number(a.gia_ban || 0);
      const priceB = Number(b.gia_ban || 0);
      if (priceA < priceB) boostA += 0.8;
      if (priceB < priceA) boostB += 0.8;
    }

    if (mode === "hot" || mode === "new" || mode === "decision") {
      const stockA = Number(a.so_luong_ton || 0);
      const stockB = Number(b.so_luong_ton || 0);
      if (stockA > stockB) boostA += 0.8;
      if (stockB > stockA) boostB += 0.8;
    }

    return scoreB + boostB - (scoreA + boostA);
  });

  return scored;
}

function getProductTone(product = {}) {
  const styleTags = product.style_tags || [];
  const motifTags = product.motif_tags || [];
  const materialTags = product.material_tags || [];
  const useCaseTags = product.use_case_tags || [];
  const price = safeNumber(product.gia_ban, 0);

  const softSignals = [
    styleTags.includes("nhẹ_nhàng"),
    styleTags.includes("nữ_tính"),
    includesAny(motifTags, ["hoa", "bướm", "trăng", "cỏ_4_lá", "nơ", "lá"]),
  ].filter(Boolean).length;

  const elegantSignals = [
    styleTags.includes("sang"),
    styleTags.includes("thanh_lịch"),
    includesAny(materialTags, ["moonstone", "cz", "đá_hồng"]),
    includesAny(motifTags, ["vòng_tròn"]),
  ].filter(Boolean).length;

  const simpleSignals = [
    styleTags.includes("tối_giản"),
    styleTags.includes("dễ_đeo"),
    includesAny(motifTags, ["vòng_tròn"]),
  ].filter(Boolean).length;

  const isDailyWear =
    useCaseTags.includes("đeo_hằng_ngày") ||
    useCaseTags.includes("đi_làm");

  return {
    isSoft: softSignals >= 1,
    isElegant: elegantSignals >= 2 || styleTags.includes("thanh_lịch"),
    isSimple: simpleSignals >= 2 || styleTags.includes("tối_giản"),
    isDailyWear,
    isAffordable: price > 0 && price <= 400000,
  };
}

function getStockMessage(stock = 0) {
  const s = safeNumber(stock, 0);

  if (s >= 30) return "shop đang có sẵn hàng khá tốt";
  if (s >= 10) return "hiện shop vẫn còn hàng ổn";
  if (s > 0) return "hiện vẫn còn hàng";
  return "";
}

function getFeatureReason(product = {}) {
  const motifTags = product.motif_tags || [];
  const materialTags = product.material_tags || [];
  const useCaseTags = product.use_case_tags || [];
  const tone = getProductTone(product);

  if (useCaseTags.includes("đeo_hằng_ngày") || useCaseTags.includes("đi_làm")) {
    return "form gọn và khá dễ đeo đi làm hằng ngày";
  }

  if (includesAny(motifTags, ["hoa"])) {
    return "có họa tiết hoa nên nhìn nữ tính và dễ tạo thiện cảm";
  }

  if (includesAny(motifTags, ["trăng"])) {
    return "có chi tiết trăng nên nhìn mềm và khá nổi bật";
  }

  if (includesAny(motifTags, ["lá"])) {
    return "chi tiết lá giúp tổng thể nhìn thanh hơn";
  }

  if (includesAny(motifTags, ["nơ"])) {
    return "họa tiết nơ tạo cảm giác trẻ trung và ngọt hơn";
  }

  if (includesAny(materialTags, ["moonstone"])) {
    return "có moonstone nên tổng thể nhìn sáng và dịu hơn";
  }

  if (includesAny(materialTags, ["cz", "đá_hồng"])) {
    return "phần đá giúp mẫu này nhìn nổi bật hơn khi đeo";
  }

  if (tone.isSimple) {
    return "form gọn nên khá dễ đeo hằng ngày";
  }

  if (tone.isElegant) {
    return "tổng thể nhìn chỉn chu và có cảm giác sang hơn";
  }

  return "";
}

function getGiftReason(product = {}, shoppingContext = {}) {
  const recipient = shoppingContext?.giftIntent?.recipient || null;
  const recipientTags = product.recipient_tags || [];
  const useCaseTags = product.use_case_tags || [];
  const tone = getProductTone(product);

  if (recipient === "bạn gái" && recipientTags.includes("bạn_gái")) {
    if (tone.isElegant) {
      return "hợp để tặng bạn gái vì nhìn chỉn chu và dễ tạo thiện cảm";
    }
    if (tone.isSoft) {
      return "hợp để tặng bạn gái vì nhìn nhẹ nhàng và nữ tính hơn";
    }
    return "khá hợp để tặng bạn gái và tương đối dễ chọn";
  }

  if (recipient === "vợ" && recipientTags.includes("vợ")) {
    return "hợp để tặng vợ vì nhìn tinh tế và đủ chỉn chu";
  }

  if (recipient === "mẹ" && recipientTags.includes("mẹ")) {
    return "hợp để tặng mẹ vì nhìn thanh lịch và dễ đeo";
  }

  if (recipient === "bạn thân" && recipientTags.includes("bạn_thân")) {
    return "hợp để tặng bạn thân vì khá xinh và dễ dùng";
  }

  if (useCaseTags.includes("quà_tặng")) {
    return "khá hợp làm quà vì dễ tạo thiện cảm";
  }

  return "";
}

function getStyleReason(product = {}, shoppingContext = {}) {
  const tone = getProductTone(product);

  if (
    shoppingContext?.refineIntent?.moreElegant ||
    shoppingContext?.styleProfile?.elegant
  ) {
    if (tone.isElegant) {
      return "nhìn sang và chỉn chu hơn trong tầm giá";
    }
  }

  if (
    shoppingContext?.refineIntent?.softer ||
    shoppingContext?.styleProfile?.soft
  ) {
    if (tone.isSoft) {
      return "nhẹ nhàng và nữ tính hơn";
    }
  }

  if (
    shoppingContext?.refineIntent?.simpler ||
    shoppingContext?.styleProfile?.simple
  ) {
    if (tone.isSimple) {
      return "đơn giản và dễ đeo hằng ngày";
    }
  }

 if (shoppingContext?.styleProfile?.dailyWear && tone.isDailyWear) {
  return "dễ đeo đi làm hằng ngày và khá dễ phối đồ";
}

  return "";
}

function getSalesReason(product = {}, shoppingContext = {}) {
  const stockMsg = getStockMessage(product.so_luong_ton);
  const isBestseller = !!product.is_bestseller;
  const isOnSale = !!product.is_on_sale;
  const prioritySellScore = safeNumber(product.priority_sell_score, 0);

  if (shoppingContext?.hotIntent) {
    if (isBestseller && stockMsg) {
      return `đang được quan tâm và ${stockMsg}`;
    }
    if (isBestseller) {
      return "là một trong những mẫu đang được khách hỏi nhiều";
    }
    if (stockMsg) {
      return stockMsg;
    }
  }

  if (shoppingContext?.newArrivalIntent) {
    if (stockMsg) {
      return `là mẫu mới và ${stockMsg}`;
    }
    return "là mẫu mới, khá đáng tham khảo";
  }

  if (shoppingContext?.decisionIntent) {
    if (prioritySellScore >= 80 && stockMsg) {
      return `là lựa chọn khá an toàn để chốt và ${stockMsg}`;
    }
    if (stockMsg) {
      return `là lựa chọn khá an toàn trong nhóm này và ${stockMsg}`;
    }
  }

  if (isOnSale && stockMsg) {
    return `${stockMsg} và giá hiện cũng khá dễ chốt`;
  }

  return "";
}

function buildProductReason(product = {}, shoppingContext = {}) {
  const styleTags = product.style_tags || [];
  const useCaseTags = product.use_case_tags || [];
  const stockMsg = getStockMessage(product.so_luong_ton);

  const giftReason = getGiftReason(product, shoppingContext);
  const styleReason = getStyleReason(product, shoppingContext);
  const featureReason = getFeatureReason(product);
  const salesReason = getSalesReason(product, shoppingContext);

  const reasons = [];
  const usedThemes = new Set();

  function detectTheme(reason = "") {
    const text = normalizeText(reason);

    if (
      text.includes("tang") ||
      text.includes("qua") ||
      text.includes("ban gai") ||
      text.includes("vo") ||
      text.includes("me") ||
      text.includes("ban than")
    ) {
      return "gift";
    }

    if (
      text.includes("sang") ||
      text.includes("chin chu") ||
      text.includes("thanh lich")
    ) {
      return "elegant";
    }

    if (text.includes("nhe nhang") || text.includes("nu tinh")) {
      return "soft";
    }

    if (
      text.includes("don gian") ||
      text.includes("toi gian") ||
      text.includes("de deo")
    ) {
      return "simple";
    }

    if (
      text.includes("hoa tiet") ||
      text.includes("moonstone") ||
      text.includes("chi tiet") ||
      text.includes("phan da") ||
      text.includes("form")
    ) {
      return "feature";
    }

    if (
      text.includes("con hang") ||
      text.includes("san hang") ||
      text.includes("duoc quan tam") ||
      text.includes("mau moi")
    ) {
      return "sales";
    }

    return "other";
  }

  function pushReason(reason = "") {
    if (!reason) return;
    const theme = detectTheme(reason);
    if (usedThemes.has(theme)) return;
    reasons.push(reason);
    usedThemes.add(theme);
  }

  if (shoppingContext?.decisionIntent) {
    pushReason(giftReason);
    pushReason(styleReason);
    pushReason(featureReason);
    pushReason(salesReason);
  } else if (shoppingContext?.giftIntent?.isGift) {
    pushReason(giftReason);
    pushReason(featureReason);
    pushReason(styleReason);
    pushReason(salesReason);
  } else if (shoppingContext?.hotIntent || shoppingContext?.newArrivalIntent) {
    pushReason(salesReason);
    pushReason(featureReason);
    pushReason(styleReason);
    pushReason(giftReason);
  } else {
    pushReason(styleReason);
    pushReason(featureReason);
    pushReason(giftReason);
    pushReason(salesReason);
  }

  if (!reasons.length) {
    if (useCaseTags.includes("đeo_hằng_ngày")) {
      reasons.push("dễ đeo hằng ngày");
    } else if (styleTags.includes("thanh_lịch")) {
      reasons.push("nhìn thanh lịch và dễ phối đồ");
    } else if (stockMsg) {
      reasons.push(stockMsg);
    } else {
      reasons.push("là một lựa chọn khá ổn trong nhóm này");
    }
  }

  return reasons.slice(0, 2).join(", ");
}

function formatBestChoice(products = [], shoppingContext = {}) {
  if (!products.length) {
    return "Hiện mình chưa đủ dữ liệu để chốt giúp bạn 1 mẫu rõ ràng. Bạn cho mình thêm kiểu bạn thích hoặc khoảng giá cụ thể hơn nhé.";
  }

  const top1 = products[0];
  const backup = products[1];

  const keepCategoryInName = !!shoppingContext?.categoryKeyword;
const top1Name = simplifyProductName(top1.ten_san_pham, {
  keepCategory: keepCategoryInName,
});
  const top1Reason = buildProductReason(top1, shoppingContext);

  let opener =
    "Nếu phải chọn 1 mẫu hợp nhất trong các lựa chọn hiện tại, mình nghiêng về:";
  if (shoppingContext?.giftIntent?.isGift) {
    opener =
      "Nếu cần chốt 1 mẫu an toàn để tặng trong nhóm hiện tại, mình nghiêng về:";
  } else if (shoppingContext?.refineIntent?.moreElegant) {
    opener =
      "Nếu phải chốt 1 mẫu theo hướng sang hơn trong nhóm hiện tại, mình nghiêng về:";
  } else if (shoppingContext?.refineIntent?.softer) {
    opener =
      "Nếu phải chốt 1 mẫu theo hướng nhẹ nhàng hơn trong nhóm hiện tại, mình nghiêng về:";
  }

  let reply = `${opener}\n\n1. ${top1Name} - ${formatCurrency(
    top1.gia_ban
  )} — ${top1Reason}`;

  if (backup) {
    const backupName = simplifyProductName(backup.ten_san_pham, {
  keepCategory: keepCategoryInName,
});
    const backupReason = buildProductReason(backup, shoppingContext);

    reply += `\n\nMẫu dự phòng mình thấy cũng khá ổn là:\n${backupName} - ${formatCurrency(
      backup.gia_ban
    )} — ${backupReason}`;
  }

  if (shoppingContext?.giftIntent?.isGift) {
    reply += `\n\nNếu muốn, mình có thể chốt tiếp cho bạn theo tiêu chí: an toàn nhất để tặng, sang nhất hoặc đúng ngân sách nhất.`;
  } else {
    reply += `\n\nNếu muốn, mình có thể chốt tiếp cho bạn theo tiêu chí: đẹp nhất, sang nhất hoặc dễ đeo nhất.`;
  }

  return reply;
}

async function logChatEvent({
  sessionId,
  userId,
  eventType,
  message = null,
  intent = null,
  shoppingContext = null,
}) {
  try {
    await supabase.from("chat_events").insert({
      session_id: sessionId,
      user_id: userId,
      event_type: eventType,
      message,
      intent,
      shopping_context: shoppingContext,
    });
  } catch (error) {
    console.error("CHAT EVENT LOG ERROR:", error);
  }
}

async function logRecommendedProducts({
  sessionId,
  userId,
  products = [],
  intent = "product_recommendation",
  shoppingContext = null,
}) {
  try {
    const logs = products.slice(0, 3).map((p, index) => ({
      session_id: sessionId,
      user_id: userId,
      product_id: p.ma_san_pham,
      product_name: p.ten_san_pham,
      recommendation_score: p.recommendation_score || 0,
      rank_position: index + 1,
      intent,
      shopping_context: shoppingContext,
    }));

    if (logs.length) {
      await supabase.from("recommended_products_log").insert(logs);
    }
  } catch (error) {
    console.error("RECOMMENDED PRODUCTS LOG ERROR:", error);
  }
}

function formatRecommendedProducts(
  products = [],
  shoppingContext = {},
  options = {}
) {
  const { stage = "first", seedSource = "" } = options;

  if (!products.length) {
    if (shoppingContext?.decisionIntent) {
      return "Hiện mình chưa đủ dữ liệu để chốt giúp bạn 1 mẫu rõ ràng. Bạn cho mình thêm kiểu bạn thích hoặc khoảng giá cụ thể hơn nhé.";
    }

    if (shoppingContext?.hotIntent) {
      return "Hiện mình chưa lọc được nhóm bán chạy thật sự phù hợp. Bạn thử cho mình loại trang sức bạn thích như dây chuyền, lắc tay hay bông tai nhé.";
    }

    if (shoppingContext?.newArrivalIntent) {
      return "Hiện mình chưa lọc được nhóm mẫu mới thật sự phù hợp. Bạn thử cho mình kiểu bạn thích như nhẹ nhàng, sang hơn hoặc dễ đeo nhé.";
    }

    if (shoppingContext?.refineIntent?.softer) {
      return "Mình chưa thấy mẫu nào thật sự sát kiểu nhẹ nhàng hơn trong nhóm hiện tại. Bạn thử cho mình khoảng giá hoặc loại trang sức cụ thể hơn nhé.";
    }

    if (shoppingContext?.refineIntent?.moreElegant) {
      return "Hiện mình chưa lọc ra mẫu nào thật sự sang hơn trong nhóm này. Bạn thử cho mình khoảng giá hoặc loại trang sức cụ thể hơn nhé.";
    }

    return "Hiện mình chưa tìm thấy sản phẩm thật sự phù hợp. Bạn cho mình thêm loại trang sức hoặc ngân sách cụ thể hơn nhé?";
  }

  const intro = buildIntro(shoppingContext, stage, seedSource);

  let finalIntro = intro;

if (shoppingContext?.categoryKeyword) {
  const categoryLabel = shoppingContext.categoryKeyword;
  finalIntro = `Bạn có thể tham khảo nhanh vài mẫu ${categoryLabel} sau:`;
}

 const keepCategoryInName = !!shoppingContext?.categoryKeyword;

const lines = products
  .slice(0, 3)
  .map((p, index) => {
    const shortName = simplifyProductName(p.ten_san_pham, {
      keepCategory: keepCategoryInName,
    });
    const reason = buildProductReason(p, shoppingContext);
    return `${index + 1}. ${shortName} - ${formatCurrency(
      p.gia_ban
    )} — ${reason}`;
  })
  .join("\n");

  const followUp = buildFollowUp(shoppingContext, stage);

  if (products.length === 1) {
  if (shoppingContext?.categoryKeyword) {
    return `Mình đang thấy mẫu ${shoppingContext.categoryKeyword} này là nổi bật nhất theo hướng bạn muốn:\n\n${lines}\n\n${followUp}`;
  }

  return `Mình đang thấy mẫu này là nổi bật nhất theo hướng bạn muốn:\n\n${lines}\n\n${followUp}`;
}

  return `${finalIntro}\n\n${lines}\n\n${followUp}`;
}

app.get("/", (req, res) => {
  res.send("Blue Peach Chatbot API is running");
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "bluepeach-chatbot-api",
    time: new Date().toISOString(),
  });
});

app.get("/kb/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from("kb_articles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }

    return res.json({
      ok: true,
      article: data,
    });
  } catch (err) {
    console.error("KB ERROR:", err);

    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
});

app.post("/chat", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        ok: false,
        error: "userId và message là bắt buộc",
      });
    }

    const cleanMessage = String(message).trim();

    if (!cleanMessage) {
      return res.status(400).json({
        ok: false,
        error: "message không được để trống",
      });
    }

    const session = await getOrCreateSession(userId);

    const { error: userError } = await supabase.from("chat_messages").insert({
      session_id: session.id,
      role: "user",
      content: cleanMessage,
    });

    if (userError) throw userError;

    await logChatEvent({
      sessionId: session.id,
      userId,
      eventType: "user_message",
      message: cleanMessage,
    });

    if (isOrderLookupMessage(cleanMessage)) {
      const extractedOrderId = extractOrderId(cleanMessage);

      let reply = "";
      let metadata = {
        intent: "order_lookup",
      };

      if (extractedOrderId) {
        const order = await findOrderByOrderId(extractedOrderId);

        if (!order) {
          reply =
            "Chào bạn, mình chưa tìm thấy đơn hàng với mã này. Bạn kiểm tra lại mã đơn giúp mình nhé.";
        } else {
          reply = `Chào bạn, mình đã tìm thấy đơn hàng của bạn:\n\nMã đơn: ${
            order.ma_don_hang
          }\nTrạng thái: ${order.trang_thai_don}\nThanh toán: ${
            order.trang_thai_thanh_toan
          }\nTổng tiền: ${formatCurrency(
            order.tong_thanh_toan
          )}\n\nBạn muốn mình hỗ trợ thêm gì về đơn này không?`;
        }

        metadata.orderId = extractedOrderId;
        metadata.order = order;

        const { error: botError } = await supabase.from("chat_messages").insert({
          session_id: session.id,
          role: "assistant",
          content: reply,
          metadata,
        });

        if (botError) throw botError;

        await logChatEvent({
          sessionId: session.id,
          userId,
          eventType: "bot_reply",
          message: reply,
          intent: "order_lookup",
        });

        return res.json({
          ok: true,
          reply,
        });
      }

      if (isValidUuid(userId)) {
        const orders = await findOrdersByUserId(userId);

        if (!orders.length) {
          reply =
            "Chào bạn, mình chưa tìm thấy đơn hàng nào. Bạn gửi thêm mã đơn để mình kiểm tra nhanh hơn nhé.";
        } else {
          const orderLines = orders
            .map((o, index) => {
              return `${index + 1}. ${o.ma_don_hang} - ${
                o.trang_thai_don
              } - ${formatCurrency(o.tong_thanh_toan)}`;
            })
            .join("\n");

          reply = `Chào bạn, mình thấy một số đơn gần đây của bạn:\n\n${orderLines}\n\nBạn muốn mình kiểm tra kỹ đơn nào không?`;
        }

        metadata.orders = orders;

        const { error: botError } = await supabase.from("chat_messages").insert({
          session_id: session.id,
          role: "assistant",
          content: reply,
          metadata,
        });

        if (botError) throw botError;

        await logChatEvent({
          sessionId: session.id,
          userId,
          eventType: "bot_reply",
          message: reply,
          intent: "order_lookup",
        });

        return res.json({
          ok: true,
          reply,
        });
      }

      reply =
        "Chào bạn, để mình kiểm tra đơn hàng chính xác hơn, bạn gửi giúp mình mã đơn nhé.";

      const { error: botError } = await supabase.from("chat_messages").insert({
        session_id: session.id,
        role: "assistant",
        content: reply,
        metadata,
      });

      if (botError) throw botError;

      await logChatEvent({
        sessionId: session.id,
        userId,
        eventType: "bot_reply",
        message: reply,
        intent: "order_lookup",
      });

      return res.json({
        ok: true,
        reply,
      });
    }

    if (isHandoverMessage(cleanMessage)) {
      const { error: sessionError } = await supabase
        .from("chat_sessions")
        .update({ status: "handed_over" })
        .eq("id", session.id);

      if (sessionError) throw sessionError;

      const reply =
        "Chào bạn, mình đã chuyển yêu cầu sang tư vấn viên rồi nhé. Shop sẽ hỗ trợ bạn sớm nhất có thể.";

      const { error: botError } = await supabase.from("chat_messages").insert({
        session_id: session.id,
        role: "assistant",
        content: reply,
        metadata: {
          intent: "handover",
        },
      });

      if (botError) throw botError;

      await logChatEvent({
        sessionId: session.id,
        userId,
        eventType: "handover",
        message: reply,
        intent: "handover",
      });

      return res.json({
        ok: true,
        reply,
      });
    }

    const recentMessages = await getRecentMessages(session.id, 20);

    const assistantHistory = recentMessages.filter(
      (msg) => msg.role === "assistant"
    );

    const previousShoppingContext = getPreviousShoppingContext(assistantHistory);
    const previousRecommendedIds =
      getPreviousRecommendedProductIds(assistantHistory);
    const previousAssistantReply = getLastAssistantReply(assistantHistory);
    const lastAssistantMetadata = getLastAssistantMetadata(assistantHistory);

    const currentShoppingContext = extractShoppingContext(cleanMessage);

    const shouldReset = shouldResetShoppingContext(
      cleanMessage,
      previousShoppingContext,
      currentShoppingContext
    );

    const baseShoppingContext = shouldReset
      ? {}
      : previousShoppingContext || {};

    const shoppingContext = mergeShoppingContext(
      baseShoppingContext,
      currentShoppingContext
    );

    let searchedProducts = await searchProducts(cleanMessage, shoppingContext);

    searchedProducts = filterProductsByContext(searchedProducts, shoppingContext);

    let recommendedProducts = recommendProducts(
      searchedProducts,
      shoppingContext
    );

    recommendedProducts = diversifyProducts(recommendedProducts, shoppingContext);

    recommendedProducts = removeRepeatedProducts(
      recommendedProducts,
      previousRecommendedIds,
      shoppingContext.decisionIntent ? 2 : 3,
      shoppingContext.decisionIntent ? 1 : 1
    );

    const compactProducts = recommendedProducts.map((p) => ({
      ma_san_pham: p.ma_san_pham,
      sku: p.sku,
      ten_san_pham: p.ten_san_pham,
      gia_ban: p.gia_ban,
      mo_ta_san_pham: p.mo_ta_san_pham || "",
      mo_ta_ngan: p.mo_ta_ngan || "",
      hinh_anh: p.hinh_anh || null,
      so_luong_ton: p.so_luong_ton,
      so_luong_da_ban: p.so_luong_da_ban,
      so_luot_yeu_thich: p.so_luot_yeu_thich,
      so_luot_binh_luan: p.so_luot_binh_luan,
      diem_danh_gia_tb: p.diem_danh_gia_tb,
      so_luot_danh_gia: p.so_luot_danh_gia,
      is_bestseller: p.is_bestseller,
      is_on_sale: p.is_on_sale,
      ten_danh_muc_tam: p.ten_danh_muc_tam || null,
      recommendation_score: p.recommendation_score || 0,
      style_tags: p.style_tags || [],
      recipient_tags: p.recipient_tags || [],
      use_case_tags: p.use_case_tags || [],
      motif_tags: p.motif_tags || [],
      material_tags: p.material_tags || [],
      gift_score: p.gift_score || 0,
      priority_sell_score: p.priority_sell_score || 0,
    }));

    let stage = detectConversationStage(
      assistantHistory,
      shoppingContext,
      cleanMessage,
      previousShoppingContext
    );

    if (shouldReset) {
      stage = "first";
    } else if (lastAssistantMetadata?.stage === "first") {
      stage = "second";
    }

    let reply = "";
    if (shoppingContext.decisionIntent) {
      reply = formatBestChoice(compactProducts, shoppingContext);
    } else {
      reply = formatRecommendedProducts(compactProducts, shoppingContext, {
        stage,
        seedSource: cleanMessage,
      });
    }

    if (
      reply &&
      previousAssistantReply &&
      reply.trim() === previousAssistantReply.trim()
    ) {
      reply = `${reply}\n\nNếu bạn muốn, mình có thể lọc sang một hướng khác để đỡ bị trùng mẫu nhé.`;
    }

    const responseIntent = shoppingContext.decisionIntent
      ? "best_choice"
      : "product_recommendation";

    const metadata = {
      intent: responseIntent,
      shoppingContext,
      stage,
      searchedProductsCount: searchedProducts.length,
      matchedProductsCount: compactProducts.length,
      previousRecommendedIds,
      shouldResetContext: shouldReset,
      products: compactProducts.slice(0, 3),
    };

    const { error: botError } = await supabase.from("chat_messages").insert({
      session_id: session.id,
      role: "assistant",
      content: reply,
      metadata,
    });

    if (botError) throw botError;

    await logChatEvent({
      sessionId: session.id,
      userId,
      eventType: compactProducts.length ? "bot_reply" : "no_result",
      message: reply,
      intent: responseIntent,
      shoppingContext,
    });

    await logRecommendedProducts({
      sessionId: session.id,
      userId,
      products: compactProducts,
      intent: responseIntent,
      shoppingContext,
    });

    return res.json({
      ok: true,
      reply,
    });
  } catch (err) {
    console.error("CHAT ERROR:", err);

    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Chatbot API running at http://localhost:${PORT}`);
});