---
name: msr-mcp-new
description: Use when building an MCP server or exposing tools to an LLM - scaffolds a server whose tool output is parsed into typed structures before the model ever sees it, which is the layer that prevents hallucination over raw tool text
---

# Scaffold an MCP server

## Overview

Builds an MCP server on one architectural commitment: **the model never sees raw tool
output.**

Every tool parses its underlying command or API response into a typed structure first.
The model receives structured JSON with known fields, not a wall of text it has to
interpret. That parsing layer is where hallucination is prevented — not in the prompt.

This is the DeepSIFT pattern: 155 typed forensic tools, 4/4 must-identify findings with
zero hallucinations against a 0/4 baseline. The difference was the parsers.

## When to Use

- Building a new MCP server.
- Wrapping a CLI, API, or database for agent use.
- An existing agent hallucinates over tool output — the fix is usually here, not in the
  prompt.

## Process

### 1. Get the current SDK docs

Use `context7` for the MCP SDK. The protocol moves; do not write from memory.

### 2. Choose the language

Python if the domain logic is Python, or the wrapped tools are. TypeScript if the
consumer is a Node toolchain. Match the surrounding project — do not introduce a second
runtime for one server.

### 3. Define the tools before writing code

For each tool, write down:

| Field | Requirement |
|---|---|
| name | verb-noun, unambiguous |
| description | when to use it **and when not to** |
| input schema | typed, with every constraint expressed |
| output schema | **typed** — this is the point |
| failure mode | what it returns when the underlying thing fails |

A tool whose output schema is `{ "result": "string" }` has skipped the entire exercise.

### 4. Build the parsing layer first

For each tool, in this order:

1. Call the underlying command or API.
2. **Parse the response into the typed output structure.** Handle the failure shape
   explicitly.
3. Return the typed structure.

Never return raw stdout, raw HTML, or an unparsed API body. If the underlying output is
genuinely unstructured, extract the fields you need and return those, plus a
`raw_excerpt` capped at a documented length — not the whole thing.

Where the source supports it, include provenance: which file, line, record, or URL the
value came from. Provenance is what makes a downstream claim checkable.

### 5. Handle failure as data

A failed tool call returns a typed failure, not an exception string:

```json
{ "ok": false, "error": "timeout", "detail": "no response in 30s", "partial": null }
```

An agent can reason about that. It cannot reason about a stack trace.

### 6. Write the manifest and test

- Declare the server in `.mcp.json`.
- Confirm `tools/list` returns every declared tool with its schema.
- Call each tool once and confirm the response validates against its output schema.

### 7. Report

The tool table, the `tools/list` output, and one example typed response per tool.

## Rationalizations

| Thought | Reality |
|---|---|
| "The model can parse the output itself" | That parsing is exactly where it invents things. That is the whole failure mode. |
| "Returning raw text is more flexible" | It is more flexible and less reliable. This skill exists to trade the first for the second. |
| "I'll add types later once it works" | The types are what makes it work. Later means never. |
| "Exceptions are fine, the agent will see the message" | It sees a stack trace and guesses. Return a typed failure. |
| "I know the MCP SDK" | The protocol changes. Check `context7`. |
| "One generic run_command tool is simpler" | It is, and it moves all the parsing into the model, which is the thing you are trying to avoid. Typed tools, one per operation. |

## Red Flags

- A tool returning `string` where a structure belongs.
- Raw stdout, raw HTML, or an unparsed body reaching the response.
- A generic `run_command` or `execute` escape-hatch tool.
- Exceptions propagating instead of typed failures.
- Writing SDK code without checking current docs.
- No provenance on values that have a source.

## Verification

1. `tools/list` responds and returns every declared tool. Paste the output.
2. Every tool has a typed output schema — no bare `string` results.
3. Each tool was called at least once, and the response validates against its schema.
   Show one response per tool.
4. A deliberate failure was triggered on at least one tool, and it returned a typed
   failure rather than raising.
5. `grep` the source for raw-output returns; confirm none remain.
