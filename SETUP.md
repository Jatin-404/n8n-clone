# WorkflowAI Setup

This guide is for setting up this `WorkflowAI` fork on a new Windows machine.

It covers:

- fresh setup on a new machine
- running the current MVP-mode version
- restoring the same data from another machine
- optional Ollama setup

## Current stack assumptions

This guide assumes:

- Windows
- Node.js 22.x
- `pnpm` via Corepack
- PostgreSQL
- local development / internal company use
- `WorkflowAI` MVP mode enabled

## 1. Install prerequisites

Install these first:

- Git
- Node.js 22.x
- PostgreSQL
- Ollama

Check Node after install:

```powershell
node -v
```

## 2. Clone the repo

```powershell
git clone <your-repo-url>
cd <your-repo-folder>
```

## 3. Enable pnpm

```powershell
corepack enable
corepack prepare pnpm@10.32.1 --activate
```

If PowerShell blocks `pnpm`, use `pnpm.cmd` for all commands in this repo.

## 4. Create the env file

Copy the example file:

```powershell
Copy-Item .env.local.example .env.local
```

Edit [`.env.local`](C:\n8n_clone\n8n\.env.local) and fill in values for the new machine.

Example local config:

```env
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5433
DB_POSTGRESDB_DATABASE=workflowai
DB_POSTGRESDB_USER=workflowai
DB_POSTGRESDB_PASSWORD=StrongPasswordHere
DB_POSTGRESDB_SCHEMA=public

N8N_ENCRYPTION_KEY=put_your_existing_or_generated_key_here
N8N_USER_MANAGEMENT_JWT_SECRET=put_your_existing_or_generated_secret_here

N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
N8N_EDITOR_BASE_URL=http://localhost:5678
WEBHOOK_URL=http://localhost:5678/

N8N_SECURE_COOKIE=false
GENERIC_TIMEZONE=Asia/Kolkata

N8N_USER_FOLDER=C:\workflowai-data
N8N_STORAGE_PATH=C:\workflowai-data\storage
N8N_DEFAULT_BINARY_DATA_MODE=filesystem
N8N_EXECUTION_DATA_STORAGE_MODE=database

N8N_RUNNERS_MODE=internal
N8N_ENV_FEAT_WORKFLOWAI_MVP_MODE=true

NODEJS_PREFER_IPV4=true
```

Notes:

- Keep `N8N_ENV_FEAT_WORKFLOWAI_MVP_MODE=true` if you want the same no-login MVP behavior.
- `NODEJS_PREFER_IPV4=true` is recommended on Windows for local Ollama usage.
- Do not change `N8N_ENCRYPTION_KEY` if you want old saved credentials to keep working.
- Do not commit `.env.local`.

## 5. Create local data folders

```powershell
New-Item -ItemType Directory -Force C:\workflowai-data
New-Item -ItemType Directory -Force C:\workflowai-data\storage
```

## 6. Create the PostgreSQL database

If this is a fresh machine with a fresh database:

```sql
CREATE USER workflowai WITH PASSWORD 'StrongPasswordHere';
CREATE DATABASE workflowai OWNER workflowai;
```

If your Postgres runs on a different port, host, or username, update `.env.local` to match.

## 7. Install dependencies

```powershell
pnpm.cmd install
```

## 8. Build the repo

```powershell
pnpm.cmd build *> build.log
```

If you want to inspect build output:

```powershell
Get-Content .\build.log -Tail 80
```

## 9. Start WorkflowAI

```powershell
pnpm.cmd start
```

Then open:

[http://localhost:5678](http://localhost:5678)

Because this fork loads root `.env.local` automatically, normal `pnpm.cmd start` is enough.

## 10. Optional: setup Ollama

Install Ollama and start it normally.

Check it:

```powershell
Invoke-WebRequest http://127.0.0.1:11434/api/tags
```

In the WorkflowAI Ollama credential:

- Base URL: `http://127.0.0.1:11434`
- API Key: leave empty for default local Ollama

If you want a model available locally:

```powershell
ollama pull llama3.2
```

## Fresh setup vs same-instance restore

### Fresh setup

Use this when you only want the code and a new empty instance.

Steps:

1. Clone repo
2. Create new `.env.local`
3. Create fresh Postgres DB
4. Run `pnpm.cmd install`
5. Run `pnpm.cmd build *> build.log`
6. Run `pnpm.cmd start`

### Same-instance restore

Use this when you want the new machine to have the same workflows, credentials, and local files as the old one.

Copy or restore these:

- the same [`.env.local`](C:\n8n_clone\n8n\.env.local), especially the same `N8N_ENCRYPTION_KEY`
- your Postgres database dump
- your `N8N_USER_FOLDER` contents, for example `C:\workflowai-data`

Recommended order:

1. Clone repo
2. Copy `.env.local`
3. Restore Postgres dump
4. Copy `C:\workflowai-data`
5. Run `pnpm.cmd install`
6. Run `pnpm.cmd build *> build.log`
7. Run `pnpm.cmd start`

## Useful commands

Install dependencies:

```powershell
pnpm.cmd install
```

Build:

```powershell
pnpm.cmd build *> build.log
```

Start:

```powershell
pnpm.cmd start
```

Run frontend/backend dev mode:

```powershell
pnpm.cmd dev
```

Watch build log:

```powershell
Get-Content .\build.log -Wait -Tail 50
```

## Troubleshooting

### `pnpm` script policy error in PowerShell

Use:

```powershell
pnpm.cmd install
pnpm.cmd start
```

Or permanently allow scripts for your user:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Ollama says "The service refused the connection"

Use:

- `http://127.0.0.1:11434`
- not `http://localhost:11434`

Also keep:

```env
NODEJS_PREFER_IPV4=true
```

### Credentials stop working after moving machines

Most common cause:

- `N8N_ENCRYPTION_KEY` changed

Use the same key from the old machine.

### New machine opens setup or sign-in instead of the app

Check:

```env
N8N_ENV_FEAT_WORKFLOWAI_MVP_MODE=true
```

and restart:

```powershell
pnpm.cmd start
```

### PostgreSQL connection fails

Check:

- `DB_POSTGRESDB_HOST`
- `DB_POSTGRESDB_PORT`
- `DB_POSTGRESDB_DATABASE`
- `DB_POSTGRESDB_USER`
- `DB_POSTGRESDB_PASSWORD`

## Important files

- [`.env.local`](C:\n8n_clone\n8n\.env.local)
- [`.env.local.example`](C:\n8n_clone\n8n\.env.local.example)
- [`packages/cli/bin/n8n`](C:\n8n_clone\n8n\packages\cli\bin\n8n)
- [`packages/@n8n/config/src/configs/database.config.ts`](C:\n8n_clone\n8n\packages\@n8n\config\src\configs\database.config.ts)
- [`packages/@n8n/config/src/configs/instance-settings-config.ts`](C:\n8n_clone\n8n\packages\@n8n\config\src\configs\instance-settings-config.ts)

