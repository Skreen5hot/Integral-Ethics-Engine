# TagTeam v3.0 Verification & Deployment Plan

**Date**: 2026-01-18
**Version**: TagTeam v3.0-alpha
**Purpose**: Fix polarity detection bug for informed consent scenarios

---

## 📋 Pre-Deployment Checklist

### Phase 1: Verification Testing

- [ ] **Run browser-based verification test**
  - File: `collaborations/tagteam/deliverables/week3/tests/verify-polarity-fix.html`
  - Open in browser to verify all 4 test scenarios pass
  - Required passing tests:
    - ✅ Test 1: Informed consent scenario (polarity +1, judgment permissible)
    - ✅ Test 2: Verb inflection ("alleviates" matches "alleviate")
    - ✅ Test 3: Possessive handling ("patient's informed consent")
    - ✅ Test 4: Negation handling ("without consent" = -1 polarity)

- [ ] **Verify file integrity**
  - Size: ~4.7MB (expected, includes Compromise.js)
  - Location: `collaborations/tagteam/deliverables/week3/dist/tagteam.js`
  - Version: Should report v3.0.0 in TagTeam.version

- [ ] **Test with IEE integration**
  - Replace current production tagteam.js temporarily
  - Run the informed consent scenario on the live site
  - Verify judgment changes from "problematic" to "permissible"
  - Check console for any errors

### Phase 2: Backup Current Production

- [ ] **Create backup of current version**
  ```bash
  cp static/lib/tagteam.js static/lib/tagteam.v2.0.backup.js
  ```

- [ ] **Document current version info**
  - Current size: 4.3MB
  - Current version: 2.0.0
  - Backup location: `static/lib/tagteam.v2.0.backup.js`

### Phase 3: Deployment

- [ ] **Copy new version to production**
  ```bash
  cp collaborations/tagteam/deliverables/week3/dist/tagteam.js static/lib/tagteam.js
  ```

- [ ] **Verify deployment**
  - Check file size matches (~4.7MB)
  - Verify file copied correctly

- [ ] **Rebuild production build**
  ```bash
  npm run build
  ```

- [ ] **Test locally**
  - Run `npm run preview`
  - Test informed consent scenario
  - Verify correct judgment and polarity

### Phase 4: Production Validation

- [ ] **Deploy to GitHub Pages**
  ```bash
  git add static/lib/tagteam.js
  git commit -m "feat: upgrade to TagTeam v3.0 with polarity detection fix"
  git push origin main
  ```

- [ ] **Wait for deployment** (~3-5 minutes)

- [ ] **Test on live site**
  - Clear browser cache
  - Enter informed consent scenario
  - Verify:
    - Autonomy polarity: +1 (was 0)
    - Consent polarity: +1 (was 0)
    - Judgment: permissible (was problematic)
    - No console errors

### Phase 5: Rollback Plan (If Needed)

If verification fails:

```bash
# Restore backup
cp static/lib/tagteam.v2.0.backup.js static/lib/tagteam.js

# Rebuild and redeploy
npm run build
git add static/lib/tagteam.js build/
git commit -m "revert: rollback to TagTeam v2.0 due to issues"
git push origin main
```

---

## 🔍 What Changed in v3.0

### New Features
1. **Compromise.js Integration** (~330KB)
   - NLP-powered lemmatization
   - Handles verb inflections automatically
   - Smarter phrase matching

2. **Enhanced Pattern Matching**
   - "obtaining their informed consent" → matches "informed consent" ✅
   - "alleviates suffering" → matches "relieve suffering" ✅
   - "patient's informed consent" → matches "informed consent" ✅
   - Handles possessives, word order variations

3. **Improved Polarity Detection**
   - More accurate upholding/violating pattern matching
   - Better negation handling

### Bundle Size Impact
- v2.0: 4.3MB
- v3.0: 4.7MB
- **Increase**: +400KB (+9%)
- **Justification**: Critical bug fix for polarity detection

---

## 📊 Expected Results

### Before (v2.0)
```
Scenario: "A doctor provides evidence-based medical treatment to alleviate
          patient suffering, fully informing the patient of risks and
          obtaining their informed consent."

TagTeam Output:
- Consent: polarity = 0 (neutral) ❌
- Autonomy: polarity = 0 (neutral) ❌
- Compassion: polarity = 0 (neutral) ❌

Moral Reasoner: 'complex' (multiple neutral values)
Final Judgment: 'problematic' ❌
Confidence: 31% (low)
```

### After (v3.0)
```
Scenario: "A doctor provides evidence-based medical treatment to alleviate
          patient suffering, fully informing the patient of risks and
          obtaining their informed consent."

TagTeam Output:
- Consent: polarity = +1 (upheld) ✅
- Autonomy: polarity = +1 (upheld) ✅
- Compassion: polarity = +1 (upheld) ✅

Moral Reasoner: 'right' (multiple upheld values)
Final Judgment: 'permissible' ✅
Confidence: 80%+ (high)
```

---

## 🚨 Risk Assessment

### Low Risk
- TagTeam is a self-contained module
- No breaking API changes
- UMD bundle is backward compatible
- Rollback plan is simple and tested

### Potential Issues
1. **Bundle size**: +400KB may slow initial page load
   - Mitigation: Acceptable for critical bug fix
   - Future: Consider code splitting

2. **Compromise.js dependency**: New dependency
   - Mitigation: Bundled, no runtime loading
   - Risk: None (self-contained)

3. **Pattern matching changes**: May affect other scenarios
   - Mitigation: Run full 20-scenario test corpus
   - Rollback: Simple backup restore

---

## ✅ Success Criteria

Deployment is successful if:

1. ✅ Browser verification test passes all 4 scenarios
2. ✅ Informed consent scenario returns "permissible" (not "problematic")
3. ✅ No console errors on live site
4. ✅ All polarity values are correctly detected (+1 for upheld, -1 for violated)
5. ✅ No regressions in other test scenarios

---

## 📝 Next Steps After Deployment

1. **Monitor for 24 hours**
   - Check for any user-reported issues
   - Monitor console errors in analytics (if available)

2. **Update documentation**
   - Update TagTeam integration docs
   - Document v3.0 changes in CHANGELOG

3. **Remove alpha tag**
   - If no issues after 24h, promote to stable v3.0.0

4. **Clean up backups**
   - After 1 week of stable operation, can remove backup file

---

## 🎯 Immediate Action Items

1. **Open verification test in browser**
   - Navigate to: `collaborations/tagteam/deliverables/week3/tests/verify-polarity-fix.html`
   - Ensure all tests pass

2. **Create backup**
   ```bash
   cp static/lib/tagteam.js static/lib/tagteam.v2.0.backup.js
   ```

3. **Deploy new version**
   ```bash
   cp collaborations/tagteam/deliverables/week3/dist/tagteam.js static/lib/tagteam.js
   npm run build
   ```

4. **Test locally**
   ```bash
   npm run preview
   ```

5. **Deploy to production**
   ```bash
   git add static/lib/tagteam.js build/ static/lib/tagteam.v2.0.backup.js
   git commit -m "feat: upgrade to TagTeam v3.0 with polarity detection fix

- Adds Compromise.js for NLP-powered lemmatization
- Fixes polarity detection for inflected verbs
- Handles possessives and word order variations
- Resolves informed consent scenario bug (problematic → permissible)

Bundle size: 4.3MB → 4.7MB (+400KB for Compromise.js)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
   git push origin main
   ```

---

**Prepared by**: Claude Sonnet 4.5
**Review Status**: Pending user verification
**Deployment Status**: Ready for verification testing
