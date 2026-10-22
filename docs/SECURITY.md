# Security and credential incident checklist

## Before every push

- Confirm local files such as `.env.local`, `.env`, private-key files and service-account credentials are ignored.
- Keep only placeholder names and fake values in `.env.example`.
- Run a secret scanner (for example, Gitleaks) and review its findings rather than blindly suppressing them.
- Review the Git diff and GitHub's Security / Secret scanning alerts if that feature is available for the repository.

## If a real credential was pushed

1. **Revoke or rotate it first** in the provider dashboard. Treat service-role keys, database passwords, JWT signing secrets, OAuth client secrets, private keys and AI-provider keys as compromised.
2. Replace it in the server/deployment secret store and verify the application uses the replacement.
3. Remove the credential from tracked files and commit the safe version. Add the relevant local secret filename to `.gitignore`.
4. Inspect the repository history and all branches/tags for other copies. If policy requires removing a credential from history, coordinate a history rewrite (for example with `git filter-repo`), force-push the rewritten refs, and have collaborators re-clone or carefully reset. History rewriting does not revoke a credential.
5. Review provider access logs and GitHub security alerts for unexpected use.

## Supabase client key distinction

Supabase publishable keys and legacy `anon` keys are designed for use in untrusted client applications and are visible in browser/mobile builds. They are not a substitute for authorization. Enforce least privilege with Row Level Security and test that each user can only access their own rows.

A Supabase `service_role` key bypasses RLS and must never be shipped to a client. If one was exposed, rotate it immediately. Do not rotate a public client key solely because it appears in client code without first assessing the project's key migration plan and downstream clients.

## AI keys

Private model-provider keys belong only in a server-side secret store. Never expose them in Vite `VITE_*` variables, Flutter `--dart-define` values, mobile binaries, source files or public CI logs.
