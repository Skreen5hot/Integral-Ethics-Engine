#!/bin/bash
# TagTeam v3.0 Rollback Script
# Restores TagTeam v2.0 backup

set -e  # Exit on error

echo "=== TagTeam v3.0 Rollback Script ==="
echo ""

# Step 1: Verify backup exists
echo "🔍 Step 1: Verifying backup exists..."
if [ ! -f "static/lib/tagteam.v2.0.backup.js" ]; then
    echo "❌ ERROR: Backup file not found!"
    echo "Cannot rollback without backup."
    exit 1
fi
echo "✓ Backup found: static/lib/tagteam.v2.0.backup.js"
echo ""

# Step 2: Restore backup
echo "⏮️  Step 2: Restoring TagTeam v2.0 from backup..."
cp static/lib/tagteam.v2.0.backup.js static/lib/tagteam.js
echo "✓ TagTeam v2.0 restored"
echo ""

# Step 3: Rebuild
echo "🔨 Step 3: Rebuilding with v2.0..."
npm run build
echo "✓ Build complete"
echo ""

# Step 4: Summary
echo "=== Rollback Summary ==="
echo "✓ TagTeam v2.0 restored successfully"
echo ""
echo "Next steps:"
echo "1. Test locally: npm run preview"
echo "2. If working, commit and push:"
echo "   git add static/lib/tagteam.js build/"
echo "   git commit -m \"revert: rollback to TagTeam v2.0 due to issues\""
echo "   git push origin main"
