import { parseTweeFile } from "./parser";
import { tokenize } from "./tokenizer";
import * as path from "path";
import * as fs from "fs";

// For debbuging purposes
const inputPath = path.join(__dirname, "../example/game.twee");
const outputPath = path.join(__dirname, "../example/tokenizer-log.txt");

// Create write stream and overwrite file each run
const logStream = fs.createWriteStream(outputPath, { flags: "w" });

// Utility logger: tokenizer
function log(...args: any[]) {
  const message = args.join(" ") + "\n";
  logStream.write(message);
}

const passages = parseTweeFile(inputPath);
log(`Parsed ${passages.length} passages.`);

for (const p of passages) {
  log(`\n== ${p.title} ==`);
  log(`\n== ${p.tags} ==`);
  log(`\n== ${p.config} ==`);
  log(`\n== ${p.content} ==`);

  const tokens = tokenize(p.content);
  for (const token of tokens) {
    log(`[${token.type.toUpperCase()}] ${token.value}`);
    if (token.type === "string" && token.unterminated) {
      console.warn("⚠️ Unterminated string detected!");
    }
  }
}

logStream.end(); // Close stream after logging is done
