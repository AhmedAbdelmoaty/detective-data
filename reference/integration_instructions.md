1) Goal (المطلوب الأساسي)

We are migrating the FULL original case mechanics and content from the old "Data-Scraper" project into this repo "detective-data" (Scenes project).

✅ We want:

EXACT case mechanics, rules, flow, state, charts, tables, evidence logic, insights logic, hypothesis/ending logic, and interactions from Data-Scraper.

Rendered using the Scenes project UI/visual style, animations, onboarding carousel, room navigation, and overall game feel.

❌ We do NOT want:

guessing

inventing missing content

rewriting mechanics

simplifying the logic

changing charts/tables structure

leaving old IDs or old room structure

2) What comes from Scenes (what we keep)

Scenes project provides:

UI style (glass cards, animations, buttons, transitions)

onboarding intro carousel structure

navigation between pages / rooms

overall game feel (clicks, transitions, sound/visual feedback if any)

existing temporary room images + avatars (only temporary)

We want to KEEP the Scenes feel exactly.

3) What comes from Data-Scraper (what must be copied EXACTLY)

Data-Scraper provides (must be preserved 100%):

the full scenario/story content

evidence list and evidence details

charts and tables data (same numbers, same structure)

insights and how they are unlocked

hypotheses and conditions

endings and scoring

rules (pin evidence, limited interviews, time/trust changes, etc.)

dialogue trees and question choices

state structure (initial state, room states, trust, etc.)

✅ Mechanics MUST remain identical.

4) Reference Source (Source of truth)

The full original Data-Scraper case source has been merged into:
reference/full_case_source.ts

This file is STRICT REFERENCE ONLY:
✅ YOU must read it and migrate from it.
❌ It must NOT be imported directly into the running app.

Meaning:

You can COPY code/data from it.

But never do: import { ... } from reference/full_case_source.ts

5) Current work already done

We created a new Scenes case file:
src/content/cases/case001.ts
(contains the Scenes case data structure)

We updated OnboardingScreen.tsx to import the new case001.

We updated onboarding slides with a new slides array matching our case narrative.

✅ These changes must remain working.

6) Required next changes (what Codex must do next)
A) Rooms (IDs + names + hotspots)

We must rename rooms AND update IDs consistently across the entire repo.
No old IDs must remain.

✅ Example:

Old IDs like warehouse, accounting, projects must be replaced.

Example mapping:

manager-office ➜ ceo-office

other rooms must match our case structure and names.

✅ IMPORTANT HOTSPOTS RULE:
Scenes uses clickable areas (hotspots / click points) in rooms.
These hotspots MUST be updated so they match OUR case content.

If our new room has 2 items to click, then hotspots should be 2.

If it has 5 items, hotspots should be 5.
Do NOT keep the old Scenes hotspot count or positions if they don’t match our case.

Temporary assets rule:

Use existing Scenes room background images temporarily.

But hotspots placement/count must match our case.

B) Characters (must match our case story)

We want these characters:

Sara = Marketing Manager

Ahmed = Sales Manager

Add CEO character (example name: "محمد" as CEO) to meet the story flow.
Use existing avatars from Scenes temporarily.

✅ All character roles, names, descriptions, and dialogue must match our case.

C) Evidence + Data tables + Charts

Evidence, tables, and charts MUST match Data-Scraper exactly.
Do not:

change the dataset

simplify the table

redesign chart logic

reduce columns
Only adapt visuals to match Scenes UI components.

D) Intro / Onboarding Carousel must match our case

Scenes has onboarding slides structure.
We will keep the structure but rewrite:

introduction text

character summary

room list

rules

time/trust explanation
to match our case narrative.

✅ Onboarding must feel like Scenes but story must be our case.

7) Strict rules (must be followed)

✅ No guessing.
✅ No leaving old IDs.
✅ No breaking routes/store references.
✅ Must keep Data-Scraper mechanics identical.
✅ Only use Scenes images temporarily.
✅ All output must compile and run without runtime errors.

8) Output / Task format requirement

For every task:

Explain what will change

Perform changes in code

Ensure all imports are correct

Ensure no runtime errors

Make sure all references are updated everywhere (store, pages, components, types)
