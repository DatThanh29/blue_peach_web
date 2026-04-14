import { supabase } from "./supabase.js";

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

function includesAny(source = [], targets = []) {
  return targets.some((item) => source.includes(item));
}

function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeScore(value, max = 100) {
  const n = safeNumber(value, 0);
  if (n <= 0) return 0;
  return Math.min(n / max, 1);
}

const PRODUCT_SELECT = `
  ma_san_pham,
  sku,
  ten_san_pham,
  mo_ta_san_pham,
  gia_ban,
  gia_goc,
  phan_tram_giam,
  so_luong_ton,
  so_luong_da_ban,
  so_luot_yeu_thich,
  so_luot_binh_luan,
  diem_danh_gia_tb,
  so_luot_danh_gia,
  trang_thai_hien_thi,
  is_available,
  is_bestseller,
  is_on_sale,
  primary_image,
  ngay_tao,
  ma_danh_muc,
  ten_danh_muc_tam,
  style_tags,
  recipient_tags,
  use_case_tags,
  motif_tags,
  material_tags,
  gift_score,
  priority_sell_score
`;

const RANKING_PRESETS = {
  balanced: {
    base: {
      outOfStockPenalty: -80,
      stockBase: 18,
      budgetFit: 30,
      budgetOverPenalty: -12,
      categoryMatch: 24,
      categoryMismatch: -6,
      bestseller: 12,
      sale: 6,
      sold: 14,
      liked: 10,
      ratingCount: 8,
      ratingHigh: 10,
      ratingGood: 7,
      ratingOk: 4,
    },

    gift: {
      giftScore: 28,
      giftUseCase: 16,
      necklace: 18,
      bracelet: 16,
      earring: 14,
      ring: 4,
      normalRingPenalty: -8,
      recipientStrong: 18,
      recipientMedium: 14,
      motifGift: 10,
      badGiftPenalty: -30,
      dailyWearBonus: 8,
      elegantBonus: 8,
    },

    style: {
      softTag: 18,
      softText: 8,
      elegantTag: 22,
      elegantMaterial: 10,
      elegantCutePenalty: -4,
      simple: 20,
      dailyWear: 18,
    },

    refine: {
      softer: 14,
      elegant: 18,
      elegantCutePenalty: -6,
      simpler: 16,
      cheaper: 10,
      moreExpensive: 10,
    },

    trend: {
      bestseller: 12,
      sold: 10,
      liked: 8,
    },

    hot: {
      sold: 22,
      liked: 12,
      ratingCount: 8,
      stock: 14,
      bestseller: 18,
      prioritySell: 12,
    },

    newArrival: {
      freshness: 26,
      stock: 16,
      prioritySell: 14,
      bestseller: 4,
    },

    decision: {
      giftScore: 18,
      prioritySell: 16,
      budgetFit: 12,
      stock: 14,
      bestseller: 8,
      rating: 8,
      giftUseCase: 10,
      recipient: 10,
      dailyWear: 8,
      elegant: 8,
    },
  },

  sales_push: {
    base: {
      outOfStockPenalty: -90,
      stockBase: 24,
      budgetFit: 26,
      budgetOverPenalty: -10,
      categoryMatch: 22,
      categoryMismatch: -6,
      bestseller: 12,
      sale: 10,
      sold: 12,
      liked: 8,
      ratingCount: 6,
      ratingHigh: 8,
      ratingGood: 6,
      ratingOk: 3,
    },

    gift: {
      giftScore: 22,
      giftUseCase: 14,
      necklace: 16,
      bracelet: 15,
      earring: 12,
      ring: 3,
      normalRingPenalty: -6,
      recipientStrong: 14,
      recipientMedium: 10,
      motifGift: 8,
      badGiftPenalty: -24,
      dailyWearBonus: 6,
      elegantBonus: 6,
    },

    style: {
      softTag: 14,
      softText: 6,
      elegantTag: 18,
      elegantMaterial: 8,
      elegantCutePenalty: -3,
      simple: 16,
      dailyWear: 14,
    },

    refine: {
      softer: 10,
      elegant: 14,
      elegantCutePenalty: -4,
      simpler: 12,
      cheaper: 12,
      moreExpensive: 8,
    },

    trend: {
      bestseller: 14,
      sold: 12,
      liked: 6,
    },

    hot: {
      sold: 20,
      liked: 8,
      ratingCount: 6,
      stock: 24,
      bestseller: 18,
      prioritySell: 18,
    },

    newArrival: {
      freshness: 20,
      stock: 24,
      prioritySell: 20,
      bestseller: 4,
    },

    decision: {
      giftScore: 14,
      prioritySell: 24,
      budgetFit: 10,
      stock: 22,
      bestseller: 8,
      rating: 6,
      giftUseCase: 8,
      recipient: 8,
      dailyWear: 6,
      elegant: 6,
    },
  },

  gift_focus: {
    base: {
      outOfStockPenalty: -80,
      stockBase: 16,
      budgetFit: 32,
      budgetOverPenalty: -14,
      categoryMatch: 24,
      categoryMismatch: -6,
      bestseller: 10,
      sale: 5,
      sold: 10,
      liked: 10,
      ratingCount: 8,
      ratingHigh: 10,
      ratingGood: 8,
      ratingOk: 4,
    },

    gift: {
      giftScore: 34,
      giftUseCase: 20,
      necklace: 22,
      bracelet: 18,
      earring: 16,
      ring: 2,
      normalRingPenalty: -12,
      recipientStrong: 22,
      recipientMedium: 16,
      motifGift: 14,
      badGiftPenalty: -36,
      dailyWearBonus: 10,
      elegantBonus: 10,
    },

    style: {
      softTag: 20,
      softText: 10,
      elegantTag: 24,
      elegantMaterial: 12,
      elegantCutePenalty: -4,
      simple: 18,
      dailyWear: 16,
    },

    refine: {
      softer: 16,
      elegant: 20,
      elegantCutePenalty: -6,
      simpler: 14,
      cheaper: 10,
      moreExpensive: 10,
    },

    trend: {
      bestseller: 10,
      sold: 8,
      liked: 8,
    },

    hot: {
      sold: 18,
      liked: 10,
      ratingCount: 8,
      stock: 12,
      bestseller: 14,
      prioritySell: 10,
    },

    newArrival: {
      freshness: 22,
      stock: 12,
      prioritySell: 10,
      bestseller: 4,
    },

    decision: {
      giftScore: 24,
      prioritySell: 12,
      budgetFit: 14,
      stock: 12,
      bestseller: 6,
      rating: 10,
      giftUseCase: 14,
      recipient: 14,
      dailyWear: 8,
      elegant: 10,
    },
  },
};

