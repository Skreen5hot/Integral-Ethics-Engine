# Phenomenalism Worldview - Value Hierarchy Complete

**Date**: December 22, 2025
**Status**: ✅ COMPLETE - **Phase 1 Material-Empirical Cluster Finalized**
**File**: `ontology/phenomenalism-values.ttl`
**Lines**: 900+
**Tests**: 12/12 passing (100%)

---

## 🎉 **PHASE 1 MATERIAL-EMPIRICAL CLUSTER NOW COMPLETE**

With phenomenalism-values.ttl, the foundational Material-Empirical cluster is now fully realized:

1. ✅ **Materialism** - Physical substance primary
2. ✅ **Realism** - Mind-independent objects primary
3. ✅ **Sensationalism** - Qualitative experience primary (aesthetic)
4. ✅ **Phenomenalism** - Phenomenal appearances primary (epistemic)

---

## 🎯 Purpose

The Phenomenalism ontology grounds values in **subjective certainty**, **perceptual validity**, and **phenomenal coherence** achieved through rigorous phenomenological method (Husserlian epoché, bracketing, eidetic intuition).

**Key Innovation**: Completes Material-Empirical cluster with empiricist epistemology (experience primary) WITHOUT materialist metaphysics (brackets material reality claims). Focuses on **validity** (epistemic) rather than **quality** (aesthetic) of experience.

---

## 📐 Philosophical Foundation

### Husserl's Phenomenology

**Core Insight**: We have direct access only to **phenomena** (appearances as given to consciousness), not "things-in-themselves." Phenomenology brackets metaphysical assumptions to describe phenomenal structures rigorously.

### The Phenomenological Method:

1. **Natural Attitude**: Naïve realism (assuming objective world exists)
2. **Epoché (Bracketing)**: Suspend metaphysical assumptions about reality
3. **Phenomenological Reduction**: Describe phenomena as purely given to consciousness
4. **Eidetic Intuition**: Grasp essential structures through imaginative variation
5. **Intentionality**: Consciousness is always consciousness-of-something

**Husserl's Motto**: *"Zu den Sachen selbst!"* (To the things themselves!)

---

## 🏗️ BFO Architecture

### Terminal Values (Highest Goods):

```turtle
:SubjectiveCertainty a :TerminalValue ;
    :groundedIn :PhenomenalismMetaphysics ;
    :primacy "highest" ;
    :salience "very_high" ;
    :realizableAs vn-schwartz:SelfDirectionDisposition (0.9) ;
    :realizableAs vn-schwartz:SecurityDisposition (0.7) ;
    skos:definition "Subjective certainty achieved through rigorous phenomenological
                     description of how phenomena are given to consciousness, independent
                     of metaphysical claims about external reality." .

:PerceptualValidity a :TerminalValue ;
    :primacy "high" ;
    :realizableAs vn-schwartz:SelfDirectionDisposition (0.85) ;
    :realizableAs vn-schwartz:UniversalismDisposition (0.6) ;
    skos:definition "Validity of perceptual experience when perceptual intentions
                     are adequately fulfilled in intuitive givenness." .

:InterpretiveHonesty a :TerminalValue ;
    :primacy "high" ;
    :realizableAs vn-schwartz:SelfDirectionDisposition (0.9) ;
    skos:definition "Authentic interpretation of phenomena as they genuinely appear,
                     resisting conformity to conventional interpretations." .

:PhenomenalCoherence a :TerminalValue ;
    :primacy "high" ;
    :realizableAs vn-schwartz:ConformityDisposition (0.65) ;
    :realizableAs vn-schwartz:SecurityDisposition (0.7) ;
    skos:definition "Internal coherence of phenomenal experience across time and contexts,
                     enabling unified experiential world." .
```

### BFO Process Modeling:

