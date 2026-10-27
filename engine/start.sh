#!/bin/sh
# Container start: prepare $CODEX_HOME on the persistent volume. Never touches an existing auth.json or config.toml.
set -e
mkdir -p "$CODEX_HOME" && chmod 700 "$CODEX_HOME"
if [ ! -f "$CODEX_HOME/config.toml" ]; then
  printf 'cli_auth_credentials_store = "file"\n' > "$CODEX_HOME/config.toml"
  chmod 600 "$CODEX_HOME/config.toml"
fi
exec node src/server.js