function getRankingPreset(shoppingContext = {}) {
  if (shoppingContext?.giftIntent?.isGift) {
    return RANKING_PRESETS.gift_focus;
  }

  if (shoppingContext?.hotIntent || shoppingContext?.newArrivalIntent) {
    return RANKING_PRESETS.sales_push;
  }

  return RANKING_PRESETS.balanced;
}

/* =========================
   CATEGORY
========================= */
function detectCategoryKeyword(message = "") {
  const text = normalizeText(message);

  if (includesPhrase(text, ["nhan", "ring"])) return "nhẫn";

  if (includesPhrase(text, ["vong", "lac", "bracelet"])) {
    return "lắc";
  }

  if (includesPhrase(text, ["day chuyen", "necklace", "dc "])) {
    return "dây chuyền";
  }

  if (includesPhrase(text, ["bong tai", "khuyen tai", "earring"])) {
    return "bông tai";
  }

  return null;
}

/* =========================
   BUDGET
========================= */
function convertPriceUnit(value, unit = "") {
  const normalizedUnit = normalizeText(unit);

  if (["k", "nghin", "ngan"].includes(normalizedUnit)) {
    return value * 1000;
  }

  if (["tr", "trieu"].includes(normalizedUnit)) {
    return value * 1000000;
  }

  return value;
}

function parseBudget(message = "") {
  const text = normalizeText(message).replaceAll(",", "").replaceAll(".", "");
  let match;

  match = text.match(/(\d+)\s*(k)\b/);
  if (match) return Number(match[1]) * 1000;

  match = text.match(/(\d+)\s*(nghin|ngan)\b/);
  if (match) return Number(match[1]) * 1000;

  match = text.match(/(\d+)\s*(trieu)\b/);
  if (match) return Number(match[1]) * 1000000;

  match = text.match(/(\d+)\s*(tr)\b/);
  if (match) return Number(match[1]) * 1000000;

  match = text.match(/(\d+)\s*tr\s*(\d{1,3})\b/);
  if (match) {
    const million = Number(match[1]);
    const extra = Number(match[2]);

    if (extra < 10) return million * 1000000 + extra * 100000;
    if (extra < 100) return million * 1000000 + extra * 10000;
    return million * 1000000 + extra * 1000;
  }

  match = text.match(/\b(\d{5,8})\b/);
  if (match) {
    const raw = Number(match[1]);
    if (raw >= 50000) return raw;
  }

  return null;
}

function detectPriceIntent(message = "") {
  const text = normalizeText(message);

  if (includesPhrase(text, ["duoi", "khong qua", "toi da"])) return "max";
  if (includesPhrase(text, ["tren", "toi thieu"])) return "min";
  if (text.includes("tu") && (text.includes("den") || text.includes("-"))) {
    return "range";
  }
  if (includesPhrase(text, ["khoang", "tam", "gan"])) return "approx";

  return "approx";
}

function parsePriceRange(message = "") {
  const text = normalizeText(message).replaceAll(",", "").replaceAll(".", "");

  const regex =
    /tu\s*(\d+)\s*(k|nghin|ngan|tr|trieu)\s*(?:den|-)\s*(\d+)\s*(k|nghin|ngan|tr|trieu)/;

  const match = text.match(regex);
  if (!match) return null;

  const minValue = convertPriceUnit(Number(match[1]), match[2]);
  const maxValue = convertPriceUnit(Number(match[3]), match[4]);

  if (!minValue || !maxValue) return null;

  return {
    min: Math.min(minValue, maxValue),
    max: Math.max(minValue, maxValue),
  };
}

function buildPriceRange(budget, intent, explicitRange = null) {
  if (explicitRange) return explicitRange;
  if (!budget) return null;

  if (intent === "max") {
    return { min: 0, max: budget };
  }

  if (intent === "min") {
    return { min: budget, max: null };
  }

  const delta = Math.max(150000, Math.floor(budget * 0.3));

  return {
    min: Math.max(0, budget - delta),
    max: budget + delta,
  };
}
/* =========================
   GIFT / STYLE / TREND / REFINE
========================= */
function detectGiftIntent(message = "") {
  const text = normalizeText(message);

  const isGift = includesPhrase(text, [
    "qua",
    "tang",
    "sinh nhat",
    "ky niem",
    "valentine",
    "8/3",
    "20/10",
  ]);

  let recipient = null;
  if (includesPhrase(text, ["ban gai", "nguoi yeu"])) recipient = "bạn gái";
  else if (text.includes("vo")) recipient = "vợ";
  else if (text.includes("me")) recipient = "mẹ";
  else if (text.includes("em gai")) recipient = "em gái";
  else if (text.includes("chi gai")) recipient = "chị gái";
  else if (text.includes("ban than")) recipient = "bạn thân";

  let occasion = null;
  if (text.includes("sinh nhat")) occasion = "sinh nhật";
  else if (text.includes("ky niem")) occasion = "kỷ niệm";
  else if (text.includes("valentine")) occasion = "valentine";
  else if (text.includes("8/3")) occasion = "8/3";
  else if (text.includes("20/10")) occasion = "20/10";

  return {
    isGift,
    recipient,
    occasion,
  };
}

