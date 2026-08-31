---
name: Imported artifact registry
description: Replit imports can preserve artifact files without registering the artifact in the current workspace.
---

Imported projects may contain `.replit-artifact/artifact.toml` and still return no entries from the artifact registry. In that state, the managed workflow name cannot be restarted and artifact-based screenshots cannot resolve the directory.

**Why:** The imported AiroRent project had valid artifact metadata but no registered artifact or managed workflow in the current environment.

**How to apply:** Check the artifact and workflow registries before assuming an imported artifact is managed. If both are empty and the user asks to run the app, configure one explicit web workflow using the app's required environment variables and actual listening port rather than creating duplicate services.