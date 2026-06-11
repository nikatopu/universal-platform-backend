# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public GitHub issue.

Instead, report it by emailing the repository owner directly (see the GitHub profile for contact details).

Please include:

- A description of the vulnerability
- Steps to reproduce
- Potential impact

You will receive a response within 72 hours.

## Security Practices in this Codebase

- Passwords are hashed with **Argon2id** before storage
- Refresh tokens are hashed with **Argon2id** before storage — the plaintext is never persisted
- JWT secrets are loaded exclusively from environment variables — never hardcoded
- All user input is validated with `class-validator` DTOs with `whitelist: true`
- Rate limiting is applied globally (100 requests per 60 seconds per IP)
- Helmet sets secure HTTP headers on every response
- CORS is restricted to the configured `FRONTEND_URL`

## Environment Variables

**Never commit `.env` files.** The `.gitignore` in this repository prevents all `.env.*` files from being tracked (with the exception of `.env.example`, which contains only placeholder values).

To generate secure JWT secrets:

```bash
openssl rand -base64 64
```