function detectStyleKeywords(message = "") {
  const text = normalizeText(message);
  const styles = [];

  if (includesPhrase(text, ["toi gian"])) styles.push("tối giản");
  if (includesPhrase(text, ["don gian"])) styles.push("đơn giản");
  if (includesPhrase(text, ["nhe nhang"])) styles.push("nhẹ nhàng");
  if (includesPhrase(text, ["nu tinh"])) styles.push("nữ tính");
  if (includesPhrase(text, ["sang"])) styles.push("sang");
  if (includesPhrase(text, ["thanh lich"])) styles.push("thanh lịch");
  if (includesPhrase(text, ["di lam"])) styles.push("đi làm");
  if (includesPhrase(text, ["de deo", "deo hang ngay"])) styles.push("dễ đeo");

  if (includesPhrase(text, ["khong qua banh beo", "khong banh beo"])) {
    styles.push("đơn giản");
  }

  if (includesPhrase(text, ["co gu", "nhin co gu"])) {
    styles.push("thanh lịch");
  }

  return Array.from(new Set(styles));
}

function detectTrendIntent(message = "") {
  const text = normalizeText(message);
  return includesPhrase(text, [
    "hot",
    "trend",
    "trending",
    "ban chay",
    "best seller",
    "best",
  ]);
}

function detectHotIntent(message = "") {
  const text = normalizeText(message);
  return includesPhrase(text, [
    "ban chay",
    "hot nhat",
    "nhieu nguoi mua",
    "best seller",
  ]);
}

function detectNewArrivalIntent(message = "") {
  const text = normalizeText(message);
  return includesPhrase(text, [
    "mau moi",
    "hang moi",
    "moi ve",
    "new arrival",
    "moi nhat",
  ]);
}

function detectDecisionIntent(message = "") {
  const text = normalizeText(message);

  return includesPhrase(text, [
    "hop nhat",
    "nen chon",
    "chon cai nao",
    "neu phai chon 1",
    "neu phai chon mot",
    "dang mua nhat",
    "de tang nhat",
    "chot giup",
    "chon giup",
  ]);
}

function detectRefineIntent(message = "") {
  const text = normalizeText(message);

  return {
    softer: includesPhrase(text, ["nhe nhang hon", "diu hon", "mem hon"]),
    moreElegant: includesPhrase(text, [
      "sang hon",
      "thanh lich hon",
      "xin hon",
      "cao cap hon",
    ]),
    simpler: includesPhrase(text, [
      "don gian hon",
      "toi gian hon",
      "gon hon",
      "khong qua banh beo",
      "khong sen",
    ]),
    cheaper: includesPhrase(text, [
      "re hon",
      "mem gia hon",
      "gia mem hon",
      "de mua hon",
    ]),
    moreExpensive: includesPhrase(text, [
      "dat hon",
      "cao hon ve gia",
      "premium hon",
    ]),
  };
}

function buildStyleProfile(message = "", styles = [], refineIntent = {}) {
  const text = normalizeText(message);

  const profile = {
    soft: false,
    elegant: false,
    simple: false,
    dailyWear: false,
  };

  for (const style of styles || []) {
    if (style === "nhẹ nhàng" || style === "nữ tính") profile.soft = true;
    if (style === "sang" || style === "thanh lịch") profile.elegant = true;
    if (style === "tối giản" || style === "đơn giản") profile.simple = true;
    if (style === "đi làm" || style === "dễ đeo") profile.dailyWear = true;
  }

  if (refineIntent?.softer) profile.soft = true;
  if (refineIntent?.moreElegant) profile.elegant = true;
  if (refineIntent?.simpler) profile.simple = true;

  if (includesPhrase(text, ["de deo", "deo hang ngay"])) {
    profile.dailyWear = true;
  }

  if (includesPhrase(text, ["khong sen", "khong qua banh beo"])) {
    profile.simple = true;
    profile.elegant = true;
  }

  return profile;
}

/* =========================
   CATEGORY FROM DB
========================= */
async function getCategoryIds(keyword) {
  if (!keyword) return [];

  const { data, error } = await supabase
    .from("categories")
    .select("ma_danh_muc, ten_danh_muc")
    .ilike("ten_danh_muc", `%${keyword}%`);

  if (error) throw error;

  return (data || []).map((c) => c.ma_danh_muc);
}

function getCategoryFallbackTerms(categoryKeyword = "") {
  const text = normalizeText(categoryKeyword);

  if (text.includes("nhan")) {
    return ["nhẫn", "nhan", "ring"];
  }

  if (text.includes("bong tai")) {
    return ["bông tai", "khuyên tai", "bong tai", "khuyen tai", "earring"];
  }

  if (text.includes("day chuyen")) {
    return ["dây chuyền", "day chuyen", "necklace"];
  }

  if (text.includes("lac")) {
    return ["lắc", "vòng", "lac", "vong", "bracelet"];
  }

  return [categoryKeyword];
}

