# TagTeam-IEE Integration Tests

Browser-based integration tests for validating TagTeam's semantic analysis integration with the Integral Ethics Engine.

## Test Suite

### [tagteam-integration-test.html](tagteam-integration-test.html)

Interactive test page that validates the complete integration pipeline.

## How to Run

### Option 1: Open Directly in Browser

1. **Navigate to the file:**
   ```
   testing/frameworks/integration-tests/tagteam-integration-test.html
   ```

2. **Open in browser:**
   - Double-click the file, or
   - Right-click → Open with → Chrome/Edge/Firefox

3. **Tests run automatically:**
   - Test 1 auto-runs on page load
   - Click buttons to run other tests
   - "Run All Tests" button runs complete suite

### Option 2: Via Development Server

If running the IEE dev server:

```bash
npm run dev
```

Then navigate to:
```
http://localhost:5173/testing/frameworks/integration-tests/tagteam-integration-test.html
```

## Test Coverage

### Test 1: TagTeam Bundle Loading ✅
**Purpose:** Verify TagTeam v2.0 loads correctly in browser

**Checks:**
- ✓ TagTeam global object defined
- ✓ TagTeam.parse() function exists
- ✓ TagTeam.parse() executes successfully
- ✓ Result has expected structure (version, agent, ethicalProfile)
- ✓ Version is 2.0

**Expected Result:** All checks pass, TagTeam v2.0.0 detected

---

### Test 2: Value Mapper Integration ✅
**Purpose:** Verify value mapping between TagTeam and IEE worldviews

**Checks:**
- ✓ findWorldviewMatches() finds correct mappings
- ✓ Terminal value match quality is "high"
- ✓ mapSalienceToLevel() converts 0.0-1.0 → high/medium/low
- ✓ mapTagteamDomainToIEEDomain() maps 5 domains correctly

**Test Scenario:**
```javascript
TagTeam value: "Autonomy"
Worldview values: {
  terminal: ['self_determination', 'fairness'],
  constitutive: ['freedom'],
  instrumental: ['choice']
}

Expected matches:
- self_determination (terminal, high quality)
- freedom (constitutive, medium quality)
- choice (instrumental, low quality)
```

**Expected Result:** 3 matches found with correct quality levels

---

### Test 3: Semantic Analysis Pipeline ✅
**Purpose:** Verify TagTeam's semantic analysis produces expected output

**Test Scenario:**
```
Input: "A doctor provides evidence-based medical treatment to alleviate patient suffering."
```

**Checks:**
- ✓ Agent detection: "doctor"
- ✓ Action detection: "provides"
- ✓ Semantic frame identified (Caring/Helping)
- ✓ Context intensity dimensions present (12 dimensions)
- ✓ Ethical values detected (Beneficence, Non-maleficence expected)
- ✓ Top value has high salience
- ✓ Dominant domain identified (Care expected)

**Expected Result:** Complete ethical profile with Care domain values

---

### Test 4: Full Integration Pipeline ✅
**Purpose:** Validate end-to-end integration of TagTeam → IEE

**Test Scenario:**
```
Input: "The family must decide whether to continue treatment for their unconscious father."
```

**Pipeline Steps:**
1. **TagTeam Analysis** → Detects values (Autonomy expected)
2. **Value Mapping** → Maps to worldview values (self_determination)
3. **Domain Suggestion** → Suggests IEE domain (healthcare)
4. **Conflict Detection** → Identifies value tensions

**Checks:**
- ✓ TagTeam analysis completes successfully
- ✓ Values map to at least one worldview value
- ✓ Domain suggestion is valid IEE domain
- ✓ Conflict detection runs (may or may not find conflicts)

**Expected Result:**
- Visual comparison showing:
  - Left panel: TagTeam detected values
  - Right panel: Mapped worldview values
- Suggested IEE domain displayed
- Full integration chain verified

---

## Interpreting Results

