# Content Review Report

## Review Metadata

| Field | Value |
|-------|-------|
| Review Type | HTML application: missing Coding Index explanation and separate measured SciCode views |
| Review Date | Sunday, 2026-10-11 |
| Iteration | #1 final independent review, including source-wording and keyboard-focus corrections |
| Reviewed Source | `f6487ea7d13d7738c022be0304752b990c0a8fb2`, including the verified focus corrections |
| Dataset | `public/data/models.json`, generated `2026-10-11T08:28:14.751Z` |
| Current Score | **98.5 / 100** |
| Verdict | **PASS** |

The installed content-review-agent rubric and Codex workflow were applied in a new separate pass. The reviewer inspected current source, supplied frozen primary-source pages/objects, connected API measurements, regenerated AI exports, meaningful tests and actual browser behavior. Application code, git state and the prior video deliverable were not changed.

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
| Resolved source-scope wording | 0 | 0 | 1 |
| Resolved keyboard focus | 0 | 0 | 1 |
| Other categories | 0 | 0 | 0 |
| **Total** | **0** | **1** | **2** |

## Rubric Score

The rubric deducts one quarter of a category's maximum per noncritical defect, sums deductions within the category and rounds once to the nearest 0.5 with exact midpoints rounded up. One Accessibility defect deducts `5 / 4 = 1.25`, rounded up to **1.5**. No other counted defect remains.

| Item | Maximum | Awarded | Evidence |
|------|--------:|--------:|----------|
| Layout | 8 | 8 | Notice, separate comparison panels/rows, rank tab and mobile wrapping |
| Terminology | 8 | 8 | Coding Index and scientific-programming SciCode explicitly distinguished |
| No Hallucination | 12 | 12 | Missing Coding Index remains missing; actual SciCode fractions preserved; no composite inferred |
| Language Consistency | 8 | 8 | Clear Korean notice and consistent English metric names |
| No Sensitive Data | 12 | 12 | Source scan and screenshots show no exposed credentials or sensitive identifiers |
| Content-Type Quality | 2 | 2 | Six affected views and static exports retain explicit availability information |
| Icon Usage & Appropriateness | 5 | 5 | Existing local information icon and clear text labels |
| Renders correctly | 5 | 5 | Independent pass: zero console/runtime/HTTP errors |
| Interactions work | 5 | 5 | Explicit metric switches, source disclosure, columns and corrected keyboard focus |
| Readability | 5 | 5 | Prominent scoped explanation and separate metric labels; typography counted once below |
| Accessibility | 5 | 3.5 | Warning #1 |
| Structural Completeness | 5 | 5 | Comparison, rank, cost-performance, table, detail and AI exports covered |
| Data Accuracy & External References | 5 | 5 | Connected API values agree with frozen primary records at displayed precision; measured-variant links preserved |
| Legal Compliance | 5 | 5 | No infringement observed; third-party application does not require AWS-owned copyright |
| Message Clarity | 5 | 5 | Availability tied to connected dataset; no unsupported global retirement/unpublication claim |
| Duplication/Gaps | 5 | 5 | Missing composite panel/row retained; measured scientific benchmark shown separately |
| **Total** | **100** | **98.5** | |

## Critical Issues (Must Fix)

None.

## Warning Issues (Should Fix)

### Issue #1: Supporting notice and source text remains small

| Field | Value |
|-------|-------|
| Severity | Warning — nonblocking |
| Category | Accessibility |
| Location | `src/styles.css:345`, `src/styles.css:347`, `src/styles.css:349` |
| Original | Notice paragraph and source disclosure use `font-size: 13px`; source links use `font-size: 12px`. |
| Problem | Supporting text falls below the plugin rubric's 14pt target and may be harder to read on mobile. It wraps without page overflow and the metric distinction remains explicit. This is a plugin target, not a universal WCAG minimum. |
| Action | Enlarge important explanatory text and source links where practical while retaining wrapping at 320px. |
| Expected | Readable explanation/source provenance without clipping or overflow. |
| Points | **-1.5** from Accessibility after required rounding. |

## Resolved Findings

### Scope of availability claim

