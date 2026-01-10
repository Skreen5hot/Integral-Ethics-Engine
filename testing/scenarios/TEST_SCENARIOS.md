# Integral Ethics Engine - Test Scenarios

**Purpose**: Comprehensive test scenarios for manual and automated testing
**Created**: 2026-01-04
**Coverage**: All 8 domains, UI components, user workflows, edge cases

---

## 📋 Table of Contents

1. [Domain-Specific Scenarios](#domain-specific-scenarios)
2. [Edge Case Scenarios](#edge-case-scenarios)
3. [UI/UX Test Scenarios](#uiux-test-scenarios)
4. [Integration Test Scenarios](#integration-test-scenarios)
5. [Performance Test Scenarios](#performance-test-scenarios)
6. [Accessibility Test Scenarios](#accessibility-test-scenarios)

---

## 🎯 Domain-Specific Scenarios

### 1. Healthcare Domain

#### Scenario 1.1: End-of-Life Decision
```
Description:
A 78-year-old patient with terminal cancer is on life support with no chance of recovery.
The family must decide whether to continue aggressive treatment or transition to comfort care.
The patient left no advance directive, but had previously mentioned preferring quality of life
over prolonged suffering.

Expected Domain: healthcare
Expected Conflicts: High (Materialism vs Spiritualism, Rationalism vs Phenomenalism)
Expected Minority Views: Spiritualism (may favor preserving life), Phenomenalism (patient experience focus)
```

#### Scenario 1.2: Experimental Treatment
```
Description:
A pharmaceutical company offers a patient access to an experimental drug that shows promise
but has not completed clinical trials. The treatment could extend life by 6-12 months but
carries unknown risks. Insurance will not cover the $200,000 cost.

Expected Domain: healthcare
Expected Conflicts: Moderate (Materialism vs Idealism, Realism vs Psychism)
Expected Judgment: Likely uncertain (high epistemic uncertainty)
```

#### Scenario 1.3: Organ Donation Priority
```
Description:
Two patients need a liver transplant. One is a 45-year-old parent of three who developed
liver disease through no fault of their own. The other is a 28-year-old with self-inflicted
damage from alcohol abuse but has been sober for 2 years. Only one liver is available.

Expected Domain: healthcare
Expected Conflicts: Very High (multiple value tensions)
Expected Minority Views: Multiple dissenting perspectives
```

---

### 2. Spiritual/Religious Domain

#### Scenario 2.1: Leaving Faith Community
```
Description:
After 30 years in a conservative religious community, I'm questioning core doctrines and
considering leaving. This would mean losing my entire social network and possibly estrangement
from family. However, staying feels intellectually dishonest and emotionally suffocating.

Expected Domain: spiritual
Expected Conflicts: High (Spiritualism vs Rationalism, Pneumatism vs Materialism)
Expected Weight Emphasis: Spiritualism, Pneumatism should have higher weights
```

#### Scenario 2.2: Interfaith Marriage
```
Description:
I'm in love with someone from a different religious tradition. Both families expect us to
convert to their faith. We're considering creating our own spiritual practice that honors
both traditions, but this may alienate both families.

Expected Domain: spiritual
Expected Conflicts: Moderate
Expected Judgment: Focus on individual autonomy vs community harmony
```

#### Scenario 2.3: Religious Practice vs Career
```
Description:
My career requires working on my faith's holy day. The job is a once-in-a-lifetime opportunity
that could support my family for years. My religious community views working on this day as
a serious violation of sacred obligations.

Expected Domain: spiritual (could auto-detect as vocational)
Expected Conflicts: High (Pneumatism vs Dynamism, Spiritualism vs Realism)
```

---

### 3. Education Domain

#### Scenario 3.1: Academic Dishonesty
```
Description:
I discovered that several students in my class are using AI to write their essays. I'm
struggling to keep up while doing my own work. Reporting them might make me a social outcast,
but not reporting feels unfair to honest students.

Expected Domain: education
Expected Conflicts: Moderate (Rationalism vs Phenomenalism, Idealism vs Realism)
Expected Minority Views: Monadism (individual conscience)
```

#### Scenario 3.2: Competitive vs Collaborative Learning
```
Description:
Our school is switching from a competitive grading system (curve-based) to a collaborative
learning model where students are evaluated on group projects and peer teaching. Some high-
achieving students are protesting, fearing it will hurt their college admissions.

Expected Domain: education
Expected Conflicts: Moderate
Expected Focus: Individual achievement vs collective growth
```

---

### 4. Vocational/Career Domain

#### Scenario 4.1: High-Paying Unethical Job
```
Description:
I've been offered a $300,000/year position at a company whose primary client is developing
weapons systems. The money would eliminate my family's debt and secure our future, but the
work conflicts with my values around peace and non-violence.

Expected Domain: vocational
Expected Conflicts: Very High (Materialism vs Idealism, Realism vs Spiritualism)
Expected Minority Views: Spiritualism, Idealism (likely dissent)
```

#### Scenario 4.2: Work-Life Balance Crisis
```
Description:
My employer expects 60-80 hour work weeks. I'm missing my children's milestones and my
marriage is suffering. However, I'm the sole income earner, and stepping back could mean
losing the promotion I've worked toward for five years.

Expected Domain: vocational
Expected Conflicts: High (Dynamism vs Phenomenalism, Materialism vs Psychism)
```

#### Scenario 4.3: Whistleblowing Decision
```
Description:
I've discovered my company is falsifying safety reports to avoid recalls. Reporting this
could save lives but will certainly cost me my job and make me unemployable in my industry.
I have a family depending on my income.

Expected Domain: vocational
Expected Conflicts: Very High
Expected Confidence: Likely low (difficult trade-offs)
```

---

### 5. Environmental Domain

#### Scenario 5.1: Wilderness vs Development
```
Description:
Our town has an opportunity to approve a lithium mining operation that would create 500 jobs
and fund schools for a decade. However, it would destroy 50,000 acres of pristine wilderness
and threaten several endangered species. The region has high unemployment.

Expected Domain: environmental
Expected Conflicts: Very High (Materialism vs Spiritualism, Realism vs Psychism)
Expected Minority Views: Spiritualism, Psychism (likely favor preservation)
```

#### Scenario 5.2: Personal Carbon Footprint
```
Description:
My dream job requires flying internationally twice a month. I'm deeply concerned about climate
change and have been a climate activist. Taking this job would increase my carbon footprint
tenfold, but I could use the platform to advocate for environmental policies.

Expected Domain: environmental
Expected Conflicts: Moderate
Expected Focus: Personal integrity vs systemic change
```

---

### 6. Interpersonal Domain

#### Scenario 6.1: Truth vs Kindness
```
Description:
My best friend is about to marry someone I believe is manipulative and emotionally abusive.
I've seen red flags that my friend dismisses as "misunderstandings." Should I speak up and
risk ending our friendship, or stay silent and potentially watch them suffer?

Expected Domain: interpersonal
Expected Conflicts: High (Rationalism vs Phenomenalism, Idealism vs Realism)
Expected Judgment: Complex trade-offs between truth and relationship preservation
```

#### Scenario 6.2: Family vs Independence
```
Description:
My parents expect me to live with them and care for them as they age, as is traditional in
our culture. However, I've received a fellowship opportunity across the country that could
define my career. Declining feels like abandoning family duty; accepting feels selfish.

Expected Domain: interpersonal
Expected Conflicts: Very High (Monadism vs Pneumatism, Dynamism vs Spiritualism)
```

---

### 7. Intellectual/Research Domain

#### Scenario 7.1: Controversial Research
```
Description:
I have data suggesting a controversial conclusion that contradicts mainstream scientific
consensus and could be misused by political groups. Publishing could advance knowledge but
might cause social harm. Not publishing violates scientific integrity.

Expected Domain: intellectual
Expected Conflicts: High (Rationalism vs Phenomenalism, Mathematism vs Realism)
Expected Minority Views: Phenomenalism (social consequences focus)
```

#### Scenario 7.2: Authorship Dispute
```
Description:
My advisor is listed as first author on a paper despite me doing 90% of the work. This is
standard in my field but feels unjust. Challenging this could damage my career prospects
and violate academic hierarchy norms.

Expected Domain: intellectual
Expected Conflicts: Moderate
Expected Focus: Individual recognition vs systemic norms
```

---

### 8. General Domain

#### Scenario 8.1: Ambiguous Situation
```
Description:
I found a wallet with $500 cash and no ID. There's a gym membership card but the gym is
closed for renovation. I could really use the money for rent, but it clearly belongs to
someone who might also need it.

Expected Domain: general (no clear domain keywords)
Expected Conflicts: Low to Moderate
Expected Auto-Detection: Should default to 'general'
```

---

## ⚠️ Edge Case Scenarios

### Edge 1: Minimum Length Input
```
Description:
I lied.

Expected: Validation error (minimum 10 characters)
UI Behavior: Error message should appear on blur or submit
```

### Edge 2: Maximum Length Input
```
Description:
[5000+ character scenario about complex multi-generational family conflict]

Expected: Validation error (maximum 5000 characters)
UI Behavior: Character counter should turn red, submit disabled
```

### Edge 3: Exact Boundary - 10 Characters
```
Description:
I stole it

Expected: Valid (exactly 10 characters)
Should Process: Yes
```

### Edge 4: Exact Boundary - 5000 Characters
```
Description:
[Exactly 5000 character scenario]

Expected: Valid (exactly 5000 characters)
Should Process: Yes
```

### Edge 5: No Domain Keywords
```
Description:
I'm trying to decide whether to paint my room blue or green. Blue feels calming but
green is more energizing. I can't decide which would be better for my mood and productivity.

Expected Domain: general
Expected Conflicts: None or very low
Expected Confidence: High (low moral stakes)
```

### Edge 6: Multiple Domain Keywords
```
Description:
I'm a doctor (healthcare) working at a religious hospital (spiritual) who teaches medical
students (education) and am considering a research position (intellectual) at an oil company
(environmental) that would require relocating away from my family (interpersonal) and
changing my career trajectory (vocational).

Expected Domain: Should pick dominant domain (likely healthcare or vocational)
Expected Conflicts: Very High
Test: Verify domain detection logic
```

### Edge 7: Special Characters
```
Description:
My friend said, "You should definitely do this!" but I'm not sure... The situation involves
$50,000 and a 50/50 decision. What if I choose wrong? (This is a test of special chars: @#$%^&*)

Expected: Should handle special characters gracefully
Should Process: Yes
Validation: No errors from punctuation
```

### Edge 8: Unicode Characters
```
Description:
我在考虑是否应该接受这份工作。This job offer involves moving to 日本 and learning a new
culture while maintaining my values. The opportunity is 非常好 but离开家人很难。

Expected: Should handle mixed language input
Should Process: Yes (though reasoning may be English-biased)
```

### Edge 9: Empty Context Object
```
Scenario:
{
  description: "Should I quit my job?",
  domain: "",
  context: {}
}

Expected: Valid (context is optional)
Should Auto-Detect Domain: Yes (vocational)
```

### Edge 10: All Worldviews Agree
```
Description:
I found a lost child crying in a store parking lot. Should I help them find their parent?

Expected Domain: interpersonal or general
Expected Conflicts: None (all worldviews should agree on helping)
Expected Confidence: Very High
Expected Minority Views: Empty array
Test: Verify system handles consensus gracefully
```

---

## 🖥️ UI/UX Test Scenarios

### UI Test 1: Component Integration
**Test**: Deliberate Page Flow
1. Navigate to `/deliberate`
2. Enter scenario (100 chars)
3. Select domain manually
4. Submit form
5. **Verify**:
   - ScenarioInput validation works
   - Loading state appears
   - Results scroll into view
   - ConflictMap renders with D3.js
   - IntegratedJudgment shows with correct data
   - WorldviewCard components are expandable

### UI Test 2: History Navigation
**Test**: History Page Functionality
1. Complete 5 deliberations
2. Navigate to `/history`
3. **Verify**:
   - HistoryTable shows all 5 entries
   - Sorting by date works (click header)
   - Filtering by domain works
   - Click row to view details
   - Detail modal shows complete data
   - Export button downloads JSON

### UI Test 3: Settings Persistence
**Test**: Settings Page State Management
1. Navigate to `/settings`
2. Change theme to "dark"
3. Select 6 worldviews
4. Set custom weight for Materialism (0.8)
5. Save settings
6. **Verify**:
   - Success message appears
   - Navigate away and back
   - Settings persist (check IndexedDB)
   - Export settings produces valid JSON
   - Import settings restores state

### UI Test 4: Home Page Preview
**Test**: Recent History Display
1. Complete 3 deliberations
2. Navigate to `/` (home)
3. **Verify**:
   - Recent Deliberations section appears
   - Shows 3 most recent (sorted by date)
   - Timestamps are relative ("2 mins ago")
   - Judgment badges have correct colors
   - Click card navigates to `/history`

### UI Test 5: Responsive Design
**Test**: Mobile Viewport
1. Resize browser to 375px width (mobile)
2. Test all pages
3. **Verify**:
   - Navigation menu collapses/adapts
   - Cards stack vertically
   - ConflictMap scales appropriately
   - Forms remain usable
   - Buttons are touch-friendly (min 44px)

### UI Test 6: Empty States
**Test**: No Data Scenarios
1. Clear all data
2. Navigate to `/history`
3. **Verify**: Empty state with "Begin Deliberation" button
4. Navigate to `/` (home)
5. **Verify**: No recent deliberations section (hidden)
6. Complete one deliberation
7. **Verify**: Recent section appears on home

### UI Test 7: Error Handling
**Test**: Form Validation
1. Navigate to `/deliberate`
2. Submit empty form
3. **Verify**: Error message appears
4. Enter 5 characters
5. **Verify**: Error persists (minimum 10)
6. Enter 10 characters
7. **Verify**: Error clears
8. Submit form
9. **Verify**: Deliberation proceeds

### UI Test 8: Loading States
**Test**: Async Operations
1. Submit deliberation
2. **Verify**: "Deliberating..." message appears
3. **Verify**: Submit button disabled
4. **Verify**: Deliberative pacing message visible
5. Wait for completion
6. **Verify**: Results appear
7. **Verify**: Submit re-enabled

---

## 🔗 Integration Test Scenarios

### Integration 1: End-to-End Workflow
**Test**: Complete User Journey
1. Open app at `/`
2. Click "Start Deliberation"
3. Enter healthcare scenario
4. Submit and wait for results
5. View radial chart (verify D3.js renders)
6. Expand minority worldviews
7. Navigate to `/history`
8. Verify deliberation appears in table
9. Click to view details
10. Navigate to `/settings`
11. Exclude Materialism from defaults
12. Save settings
13. Return to `/deliberate`
14. Submit new scenario
15. **Verify**: Materialism not in results

### Integration 2: Storage Persistence
**Test**: IndexedDB Integration
1. Complete deliberation
2. **Verify**: Saved to IndexedDB (check dev tools)
3. Refresh page
4. Navigate to `/history`
5. **Verify**: Deliberation still present
6. Clear browser data (simulated)
7. **Verify**: History cleared

### Integration 3: Export/Import
**Test**: Data Portability
1. Complete 3 deliberations
2. Navigate to `/history`
3. Export all as JSON
4. **Verify**: File downloads with correct format
5. Clear all data
6. Navigate to `/settings`
7. Import exported JSON
8. **Verify**: All deliberations restored
9. Navigate to `/history`
10. **Verify**: All 3 appear in table

### Integration 4: Preference Propagation
**Test**: Settings Affect Deliberations
1. Navigate to `/settings`
2. Set default worldviews: Only Material-Empirical cluster (4 worldviews)
3. Set custom weight: Materialism = 1.0
4. Save settings
5. Navigate to `/deliberate`
6. Submit healthcare scenario
7. **Verify**: Only 4 worldviews evaluated
8. **Verify**: Materialism has highest weight in results

---

## ⚡ Performance Test Scenarios

### Performance 1: Large History
**Test**: 100 Deliberations
1. Programmatically create 100 deliberation entries
2. Navigate to `/history`
3. **Measure**: Page load time (should be < 2s)
4. **Verify**: Pagination works smoothly
5. **Verify**: Filtering is responsive
6. **Verify**: Sorting doesn't lag

### Performance 2: Complex Scenario
**Test**: 5000 Character Input
1. Enter maximum length scenario (5000 chars)
2. Submit deliberation
3. **Measure**: Processing time
4. **Verify**: Results render completely
5. **Verify**: ConflictMap handles data
6. **Verify**: No truncation or errors

### Performance 3: Rapid Navigation
**Test**: Quick Page Switching
1. Navigate `/` → `/deliberate` → `/history` → `/settings` → `/worldviews` → `/`
2. Repeat 10 times rapidly
3. **Verify**: No memory leaks
4. **Verify**: Smooth transitions
5. **Verify**: State preserved correctly

---

## ♿ Accessibility Test Scenarios

### A11y 1: Keyboard Navigation
**Test**: No Mouse Usage
1. Use only Tab, Enter, Space, Arrow keys
2. Navigate entire app
3. **Verify**: All interactive elements reachable
4. **Verify**: Focus indicators visible
5. **Verify**: Forms submittable via keyboard
6. **Verify**: Modals closable via Esc

### A11y 2: Screen Reader
**Test**: NVDA/JAWS/VoiceOver
1. Enable screen reader
2. Navigate `/deliberate` page
3. **Verify**: Form labels announced
4. **Verify**: Error messages read aloud
5. **Verify**: Results structure clear
6. **Verify**: ARIA labels present on charts

### A11y 3: Color Contrast
**Test**: WCAG AA Compliance
1. Use browser contrast checker
2. Test all text/background combinations
3. **Verify**: Minimum 4.5:1 ratio for normal text
4. **Verify**: Minimum 3:1 ratio for large text
5. **Verify**: Judgment colors distinguishable

### A11y 4: Zoom Support
**Test**: Browser Zoom
1. Set browser zoom to 200%
2. Navigate all pages
3. **Verify**: No horizontal scroll
4. **Verify**: Text remains readable
5. **Verify**: Buttons remain clickable
6. **Verify**: ConflictMap scales appropriately

---

## 🎭 Conflict Detection Test Scenarios

### Conflict 1: Clear Disagreement
**Scenario**: Abortion ethics
```
Description:
I'm 8 weeks pregnant and facing a choice about continuing the pregnancy. My health is
stable, but I'm not financially or emotionally ready to become a parent. I'm considering
abortion but struggling with moral questions about when life begins.

Expected: Very High conflicts (Materialism vs Spiritualism fundamentally disagree)
Expected Minority Views: Significant (deep worldview divide)
```

### Conflict 2: Subtle Tension
**Scenario**: White lie to protect feelings
```
Description:
My partner asks if I like their new haircut, which I honestly find unflattering. Telling
the truth might hurt their feelings and they can't change it now. Should I be honest or
tell a kind lie?

Expected: Low to Moderate conflicts (most agree on kindness, some emphasize truth)
Expected: Rationalism may dissent (truth over comfort)
```

### Conflict 3: No Conflict
**Scenario**: Helping emergency
```
Description:
I witnessed a car accident. The driver is unconscious and the car is on fire. Should I
attempt to pull them out before emergency services arrive, even though moving them might
cause injury?

Expected: Zero conflicts (all worldviews agree on helping in emergency)
Expected Confidence: Very High
Expected Minority Views: Empty
```

---

## 📊 Test Coverage Summary

### Domains Covered
- ✅ Healthcare (3 scenarios)
- ✅ Spiritual (3 scenarios)
- ✅ Education (2 scenarios)
- ✅ Vocational (3 scenarios)
- ✅ Environmental (2 scenarios)
- ✅ Interpersonal (2 scenarios)
- ✅ Intellectual (2 scenarios)
- ✅ General (1 scenario)

### Conflict Levels Covered
- ✅ None (1 scenario)
- ✅ Low (2 scenarios)
- ✅ Moderate (4 scenarios)
- ✅ High (6 scenarios)
- ✅ Very High (5 scenarios)

### Edge Cases Covered
- ✅ Minimum length (10 chars)
- ✅ Maximum length (5000 chars)
- ✅ Empty fields
- ✅ Special characters
- ✅ Unicode/multi-language
- ✅ Multiple domain keywords
- ✅ No domain keywords
- ✅ Consensus scenarios (all agree)
- ✅ Maximum conflict (fundamental disagreement)

### UI Components Covered
- ✅ ScenarioInput
- ✅ ConflictMap (D3.js)
- ✅ IntegratedJudgment
- ✅ WorldviewCard
- ✅ HistoryTable
- ✅ Settings forms
- ✅ Navigation
- ✅ Empty states
- ✅ Loading states
- ✅ Error states

### User Workflows Covered
- ✅ First-time user journey
- ✅ Repeat deliberation
- ✅ History review
- ✅ Settings customization
- ✅ Data export/import
- ✅ Worldview exploration

---

## 🚀 Quick Start Testing

### Priority 1: Core Functionality (15 mins)
1. Test Scenario 1.1 (Healthcare - End of Life)
2. Test UI Test 1 (Component Integration)
3. Test Integration 1 (End-to-End Workflow)

### Priority 2: Domain Coverage (30 mins)
1. One scenario from each domain (8 total)
2. Verify domain detection
3. Verify appropriate worldview weights

### Priority 3: Edge Cases (20 mins)
1. Test Edge 1, 2 (min/max length)
2. Test Edge 10 (consensus)
3. Test Conflict 1 (high conflict)

### Priority 4: Full Suite (2 hours)
1. All domain scenarios
2. All edge cases
3. All UI tests
4. All integration tests
5. Sample performance tests
6. Sample accessibility tests

---

**Total Scenarios**: 50+
**Estimated Full Testing Time**: 3-4 hours
**Recommended Testing Order**: Priority 1 → Priority 2 → Priority 3 → Priority 4