```turtle
:PhenomenologicalReduction a owl:Class ;
    rdfs:subClassOf bfo:0000015 ;  # process
    bfo:0000057 :Phenomenologist ;  # has_participant
    :hasSubProcesses :Bracketing, :EideticReduction, :TranscendentalReduction ;
    cco:has_input :NaturalAttitudeExperience ;
    cco:has_output :PhenomenologicallyDescribedStructure .

:Bracketing a owl:Class ;
    rdfs:subClassOf bfo:0000015 ;  # process
    :suspends :NaturalAttitude ;
    :reveals :PureAppearance ;
    skos:definition "Epoché 'puts out of play' natural attitude's existential positing." .

:EideticIntuition a owl:Class ;
    rdfs:subClassOf bfo:0000015 ;  # process
    :method "Imaginative variation" ;
    cco:has_input :ParticularPhenomenon ;
    cco:has_output :EssenceStructure ;
    skos:definition "Grasping essential structures through systematic imaginative
                     variation to see what must remain invariant." .
```

### BFO Quality Substrates:

```turtle
:PhenomenologicalAttitude a owl:Class ;
    rdfs:subClassOf bfo:0000019 ;  # quality
    bfo:0000052 :Phenomenologist ;  # inheres_in
    :opposedTo :NaturalAttitude ;
    skos:definition "Reflective awareness of how phenomena are given, with
                     existential judgments suspended (epoché)." .

:IntentionalStructure a owl:Class ;
    rdfs:subClassOf bfo:0000019 ;  # quality
    :hasComponents :NoeticAct, :NoematicObject ;
    :fundamentalLaw "Consciousness is always consciousness-of-something (intentionality)" .
```

---

## 🔑 Key Distinctions

### From Sensationalism:
- **Sensationalism**: Quality (aesthetic) of experience primary
- **Phenomenalism**: Validity (epistemic) of experience primary
- **Example**: A beautiful illusion has aesthetic value (sensationalism) but lacks epistemic validity (phenomenalism)

### From Realism:
- **Realism**: Mind-independent objects exist; correspondence truth
- **Phenomenalism**: Brackets mind-independence claims; validity in intention-fulfillment
- **Key**: Phenomenalism is **agnostic** about objective reality, not **denying** it

### From Idealism:
- **Idealism**: Consciousness constitutes reality
- **Phenomenalism**: Phenomena given TO consciousness, not constituted BY it
- **Key**: Phenomenalism more modest - describes givenness, doesn't explain constitution

### From Materialism:
- **Materialism**: Material substance ontologically primary
- **Phenomenalism**: Material objects are phenomenal constructs
- **Key**: Physical science presupposes life-world; can't reduce consciousness to physical without circularity (Husserl's *Crisis*)

---

## 📊 Value Hierarchy Summary

### **Terminal Values** (Highest Goods):

| Value | Salience | Primary Disposition Mappings |
|-------|----------|------------------------------|
| **Subjective Certainty** | Very High | Self-Direction (0.9), Security (0.7) |
| **Perceptual Validity** | High | Self-Direction (0.85), Universalism (0.6) |
| **Interpretive Honesty** | High | Self-Direction (0.9), Universalism (0.55) |
| **Phenomenal Coherence** | High | Conformity (0.65), Security (0.7) |

### **Constitutive Values** (Components):

| Value | Constitutes | Disposition Mappings |
|-------|-------------|----------------------|
| **Eidetic Insight** | Subjective Certainty | Universalism (0.7) |
| **First-Person Evidence** | Perceptual Validity | Self-Direction (0.85) |
| **Bracketing Rigor** | Interpretive Honesty | Self-Direction (0.85) |
| **Intersubjective Validation** | Phenomenal Coherence | Universalism (0.65) |

### **Instrumental Values** (Means):

| Value | Instrumental To | Disposition Mappings |
|-------|-----------------|----------------------|
| **Descriptive Precision** | Subjective Certainty, Interpretive Honesty | Self-Direction (0.75), Achievement (0.6) |
| **Phenomenological Training** | Subjective Certainty, Eidetic Insight | Self-Direction (0.8), Achievement (0.7) |
| **Reflective Practice** | Interpretive Honesty, First-Person Evidence | Self-Direction (0.75) |

### **Subordinated Values** (Devalued):