function getProductCategorySignals(product = {}) {
  const categoryText = normalizeText(product.ten_danh_muc_tam || "");
  const nameText = normalizeText(product.ten_san_pham || "");
  const descText = normalizeText(product.mo_ta_san_pham || "");
  const text = `${categoryText} ${nameText} ${descText}`;

  return {
    isRing:
      /nhan|ring|free size true love|nhan doi/.test(text),

    isEarring:
      /bong tai|khuyen tai|earring|\bkt\b|khuyen/.test(text),

    isNecklace:
      /day chuyen|necklace|\bdc\b/.test(text),

    isBracelet:
      /lac tay|vong tay|bracelet|\blt\b|lac /.test(text),
  };
}

function matchesCategoryStrict(product = {}, categoryKeyword = "") {
  const key = normalizeText(categoryKeyword);
  const signals = getProductCategorySignals(product);

  if (key.includes("nhan")) return signals.isRing;
  if (key.includes("bong tai")) return signals.isEarring;
  if (key.includes("day chuyen")) return signals.isNecklace;
  if (key.includes("lac")) return signals.isBracelet;

  return true;
}
/* =========================
   IMAGES
========================= */
async function getImages(productIds = []) {
  if (!productIds.length) return {};

  const { data, error } = await supabase
    .from("product_images")
    .select("ma_san_pham, duong_dan_anh, la_anh_chinh, thu_tu")
    .in("ma_san_pham", productIds)
    .order("la_anh_chinh", { ascending: false })
    .order("thu_tu", { ascending: true });

  if (error) throw error;

  const map = {};

  for (const row of data || []) {
    if (!map[row.ma_san_pham]) {
      map[row.ma_san_pham] = row.duong_dan_anh;
    }
  }

  return map;
}

/* =========================
   SHORT DESCRIPTION
========================= */
function buildShortDescription(product = {}) {
  const category = normalizeText(product.ten_danh_muc_tam || "trang suc");
  const text = normalizeText(
    `${product.ten_san_pham || ""} ${product.mo_ta_san_pham || ""}`
  );
  const price = Number(product.gia_ban || 0);

  if (category.includes("day chuyen")) {
    if (/hoa|la|moon|star|butterfly|tim/.test(text)) {
      return "Mẫu dây chuyền nữ tính, khá hợp để làm quà tặng.";
    }
    if (price <= 700000) return "Mẫu dây chuyền thanh lịch, dễ đeo hằng ngày.";
    return "Mẫu dây chuyền nổi bật, tinh tế và dễ tạo điểm nhấn.";
  }

  if (category.includes("lac")) {
    if (/hoa|la|tim|moon/.test(text)) {
      return "Mẫu lắc tay nhẹ nhàng, nữ tính và dễ tặng.";
    }
    return "Mẫu lắc tay thanh lịch, dễ phối đồ hằng ngày.";
  }

  if (category.includes("nhan")) {
    return "Mẫu nhẫn tinh tế, phù hợp nếu đã biết size.";
  }

  if (category.includes("bong tai") || category.includes("khuyen tai")) {
    return "Mẫu bông tai xinh xắn, dễ đeo và khá dễ tặng.";
  }

  return "Mẫu trang sức thanh lịch, phù hợp đeo hằng ngày.";
}

/* =========================
   EXTRACT CONTEXT
========================= */
export function extractShoppingContext(message = "") {
  const styles = detectStyleKeywords(message);
  const refineIntent = detectRefineIntent(message);

  return {
    categoryKeyword: detectCategoryKeyword(message),
    budget: parseBudget(message),
    priceIntent: detectPriceIntent(message),
    explicitPriceRange: parsePriceRange(message),
    giftIntent: detectGiftIntent(message),
    styles,
    trendIntent: detectTrendIntent(message),
    hotIntent: detectHotIntent(message),
    newArrivalIntent: detectNewArrivalIntent(message),
    decisionIntent: detectDecisionIntent(message),
    refineIntent,
    styleProfile: buildStyleProfile(message, styles, refineIntent),
  };
}

/* =========================
   MERGE CONTEXT
========================= */
export function mergeShoppingContext(previousContext = {}, currentContext = {}) {
  const previousStyles = previousContext.styles || [];
  const currentStyles = currentContext.styles || [];
  let mergedStyles = Array.from(new Set([...previousStyles, ...currentStyles]));

  const previousGift = previousContext.giftIntent || {};
  const currentGift = currentContext.giftIntent || {};
  const currentRefine = currentContext.refineIntent || {};

  const merged = {
    categoryKeyword:
      currentContext.categoryKeyword || previousContext.categoryKeyword || null,

    budget:
      currentContext.budget ?? previousContext.budget ?? null,

    priceIntent:
      currentContext.priceIntent || previousContext.priceIntent || "approx",

    explicitPriceRange:
      currentContext.explicitPriceRange ||
      previousContext.explicitPriceRange ||
      null,

    giftIntent: {
      isGift: Boolean(currentGift.isGift || previousGift.isGift),
      recipient: currentGift.recipient || previousGift.recipient || null,
      occasion: currentGift.occasion || previousGift.occasion || null,
    },

    styles: mergedStyles,

    trendIntent:
      currentContext.trendIntent || previousContext.trendIntent || false,

    hotIntent: currentContext.hotIntent || false,
    newArrivalIntent: currentContext.newArrivalIntent || false,
    decisionIntent: currentContext.decisionIntent || false,

    refineIntent: {
      softer: Boolean(currentRefine.softer),
      moreElegant: Boolean(currentRefine.moreElegant),
      simpler: Boolean(currentRefine.simpler),
      cheaper: Boolean(currentRefine.cheaper),
      moreExpensive: Boolean(currentRefine.moreExpensive),
    },
  };

  if (merged.refineIntent.softer) {
    merged.styles = Array.from(
      new Set(
        merged.styles
          .filter((s) => s !== "sang" && s !== "thanh lịch")
          .concat(["nhẹ nhàng"])
      )
    );
  }

  if (merged.refineIntent.moreElegant) {
    merged.styles = Array.from(
      new Set(
        merged.styles
          .filter(
            (s) =>
              s !== "tối giản" &&
              s !== "đơn giản" &&
              s !== "nhẹ nhàng" &&
              s !== "nữ tính"
          )
          .concat(["sang", "thanh lịch"])
      )
    );
  }

  if (merged.refineIntent.simpler) {
    merged.styles = Array.from(
      new Set(
        merged.styles
          .filter((s) => s !== "sang")
          .concat(["tối giản", "đơn giản"])
      )
    );
  }

  if (merged.refineIntent.cheaper && merged.budget) {
    merged.budget = Math.floor(merged.budget * 0.85);
  }

  if (merged.refineIntent.moreExpensive && merged.budget) {
    merged.budget = Math.floor(merged.budget * 1.15);
  }

  if (merged.explicitPriceRange) {
    merged.priceIntent = "range";
  }

  merged.styleProfile = buildStyleProfile("", merged.styles, merged.refineIntent);

  return merged;
}

