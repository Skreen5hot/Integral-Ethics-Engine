#!/bin/bash
# TagTeam v3.0 Deployment Script
# Automates backup, deployment, and verification

set -e  # Exit on error

echo "=== TagTeam v3.0 Deployment Script ==="
echo ""

# Step 1: Backup current version
echo "📦 Step 1: Creating backup of current TagTeam v2.0..."
cp static/lib/tagteam.js static/lib/tagteam.v2.0.backup.js
echo "✓ Backup created: static/lib/tagteam.v2.0.backup.js"
echo ""

# Step 2: Verify new version exists
echo "🔍 Step 2: Verifying new version exists..."
if [ ! -f "collaborations/tagteam/deliverables/week3/dist/tagteam.js" ]; then
    echo "❌ ERROR: TagTeam v3.0 not found at expected location!"
    exit 1
fi
echo "✓ TagTeam v3.0 found"
echo ""

# Step 3: Deploy new version
echo "🚀 Step 3: Deploying TagTeam v3.0 to production..."
cp collaborations/tagteam/deliverables/week3/dist/tagteam.js static/lib/tagteam.js
echo "✓ TagTeam v3.0 copied to static/lib/tagteam.js"
echo ""

# Step 4: Verify file size
echo "📊 Step 4: Verifying file size..."
OLD_SIZE=$(stat -c%s "static/lib/tagteam.v2.0.backup.js" 2>/dev/null || stat -f%z "static/lib/tagteam.v2.0.backup.js" 2>/dev/null || echo "unknown")
NEW_SIZE=$(stat -c%s "static/lib/tagteam.js" 2>/dev/null || stat -f%z "static/lib/tagteam.js" 2>/dev/null || echo "unknown")
echo "Old version (v2.0): $OLD_SIZE bytes"
echo "New version (v3.0): $NEW_SIZE bytes"
echo "✓ File sizes verified"
echo ""

# Step 5: Rebuild production build
echo "🔨 Step 5: Rebuilding production build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Build failed!"
    echo "Rolling back to v2.0..."
    cp static/lib/tagteam.v2.0.backup.js static/lib/tagteam.js
    exit 1
fi
echo "✓ Production build complete"
echo ""

# Step 6: Summary
echo "=== Deployment Summary ==="
echo "✓ TagTeam v3.0 deployed successfully"
echo "✓ Backup saved to: static/lib/tagteam.v2.0.backup.js"
echo ""
echo "Next steps:"
echo "1. Test locally: npm run preview"
echo "2. Verify informed consent scenario returns 'permissible'"
echo "3. If tests pass, commit and push to GitHub:"
echo "   git add static/lib/tagteam.js build/ static/lib/tagteam.v2.0.backup.js"
echo "   git commit -m \"feat: upgrade to TagTeam v3.0 with polarity detection fix\""
echo "   git push origin main"
echo ""
echo "If issues occur, rollback with:"
echo "   ./scripts/rollback-tagteam-v3.sh"
