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
