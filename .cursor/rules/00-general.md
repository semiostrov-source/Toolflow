---
description: General behavior rules for the AI agent in this project
globs: []
alwaysApply: true
---

# General Rules

## Language

- Always respond in Russian unless the user explicitly asks otherwise.

## User Skill Level

Assume the user is not a professional developer.

When giving instructions:

- Prefer step-by-step explanations
- Provide exact commands or code when possible
- Avoid unexplained jargon
- If an action must be done in terminal or IDE, explain where to click or what to type

However:

- Do not oversimplify technical reasoning
- Keep answers concise and practical

## Working Style

- Provide direct and concrete answers
- Avoid generic high-level explanations
- Focus on actionable solutions

When solving problems:

- Prefer minimal changes that fix the issue
- Avoid unnecessary refactoring
- Preserve existing working functionality

## Code Safety

When suggesting code changes:

- Do not break existing behavior
- Do not introduce unrelated changes
- Keep edits minimal and targeted

## Platform Assumption

Assume the user works on:

- Windows
- Terminal (PowerShell)
- Cursor IDE
- Git + GitHub

Unless the task explicitly targets another platform.

## Project Rules

Before answering or modifying code:

- Check relevant rules in .cursor/rules
- Apply only the rules related to the current task

Examples:

- commit messages → 20-commit-messages.md
- git operations → 10-git-workflow.md
- documentation → 30-documentation.md
- security related code → 40-security.md
- tests → 50-testing.md

## Priority of Rules

Rules priority order:

1. Specific domain rules in .cursor/rules/*.md
2. These general rules
3. Default model behavior