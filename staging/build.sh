#!/bin/bash
# Builds the private review copy of spureducation.com into staging/site.
# The review copy shows reviewer notes and content that still needs sign-off.
# It never touches the pages in the repository root, which GitHub Pages publishes.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
root="$(dirname "$here")"
rm -rf "$here/site"
mkdir -p "$here/site"
tar -C "$root" --exclude=.git --exclude=node_modules --exclude=staging --exclude='*.bak' -cf - . | tar -C "$here/site" -xf -
STAGING=1 OUT_DIR="$here/site" \
  LEAD_ENDPOINT="${LEAD_ENDPOINT:-/__lead}" \
  SANDBOX_URL="${SANDBOX_URL:-https://spur-hr-sandbox.fly.dev/}" \
  node "$root/build-back-office.js"
echo "Review copy is in staging/site. Deploy with: (cd staging && fly deploy)"
