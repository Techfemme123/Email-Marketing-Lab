# Email Studio

Planning and writing email campaigns for Kettlebird Tea. Drafts only. No real people are emailed.

## Before you start Claude

The Resend connection in `.mcp.json` points to a practice server on your own laptop (`http://localhost:4000`). That server is not part of this repo, so you must start it yourself.

1. Open a separate terminal window.
2. Run this and leave it running:

   ```
   npx emulate@0.12.3 start --service resend
   ```

3. In your normal window, start `claude` in this folder.

If you skip step 2, the Resend tools will fail to connect.

## Safety

- The practice server never sends real email.
- Only send to `@resend.dev` test addresses or your own address.
- No real API key is stored in this repo. The default key is `re_practice`.
