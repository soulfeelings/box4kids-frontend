const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const url = require("url");
require("dotenv").config({ path: path.join(__dirname, "../.env.development") });

const OPENAPI_URL = `${process.env.REACT_APP_API_URL}/openapi.json`;
const OUTPUT_PATH = path.join(__dirname, "../src/generated/api.json");

const parsedUrl = url.parse(OPENAPI_URL);
const client = parsedUrl.protocol === "https:" ? https : http;

client
  .get(OPENAPI_URL, (res) => {
    if (res.statusCode !== 200) {
      console.error(`❌ Failed to download: ${res.statusCode}`);
      res.resume(); // free up memory
      process.exit(1);
      return;
    }

    let rawData = "";
    res.setEncoding("utf8");
    res.on("data", (chunk) => (rawData += chunk));
    res.on("end", () => {
      try {
        const json = JSON.parse(rawData);
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(json, null, 2));
        console.log("✅ OpenAPI schema downloaded to openapi.json");
      } catch (e) {
        console.error("❌ Failed to parse JSON:", e.message);
        process.exit(1);
      }
    });
  })
  .on("error", (e) => {
    console.error(`❌ Request failed: ${e.message}`);
    process.exit(1);
  });
