---
paths:
  - "campaigns/**/emails/*.md"
---

# Email file rules

Every email file must follow these rules:

1. **Subject and preview.** The file starts with a line `Subject: ...` of 50 characters or fewer. The next line is `Preview: ...` of 90 characters or fewer.
2. **Greeting.** Greet the reader with `{{first_name}}`.
3. **One main link.** Use exactly one main link, written as `[Button text](https://kettlebird.example/steep-club)`.
4. **Ending.** End with our sign-off from `brand/voice.md` (closing line, sender, and the P.S. brewing tip). After it, add this two-line footer as plain text, not inside a code block:

You're getting this because you joined the Kettlebird Tea waitlist.
Kettlebird Tea, {{company_address}} · Unsubscribe: {{unsubscribe_url}}

End the first footer line with two spaces so the footer shows as two lines in email tools.

5. **Friends.** Use the word "friends" at least once in the subject or body.
6. **One P.S. tip per email.** Each email in a campaign uses a different brewing tip. Never repeat a tip within a campaign.
7. **Voice.** Use contractions ("we're", "you'll") to keep the chatty tone. Avoid stiff phrasing.
8. **Draft notes and placeholders.** A draft may have a `> Draft notes` block after the Preview line and `[TO CONFIRM]` or `[ADD]` placeholders. Both must be removed or filled in before the email is sent.
9. **Promises.** Make no promise about replies, shipping notices, deadlines or sign-up time unless the owner has confirmed it is true.
