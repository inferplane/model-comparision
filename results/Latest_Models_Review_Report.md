# Content Review Report

## Review Metadata

| Field | Value |
|-------|-------|
| Review Type | HTML application: latest-model preset, exclusion explanations and precise performance floor |
| Review Date | 2026-10-11, UTC |
| Iteration | #1, separate final-source review |
| Reviewed Source | Current working tree based on `64c16244c5a0992d4f2eda9debc534020fc41bcf`, including the corrected full preset explanation |
| Current Dataset | `public/data/models.json`, generated `2026-10-11T07:09:46.379Z` |
| Current Score | **98.5 / 100** |
| Verdict | **PASS** |

The installed content-review-agent rubric and Codex workflow were applied in a new separate pass. The reviewer inspected current source, dataset provenance, meaningful unit tests and actual browser behavior. Application code, git state and the legitimate prior video deliverable were not changed.

## Quality Gate Result

### Verdict: PASS

| Independent Band | Observed | PASS Requirement | Result |
|------------------|----------|------------------|--------|
| Score | 98.5 / 100 | At least 85 / 100 | PASS |
| Critical count | 0 | 0 | PASS |
| Warning count | 1 | No more than 3 | PASS |

The worst of the three independent bands is PASS. The mandatory pre-deployment content gate is satisfied.

| Category | Critical | Warning | Info |
|----------|----------|---------|------|
| Accessibility | 0 | 1 | 0 |
| Resolved preset explanation | 0 | 0 | 1 |
| Release-stage data refresh | 0 | 0 | 1 |
| Other categories | 0 | 0 | 0 |
| **Total** | **0** | **1** | **2** |

## Rubric Score

The rubric deducts one quarter of a category's maximum for each noncritical defect, sums the category deductions, then rounds once to the nearest 0.5 with exact midpoints rounded up. One Accessibility defect deducts `5 / 4 = 1.25`, rounded up to **1.5**. No other counted defect remains in the reviewed final source.

| Item | Maximum | Awarded | Evidence |
|------|--------:|--------:|----------|
| Layout | 8 | 8 | Desktop/mobile preset, controls, diagnostic disclosure and candidate/table layout |
| Terminology | 8 | 8 | Verified launch date, UTC 60-day range, inference scope and exclusion reasons |
| No Hallucination | 12 | 12 | Existing actual API measurements preserved; no fabricated score or forced eligibility |
| Language Consistency | 8 | 8 | Clear Korean explanations with established product/metric terms |
| No Sensitive Data | 12 | 12 | Source pattern scan and screenshot inspection found no sensitive data |
| Content-Type Quality | 2 | 2 | Working preset, filters, share state and actionable diagnostic UI |
| Icon Usage & Appropriateness | 5 | 5 | Existing local inline icons; contextual preset/information controls |
| Renders correctly | 5 | 5 | Independent pass: zero console/runtime/HTTP errors |
| Interactions work | 5 | 5 | Six-model Seoul check, exclusion actions, exact threshold, shared reload and mobile widths |
| Readability | 5 | 5 | Explicit preset policy and grouped explanations; typography counted once below |
| Accessibility | 5 | 3.5 | Warning #1 |
| Structural Completeness | 5 | 5 | Existing cost-performance flow retained; recent filter and diagnostic disclosure added |
| Data Accuracy & External References | 5 | 5 | Card launch dates, actual benchmark variants, supported scope and mathematical threshold preserved |
| Legal Compliance | 5 | 5 | No infringement observed; third-party application does not require AWS-owned copyright |
| Message Clarity | 5 | 5 | Final label explicitly identifies mixed pricing and all filters reset by the preset |
| Duplication/Gaps | 5 | 5 | Generic date/scope logic; no requested model silently hardcoded or substituted |
| **Total** | **100** | **98.5** | |

## Critical Issues (Must Fix)

None.

## Warning Issues (Should Fix)

### Issue #1: Small supporting labels remain below the plugin typography target