The initial static-export phrase “remain unpublished” could be read more broadly than the evidence supports. The producing agent narrowed it to:

> Missing Coding Index values remain unavailable in this connected dataset and are never inferred from SciCode.

The final builder, HTML and Markdown exports all contain this scoped wording. The UI likewise says “현재 연동한 Artificial Analysis 측정 항목”. No final deduction is taken. This review does not claim that Artificial Analysis globally never publishes Coding Index or that the metric has been retired.

### Keyboard focus after switching metrics

The reviewer reproduced focus returning to `BODY` after Enter activated the notice's SciCode switch in both rank and cost-performance views. The producing agent corrected the handlers to focus `#rank-tab-scicode` or the Y-axis selector after the state change, using `preventScroll`.

Independent re-verification confirmed:

| View | Active Element After Enter |
|------|----------------------------|
| Ranking | `BUTTON#rank-tab-scicode`, label `SciCode 순위 보기` |
| Cost-performance | `SELECT`, label `Y축 벤치마크` |

This is resolved and takes no final deduction.

## Primary-Source and Measurement Verification

The supplied fresh primary pages and decoded objects were inspected:

- `/tmp/coding-claude-opus-5-5.html` and `/tmp/coding-claude-opus-5-5-model.json`
- `/tmp/coding-claude-sonnet-5-5.html` and `/tmp/coding-claude-sonnet-5-5-model.json`
- `/tmp/coding-gpt-6-1-sol.html` and `/tmp/coding-gpt-6-1-sol-model.json`

The producer reports HTTP 200 for the three primary captures. The reviewer independently inspected their contents and matched measured variant names to the connected dataset's `benchmarkSource`.

| Model / Measured Variant | Coding Index in Connected Record | Connected SciCode Fraction | Frozen Public SciCode Fraction | Display |
|--------------------------|----------------------------------|---------------------------:|------------------------------:|---------|
| Claude Opus 5.5 (Max, Default Fallback) | Absent | 0.669 | 0.668981481481482 | 66.9% |
| Claude Sonnet 5.5 (Max, Default Fallback) | Absent | 0.610 | 0.609953703703704 | 61.0% |
| GPT-6.1 Sol (Max) | Absent | 0.542 | 0.541666666666667 | 54.2% |

None of the three inspected public model objects contains a Coding Index key. Their supplied HTML does not expose a literal Coding Index entry. This establishes the examined records' absence, rather than a global statement about every AA endpoint, model or future publication.

Connected API SciCode values and the higher-precision public values round to the same displayed percentage at one decimal place. The implementation uses the connected API fractions already in the dataset; it does not overwrite them with another metric.

The current dataset still contains **49 actual Coding Index measurements** for other models. `codingIndexOf()` preserves a real finite nonnegative Coding Index, including zero. `scienceCodingPercent()` reads only `scicode`, validates a finite fraction from 0 through 1, and multiplies by 100.

SciCode is consistently labeled **“과학 코딩”**, a separate scientific-programming percentage. It is not mathematically equated with the composite Coding Index or represented as a complete measure of general software-development ability. No TerminalBench value is mapped into Coding Index. No missing composite is calculated from Intelligence Index, SciCode or other available benchmarks.

Actual measured-variant source links point to:

- `https://artificialanalysis.ai/models/claude-opus-5-5`
- `https://artificialanalysis.ai/models/claude-sonnet-5-5`
- `https://artificialanalysis.ai/models/gpt-6-1-sol`

## UI and AI Export Fidelity

The comparison view retains the all-missing **Coding Index** panel and table row, explicitly labeling each selected model **“원본 미제공”** with no fabricated numerical bar. The separate **SciCode (과학 코딩)** panel and row show 66.9%, 61.0% and 54.2%.

Ranking keeps the Coding Index tab and adds a separate visible SciCode tab. The notice action explicitly switches the selected metric; it does not substitute a score while leaving the old label active. The cost-performance notice likewise changes the Y-axis selector to `scicode`, and its ratio uses **%p/$**.

Detailed model exploration provides separate **Coding Index** and **SciCode (%)** columns. Missing composite values are labeled **“미제공”**. Model detail retains the scoped notice and a separately named SciCode percentage.

