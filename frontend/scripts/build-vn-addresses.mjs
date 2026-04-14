import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..");
const provincePath = path.join(projectRoot, "src/data/raw/province.json");
const wardPath = path.join(projectRoot, "src/data/raw/ward.json");
const outputPath = path.join(projectRoot, "src/data/vn-addresses.ts");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function normalizeProvinceName(name, type) {
  if (!name) return "";
  return type === "thanh-pho" ? `TP. ${name}` : name;
}

function normalizeWardName(item) {
  if (item?.name_with_type) return item.name_with_type;
  return item?.name || "";
}

function buildDataset() {
  const provinceRaw = readJson(provincePath);
  const wardRaw = readJson(wardPath);

  const provinces = Object.values(provinceRaw)
    .map((province) => ({
      code: province.code,
      name: normalizeProvinceName(province.name, province.type),
      wards: Object.values(wardRaw)
        .filter((ward) => ward.parent_code === province.code)
        .map((ward) => ({
          code: ward.code,
          name: normalizeWardName(ward),
          type: ward.type,
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "vi")),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "vi"));

  return provinces;
}

function writeOutput(data) {
  const content = `export type WardOption = {
  code: string;
  name: string;
  type?: string;
};

export type ProvinceOption = {
  code: string;
  name: string;
  wards: WardOption[];
};

export const VN_ADDRESS_OPTIONS: ProvinceOption[] = ${JSON.stringify(data, null, 2)} as const;
`;

  fs.writeFileSync(outputPath, content, "utf-8");
}

const dataset = buildDataset();
writeOutput(dataset);

console.log(
  `Built vn-addresses.ts with ${dataset.length} provinces/cities and ${dataset.reduce(
    (sum, item) => sum + item.wards.length,
    0
  )} wards.`
);