| Field | Value |
|-------|-------|
| Severity | Warning — nonblocking |
| Category | Accessibility |
| Location | `src/styles.css:270`, `src/styles.css:271`, `src/styles.css:335`, `src/styles.css:341` |
| Original | Preset/recent-filter/disclosure labels use `font-size: 12px`; diagnostic model links use `font-size: 11px`. |
| Problem | Supporting labels are smaller than the plugin rubric's 14pt target and can be harder to read on mobile. Main numerical content remains larger and the new labels wrap without page overflow. The 14pt target is a plugin target, not a universal WCAG minimum. |
| Action | Increase important explanatory labels and diagnostic links where practical, retaining mobile wrapping. |
| Expected | Readable explanations at 320px and 390px without overflow. |
| Points | **-1.5** from Accessibility after required rounding. |

## Resolved Review Finding

The initial preset label mentioned performance/price resets while `latest()` also cleared provider, query and cache requirements. The producing agent corrected `src/views/chart.ts:209` to:

> 최근 60일 출시 · 종합 지능 · 혼합 단가 · 일반 티어 · 전체 추론 방식 · 제공사·검색·캐시·성능·단가 조건 해제

The final explanation matches actual behavior and README documentation. The reviewer independently verified this exact label and zero page overflow at 320px. No final deduction is taken.

## Data and Eligibility Verification

All six requested models already exist in the current dataset with actual API benchmark variants, AWS card launch dates, and confirmed Seoul Global CRIS availability. The UI change exposes them under valid conditions rather than inventing missing data.

| Requested Model | AWS Card Launch Date | API Intelligence Index | Seoul Supported Scope | Current Mixed Standard Price |
|-----------------|----------------------|-----------------------:|-----------------------|-----------------------------:|
| Claude Sonnet 5.5 | September 28, 2026 | 56.0 | Global CRIS | $3.60 / 1M tokens |
| Claude Opus 5.5 | September 22, 2026 | 57.6 | Global CRIS | $7.20 / 1M tokens |
| Claude Haiku 5.5 | October 7, 2026 | 43.4 | Global CRIS | $0.18 / 1M tokens |
| GPT-6 Luna | September 22, 2026 | 38.1 | Global CRIS | $0.18 / 1M tokens |
| GPT-6.1 Sol | September 29, 2026 | 51.8 | Global CRIS | $3.60 / 1M tokens |
| Grok 4.7 | September 28, 2026 | 46.4 | Global CRIS | $2.80 / 1M tokens |

These are current dataset values, not a claim that the pending complete source refresh has already finished. `benchmarkSource` names actual API variants; the six records do not rely on fabricated measurements. Card URLs identify the corresponding official AWS model cards.

`src/value.ts` parses strict ISO dates and full English month dates and checks the resulting UTC calendar date, rejecting invalid normalized dates such as February 31. Eligibility uses only `card.launchDate`. A recent catalogue `firstSeen` cannot convert an older or undated model into a recent launch.

For the review date, the 60 UTC calendar days include **2026-08-13 through 2026-10-11**. August 12 and future October 12 are excluded. Missing/invalid dates are excluded. The implementation is generic and contains no special inclusion rule for the six model names.

The latest preset preserves the selected region, uses Intelligence Index and mixed standard-tier prices, enables all inference modes, clears provider/search/cache/performance/budget requirements and selects descending reference-value order. Each visible price scope still passes existing regional availability checks.

The diagnostic helper uses the same available variants, benchmark validation, prices, cache eligibility, raw performance floor and inclusive budget as the visible table. It presents one actionable primary reason per excluded model: provider, inference, benchmark, price, cache, quality or budget. It does not force a model to appear under a condition it cannot satisfy.

The 90% floor uses **57.6 × 0.9 = 51.84**. The new UI displays **51.84**, while the current GPT-6.1 Sol API score is **51.8**. Its exclusion is therefore correctly explained, rather than suggesting that a rounded 51.8 threshold qualifies it.

## Independent Test and Browser Evidence

The reviewer independently ran:

`node node_modules/vitest/vitest.mjs run src/value.test.ts src/urlstate.test.ts`

**35 tests passed in 2 files**: 17 value/date/exclusion tests and 18 URL-state tests. These include exact UTC bounds, full English/ISO dates, invalid/future/missing dates, rejection of `firstSeen` as release date, scope/budget eligibility, precise quality threshold, and persisted latest state.

