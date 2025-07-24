export type Token =
  | { type: "paren"; value: "(" | ")" }
  | { type: "bracket"; value: "[" | "]" | "[=" | "=]" | "{=" | "=}" }
  | { type: "brace"; value: "{" | "}" }
  | { type: "colon"; value: ":" }
  | { type: "semicolon"; value: ";" }
  | { type: "coma"; value: "," }
  | { type: "macroName"; value: string }
  | { type: "variable"; value: string } // $var o _temp
  | { type: "string"; value: string; unterminated?: boolean }
  | { type: "number"; value: string }
  | { type: "operator"; value: string } // + - * / >= ...
  | { type: "emoji"; value: string }
  | { type: "text"; value: string };

const smartQuotePairs = [
  ['"', '"'],
  ['“', '”'],
  ['“', '"'],
  ['"', '”']
];

function isSmartQuote(ch: string): boolean {
  return ['"', '“', '”'].includes(ch);
}

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  const isLetter = (ch: string) => /[a-zA-Z\-]/.test(ch);
  const isDigit = (ch: string) => /[0-9]/.test(ch);
  const isEmoji = (ch: string) => /\p{Emoji}/u.test(ch);
  const isWhitespace = (ch: string) => /\s/.test(ch);
  const isOperatorChar = (ch: string) => /[+\-*/=<>&!%|]/.test(ch); 
  const isWordChar = (ch: string) => /[a-zA-Z0-9_\-]/.test(ch);

  while (i < input.length) {
    const current = input[i];
    const next = input[i + 1] ?? "";
    const nextPlus = input[i + 2] ?? "";
    const isPossessive = tokens.length > 0 &&
                    tokens[tokens.length - 1].type === "variable" &&
                    isLetter(next); // next is a letter
    const isQuestionVar = tokens.length > 0 &&
                    tokens[tokens.length - 1].type === "colon" &&
                    isLetter(next); // next is a letter
    const isContraction = (
                    i > 0 &&
                    /[a-zA-Z0-9]/.test(input[i - 1]) &&
                    /[a-zA-Z0-9]/.test(input[i + 1] || "")
                  );

    // --- Special Brackets ---
    if ((current === "[" || current === "{") && next === "=") {
      tokens.push({ type: "bracket", value: current + "=" as "[=" | "{=" });
      i += 2;
      continue;
    } else if ((current === "=") && (next === "]" || next === "}")) {
      tokens.push({ type: "bracket", value: "=" + next as "=]" | "=}" });
      i += 2;
      continue;
    // --- Parenthesis and normal brackets ---
    } else if (current === "(" || current === ")") {
      tokens.push({ type: "paren", value: current });
      i++;
      continue;
    } else if (current === "[" || current === "]") {
      tokens.push({ type: "bracket", value: current });
      i++;
      continue;
    } else if (current === "{" || current === "}") {
      tokens.push({ type: "brace", value: current });
      i++;
      continue;
    } else if (current === ":") {
      tokens.push({ type: "colon", value: ":" });
      i++;
      continue;
    } else if (current === ";") {
      tokens.push({ type: "semicolon", value: ";" });
      i++;
      continue;
    } else if (current === ",") {
      tokens.push({ type: "coma", value: "," });
      i++;
      continue;
    // Handle possible prefix like "..."
    } else if (current === ".") {
      if (next === "." && nextPlus === "."){
        tokens.push({ type: "text", value: "..." });
        i += 3;
      } else {
        tokens.push({ type: "text", value: "." });
        i++;
      }
    } else if (current === "$" || current === "_" || (current === "?" && isQuestionVar)) {
      let value = current;
      i++;
      while (isLetter(input[i]) || isDigit(input[i]) || input[i] === "_" || input[i] === "-") {
        value += input[i++];
      }
      tokens.push({ type: "variable", value });
      continue;
    // --- Regular single-quoted string ---
    } else if (current === "'") {
      if(isPossessive || isContraction) {
        tokens.push({ type: "text", value: "'" });
        i++;
        continue;
      }

      let value = "";
      i++; // Skip opening quote
      while (i < input.length && input[i] !== "'") {
        value += input[i++];
      }

      const unterminated = i >= input.length;
      if (input[i] === "'") i++; // Skip closing quote
      tokens.push({ type: "string", value, unterminated });
      continue;
    // --- Strings enclosed in double quotes ---
    } else if (isSmartQuote(current)) {
      const open = current;
      const closingCandidates = smartQuotePairs
        .filter(([start]) => start === open)
        .map(([, end]) => end);

      let value = "";
      i++; // Skip opening quote

      while (i < input.length && !closingCandidates.includes(input[i])) {
        value += input[i++];
      }

      const unterminated = i >= input.length;
      if (!unterminated) i++; // Skip closing quote

      tokens.push({ type: "string", value, unterminated });
      continue;
    // --- Numbers ---
    } else if (isDigit(current)) {
      let value = "";
      while (i < input.length && isDigit(input[i])) {
        value += input[i++];
      }
      tokens.push({ type: "number", value });
      continue;
    // --- Emojis ---
    } else if (isEmoji(current)) {
      tokens.push({ type: "emoji", value: current });
      i++;
      continue;
    // --- Operators: >=, <=, !=, etc. ---
    } else if (isOperatorChar(current)) {
      let value = current;
      if (next === "=") {
        value += next;
        i += 2;
      } else {
        i++;
      }
      tokens.push({ type: "operator", value });
      continue;
    // --- MacroNames or Text ---
    } else if (isWordChar(current)) {
      let value = "";
      while (isWordChar(input[i])) {
        value += input[i++];
      }
      // Lookahead for colon → macroName
      if (current === ":") {
        i++;
        tokens.push({ type: "macroName", value });
        continue;
      } else {
        tokens.push({ type: "text", value });
      }
    // --- Whitespace ---
    } else if (isWhitespace(current)) {
      i++; // skip
    // --- Unknown character fallback ---
    }else {
      let value = "";
      while (i < input.length && !isWhitespace(current) && !"()[]:\"".includes(current)) {
        value += input[i++];
      }
      tokens.push({ type: "text", value });
    }
  }

  return tokens;
}