| Value | Salience | Why Subordinated |
|-------|----------|------------------|
| **Objective Reality** | Low | Epoché brackets existence claims; metaphysical speculation beyond phenomenal givenness |
| **Material Causation** | Very Low | Physical theory is constituted meaning, not ontological foundation |
| **Aesthetic Beauty** | Moderate | Beauty subordinated to validity; beautiful illusions still invalid |
| **Practical Utility** | Low | Phenomenological attitude suspends practical interests for pure theory |

---

## 🔬 Worked Scenarios

### Scenario 1: Scientific Theory Choice

**Context**: Two theories with equivalent empirical adequacy

**Phenomenalist Evaluation**:
```turtle
:judgment "neutral_to_positive_IF_phenomenologically_grounded" ;
:reasoning "Phenomenalism brackets metaphysical realism; theories valued if they
           systematically describe phenomenal regularities ('saving appearances')
           rather than claiming metaphysical truth." ;
:valuedCriteria :DescriptiveAdequacy, :PhenomenalCoherence, :SystematicDescription ;
:bracketed :MetaphysicalTruthClaims ;
:preferenceFactors "Theoretical elegance, phenomenological coherence, descriptive
                    precision - not 'correspondence to reality'" ;
:philosophicalGrounding "Mill (1865): Theories are 'permanent possibilities of sensation.'" .
```

**Key Insight**: Instrumentalist about scientific theories - valued for descriptive adequacy, not metaphysical truth.

### Scenario 2: Mystical Experience

**Context**: Evaluating mystical experience as knowledge

**Phenomenalist Evaluation**:
```turtle
:judgment "positive_as_phenomenal_datum" ;
:reasoning "Mystical experience has phenomenal validity - it appears/is given in
           distinctive way. Phenomenology brackets metaphysical question (Does it
           reveal transcendent reality?) to describe experience rigorously." ;
:valuedAspects :FirstPersonEvidence, :PhenomenalClarity, :NoeticQuality ;
:bracketed :MetaphysicalInterpretation ;
:methodologicalNote "Can describe structure of mystical experience (intentional
                     structure, temporal character, affective tone) without judging
                     metaphysical claims" .
```

**Key Insight**: Mystical experience is legitimate phenomenal datum even if metaphysical interpretation is bracketed.

### Scenario 3: Ethical Disagreement

**Context**: Resolving ethical disagreement

**Phenomenalist Evaluation**:
```turtle
:judgment "focus_on_shared_phenomenal_structures" ;
:reasoning "Phenomenalism brackets metaphysical moral realism; focuses on
           phenomenological description of moral experience (shame, guilt,
           obligation's 'felt bindingness')." ;
:valuedMethod :PhenomenologicalDescription, :IntersubjectiveValidation ;
:approach "Describe HOW moral obligations appear/are given (phenomenology of ethics)
          rather than assuming objective moral facts or subjective preferences" ;
:philosophicalGrounding "Levinas (1961): Ethics as first philosophy - ethical encounter
                        is phenomenologically primordial. Obligation appears in face of other." .
```

**Key Insight**: Phenomenological ethics describes moral experience without assuming moral realism or emotivism.

---

## 📚 Philosophical Sources (Major)

### Husserlian Phenomenology (Foundational):
- **Husserl, E. (1913/1983)**. *Ideas Pertaining to a Pure Phenomenology*. Martinus Nijhoff.
- **Husserl, E. (1931/1960)**. *Cartesian Meditations*. Martinus Nijhoff.
- **Husserl, E. (1936/1970)**. *The Crisis of European Sciences and Transcendental Phenomenology*. Northwestern.

### Existential Phenomenology:
- **Heidegger, M. (1927/1962)**. *Being and Time*. Harper & Row.
- **Merleau-Ponty, M. (1945/2012)**. *Phenomenology of Perception*. Routledge.
- **Sartre, J.-P. (1943/1956)**. *Being and Nothingness*. Washington Square Press.
- **Levinas, E. (1961/1969)**. *Totality and Infinity*. Duquesne University Press.

### Contemporary Phenomenology:
- **Zahavi, D. (2003)**. *Husserl's Phenomenology*. Stanford University Press.
- **Gallagher, S., & Zahavi, D. (2012)**. *The Phenomenological Mind* (2nd ed.). Routledge.
- **Moran, D. (2000)**. *Introduction to Phenomenology*. Routledge.

