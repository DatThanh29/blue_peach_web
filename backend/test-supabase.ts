import dotenv from "dotenv";
dotenv.config();

import { supabase } from "./src/lib/supabase";

async function testConnection() {
  console.log("Testing Supabase connection...");
  console.log("URL:", process.env.SUPABASE_URL);
  console.log("Key exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data, error } = await supabase
      .from("products")
      .select("ma_san_pham,sku,ten_san_pham,gia_ban")
      .limit(5);

    if (error) {
      console.error("❌ Error:", error.message);
      console.error("Details:", error);
      process.exit(1);
    }

    console.log("✓ Connection successful!");
    console.log("Found", data?.length || 0, "products:");
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("❌ Exception:", err);
    process.exit(1);
  }
}

testConnection();
