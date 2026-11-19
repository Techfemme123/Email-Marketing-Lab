---
name: personalize
description: Write a version of each campaign email for every lead group in leads/leads.csv. Use when a campaign's emails are final and you want one copy per group.
argument-hint: "[campaign folder]"
context: fork
allowed-tools: Read, Glob, Grep, Write
---

# Personalize a campaign by lead group

Campaign folder: `$ARGUMENTS`

## Step 1: Check the argument

If `$ARGUMENTS` is empty, stop. Do not write anything. Use Glob on `campaigns/*/` and reply with the list of campaign folders that exist, and ask which one to use.

If the folder does not exist, say so and list the folders that do.

## Step 2: Gather what you need

- Read `brand/voice.md`. Follow the voice, the words we use and avoid, and the claims we must never make.
- Read `.claude/rules/emails.md`. Every version must still follow these rules.
- Read `leads/leads.csv` and find the distinct values in the `group` column. Expect `tea-curious`, `gift-buyers` and `daily-drinkers`. Use the groups actually in the file. Never copy names or email addresses into the emails.
- Use Glob to find every `*.md` file in `<campaign folder>/emails/`. Do not read or write inside any `groups/` folder.

## Step 3: Write the versions

For each email file and each group, write a new file to `<campaign folder>/groups/<group>/emails/<same file name>`.

Each version must keep identical to the original:
- The structure (headings, order, section titles)
- The subject and preview lines
- The main link and button text
- The sign-off, P.S. tip and two-line footer (keep the two trailing spaces on the first footer line)
- All `{{placeholders}}` and any `[TO CONFIRM]` / `[ADD]` markers and draft notes, copied as they are. Never invent facts to fill them.

Change only two things:
1. **The opening line.** Replace the first sentence after the greeting so it speaks to the group.
2. **One example.** Change one example, scenario or small illustration in the body so it fits the group. If the email has no example, add one short sentence.

Group guide:
- `tea-curious`: new to subscriptions or to tea like this. Gentle, reassuring, no jargon.
- `gift-buyers`: thinking of a box for someone else. Think of a friend or loved one opening it.
- `daily-drinkers`: already have a cup every day. Think of their daily ritual and the morning cup.

Rules for the new lines:
- Follow `brand/voice.md`: charming, warm, chatty, plain English, contractions, no slang.
- No fake pressure, no ALL CAPS, no "!!!", no more than one emoji in the email.
- No health claims, no delivery guarantees, no price promises, no "best" claims, and no "organic" or "100% natural".
- Keep "friends" in the email at least once.
- Keep the email about the same length as the original.

Drafts only. Never send anything.

## Step 4: Reply with a short summary only

Reply with just this:
- How many files you wrote.
- One example opening line per group.

Do not paste whole emails or list every file.