### Embodied/Neurophenomenology:
- **Varela, F. J., Thompson, E., & Rosch, E. (1991)**. *The Embodied Mind*. MIT Press.
- **Thompson, E. (2007)**. *Mind in Life: Biology, Phenomenology, and the Sciences of Mind*. Harvard.
- **Gallagher, S. (2005)**. *How the Body Shapes the Mind*. Oxford University Press.

### Empirical Phenomenological Research:
- **Giorgi, A. (2009)**. *The Descriptive Phenomenological Method in Psychology*. Duquesne.
- **Moustakas, C. (1994)**. *Phenomenological Research Methods*. SAGE.
- **Smith, J. A., Flowers, P., & Larkin, M. (2009)**. *Interpretative Phenomenological Analysis*. SAGE.

**Total Citations**: 35+ (philosophical) + 15+ (empirical phenomenological research)

---

## 🔗 Integration with Material-Empirical Cluster

### Complementarities and Tensions:

```turtle
:Phenomenalism rdfs:seeAlso :Sensationalism, :Idealism, :Realism ;
    :complementaryTo :Realism ;  # Along Object-Subject axis
    :affinityWith :Sensationalism ;  # Both empiricist, but different foci
    :conflictsWith :Materialism ;  # Material objects are phenomenal constructs
    :clusterMembership :MaterialEmpirical .
```

### Material-Empirical Cluster Complete:

| Worldview | Foundation | Primacy | Epistemology |
|-----------|------------|---------|--------------|
| **Materialism** | Material substance | Physical | Empirical observation of matter |
| **Realism** | Mind-independent objects | Objective | Correspondence to external reality |
| **Sensationalism** | Qualitative experience | Aesthetic | Direct sensory intuition of qualities |
| **Phenomenalism** | Phenomenal appearances | Epistemic validity | Phenomenological reduction, bracketing |

**Shared Commitment**: All four prioritize **experience/empirical** over abstract reason (vs. rationalism/idealism).

**Key Differences**:
- **Materialism**: Material → Experience (reductionist)
- **Realism**: Objects → Experience (representational)
- **Sensationalism**: Experience primary (quality/aesthetic)
- **Phenomenalism**: Experience primary (validity/epistemic)

---

## 💡 Key Methodological Insights

### 1. **Epoché (Bracketing)**

**What It Is**: Suspending (not denying) existence claims to focus on appearances

**Not**: Skepticism denying reality
**Is**: Methodological agnosticism to see phenomena purely

**Analogy**: Like mathematician brackets a term to work on it separately. Phenomenologist brackets existence to examine appearance purely.

**Husserl**: "We put the world 'in brackets,' out of action."

### 2. **Eidetic Intuition**

**What It Is**: Grasping essential structures through imaginative variation

**Method**:
1. Start with example (particular triangle)
2. Vary features imaginatively (color, size, orientation)
3. Observe what remains invariant (three-sidedness)
4. Grasp essence: What MUST be present for this to be THAT

**Example**: Essence of 'melody' = temporal succession of tones with Gestalt unity. Color optional; temporality essential.

**Type of Knowledge**: A priori, necessary, universal (like mathematics)

### 3. **Intentionality**

**Husserl's Breakthrough**: Consciousness is not inner realm but always **directed toward** objects

**Structure**: Noesis (act-side) ↔ Noema (object-side)
- **Noesis**: Perceiving, imagining, judging, remembering
- **Noema**: Perceived, imagined, judged, remembered

**Inseparable**: Cannot have act without object or object without act

**Revolution**: No "veil of ideas" between mind and world - consciousness already at objects through intentionality

### 4. **Natural vs. Phenomenological Attitude**

| Natural Attitude | Phenomenological Attitude |
|------------------|---------------------------|
| Unreflective | Reflective |
| Assumes objective world | Suspends existence claims |
| Practical engagement | Theoretical wonder |
| Absorbed in world | Notices how world appears |
| Default mode | Cultivated through training |