/* =========================
   SEARCH HELPERS
========================= */
 function baseProductQuery() {
  return supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("trang_thai_hien_thi", true)
    .eq("is_available", true);
}

function applyKeywordSearch(query, text = "") {
  const clean = normalizeText(text);
  if (!clean || clean.length < 2) return query;

  const raw = clean
    .split(" ")
    .filter(Boolean)
    .slice(0, 5);

  if (!raw.length) return query;

  const orParts = raw.flatMap((token) => [
    `ten_san_pham.ilike.%${token}%`,
    `mo_ta_san_pham.ilike.%${token}%`,
    `ten_danh_muc_tam.ilike.%${token}%`,
  ]);

  return query.or(orParts.join(","));
}

/* =========================
   SEARCH PRODUCTS
========================= */
export async function searchProducts(message = "", forcedContext = null) {
  const text = normalizeText(message);
  const shoppingContext = forcedContext || extractShoppingContext(message);

  const categoryKeyword = shoppingContext.categoryKeyword;
  const budget = shoppingContext.budget;
  const priceIntent = shoppingContext.priceIntent;
  const explicitPriceRange = shoppingContext.explicitPriceRange;
  const priceRange = buildPriceRange(budget, priceIntent, explicitPriceRange);

  let categoryIds = [];
  if (categoryKeyword) {
    categoryIds = await getCategoryIds(categoryKeyword);
  }

  let query =  baseProductQuery();

  if (priceRange?.min !== null && priceRange?.min !== undefined) {
    query = query.gte("gia_ban", priceRange.min);
  }

  if (priceRange?.max !== null && priceRange?.max !== undefined) {
    query = query.lte("gia_ban", priceRange.max);
  }

  if (categoryIds.length) {
    query = query.in("ma_danh_muc", categoryIds);
  }

  if (includesPhrase(text, ["sale", "giam gia"])) {
    query = query.eq("is_on_sale", true);
  }

  if (includesPhrase(text, ["con hang", "san hang"])) {
    query = query.gt("so_luong_ton", 0);
  }

  if (shoppingContext.hotIntent) {
    query = query
      .order("is_bestseller", { ascending: false })
      .order("so_luong_da_ban", { ascending: false, nullsFirst: false })
      .order("so_luot_yeu_thich", { ascending: false, nullsFirst: false })
      .order("so_luong_ton", { ascending: false, nullsFirst: false })
      .order("ngay_tao", { ascending: false })
      .limit(24);
  } else if (shoppingContext.newArrivalIntent) {
    query = query
      .order("ngay_tao", { ascending: false })
      .order("so_luong_ton", { ascending: false, nullsFirst: false })
      .order("is_bestseller", { ascending: false })
      .limit(24);
  } else if (shoppingContext.trendIntent) {
    query = query
      .order("is_bestseller", { ascending: false })
      .order("so_luong_da_ban", { ascending: false, nullsFirst: false })
      .order("so_luot_yeu_thich", { ascending: false, nullsFirst: false })
      .order("ngay_tao", { ascending: false })
      .limit(24);
  } else {
    query = query
      .order("is_bestseller", { ascending: false })
      .order("so_luong_da_ban", { ascending: false, nullsFirst: false })
      .order("so_luot_yeu_thich", { ascending: false, nullsFirst: false })
      .order("ngay_tao", { ascending: false })
      .limit(24);
  }

 let { data, error } = await query;
if (error) throw error;

// fallback 1: nếu có category mà không ra, thử nới theo category trước
if ((!data || data.length === 0) && categoryKeyword) {
  const terms = getCategoryFallbackTerms(categoryKeyword);

  let categoryFallback = baseProductQuery();

  const orParts = terms.flatMap((term) => [
    `ten_danh_muc_tam.ilike.%${term}%`,
    `ten_san_pham.ilike.%${term}%`,
    `mo_ta_san_pham.ilike.%${term}%`,
  ]);

  categoryFallback = categoryFallback
    .or(orParts.join(","))
    .order("is_bestseller", { ascending: false })
    .order("so_luong_da_ban", { ascending: false, nullsFirst: false })
    .order("so_luot_yeu_thich", { ascending: false, nullsFirst: false })
    .limit(24);

  const categoryFallbackRes = await categoryFallback;
  if (categoryFallbackRes.error) throw categoryFallbackRes.error;
  data = categoryFallbackRes.data || [];
}

// fallback 2: nếu vẫn không ra thì mới fallback theo text chung
if ((!data || data.length === 0) && text) {
  let fallback = baseProductQuery();
  fallback = applyKeywordSearch(fallback, text).limit(24);

  const fallbackRes = await fallback;
  if (fallbackRes.error) throw fallbackRes.error;
  data = fallbackRes.data || [];
}

  if ((!data || data.length === 0) && shoppingContext.giftIntent?.isGift) {
    const giftFallback = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("trang_thai_hien_thi", true)
      .eq("is_available", true)
      .or(
        "ten_danh_muc_tam.ilike.%dây chuyền%,ten_danh_muc_tam.ilike.%lắc%,ten_danh_muc_tam.ilike.%bông tai%,ten_danh_muc_tam.ilike.%khuyên tai%"
      )
      .limit(24);

    if (giftFallback.error) throw giftFallback.error;
    data = giftFallback.data || [];
  }

  if ((!data || data.length === 0) && shoppingContext.hotIntent) {
    const hotFallback = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("trang_thai_hien_thi", true)
      .eq("is_available", true)
      .order("so_luong_da_ban", { ascending: false, nullsFirst: false })
      .order("so_luot_yeu_thich", { ascending: false, nullsFirst: false })
      .order("so_luong_ton", { ascending: false, nullsFirst: false })
      .limit(24);

    if (hotFallback.error) throw hotFallback.error;
    data = hotFallback.data || [];
  }

  if ((!data || data.length === 0) && shoppingContext.newArrivalIntent) {
    const newFallback = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("trang_thai_hien_thi", true)
      .eq("is_available", true)
      .order("ngay_tao", { ascending: false })
      .order("so_luong_ton", { ascending: false, nullsFirst: false })
      .limit(24);

    if (newFallback.error) throw newFallback.error;
    data = newFallback.data || [];
  }

  if (data?.length && categoryKeyword) {
  const strictCategoryMatches = data.filter((p) =>
    matchesCategoryStrict(p, categoryKeyword)
  );

  if (strictCategoryMatches.length >= 1) {
    data = strictCategoryMatches;
  }
}

if (data?.length === 1 && categoryKeyword) {
  let relaxedCategoryQuery = baseProductQuery();

  const terms = getCategoryFallbackTerms(categoryKeyword);
  const orParts = terms.flatMap((term) => [
    `ten_danh_muc_tam.ilike.%${term}%`,
    `ten_san_pham.ilike.%${term}%`,
    `mo_ta_san_pham.ilike.%${term}%`,
  ]);

  relaxedCategoryQuery = relaxedCategoryQuery
    .or(orParts.join(","))
    .order("is_bestseller", { ascending: false })
    .order("so_luong_da_ban", { ascending: false, nullsFirst: false })
    .order("so_luot_yeu_thich", { ascending: false, nullsFirst: false })
    .limit(12);

  const relaxedRes = await relaxedCategoryQuery;
  if (relaxedRes.error) throw relaxedRes.error;

  const moreMatches = (relaxedRes.data || []).filter((p) =>
    matchesCategoryStrict(p, categoryKeyword)
  );

  if (moreMatches.length > 1) {
    data = moreMatches;
  }
}

  const ids = (data || []).map((p) => p.ma_san_pham);
  const imageMap = await getImages(ids);

  return (data || []).map((p) => ({
    ma_san_pham: p.ma_san_pham,
    sku: p.sku,
    ten_san_pham: p.ten_san_pham,
    mo_ta_san_pham: p.mo_ta_san_pham,
    mo_ta_ngan: buildShortDescription(p),
    gia_ban: p.gia_ban,
    gia_goc: p.gia_goc,
    phan_tram_giam: p.phan_tram_giam,
    so_luong_ton: p.so_luong_ton,
    so_luong_da_ban: p.so_luong_da_ban,
    so_luot_yeu_thich: p.so_luot_yeu_thich,
    so_luot_binh_luan: p.so_luot_binh_luan,
    diem_danh_gia_tb: p.diem_danh_gia_tb,
    so_luot_danh_gia: p.so_luot_danh_gia,
    is_bestseller: p.is_bestseller,
    is_on_sale: p.is_on_sale,
    ma_danh_muc: p.ma_danh_muc,
    ten_danh_muc_tam: p.ten_danh_muc_tam,
    ngay_tao: p.ngay_tao,
    style_tags: p.style_tags || [],
    recipient_tags: p.recipient_tags || [],
    use_case_tags: p.use_case_tags || [],
    motif_tags: p.motif_tags || [],
    material_tags: p.material_tags || [],
    gift_score: p.gift_score || 0,
    priority_sell_score: p.priority_sell_score || 0,
    hinh_anh: imageMap[p.ma_san_pham] || p.primary_image || null,
  }));
}