The regenerated builder uses the same pure helpers for validation and units. The reviewer checked Markdown column alignment and the three rows in both `public/ai/models.md` and `public/ai/regions/ap-northeast-2.md`: **Coding Index remains `-`**, while the separate SciCode column is **66.9 / 61.0 / 54.2**. The HTML export also includes the scoped connected-dataset explanation.

## Independent Verification

The reviewer independently ran:

`node node_modules/vitest/vitest.mjs run src/coding.test.ts src/urlstate.test.ts`

**22 tests passed in 2 files**: four pure measurement tests and 18 URL-state tests. These cover non-substitution, preserved actual Coding Index, valid zero scores, rejected invalid values and supported metric/sort state.

The producing agent confirms final build, **108 unit tests**, and diff whitespace checks passing for the committed application source. Those are producer checks, distinct from the independent targeted tests and browser verification.

The independent browser pass used the local application at `127.0.0.1:5173` with Playwright/Chromium:

| Width | Missing Composite Retained | Actual SciCode / Source Links | Explicit Rank and Cost Switch | Table / Detail | Page Overflow |
|------:|----------------------------|-------------------------------|-------------------------------|----------------|---------------|
| 1440px | PASS | PASS | PASS | PASS | None |
| 390px | PASS | PASS | PASS | PASS | None |
| 320px | PASS | PASS | PASS | PASS | None |

At every width, the reviewer confirmed three missing Coding Index labels, **zero composite bars**, a retained all-missing comparison row, exact scientific percentages, the three correct source links, an empty Coding Index rank for the selected latest model, explicit SciCode selection, cost ratio units, separate detailed columns and GPT-6.1 Sol detail provenance.

Console errors: **0**. Runtime errors: **0**. Console warnings: **0**. HTTP error responses: **0**.

Independent evidence:

- `/tmp/coding-metrics-independent-review.cjs`
- `/tmp/coding-metrics-independent-review-results.json`
- `/tmp/coding-review-1440.png`, `/tmp/coding-review-320.png`
- `/tmp/coding-focus-review.cjs`
- `/tmp/coding-focus-review-results.json`, containing final corrected focus targets

Supplied `/tmp/coding-ui-check.cjs`, `/tmp/coding-ui-check-results.json`, `/tmp/coding-compare-{desktop,mobile}.png` and `/tmp/coding-rank-scicode.png` were also inspected. The prior video deliverable was outside this review and was preserved.

## Source-omission Findings

| User Requirement | Status | Evidence |
|------------------|--------|----------|
| Explain missing Coding Index for Opus 5.5, Sonnet 5.5 and GPT-6.1 Sol | INCLUDED | Connected-source notice, retained missing panel/table row and original links |
| Make actual available coding measurement usable | INCLUDED | Explicit separate scientific SciCode tab/panel/column and metric switch |
| Preserve actual source values and units | INCLUDED | Existing fractions, percentage conversion and primary-record agreement |
| Avoid inventing or substituting a Coding Index | INCLUDED | Pure helpers, zero composite bars and unchanged missing fields |
| Keep the evidence claim scoped | INCLUDED | Connected-dataset wording; no unsupported retirement/global-absence claim |
| Provide consistent human and AI-readable output | INCLUDED | Six UI views plus regenerated static columns/explanations |

No load-bearing requested information is omitted. Actual Coding Index values remain unavailable for these three connected records; the fix explains and exposes the gap rather than manufacturing a measurement.

## Revision Checklist and Next Steps

- [ ] Nonblocking refinement: enlarge notice/source supporting text.
- [x] Scope availability wording to the connected dataset.
- [x] Preserve keyboard focus after explicit metric switches.
- [x] Independently verify units, source variants, missing composite and separate scientific measurement.

| State | Critical | Warnings | Score |
|-------|---------:|---------:|------:|
| Reviewed final artifact | 0 | 1 | 98.5 |
| With supporting typography refined | 0 | 0 | 100 |

**PASS: proceed with the authorized PR merge and deployment.** Verify the deployed comparison and explicit SciCode switch while keeping the three Coding Index fields accurately marked unavailable.