The producing agent separately reports final build, all **104 unit tests**, and diff whitespace checks passing. Those full-suite results are producer verification, distinct from the independent targeted pass.

The independent browser pass used the actual local Vite application at `127.0.0.1:5173` with Playwright/Chromium:

| Width | Six Requested Models in Seoul | Filter Reasons/Actions | Exact 51.84 Floor | Shared Latest Reload | Page Overflow |
|------:|-------------------------------|------------------------|-------------------|----------------------|---------------|
| 1440px | PASS | PASS | PASS | PASS | None |
| 390px | PASS | PASS | PASS | PASS | None |
| 320px | PASS | PASS | PASS | PASS | None |

At each width, the reviewer started with a Seoul Sonnet query excluded by inference modes, used the Global CRIS action, reproduced Grok's budget exclusion and a provider exclusion, then deliberately set incompatible benchmark/cost/tier/cache filters before clicking the latest preset.

The preset restored all six requested model IDs with their exact dataset scores and Global CRIS scope. It cleared the actual conflicting filters, preserved Seoul and enabled the recent-launch checkbox. Further tests explained GPT-6.1 Sol's insufficient 90% score and absent Coding Index, exercised the corrective actions, and reloaded a `latest=1` shared URL with all six restored.

The final expanded preset wording was separately checked at 320px after the copy correction.

Console errors: **0**. Runtime errors: **0**. Console warnings: **0**. HTTP error responses: **0**.

Independent evidence:

- `/tmp/latest-models-independent-review.cjs`
- `/tmp/latest-models-independent-review-results.json`
- `/tmp/latest-review-1440.png`, `/tmp/latest-review-390.png`
- `/tmp/latest-label-final-review.cjs`
- `/tmp/latest-label-final-review-results.json`
- `/tmp/latest-review-final-320.png`

Supplied `/tmp/latest-models-check.cjs`, `/tmp/latest-models-check-results.json` and `/tmp/latest-models-{desktop,mobile}.png` were also inspected. Their supplementary checks include 768px and the same six-model/diagnostic/shared-link requirements.

## Source-omission Findings and Release Scope

| Requested Requirement | Status | Evidence / Remaining Step |
|-----------------------|--------|---------------------------|
| Include Claude Sonnet/Opus/Haiku 5.5, GPT-6 Luna, GPT-6.1 Sol and Grok 4.7 in cost-performance exploration | INCLUDED | Independently confirmed under valid Seoul latest-preset conditions |
| Clarify why current filters hide models | INCLUDED | Grouped reasons and actionable controls |
| Treat actual launches as recent | INCLUDED | Verified AWS card dates; strict 60 UTC calendar days; no `firstSeen` substitution |
| Keep latest selection shareable | INCLUDED | Persisted checkbox and `latest=1` reload |
| Refresh all source data | RELEASE STEP PENDING | Existing main-branch workflow runs the complete data pipeline before deployment |
| Verify all six after refresh on the public site | RELEASE STEP PENDING | Producing agent must check refreshed records and final live behavior |

No required UI capability is omitted. The pending source refresh and public verification are authorized release steps that follow this required pre-deployment gate; they are not reported as already completed.

The reviewer inspected `.github/workflows/update-and-deploy.yml`: a main-branch push triggers tests, `npm run data` with the repository's AA secret reference, commits refreshed public data/AI exports, then builds and deploys. This confirms the intended whole-pipeline refresh path. It does not certify that a future run or its credentials will succeed.

## Revision Checklist and Next Steps

- [ ] Nonblocking refinement: enlarge small explanatory labels.
- [x] Match the preset explanation to every condition it resets.
- [x] Independently verify all six models, raw threshold, launch boundaries, exclusions and shared state.
- [ ] Run and verify the full refresh/deployment pipeline after merge.
- [ ] Verify updated source records and all six model flows on the final public site.

| State | Critical | Warnings | Score |
|-------|---------:|---------:|------:|
| Reviewed final source | 0 | 1 | 98.5 |
| With typography refinement | 0 | 0 | 100 |

**PASS: proceed with the authorized PR merge and whole-pipeline refresh/deployment.** Final completion should report the actual pipeline outcome and public verification of the refreshed six records.
