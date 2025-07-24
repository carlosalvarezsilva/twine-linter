import * as fs from "fs";

export interface Passage {
  title: string;
  content: string;
  tags: string[];
  config: string[];
  raw: string;
}

/**
 * Parses a .twee file and extracts an array of passages.
 */
export function parseTweeFile(path: string): Passage[] {
  const file = fs.readFileSync(path, "utf-8");
  const lines = file.split(/\r?\n/);
  const passages: Passage[] = [];

  let currentTitle = "";
  let currentTags: string[] = [];
  let currentConfig: string[] = [];
  let buffer: string[] = [];

  for (const line of lines) {
    if (line.startsWith("::")) {
      // Save previous passage
      if (currentTitle) {
        passages.push({
          title: currentTitle.trim(),
          content: buffer.join("\n").trim(),
          tags: currentTags,
          config: currentConfig,
          raw: buffer.join("\n"),
        });
      }

      // New passage
      buffer = [];
      const headerMatch = line.match(/^::\s*([^\[]+?)(?:\s*\[(.*?)\])?\s*$/);
      if (headerMatch) {
        currentTitle = headerMatch[1].trim();
        currentTags = headerMatch[2] ? headerMatch[2].split(" ") : [];
        currentConfig = headerMatch[3] ? headerMatch[3].split(" "): [];
      }
    } else {
      buffer.push(line);
    }
  }

  // Final passage
  if (currentTitle && buffer.length) {
    passages.push({
      title: currentTitle.trim(),
      content: buffer.join("\n").trim(),
      tags: currentTags,
      config: currentConfig,
      raw: buffer.join("\n"),
    });
  }

  return passages;
}
