# Optimized Demo Scenarios for IEE

**Purpose**: These scenarios are crafted to use TagTeam's exact polarity indicator phrases, maximizing reliable value detection and proper polarity assignment.

**Key Insight**: TagTeam v3.0 detects values based on specific phrase patterns (e.g., "obtain consent" triggers Consent+1, "relieve suffering" triggers Compassion+1). These scenarios use those exact patterns.

---

## Scenario 1: Medical Care with Full Consent (Recommended Lead Demo)

**Domain**: Healthcare

**Scenario Text**:
> A physician seeks permission from the patient and obtains informed consent before treatment. The doctor helps the patient understand risks, respects their wishes, and promotes their welfare while ensuring safety.

**Why This Works**:
- "seeks permission" → Consent +1
- "obtains informed consent" → Consent +1, Autonomy +1
- "helps the patient" → Beneficence +1
- "respects their wishes" → Autonomy +1, Respect for Persons +1
- "promotes their welfare" → Beneficence +1
- "ensuring safety" → Non-maleficence +1

**Expected Values Detected**:
| Value | Polarity | Why |
|-------|----------|-----|
| Consent | +1 | "seeks permission", "obtains informed consent" |
| Autonomy | +1 | "respects their wishes", "informed consent" |
| Beneficence | +1 | "helps", "promotes their welfare" |
| Non-maleficence | +1 | "ensuring safety" |
| Respect for Persons | +1 | "respects their wishes" |

**Expected Judgment**: Permissible (multiple values upheld, none violated)

---

## Scenario 2: Ethical Violation (Demonstrates Violation Detection)

**Domain**: Business

**Scenario Text**:
> A company coerces employees to work overtime without consent. They cause harm by ignoring safety concerns, discriminate in hiring, and refuse assistance to injured workers.

**Why This Works**:
- "coerces" → Autonomy -1
- "without consent" → Consent -1
- "cause harm" → Non-maleficence -1
- "discriminate" → Equality -1, Justice -1
- "refuse assistance" → Beneficence -1

**Expected Values Detected**:
| Value | Polarity | Why |
|-------|----------|-----|
| Autonomy | -1 | "coerces" |
| Consent | -1 | "without consent" |
| Non-maleficence | -1 | "cause harm" |
| Equality | -1 | "discriminate" |
| Beneficence | -1 | "refuse assistance" |

**Expected Judgment**: Impermissible (multiple values violated)

---

## Scenario 3: Community Fair Distribution

**Domain**: Governance

**Scenario Text**:
> A local council ensures fair distribution of emergency supplies. They maintain transparency in decision-making, protect human rights, and show equal treatment for all residents regardless of background.

**Why This Works**:
- "fair distribution" → Justice +1
- "transparency" → Transparency +1
- "protect human rights" → Human Rights +1
- "equal treatment" → Equality +1

**Expected Values Detected**:
| Value | Polarity | Why |
|-------|----------|-----|
| Justice | +1 | "fair distribution" |
| Transparency | +1 | "maintain transparency" |
| Human Rights | +1 | "protect human rights" |
| Equality | +1 | "equal treatment" |

**Expected Judgment**: Permissible

---

## Scenario 4: Mixed Ethical Dilemma

**Domain**: Healthcare

**Scenario Text**:
> To promote the welfare of the community and ensure safety, a health authority mandates vaccination. While this may override individual decision for some who object, it protects vulnerable populations and shows compassion for those at risk.

**Why This Works**:
- "promote the welfare" → Beneficence +1
- "ensure safety" → Non-maleficence +1
- "override individual decision" → Autonomy -1
- "protects" → Protection +1
- "shows compassion" → Compassion +1

**Expected Values Detected**:
| Value | Polarity | Why |
|-------|----------|-----|
| Beneficence | +1 | "promote the welfare" |
| Non-maleficence | +1 | "ensure safety" |
| Autonomy | -1 | "override individual decision" |
| Protection | +1 | "protects vulnerable" |
| Compassion | +1 | "shows compassion" |

**Expected Judgment**: Problematic (mixed - values both upheld and violated)

---

## Scenario 5: Privacy and Technology

**Domain**: Business

**Scenario Text**:
> A company protects user privacy by maintaining confidentiality of personal data. They seek permission before data collection, show respect for users, and are transparent about their practices.

**Why This Works**:
- "protects user privacy" → Privacy +1
- "maintaining confidentiality" → Privacy +1
- "seek permission" → Consent +1
- "show respect" → Respect for Persons +1
- "transparent" → Transparency +1

**Expected Values Detected**:
| Value | Polarity | Why |
|-------|----------|-----|
| Privacy | +1 | "protects privacy", "maintaining confidentiality" |
| Consent | +1 | "seek permission" |
| Respect for Persons | +1 | "show respect" |
| Transparency | +1 | "transparent" |

**Expected Judgment**: Permissible

---

## Demo Flow Recommendation

### For a 15-minute demo:

1. **Lead with Scenario 1** (Medical Care) - Shows clear permissible judgment with multiple values
2. **Show Scenario 2** (Ethical Violation) - Demonstrates the system catching ethical violations
3. **End with Scenario 4** (Mixed Dilemma) - Shows nuanced "problematic" judgment with worldview disagreement

### Key Talking Points:

1. "Notice how the system detected [X] values automatically from the text"
2. "The polarity shows whether each value is being upheld (+1) or violated (-1)"
3. "Different philosophical worldviews reach different conclusions - this isn't a bug, it's showing genuine ethical tension"
4. "The integrated judgment synthesizes all 12 perspectives"

---

## Technical Notes

### TagTeam Phrase Patterns Used

These exact phrases trigger reliable detection:

**Positive Polarity (+1)**:
- Consent: "obtain consent", "seek permission", "informed agreement"
- Autonomy: "free choice", "respect wishes", "voluntary decision"
- Compassion: "show compassion", "relieve suffering", "comfort"
- Beneficence: "promote welfare", "help", "benefit", "improve well-being"
- Non-maleficence: "avoid harm", "ensure safety", "minimize risk"
- Justice: "fair distribution", "due process"
- Privacy: "protect privacy", "maintain confidentiality"

**Negative Polarity (-1)**:
- Consent: "without consent", "manipulate into"
- Autonomy: "coerce", "force", "override decision"
- Non-maleficence: "cause harm", "injure", "endanger"
- Equality: "discriminate", "bias against"
- Beneficence: "neglect", "refuse assistance", "abandon"

### Worldview Mapping

For Scenario 1 (Medical Care):
- **Monadism**: Should show +1 (Autonomy maps to autonomous_agency)
- **Materialism**: Should show +1 (Beneficence maps to physical_wellbeing)
- **Realism**: Should show +1 (Respect maps to personal_dignity)

---

## Known Limitations

Even with optimized scenarios, current TagTeam v3.0 may:
- Miss some synonyms (use exact phrases above)
- Return polarity=0 for values detected but without clear +1/-1 indicators
- Trigger false positives (e.g., "patient" → "Patience")

These limitations are documented in the TagTeam v3.1 requirements.