### ✅ Test Passed
- Green background
- All checks marked with ✓
- Details expandable for inspection

### ❌ Test Failed
- Red background
- Error message displayed
- Failed check indicated with ✗

### Test Summary
After running all tests, summary shows:
- Total tests run
- Pass/fail counts
- Pass rate percentage

### Expected Outcomes

**All Tests Passing:**
```
✅ Test 1: TagTeam Bundle Loading
✅ Test 2: Value Mapper Integration
✅ Test 3: Semantic Analysis Pipeline
✅ Test 4: Full Integration Pipeline

📊 Test Summary
Total Tests: 4
Passed: 4
Failed: 0
Pass Rate: 100%
```

## Troubleshooting

### "TagTeam is not defined"
**Problem:** TagTeam bundle not loading

**Solutions:**
1. Check file path: `collaborations/tagteam/dist/tagteam.js` exists
2. Ensure running from correct directory
3. Check browser console for loading errors
4. Try opening HTML file directly (not via file:// in some browsers)

### "Value Mapper not loaded yet"
**Problem:** ES module loading timing issue

**Solution:**
1. Refresh the page
2. Wait 1-2 seconds after page load
3. Try again - module should be loaded

### Module Import Errors
**Problem:** Browser doesn't support ES modules

**Solution:**
- Use modern browser (Chrome 89+, Firefox 88+, Edge 89+)
- Enable JavaScript in browser settings

### TagTeam Parse Errors
**Problem:** TagTeam.parse() throws errors

**Check:**
1. TagTeam version is 2.0.0 (displayed at top)
2. Bundle is complete (4.2 MB size)
3. Browser console for specific error messages

## Test Data

### Sample Scenarios Used

**Healthcare:**
- "A doctor provides evidence-based medical treatment to alleviate patient suffering."
- Expected values: Beneficence, Non-maleficence
- Expected domain: Care → healthcare

**Family Decision:**
- "The family must decide whether to continue treatment for their unconscious father."
- Expected values: Autonomy, Compassion, Fidelity
- Expected domain: Dignity/Care → healthcare

### Worldview Values (Test Data)

**Materialism (Healthcare-focused):**
```javascript
{
  terminal: ['physical_wellbeing', 'self_determination', 'fairness'],
  constitutive: ['health', 'freedom', 'dignity'],
  instrumental: ['medicine', 'treatment', 'choice']
}
```

## Success Criteria

Integration is successful if:

1. ✅ **All 4 tests pass**
2. ✅ **TagTeam v2.0.0 loads and parses**
3. ✅ **Value mapping finds matches** (>0 matches for typical values)
4. ✅ **Domain suggestions are valid** (one of 7 IEE domains)
5. ✅ **No JavaScript errors** in browser console

## Next Steps

After all tests pass:

1. **Implement Orchestrator Integration**
   - Modify `src/application/deliberationOrchestrator.js`
   - Add semantic analysis to deliberation pipeline

2. **Add Semantic Analysis to IEE UI**
   - Display TagTeam results in deliberation interface
   - Show value mappings to user

3. **Create End-to-End Deliberation Test**
   - Full deliberation with TagTeam enabled
   - Compare results with/without semantic analysis

## Files

**Test Suite:**
- `tagteam-integration-test.html` - Main test page (this)

**Dependencies:**
- `../../../collaborations/tagteam/dist/tagteam.js` - TagTeam v2.0 bundle
- `../../../src/concepts/valueMapper.js` - Value mapping module
- `../../../src/concepts/semanticAnalyzer.js` - Semantic analyzer wrapper

**Documentation:**
- `../../../collaborations/tagteam/integration/TAGTEAM_IEE_INTEGRATION_DESIGN.md` - Integration design spec
- `../../../collaborations/tagteam/communication/WEEK2B_COMPLETE.md` - TagTeam Week 2b docs

---

**Last Updated:** January 18, 2026
**TagTeam Version:** 2.0.0
**Test Suite Version:** 1.0.0
