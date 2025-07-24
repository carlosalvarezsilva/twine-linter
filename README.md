# 🌌 FlowWeaver DevKit v1.0  
**Trace your tales. Debug your destiny.**

FlowWeaver is a retro-inspired development toolkit for inspecting, debugging, and stepping through narrative logic — perfect for interactive story engines, branching dialogues, and Twine-style scripting systems.

Designed with both whimsy and precision, FlowWeaver gives you full control over script flow, variable tracking, and decision trees in your custom narrative engine.

---

## 📦 Features

- 🔍 Step-by-step execution of script passages  
- 🧵 Visual thread tracing and node highlighting  
- 📄 Line-by-line compiler (Twine-like syntax)  
- 🧠 Real-time variable state inspector  
- 💾 Breakpoints, jump-to-node, and history tracking  
- 🎨 Retro-themed UI (optional, customizable)

---

## 🧰 Getting Started

### 🔧 Requirements
- Node.js `>= 16.x`
- A modern browser (for UI interface)
- [Other dependencies or build tools here]

### 📥 Installation

```bash
git clone https://github.com/yourusername/flowweaver-devkit.git
cd flowweaver-devkit
npm install


## Planned architecthure
FlowWeaver DevKit
│
├───Tokenizer / Preprocessor
│   ├───Parse the .twee file into passages.
│   └───Break each passage into Harlowe macros, embedded HTML, CSS, JS.
│
├───Macro Parser (Custom):
│   ├───Validate macro structure, bracket/quote closure.
│   ├───Match (if:), (set:), (link:), (display:), etc.
│   └───Track custom macros like $cs or (twirl:).
│
├───Symbol Table Builder:
│   ├───Track declared and used variables ($product, $npc, etc.).
│   └───Mark undefined or reused variables.
│
├───Passage Validator:
│   └───Check all (display:), ($cs:), ($demo_passage), etc., reference existing passages.
│
├───JS/HTML/CSS Validator:
│   └───Use existing libraries:
│       ├───HTML: parse5
│       ├───JS: Acorn or Esprima
│       └───CSS: stylelint
│
└───Reporter:
    ├───Print linting errors (e.g., line number, passage name, macro error).
    └───Suggest fixes if possible.