#!/bin/sh
set -e

# Log function for consistent messages
log() {
  echo "[INFO] $1"
}

log "Starting environment variable replacement for NEXT_PUBLIC_*..."

# Check if there are any NEXT_PUBLIC_ environment variables
if ! printenv | grep -q NEXT_PUBLIC_; then
  log "No NEXT_PUBLIC_ environment variables found. Skipping replacement."
else
  # Replace env variable placeholders with actual values
  printenv | grep NEXT_PUBLIC_ | while IFS= read -r line; do
    key=$(echo "$line" | cut -d "=" -f1)
    value=$(echo "$line" | cut -d "=" -f2)

    if [ -z "$value" ]; then
      log "Skipping $key as it has an empty value."
      continue
    fi

    log "Replacing occurrences of $key with $value in .next directory files..."

    # Search and replace in all files under the .next directory
    find /app/.next/ -type f -exec sed -i "s|BAKED_$key|$value|g" {} \;
  done
fi

log "Environment variable replacement completed."

# Execute the container's main process (CMD in Dockerfile)
log "Starting the main process..."
exec "$@"