**Key**: Phenomenological attitude must be **learned** - natural attitude deeply entrenched.

---

## ✅ Test Results

```
📊 Test Results: 12/12 passed (100.0%)
✅ PASSED: valuenet-integration.test.js (165ms) [12/12 tests]
⏱️  Total Duration: 225ms
```

All existing IEE tests continue to pass with phenomenalism-values.ttl addition.

---

## 📈 Applications

### 1. **First-Person Research**

Phenomenalism provides rigorous method for first-person experiential research:
- Neurophenomenology (Varela, Thompson): Integrate first-person phenomenological reports with neuroscience
- Qualitative research: IPA, descriptive phenomenology
- Consciousness studies: Systematic first-person methodology

### 2. **Epistemic Humility**

Phenomenalism models epistemic humility:
- Brackets metaphysical claims beyond phenomenal givenness
- Focus on "how things appear" not "how things really are"
- Relevant for Step 7 (Epistemic Humility) in value-conflict-resolution.ttl

### 3. **Lived Experience**

Phenomenalism honors lived experience as legitimate datum:
- Medical phenomenology: How illness is lived
- Educational phenomenology: Learning experience
- Ethical phenomenology: How moral obligations appear

### 4. **Anti-Reductionism**

Phenomenalism resists reductionism:
- First-person experience irreducible to third-person observation
- Life-world not reducible to mathematical physics
- Meaning-structures not reducible to causal mechanisms

---

## 🚀 Future Extensions

### 1. **Social Phenomenology**
- Schutz's phenomenology of social world
- Life-world structures
- Intersubjectivity and empathy

### 2. **Embodied Phenomenology**
- Merleau-Ponty's body phenomenology
- Enactivism and embodied cognition
- Sensorimotor intentionality

### 3. **Phenomenology of Morality**
- Levinas: Ethics as first philosophy
- Scheler: Phenomenology of values
- Moral emotions and felt obligations

### 4. **Phenomenological Psychology**
- Giorgi's descriptive method
- Clinical phenomenology
- Trauma phenomenology

