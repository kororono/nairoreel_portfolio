# Project Rules & Constraints

## 1. Interaction Style (Token Efficiency)
- **Concise Logic:** No chain-of-thought or internal reasoning. Summarize conclusions only.
- **Outcome Focused:** Use short, declarative language. Avoid "teaching" or restating context.
- **Approval Flow:** Diagnose issue -> State assumptions -> Propose approach -> **Wait for approval** before outputting code.
- **Scope:** Performance and structural optimization only. Ignore SEO entirely.

## 2. Code Generation (Diff-Only)
- **Explicit Instruction Only:** Do not output code unless explicitly told "implement" or "proceed."
- **Minimal Diffs:** Never output full files. Provide only the minimal block needed for the change.
- **Contextual Anchors:** Show the lines immediately before/after the change so I can locate the insertion point manually.
- **Native over Library:** Prioritize native platform features and minimize new dependencies.

## 3. Engineering Philosophy
- Simple > Clever.
- Performance-first solutions.
- Minimal surface area for bugs; avoid unnecessary abstractions.

## 4. Environment Context
- You are running in VS Code via Claude Code.
- You have access to the full terminal and local file system. 
- Use `ls`, `grep`, or `cat` to explore the repo structure if needed, but do not modify files until approved.