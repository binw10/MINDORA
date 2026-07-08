# Production Repository Maintenance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the MINDORA website repository into a long-term maintainable production repository without changing business functionality.

**Architecture:** Keep the existing Next.js application intact. Add repository metadata, operational scripts, and documentation around the current EC2/systemd/Apache deployment model.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, GSAP, npm, systemd, Apache, GitHub Actions.

## Global Constraints

- Do not change business functionality.
- Do not remove existing functionality.
- Focus on engineering quality.
- Commit everything into logical commits.

---

### Task 1: Repository Standards

**Files:** `.editorconfig`, `.gitattributes`, `.gitignore`, `.node-version`, `package.json`

- [x] Add editor and line-ending standards.
- [x] Add binary/text Git attributes.
- [x] Tighten ignore rules for secrets, logs, and local files.
- [x] Document Node/npm expectations through package metadata.

### Task 2: Operations Scripts

**Files:** `scripts/*.sh`, `package.json`

- [x] Add health check script.
- [x] Add preflight script.
- [x] Add backup script.
- [x] Add local emergency deploy helper.
- [x] Add lightweight production audit script.

### Task 3: Documentation Set

**Files:** `README.md`, `MAINTAINER.md`, `CONTRIBUTING.md`, `docs/*.md`

- [x] Replace scaffold README.
- [x] Expand maintainer workflow.
- [x] Add contributing, architecture, directory, environment, operations, release, and disaster recovery docs.

### Task 4: Verification

**Commands:**

```bash
npm ci
npm run lint
npm run typecheck
npm run build
bash -n scripts/*.sh
```

- [ ] Run verification after all edits.
- [ ] Fix any failures without changing business behavior.
- [ ] Commit in logical groups.