/* =========================
   RECOMMEND PRODUCTS
========================= */
export function recommendProducts(products = [], shoppingContext = {}) {
  const {
    budget,
    giftIntent,
    categoryKeyword,
    trendIntent,
    hotIntent,
    newArrivalIntent,
    decisionIntent,
    refineIntent,
    styleProfile,
    priceIntent,
    explicitPriceRange,
  } = shoppingContext;

  const profile =
    styleProfile ||
    buildStyleProfile("", shoppingContext.styles || [], refineIntent);

  const W = getRankingPreset(shoppingContext);

  function getFreshnessScore(dateValue) {
    if (!dateValue) return 0;

    const createdAt = new Date(dateValue).getTime();
    if (!createdAt || Number.isNaN(createdAt)) return 0;

    const now = Date.now();
    const daysOld = (now - createdAt) / (1000 * 60 * 60 * 24);

    if (daysOld <= 7) return 1;
    if (daysOld <= 15) return 0.9;
    if (daysOld <= 30) return 0.75;
    if (daysOld <= 60) return 0.55;
    if (daysOld <= 120) return 0.3;
    return 0.1;
  }

  function getBudgetFitScore(price, targetBudget) {
    const p = safeNumber(price, 0);
    const b = safeNumber(targetBudget, 0);

    if (!p || !b) return 0;

    const diffRatio = Math.abs(p - b) / b;

    if (diffRatio <= 0.03) return 1;
    if (diffRatio <= 0.07) return 0.9;
    if (diffRatio <= 0.12) return 0.75;
    if (diffRatio <= 0.2) return 0.55;
    if (diffRatio <= 0.35) return 0.3;
    return 0.1;
  }

  function getPriceIntentAdjustment(price) {
    const p = safeNumber(price, 0);
    const b = safeNumber(budget, 0);
    if (!p || !b) return 0;

    if (explicitPriceRange?.min != null && explicitPriceRange?.max != null) {
      if (p >= explicitPriceRange.min && p <= explicitPriceRange.max) return 10;
      return -10;
    }

    if (priceIntent === "max") {
      if (p <= b) return 8;
      return W.base.budgetOverPenalty;
    }

    if (priceIntent === "min") {
      if (p >= b) return 6;
      return -8;
    }

    return 0;
  }

  function getStockScore(stock) {
    const s = safeNumber(stock, 0);

    if (s >= 50) return 1;
    if (s >= 30) return 0.85;
    if (s >= 15) return 0.65;
    if (s >= 5) return 0.4;
    if (s > 0) return 0.2;
    return -1;
  }

  const scored = products.map((product) => {
    let score = 0;

    const category = normalizeText(product.ten_danh_muc_tam || "");
    const name = normalizeText(product.ten_san_pham || "");
    const desc = normalizeText(product.mo_ta_san_pham || "");
    const shortDesc = normalizeText(product.mo_ta_ngan || "");
    const text = `${name} ${desc} ${category} ${shortDesc}`;

    const price = safeNumber(product.gia_ban, 0);
    const stock = safeNumber(product.so_luong_ton, 0);
    const sold = safeNumber(product.so_luong_da_ban, 0);
    const liked = safeNumber(product.so_luot_yeu_thich, 0);
    const ratingAvg = safeNumber(product.diem_danh_gia_tb, 0);
    const ratingCount = safeNumber(product.so_luot_danh_gia, 0);

    const styleTags = product.style_tags || [];
    const recipientTags = product.recipient_tags || [];
    const useCaseTags = product.use_case_tags || [];
    const motifTags = product.motif_tags || [];
    const materialTags = product.material_tags || [];

    const giftScore = safeNumber(product.gift_score, 0);
    const prioritySellScore = safeNumber(product.priority_sell_score, 0);

    const budgetFit = getBudgetFitScore(price, budget);
    const stockScore = getStockScore(stock);
    const freshnessScore = getFreshnessScore(product.ngay_tao);

    const soldNorm = normalizeScore(sold, 500);
    const likedNorm = normalizeScore(liked, 3000);
    const ratingCountNorm = normalizeScore(ratingCount, 1000);
    const giftNorm = normalizeScore(giftScore, 100);
    const priorityNorm = normalizeScore(prioritySellScore, 100);

    const isElegant =
      styleTags.includes("sang") ||
      styleTags.includes("thanh_lịch") ||
      includesAny(materialTags, ["moonstone", "cz", "đá_hồng"]);

    const isDailyWear =
      useCaseTags.includes("đeo_hằng_ngày") ||
      useCaseTags.includes("đi_làm") ||
      styleTags.includes("dễ_đeo");
    
    const hasMinimalSignal =
  styleTags.includes("tối_giản") ||
  styleTags.includes("dễ_đeo") ||
  includesAny(motifTags, ["vòng_tròn"]) ||
  /basic|tron|simple|mini|vong tron/.test(text);

    // BASE
    if (stockScore < 0) {
      score += W.base.outOfStockPenalty;
    } else {
      score += stockScore * W.base.stockBase;
    }

    if (budget) {
      score += budgetFit * W.base.budgetFit;
      score += getPriceIntentAdjustment(price);
    }

    if (categoryKeyword) {
      const normalizedCategoryKeyword = normalizeText(categoryKeyword);
      if (
        category.includes(normalizedCategoryKeyword) ||
        text.includes(normalizedCategoryKeyword)
      ) {
        score += W.base.categoryMatch;
      } else {
        score += W.base.categoryMismatch;
      }
    }

    score += soldNorm * W.base.sold;
    score += likedNorm * W.base.liked;
    score += ratingCountNorm * W.base.ratingCount;

    if (ratingAvg >= 4.9) score += W.base.ratingHigh;
    else if (ratingAvg >= 4.8) score += W.base.ratingGood;
    else if (ratingAvg >= 4.6) score += W.base.ratingOk;

    if (product.is_bestseller) score += W.base.bestseller;
    if (product.is_on_sale) score += W.base.sale;

    // GIFT
    if (giftIntent?.isGift) {
      score += giftNorm * W.gift.giftScore;

      if (useCaseTags.includes("quà_tặng")) score += W.gift.giftUseCase;

      if (category.includes("day chuyen")) score += W.gift.necklace;
      if (category.includes("lac")) score += W.gift.bracelet;
      if (category.includes("khuyen tai") || category.includes("bong tai")) {
        score += W.gift.earring;
      }
      if (category.includes("nhan")) score += W.gift.ring;

      if (giftIntent?.recipient === "bạn gái" && recipientTags.includes("bạn_gái")) {
        score += W.gift.recipientStrong;
      }
      if (giftIntent?.recipient === "vợ" && recipientTags.includes("vợ")) {
        score += W.gift.recipientStrong;
      }
      if (giftIntent?.recipient === "mẹ" && recipientTags.includes("mẹ")) {
        score += W.gift.recipientStrong;
      }
      if (
        ["em gái", "chị gái", "bạn thân"].includes(giftIntent?.recipient) &&
        (recipientTags.includes("bạn_thân") ||
          recipientTags.includes("bạn_gái"))
      ) {
        score += W.gift.recipientMedium;
      }

      if (includesAny(motifTags, ["tim", "hoa", "bướm", "trăng", "cỏ_4_lá", "nơ"])) {
        score += W.gift.motifGift;
      }

      if (category.includes("nhan") && !text.includes("nhan doi")) {
        score += W.gift.normalRingPenalty;
      }

      if (
        text.includes("tre em") ||
        text.includes("be") ||
        text.includes("chuong")
      ) {
        score += W.gift.badGiftPenalty;
      }

      if (isDailyWear) score += W.gift.dailyWearBonus;
      if (isElegant) score += W.gift.elegantBonus;
    }

    // STYLE PROFILE
    if (profile.soft) {
      if (
        styleTags.includes("nhẹ_nhàng") ||
        styleTags.includes("nữ_tính") ||
        includesAny(motifTags, ["hoa", "bướm", "trăng", "cỏ_4_lá", "nơ", "lá"])
      ) {
        score += W.style.softTag;
      }

      if (/hoa|la|moon|butterfly|tim/.test(text)) {
        score += W.style.softText;
      }
    }

    if (profile.elegant) {
      if (styleTags.includes("sang") || styleTags.includes("thanh_lịch")) {
        score += W.style.elegantTag;
      }

      if (
        includesAny(materialTags, ["moonstone", "cz", "đá_hồng"]) ||
        includesAny(motifTags, ["vòng_tròn"]) ||
        /diamond|oval|premium/.test(text)
      ) {
        score += W.style.elegantMaterial;
      }

      if (includesAny(motifTags, ["bướm", "nơ"]) && !styleTags.includes("sang")) {
        score += W.style.elegantCutePenalty;
      }
    }

    if (profile.simple) {
      if (
        styleTags.includes("tối_giản") ||
        /tron|basic|circle|vong tron/.test(text)
      ) {
        score += W.style.simple;
      }

      if (includesAny(motifTags, ["nơ", "bướm"]) && !styleTags.includes("tối_giản")) {
        score -= 4;
      }
    }

    if (profile.dailyWear) {
  if (isDailyWear) {
    score += W.style.dailyWear;
  }

  if (hasMinimalSignal) {
    score += 8;
  }

  if (includesAny(motifTags, ["nơ", "bướm"]) && !styleTags.includes("dễ_đeo")) {
    score -= 4;
  }

    }

    // REFINE
    if (refineIntent?.softer) {
      if (
        styleTags.includes("nhẹ_nhàng") ||
        styleTags.includes("nữ_tính") ||
        includesAny(motifTags, ["hoa", "bướm", "trăng", "cỏ_4_lá", "nơ"])
      ) {
        score += W.refine.softer;
      }
    }

    if (refineIntent?.moreElegant) {
      if (styleTags.includes("sang") || styleTags.includes("thanh_lịch")) {
        score += W.refine.elegant;
      }

      if (includesAny(motifTags, ["bướm", "nơ"]) && !styleTags.includes("sang")) {
        score += W.refine.elegantCutePenalty;
      }
    }

    if (refineIntent?.simpler) {
      if (styleTags.includes("tối_giản") || styleTags.includes("dễ_đeo")) {
        score += W.refine.simpler;
      }

      if (includesAny(motifTags, ["nơ", "bướm", "tim"]) && !styleTags.includes("tối_giản")) {
        score -= 5;
      }
    }

    if (refineIntent?.cheaper && budget && price <= budget) {
      score += W.refine.cheaper;
    }

    if (refineIntent?.moreExpensive && budget) {
      if (price >= budget * 0.95 && price <= budget * 1.25) {
        score += W.refine.moreExpensive;
      }
    }

    // TREND
    if (trendIntent) {
      if (product.is_bestseller) score += W.trend.bestseller;
      score += soldNorm * W.trend.sold;
      score += likedNorm * W.trend.liked;
    }

    // HOT
    if (hotIntent) {
      score += soldNorm * W.hot.sold;
      score += likedNorm * W.hot.liked;
      score += ratingCountNorm * W.hot.ratingCount;
      score += stockScore > 0 ? stockScore * W.hot.stock : -20;
      if (product.is_bestseller) score += W.hot.bestseller;
      score += priorityNorm * W.hot.prioritySell;
    }

    // NEW
    if (newArrivalIntent) {
      score += freshnessScore * W.newArrival.freshness;
      score += stockScore > 0 ? stockScore * W.newArrival.stock : -20;
      score += priorityNorm * W.newArrival.prioritySell;
      if (product.is_bestseller) score += W.newArrival.bestseller;
    }

    // DECISION
    if (decisionIntent) {
      score += giftNorm * W.decision.giftScore;
      score += priorityNorm * W.decision.prioritySell;
      score += budgetFit * W.decision.budgetFit;
      score += stockScore > 0 ? stockScore * W.decision.stock : -20;

      if (product.is_bestseller) score += W.decision.bestseller;
      if (ratingAvg >= 4.8) score += W.decision.rating;
      if (useCaseTags.includes("quà_tặng")) score += W.decision.giftUseCase;
      if (giftIntent?.recipient === "bạn gái" && recipientTags.includes("bạn_gái")) {
        score += W.decision.recipient;
      }
      if (isDailyWear) score += W.decision.dailyWear;
      if (isElegant) score += W.decision.elegant;
    }

    return {
      ...product,
      recommendation_score: Math.round(score * 100) / 100,
    };
  });

  return scored
    .sort((a, b) => b.recommendation_score - a.recommendation_score)
    .slice(0, 8);
}