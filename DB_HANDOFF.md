# WorkflowAI DB Handoff

This document explains the database schema for the current `WorkflowAI` fork and how the integration developer should treat it.

Primary source of truth:

- [index.ts](C:\n8n_clone\n8n\packages\@n8n\db\src\entities\index.ts)
- [workflow-entity.ts](C:\n8n_clone\n8n\packages\@n8n\db\src\entities\workflow-entity.ts)
- [execution-entity.ts](C:\n8n_clone\n8n\packages\@n8n\db\src\entities\execution-entity.ts)
- [credentials-entity.ts](C:\n8n_clone\n8n\packages\@n8n\db\src\entities\credentials-entity.ts)
- [project.ts](C:\n8n_clone\n8n\packages\@n8n\db\src\entities\project.ts)
- [user.ts](C:\n8n_clone\n8n\packages\@n8n\db\src\entities\user.ts)

## Important rule

Do **not** manually delete tables just because the feature is hidden in the UI.

For this fork:

- hidden in UI does **not** mean unused by backend
- the safest approach is to keep the **full migrated schema**
- only remove a table if you are also removing the backend feature, entity usage, and related migrations

## Current product shape

Current `WorkflowAI` is focused on:

- workflows
- credentials
- executions
- editor

Some n8n surfaces are hidden or bypassed in MVP mode, but the DB still uses the standard ownership and runtime model.

## Core runtime tables

These are foundational for the current product and should be treated as required.

| Table | Purpose | Status | Remove? |
|---|---|---|---|
| `workflow_entity` | Main workflow definitions, nodes, connections, settings | Required | No |
| `credentials_entity` | Saved encrypted credentials | Required | No |
| `execution_entity` | One row per workflow run | Required | No |
| `execution_data` | Full run payload and workflow snapshot | Required | No |
| `execution_metadata` | Extra key/value metadata for executions | Keep | No |
| `webhook_entity` | Registered webhook routes | Required for webhook workflows | No |
| `binary_data` | Stored binary files and attachments | Required if binary/file usage exists | No |
| `settings` | Internal instance key/value settings | Required | No |
| `workflow_dependency` | Dependency index for workflows | Keep | No |
| `processed_data` | Cached processed workflow data | Keep | No |

## Ownership, auth, and access-control tables

These are still important even though the current MVP UI bypasses or hides parts of auth.

| Table | Purpose | Status | Remove? |
|---|---|---|---|
| `user` | User records | Required | No |
| `project` | Workspace container | Required | No |
| `project_relation` | User-to-project membership and role | Required | No |
| `shared_workflow` | Workflow ownership/sharing by project | Required | No |
| `shared_credentials` | Credential ownership/sharing by project | Required | No |
| `role` | Role definitions | Keep | No |
| `scope` | Permission scopes | Keep | No |
| `role_scope` | Role-to-scope join table | Keep | No |
| `auth_identity` | User identity provider links | Keep | No |
| `invalid_auth_token` | Revoked/invalidated auth tokens | Keep | No |
| `user_api_keys` | User API keys | Keep, may stay empty | No |
| `auth_provider_sync_history` | Sync history for auth providers | Optional | Only if auth-provider sync backend is removed |

## Workflow organization and general product tables

These are not required for the narrowest MVP flow, but are normal to keep in the schema.

| Table | Purpose | Status | Remove? |
|---|---|---|---|
| `tag_entity` | Workflow and folder tags | Optional | Only if tags backend is removed |
| `workflows_tags` | Workflow-to-tag mapping | Optional | Same as above |
| `folder` | Folder structure | Optional | Only if folder backend is removed |
| `folder_tag` | Folder-to-tag mapping | Optional | Same as above |
| `variables` | Global and project variables | Hidden in current UI | Only if variables backend is removed |
| `workflow_history` | Workflow version history | Keep | No |
| `workflow_published_version` | Published workflow version pointer | Keep | No |
| `workflow_publish_history` | Publish/unpublish history | Keep | No |
| `workflow_statistics` | Workflow counters and metrics | Keep | No |

## Execution annotation and evaluation-related tables

These are part of n8n's broader execution annotation and evaluation model. They may stay empty if unused.

| Table | Purpose | Status | Remove? |
|---|---|---|---|
| `execution_annotations` | Vote/note on executions | Optional | Only if annotation backend is removed |
| `annotation_tag_entity` | Tag dictionary for execution annotations | Optional | Same as above |
| `execution_annotation_tags` | Annotation-to-tag mapping | Optional | Same as above |
| `test_run` | Evaluation/test runs | Hidden in current UI | Only if evaluation backend is removed |
| `test_case_execution` | Per-test-case execution records | Hidden in current UI | Same as above |

## Advanced integrations and enterprise-oriented tables

These are feature-related and may stay empty.

| Table | Purpose | Status | Remove? |
|---|---|---|---|
| `secrets_provider_connection` | External secret manager connection | Optional | Only if secrets-provider backend is removed |
| `project_secrets_provider_access` | Project access to secret providers | Optional | Same as above |
| `role_mapping_rule` | SSO role mapping/provisioning rules | Optional | Only if SSO provisioning backend is removed |
| `credential_dependency` | Dependency data for credentials/resolvers | Optional | Only if resolver backend is removed |

## What the developer should consider foundational

For the current `WorkflowAI` integration, these should be treated as the core application tables:

- `workflow_entity`
- `credentials_entity`
- `execution_entity`
- `execution_data`
- `user`
- `project`
- `project_relation`
- `shared_workflow`
- `shared_credentials`
- `webhook_entity`

## Practical integration guidance

1. Keep the migrated schema intact.
2. Hide unwanted product surfaces in UI rather than dropping tables.
3. Keep `N8N_ENCRYPTION_KEY` stable across environments if you want saved credentials to keep working.
4. Treat ownership tables as required even in MVP mode, because the backend still uses them.
5. If the app later moves from MVP mode to real portal auth, the existing ownership/auth tables will still be useful.

## If you ever want to truly remove a feature

Do not start by dropping the table.

Do this instead:

1. remove or disable the backend feature
2. remove route/UI entry points
3. remove API/controller/service usage
4. verify migrations and foreign-key dependencies
5. only then consider schema cleanup

## Short answer

For this fork, the default policy should be:

- keep the full schema
- hide what you do not want in the product
- avoid DB-level removals unless doing a full backend feature removal