### 5. **Integration with Idealism**
- Transcendental idealism (Kant, Husserl's later work)
- Phenomenological constitution
- Synthesis of phenomenalism and idealism (Phase 2)

---

## 🎯 Success Metrics

✅ **Completeness**: All terminal, constitutive, instrumental, and subordinated values specified
✅ **BFO Compliance**: Processes (reduction, bracketing, eidetic intuition), qualities (attitudes), ICE (descriptions)
✅ **Philosophical Rigor**: 35+ major phenomenological sources
✅ **Empirical Grounding**: 15+ empirical phenomenological research studies
✅ **ValueNet Integration**: Complete mappings with salience levels
✅ **Worked Scenarios**: 3 comprehensive examples demonstrating phenomenalist evaluation
✅ **Methodological Detail**: Epoché, eidetic intuition, intentionality thoroughly modeled
✅ **Cluster Integration**: Properly positioned within Material-Empirical cluster
✅ **Distinctions**: Clear differentiation from realism, sensationalism, materialism, idealism
✅ **Tests**: 12/12 passing (100%)

---

## 💡 Critical Insights

### 1. **Bracketing ≠ Denial**

Phenomenalism often misunderstood as denying objective reality. **False**.

**Epoché**: Methodological suspension, not metaphysical denial
- Like mathematician brackets term (suspension for analysis)
- Like scientist controls variables (isolation for study)
- **Agnostic**, not **atheistic** about objective reality

### 2. **Subjective Certainty ≠ Subjectivism**

Phenomenalism seeks **subjective certainty** but not arbitrary **subjectivism**.

**Key**: Subjective certainty about phenomenal structures is **inter-subjectively** validate through rigorous method. Like mathematics: subjective intuition of proofs but inter-subjectively valid.

### 3. **First-Person ≠ Solipsism**

Phenomenalism prioritizes first-person but not solipsistic.

**Intersubjectivity**: Phenomenology includes rigorous study of how we experience others (empathy, communication, shared world). Husserl: Objective world constituted intersubjectively.

### 4. **Validity ≠ Beauty**

**Critical distinction** from sensationalism:
- **Sensationalism**: Quality/beauty of experience is value criterion
- **Phenomenalism**: Validity/adequation of experience is value criterion

**Example**: Beautiful illusion has aesthetic value (sensationalism YES) but lacks epistemic validity (phenomenalism NO).

### 5. **Phenomena ≠ Appearances**

Common mistranslation creates confusion:

**"Phenomena" in phenomenology**: What is given to consciousness (Greek: *phainomena* = that which shows itself)

**NOT**: "Mere appearances" (implying illusory)

**IS**: "Appearances as such" (what shows itself in its showing)

### 6. **Phenomenology ≠ Anti-Science**

Husserl trained as mathematician; phenomenology not anti-scientific.

**Relationship**: Phenomenology is **foundational** for science
- Science presupposes life-world
- Mathematical physics is idealization of lived experience
- Phenomenology investigates *how* scientific knowledge is constituted

**Not**: Rejecting science
**Is**: Understanding science's foundations

### 7. **Method ≠ Metaphysics**

Phenomenology primarily a **method**, not metaphysical doctrine.

**Method**: Epoché, reduction, eidetic intuition
**Neutral**: Can combine with various metaphysics (realism, idealism, even materialism as Merleau-Ponty showed)

**Phenomenalism as worldview**: Specific metaphysical commitment (reality = phenomena)
**Phenomenology as method**: Neutral investigative technique

---

## 🏆 Achievement Summary

The Phenomenalism ontology successfully provides:

1. **Complete Value Hierarchy**: Terminal, constitutive, instrumental, subordinated values
2. **BFO-Compliant Modeling**: Processes (reduction, bracketing), qualities (attitudes), ICE (descriptions)
3. **Husserlian Method**: Epoché, phenomenological reduction, eidetic intuition thoroughly modeled
4. **Philosophical Depth**: 35+ phenomenological sources from Husserl to contemporary
5. **Empirical Grounding**: 15+ empirical phenomenological research citations
6. **ValueNet Integration**: Complete Schwartz disposition mappings with salience
7. **Worked Scenarios**: 3 examples (scientific theory, mystical experience, ethics)
8. **Critical Distinctions**: From sensationalism, realism, materialism, idealism
9. **Methodological Rigor**: Detailed modeling of phenomenological method
10. **Cluster Completion**: **Material-Empirical cluster now complete (Phase 1 finalized)**

**Result**: Rigorous, BFO-compliant phenomenalist value ontology grounding values in subjective certainty, perceptual validity, and phenomenal coherence achieved through Husserlian method.

---

## 🎉 **PHASE 1 COMPLETE**

### **Material-Empirical Cluster (4 Worldviews)**:

1. ✅ **Materialism** (physical substance primary)
2. ✅ **Realism** (mind-independent objects primary)
3. ✅ **Sensationalism** (qualitative experience primary - aesthetic)
4. ✅ **Phenomenalism** (phenomenal appearances primary - epistemic)

### **Cross-Cutting Foundations (4 Ontologies)**:

1. ✅ **moral-character.ttl** (850+ lines, character as BFO dispositions)
2. ✅ **worldview-relationships.ttl** (520 lines, complementarities and clusters)
3. ✅ **value-conflict-resolution.ttl** (950+ lines, 7-step integration procedure)
4. ✅ **domain-contextualization.ttl** (1,150+ lines, 8 domains with worldview weights)

### **Phase 1 Statistics**:

- **Total Ontology Lines**: 5,200+
- **Total Citations**: 200+ (philosophical + empirical)
- **Worldviews Complete**: 4/12 (Material-Empirical cluster)
- **Foundation Ontologies**: 4/4 critical cross-cutting ontologies
- **Tests**: 12/12 passing (100%)
- **BFO Compliance**: Full across all ontologies

---

**Date Completed**: December 22, 2025
**Status**: ✅ **PHASE 1 FOUNDATION COMPLETE**
**Next Recommended**: Begin **Phase 2** (Process-Individual cluster: Dynamism, Monadism, Idealism, Rationalism)
