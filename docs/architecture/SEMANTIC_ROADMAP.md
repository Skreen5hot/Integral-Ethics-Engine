# Semantic Roadmap - IEE Ontological Progression

**Status:** Living Document
**Version:** 1.0
**Date:** January 18, 2026
**Purpose:** Document the incremental progression from syntactic parsing to full ontological alignment

---

## Executive Summary

The Integral Ethics Engine (IEE) is pursuing a **methodologically sound, incremental approach** to semantic alignment. We are building from concrete implementation toward formal ontology, ensuring each tier is **semantically honest** while remaining **pragmatically deliverable**.

**Current Status:** **Tier 2.5/5** - Strong semantic foundation with value ontology in progress

**Philosophy:** Build a **Semantically Honest Middle Layer (SHML)** - rich enough for ethical reasoning, pragmatic enough to ship code.

---

## Semantic Maturity Model

### Tier 1: Semantic Role Extraction ✅ COMPLETE
**Capability:** Extract meaning-bearing structures from natural language

**Implementation:** TagTeam.js Week 1
- Agent-action-patient extraction
- Semantic frame classification (FrameNet-inspired)
- Modality detection (deontic: must, should, may)

**Ontological Commitments:**

#### 1.1 Agents are Intentional Beings
```
Commitment: Agents have intrinsic intentionality
Grounding: BFO → bfo:material entity with bfo:role of intentional agent
Not: Mere syntactic subjects (noun phrases)
But: Entities capable of purposeful action
```

**Evidence in Implementation:**
- Agent extraction prioritizes animate entities
- Distinguishes "I", "doctor", "family" (intentional) from "treatment", "report" (non-intentional)
- Captures collective intentionality ("family must decide")

#### 1.2 Actions are Processes with Temporal Extension
```
Commitment: Actions are processes, not instantaneous events
Grounding: BFO → bfo:process with bfo:temporal region
Not: Timeless predicates
But: Occurrents with beginning, middle, end
```

**Evidence in Implementation:**
- Tense tracking (past, present, progressive aspect)
- Modal operators indicate deontic temporality (obligation persists)
- "Deciding" is a process-frame, not a state-frame

#### 1.3 Semantic Frames are Event Schemas
```
Commitment: Frames capture event-type semantics
Grounding: FrameNet + BFO process types
Not: Mere verb categories
But: Structured event representations with roles
```

**Frames Implemented:**
- **Deciding** - Decision-making process (agent, options, criteria)
- **Questioning** - Interrogation process (questioner, questioned content)
- **Becoming_aware** - Discovery/realization process (agent, new knowledge)
- **Offenses** - Violation process (perpetrator, victim, norm)
- **Choosing** - Selection process (chooser, alternatives)

**Semantic Achievement:** ⭐⭐⭐⭐⭐ (5/5)
- Moves beyond syntax to **meaning**
- Captures **event structure** not just surface form
- Ontologically grounded in intentionality and process

---

### Tier 2: Context Intensity Semantics ✅ COMPLETE
**Capability:** Represent contextual dimensions as constitutive of meaning

**Implementation:** TagTeam.js Week 2a
- 12-dimensional context scoring (temporal, relational, consequential, epistemic)
- Process-aware representation
- Differentiated default assumptions

**Ontological Commitments:**

#### 2.1 Context is Constitutive, Not Decorative
```
Commitment: Context dimensions modify semantic content
Grounding: SHML → Process qualities are intrinsic to process identity
Not: Metadata or annotations
But: Essential properties of ethical situations
```

**Evidence:**
A decision with urgency=1.0 is **semantically different** from urgency=0.3
- Different obligations arise
- Different virtues are salient
- Different reasoning processes apply

#### 2.2 Temporal Context as Process Qualities
```
Commitment: Urgency, duration, reversibility are process qualities
Grounding: Whitehead's process philosophy + SHML
Not: Static attributes of decisions
But: Dynamic qualities of unfolding processes
```

**Temporal Dimensions:**
1. **Urgency** - Temporal pressure quality of the process
   - `bfo:quality` inhering in the decision-making process
   - Affects deliberation time, epistemic requirements

2. **Duration** - Temporal extent of impact
   - `bfo:temporal region` spanned by consequences
   - Permanent (1.0) vs momentary (0.0) are ontologically distinct

3. **Reversibility** - Temporal modality of process effects
   - Possibility of temporal "undoing"
   - Irreversible processes create **different obligations**

**Process Philosophy Integration:**
- Time is **constitutive** (Whitehead): A decision happening now ≠ same decision happening later
- Process **unities** not aggregates: Context dimensions form coherent wholes
- **Becoming** over being: Ethical situations are temporal becomings, not static states

#### 2.3 Relational Context as Social Ontology
```
Commitment: Relationships are ontologically fundamental
Grounding: Care ethics + relational ontology (Held, Noddings)
Not: Properties of isolated individuals
But: Constitutive relations between persons
```

**Relational Dimensions:**
1. **Intimacy** - Degree of relational depth
   - Not: Physical proximity
   - But: Existential interdependence (0.0 = stranger, 1.0 = self/immediate family)

2. **Power Differential** - Relational asymmetry
   - Not: Individual property ("powerful person")
   - But: Structural relation between persons
   - Captures vulnerability, authority, dependency

3. **Trust** - Relational quality enabling cooperation
   - Not: Belief state in individual
   - But: Bi-directional relational property
   - Affects epistemic and practical possibilities

**Social Ontology Integration:**
- Persons exist in **constitutive relations** (not atomistic individuals)
- Power is **relational** (exists only between entities)
- Care ethics: **Relationships generate obligations**

#### 2.4 Consequential Context as Axiological Ontology
```
Commitment: Consequences have objective moral weight
Grounding: Value realism + consequentialist framework
Not: Subjective preferences
But: Objective features of outcomes bearing moral significance
```

**Consequential Dimensions:**
1. **Harm Severity** - Axiological magnitude of negative value
   - Harm is **objective** (not mere dispreference)
   - Death (1.0) ≠ inconvenience (0.2) ontologically

2. **Benefit Magnitude** - Axiological magnitude of positive value
   - Well-being has **objective features**
   - Life-saving (1.0) vs slight improvement (0.2)

3. **Scope** - Distributive span of value
   - Global (1.0) vs individual (0.1)
   - Aggregative ethics: scope multiplies moral weight

**Axiological Commitments:**
- **Value realism**: Some states of affairs are objectively better than others
- **Commensurability** (weak): Different harms/benefits can be compared (with tolerance)
- **Non-additive**: Severity and scope interact, don't simply multiply

#### 2.5 Epistemic Context as Knowledge Conditions
```
Commitment: Knowledge states affect moral responsibility
Grounding: Epistemology + ethics interface
Not: Irrelevant to moral evaluation
But: Constitutive of moral agency
```

**Epistemic Dimensions:**
1. **Certainty** - Confidence in propositional knowledge
   - Affects **degree of responsibility**
   - Uncertain action (0.3) has different moral status than certain (0.9)

2. **Information Completeness** - Epistemic access
   - **Critical information missing** (0.2) creates different obligations
   - "Ought implies can know"

3. **Expertise** - Domain-specific epistemic competence
   - Expert (0.9) vs novice (0.2) have **different obligations**
   - Competence generates responsibility

**Epistemology Integration:**
- **Knowledge as justified true belief** (traditional)
- **Epistemic responsibility**: Agents obligated to know relevant facts
- **Moral luck**: Outcomes affect evaluation, but knowledge states affect responsibility

**Semantic Achievement:** ⭐⭐⭐⭐ (4/5)
- Context is **constitutive** not decorative
- **Process-aware** (SHML philosophy integrated)
- **Ontologically grounded** in multiple philosophical traditions
- Not yet **formally encoded** (lacks OWL/RDF representation)

---

### Tier 3: Value Semantics ⏳ IN PROGRESS (Week 2b)
**Capability:** Explicit normative content representation

**Implementation:** TagTeam.js Week 2b (Target: Feb 7, 2026)
- 50 ethical values across 5 domains
- Salience scoring (0.0-1.0)
- Polarity detection (+1 upheld, -1 violated, 0 conflicted)
- Conflict detection (value pluralism)

**Ontological Commitments:**

#### 3.1 Values as Abstract Entities
```
Commitment: Values are real abstract entities, not mere concepts
Grounding: BFO → bfo:generically dependent continuant
Not: Social constructions (relativism)
Not: Individual preferences (subjectivism)
But: Abstract entities that can be instantiated in particular situations
```

**Value Ontology:**
- **Universal**: Autonomy (the value itself) exists independently of particular instantiations
- **Particular**: This specific violation of autonomy in healthcare-001
- **Instantiation relation**: Particular bears the universal

**Anti-Relativism:**
- Values have **objective content** (autonomy means self-governance, not arbitrary)
- Cross-cultural recognition (though different weightings)
- Grounded in **human nature** (capabilities approach - Nussbaum)

#### 3.2 Value Domains as Ontological Categories
```
Commitment: The 5 domains represent distinct modes of ethical being
Grounding: Virtue ethics + care ethics + deontology + consequentialism + existentialism
Not: Arbitrary groupings
But: Fundamental ethical orientations
```

**Domain Ontology:**

**DIGNITY DOMAIN** (Kantian Deontology)
```
Core Commitment: Persons are ends-in-themselves
Grounding: Rational nature has absolute worth
Values: Human Dignity, Autonomy, Equality, Justice, Freedom, Rights,
        Respect for Persons, Privacy, Consent, Human Rights

Ontological Status: Categorical imperatives (universal, necessary)
Violation: Treating persons as mere means
```

**CARE DOMAIN** (Relational Ethics)
```
Core Commitment: Interdependence is fundamental to human existence
Grounding: Vulnerability + dependence are universal human conditions
Values: Compassion, Fidelity, Beneficence, Non-maleficence, Care,
        Love, Kindness, Empathy, Forgiveness, Mercy

Ontological Status: Relational obligations (particular, contextual)
Violation: Abandonment, neglect of dependent others
```

**VIRTUE DOMAIN** (Aristotelian Teleology)
```
Core Commitment: Human excellence is the telos of ethical life
Grounding: Eudaimonia (flourishing) as natural end
Values: Integrity, Honesty, Courage, Humility, Wisdom, Temperance,
        Patience, Generosity, Gratitude, Authenticity

Ontological Status: Character excellences (developmental)
Violation: Vice, character deficiency, self-betrayal
```

**COMMUNITY DOMAIN** (Social Ethics)
```
Core Commitment: Common good transcends individual interests
Grounding: Social nature of human beings (zoon politikon)
Values: Solidarity, Common Good, Stewardship, Peace, Inclusion,
        Diversity, Transparency, Accountability, Service, Democracy

Ontological Status: Collective obligations (systemic)
Violation: Individualism that harms collective, injustice
```

**TRANSCENDENCE DOMAIN** (Existential/Spiritual)
```
Core Commitment: Meaning-making is essential to human existence
Grounding: Existentialism + theology (ultimate concerns - Tillich)
Values: Meaning, Spiritual Growth, Sacred/Holy, Hope, Faith,
        Transcendence, Mystery, Reverence, Grace, Self-care

Ontological Status: Ultimate concerns (existential)
Violation: Meaninglessness, spiritual death, despair
```

**Domain Relations:**
- **Not mutually exclusive**: Same situation activates multiple domains
- **Complementary**: Dignity grounds Care, Virtue enables Community
- **Tensions**: Autonomy (Dignity) may conflict with Care obligations

#### 3.3 Frame-Value Entailments as Semantic Rules
```
Commitment: Event types semantically entail value relevance
Grounding: Frame semantics + deontic logic
Not: Mere correlations
But: Meaning-constitutive relations
```

**Entailment Examples:**
```
Semantic Rule: Deciding → Autonomy (salience +0.3)
Justification: Decision-making processes presuppose autonomous agency
Formalization: ∀x (Deciding(x) → Salient(Autonomy, x))

Semantic Rule: Offenses → Justice (salience +0.3)
Justification: Violations create justice claims
Formalization: ∀x (Offense(x) → Salient(Justice, x))

Semantic Rule: Questioning → Integrity (salience +0.3)
Justification: Self-examination presupposes integrity concerns
Formalization: ∀x (Questioning(x) → Salient(Integrity, x))
```

**Philosophical Grounding:**
- **Conceptual necessity**: "Deciding" contains "autonomy" in its very meaning
- Not empirical correlation: "decisions happen to involve autonomy"
- But semantic entailment: "to decide IS to exercise autonomy"

#### 3.4 Role-Value Mappings as Social Ontology
```
Commitment: Social roles carry normative content
Grounding: Role ethics + practice-based virtue ethics (MacIntyre)
Not: Job descriptions
But: Normatively thick social positions
```

**Role Ontology:**
```
Role: Doctor
Constitutive Values: Beneficence, Non-maleficence, Competence
Ontological Status: bfo:role that inheres in persons
Normative Force: To be a doctor IS to be bound by these values
Violation: A doctor who harms is failing AS A DOCTOR
```

**Examples:**
- **Doctor** → Beneficence, Non-maleficence (Hippocratic tradition)
- **Parent** → Care, Fidelity (parental role entails these)
- **Judge** → Justice, Impartiality (constitutive of judicial role)
- **Priest** → Sacred/Holy, Spiritual Growth (religious authority)

**MacIntyre's Practice Conception:**
- Roles are embedded in **practices** (medicine, parenting, law)
- Practices have **internal goods** (health, child flourishing, justice)
- Values are **standards of excellence** within practices

#### 3.5 Polarity as Normative Semantics
```
Commitment: Values can be upheld or violated (not just present/absent)
Grounding: Deontic logic + axiology
Not: Binary (relevant/irrelevant)
But: Tripartite (upheld +1, violated -1, conflicted 0)
```

**Polarity Ontology:**
```
+1 (Upheld): Value is being honored, protected, advanced
 0 (Conflicted): Value is both upheld and violated, or ambiguous
-1 (Violated): Value is being transgressed, harmed, denied

Ontological Status: Normative property of value instantiations
Not: Observer judgments
But: Objective features of situations (value realism)
```

**Conflict Detection = Value Pluralism:**
```
Commitment: Incommensurable values genuinely conflict
Grounding: Berlin's value pluralism + Williams' moral luck
Not: Apparent conflicts (resolvable by deeper principle)
But: Tragic conflicts (no resolution without loss)

Detection: polarity=0 AND conflict=true
Example: Autonomy (patient refuses) vs Beneficence (treatment needed)
```

**Philosophical Significance:**
- Rejects **monism** (single supreme value)
- Rejects **simple consequentialism** (values aren't all reducible to utility)
- Embraces **moral complexity** (some dilemmas have no right answer)

**Semantic Achievement (Projected):** ⭐⭐⭐⭐ (4/5)
- **Normative content** explicitly represented
- **Value ontology** grounded in philosophical traditions
- **Domain categories** capture different ethical orientations
- **Conflict detection** models value pluralism
- Not yet **formally inferential** (can't reason over values automatically)

---

### Tier 4: JSON-LD / Linked Data 📋 PLANNED (Months 2-3)
**Capability:** Machine-readable semantics with ontology alignment

**Implementation:** IEE Semantic Adapter Layer
- Add @context to TagTeam output
- Map to standard ontologies (BFO, FOAF, Dublin Core)
- Enable RDF triple generation
- Publish as Linked Data

**Ontological Commitments:**

#### 4.1 Semantic Web Integration
```
Commitment: Ethical knowledge should be part of semantic web
Grounding: Linked Open Data principles (Berners-Lee)
Not: Proprietary silo
But: Interoperable knowledge graph
```

**JSON-LD @context Example:**
```json
{
  "@context": {
    "@vocab": "http://iee.org/ontology/ethics#",
    "bfo": "http://purl.obolibrary.org/obo/BFO_",
    "foaf": "http://xmlns.com/foaf/0.1/",
    "dcterms": "http://purl.org/dc/terms/",

    "agent": {
      "@id": "bfo:0000023",
      "@type": "@id",
      "rdfs:label": "role",
      "rdfs:comment": "The agent is a material entity bearing the role of intentional actor"
    },

    "action": {
      "@id": "bfo:0000015",
      "@type": "@id",
      "rdfs:label": "process",
      "rdfs:comment": "The action is a process occurring in time"
    },

    "Autonomy": {
      "@id": "iee:autonomy_value",
      "@type": "bfo:0000020",
      "rdfs:label": "Autonomy",
      "rdfs:comment": "Abstract value of self-governance",
      "skos:broader": "iee:dignity_domain"
    },

    "urgency": {
      "@id": "iee:urgency_quality",
      "@type": "bfo:0000019",
      "rdfs:label": "urgency",
      "rdfs:comment": "Process quality of temporal pressure"
    }
  }
}
```

**RDF Triple Generation:**
```turtle
@prefix iee: <http://iee.org/ontology/ethics#> .
@prefix bfo: <http://purl.obolibrary.org/obo/BFO_> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

<scenario:healthcare-001> a iee:EthicalDilemma ;
    iee:hasAgent <agent:family> ;
    iee:hasAction <action:decide_001> ;
    iee:activatesValue <value:autonomy_instance_001> .

<agent:family> a bfo:0000040 ;  # material entity
    bfo:0000087 iee:intentional_agent_role .  # has role

<action:decide_001> a bfo:0000015 ;  # process
    iee:hasUrgency 0.8 ;
    iee:hasDuration 1.0 ;
    iee:hasReversibility 1.0 .

<value:autonomy_instance_001> a iee:ValueInstantiation ;
    iee:instantiates iee:autonomy_value ;
    iee:hasSalience 0.9 ;
    iee:hasPolarity -1 ;  # violated
    iee:hasEvidence "Patient unconscious, cannot express wishes" .
```

#### 4.2 Ontology Alignment Strategy

**BFO Alignment:**
- Agents → `bfo:material entity` with `bfo:role`
- Actions → `bfo:process` with `bfo:temporal region`
- Values → `bfo:generically dependent continuant`
- Context dimensions → `bfo:quality` (process qualities)

**FOAF Alignment (for persons):**
- Individual agents → `foaf:Person`
- Collective agents → `foaf:Group`
- Relational context → `foaf:knows` (intimacy)

**Dublin Core Alignment (metadata):**
- `dcterms:created` - timestamp
- `dcterms:subject` - domain classification
- `dcterms:description` - scenario text

**Domain-Specific Ontologies:**
- Medical scenarios → SNOMED CT, ICD
- Legal scenarios → Legal Ontology (LegalRuleML)
- Spiritual scenarios → Religious ontologies (if available)

#### 4.3 Linked Data Publishing

**URIs for Values:**
```
http://iee.org/values/autonomy
http://iee.org/values/beneficence
http://iee.org/values/justice
...
```

**Content Negotiation:**
- HTML (human-readable value description)
- RDF/XML (machine-readable)
- JSON-LD (developer-friendly)
- Turtle (semantic web standard)

**SPARQL Endpoint:**
Enable queries like:
```sparql
SELECT ?scenario ?value WHERE {
  ?scenario iee:activatesValue ?valueInst .
  ?valueInst iee:instantiates ?value ;
             iee:hasPolarity -1 .  # violated
  ?value skos:broader iee:dignity_domain .
}
# Returns: All scenarios violating dignity-domain values
```

**Semantic Achievement (Projected):** ⭐⭐⭐ (3/5)
- **Machine-readable** semantics
- **Interoperable** with other systems
- **Standard ontologies** (BFO, FOAF, DC)
- **Queryable** via SPARQL
- Not yet **inferential** (can't derive new knowledge automatically)

---

### Tier 5: BFO/SHML Full Alignment 🔮 FUTURE (Months 4-6)
**Capability:** Formal ontological grounding with automated reasoning

**Implementation:** OWL Ontology + Reasoner Integration
- Complete BFO alignment
- SHML process ontology formalization
- OWL-DL reasoning
- Automated inference of ethical properties

**Ontological Commitments:**

#### 5.1 Basic Formal Ontology (BFO) Complete Integration

**BFO Top-Level Categories:**
```
Entity
├─ Continuant (exists in full at any time)
│  ├─ Independent Continuant
│  │  ├─ Material Entity (agent: doctor, patient, family)
│  │  └─ Immaterial Entity (not used in IEE)
│  ├─ Specifically Dependent Continuant
│  │  ├─ Quality (urgency, trust, intimacy - inhere in processes/relations)
│  │  └─ Realizable Entity
│  │     ├─ Role (doctor role, parent role)
│  │     └─ Disposition (capacity for moral action)
│  └─ Generically Dependent Continuant
│     └─ Information Content Entity (parser output, value definitions)
│        └─ Abstract Entity (values themselves)
└─ Occurrent (happens/unfolds in time)
   └─ Process (action: deciding, questioning, discovering)
      └─ Process Boundary (beginning/end of ethical situation)
```

**IEE Mapping to BFO:**

**Agents:**
```owl
iee:IntentionalAgent rdfs:subClassOf bfo:0000040 .  # material entity
iee:IntentionalAgent rdfs:subClassOf [
  rdf:type owl:Restriction ;
  owl:onProperty bfo:0000087 ;  # has_role
  owl:someValuesFrom iee:AgentRole
] .

# Example:
<agent:doctor_smith> a iee:IntentionalAgent, bfo:0000040 ;
    bfo:0000087 <role:physician> .
```

**Actions:**
```owl
iee:EthicalAction rdfs:subClassOf bfo:0000015 .  # process

iee:DecidingProcess rdfs:subClassOf iee:EthicalAction ;
    rdfs:label "Deciding" ;
    iee:entailsValue iee:autonomy_value .

# Example:
<action:decide_001> a iee:DecidingProcess, bfo:0000015 ;
    bfo:0000199 <agent:family> ;  # has_participant
    iee:hasTemporalQuality <quality:urgency_001> .
```

**Values:**
```owl
iee:EthicalValue rdfs:subClassOf bfo:0000020 .  # generically dependent continuant

iee:autonomy_value a iee:EthicalValue, bfo:0000020 ;
    rdfs:label "Autonomy" ;
    skos:broader iee:dignity_domain ;
    rdfs:comment "The capacity for self-governance and independent decision-making" .

# Instantiation:
iee:ValueInstantiation rdfs:subClassOf bfo:0000020 .
<value_inst:autonomy_001> a iee:ValueInstantiation ;
    iee:instantiates iee:autonomy_value ;
    bfo:0000080 <scenario:healthcare-001> .  # generically_depends_on
```

**Context Dimensions:**
```owl
iee:ProcessQuality rdfs:subClassOf bfo:0000019 .  # quality

iee:Urgency rdfs:subClassOf iee:ProcessQuality ;
    rdfs:domain iee:EthicalAction ;
    rdfs:range xsd:float ;
    rdfs:comment "Temporal pressure quality inhering in ethical processes" .

# Example:
<quality:urgency_001> a iee:Urgency, bfo:0000019 ;
    bfo:0000052 <action:decide_001> ;  # inheres_in
    iee:hasNumericValue 0.8 .
```

#### 5.2 SHML Process Ontology Formalization

**SHML Core Principles:**

**1. Process Primacy**
```
Commitment: Processes are ontologically prior to substances
Anti-Commitment: Static entities with properties
Instead: Dynamic processes with qualities

BFO Integration:
- Occurrents (processes) are fundamental
- Continuants (entities) are abstractions from processes
- Qualities inhere in processes, not just entities
```

**2. Temporal Constitution**
```
Commitment: Time is constitutive of identity, not container
Formalization:
  - Every process has essential temporal region
  - Same process type at different times = different process token
  - Urgency, duration, reversibility are temporal modes
```

**3. Relational Ontology**
```
Commitment: Relations are as real as relata
Formalization:
  - Intimacy, power, trust are sui generis relations
  - Not reducible to properties of individuals
  - Bidirectional ontological dependence
```

**SHML Ontology Classes:**
```owl
shml:ProcessUnity rdfs:subClassOf bfo:0000015 .
  # Processes that form coherent wholes (not mere aggregates)

shml:TemporalMode rdfs:subClassOf bfo:0000019 .
  # Urgency, duration, reversibility as temporal modes

shml:RelationalQuality rdfs:subClassOf bfo:0000019 .
  # Intimacy, power, trust as relational qualities

shml:ContextualProcess rdfs:subClassOf shml:ProcessUnity .
  # Processes whose identity depends on context
```

**SHML Axioms:**
```owl
# Axiom 1: Every ethical action is a process unity
iee:EthicalAction rdfs:subClassOf shml:ProcessUnity .

# Axiom 2: Process unities have essential temporal modes
shml:ProcessUnity rdfs:subClassOf [
  rdf:type owl:Restriction ;
  owl:onProperty shml:hasTemporalMode ;
  owl:minCardinality 1
] .

# Axiom 3: Relational qualities require at least 2 participants
shml:RelationalQuality rdfs:subClassOf [
  rdf:type owl:Restriction ;
  owl:onProperty bfo:0000052 ;  # inheres_in
  owl:minCardinality 2
] .
```

#### 5.3 Information Content Entities (ICE)

**Per BFO Intentionality Document:**

**Parser Output as ICE:**
```owl
iee:SemanticAnalysis rdfs:subClassOf bfo:0000031 .  # generically dependent continuant
  # The output of TagTeam.parse() is an ICE

<analysis:healthcare-001-output> a iee:SemanticAnalysis, bfo:0000031 ;
    iee:aboutEntity <scenario:healthcare-001> ;
    iee:concretizes iee:autonomy_value ;  # makes abstract value concrete
    dcterms:created "2026-01-18T10:30:00Z"^^xsd:dateTime .
```

**Intentionality Relations:**
```owl
iee:aboutEntity rdfs:subPropertyOf iao:0000136 .  # is_about (IAO)
  # Semantic analysis is ABOUT the ethical scenario

iee:concretizes rdfs:subPropertyOf bfo:0000058 .  # concretizes
  # Analysis concretizes abstract value concepts

iee:prescribes rdfs:domain iee:ValueInstantiation ;
              rdfs:range iee:NormativeAction .
  # Value instantiations prescribe actions (deontic)
```

**Intentional Content:**
- Parser creates **representations** (ICEs)
- Representations are **about** ethical scenarios
- Representations **concretize** abstract values
- This preserves **semantic content** across transformations

#### 5.4 OWL-DL Reasoning

**Inference Rules:**

**Rule 1: Frame-Value Entailment**
```owl
# If process is Deciding, then Autonomy is salient
{
  ?process a iee:DecidingProcess .
}
=>
{
  ?valueInst a iee:ValueInstantiation ;
    iee:instantiates iee:autonomy_value ;
    iee:about ?process ;
    iee:hasSalience ?salience .
  FILTER(?salience >= 0.5)
}
```

**Rule 2: Role-Value Entailment**
```owl
# If agent has doctor role, then Beneficence is salient
{
  ?agent bfo:0000087 iee:PhysicianRole .
  ?process bfo:0000199 ?agent .
}
=>
{
  ?valueInst a iee:ValueInstantiation ;
    iee:instantiates iee:beneficence_value ;
    iee:about ?process ;
    iee:hasSalience ?salience .
  FILTER(?salience >= 0.6)
}
```

**Rule 3: Context-Obligation Inference**
```owl
# High urgency + high harm severity → Strong obligation
{
  ?process iee:hasUrgency ?urgency ;
           iee:hasHarmSeverity ?harm .
  FILTER(?urgency >= 0.8 && ?harm >= 0.8)
}
=>
{
  ?obligation a iee:StrongObligation ;
    iee:binds ?agent ;
    iee:regardingProcess ?process .
}
```

**Rule 4: Value Conflict Detection**
```owl
# If value has both upholding and violating evidence → Conflict
{
  ?valueInst iee:hasUpholdingEvidence ?evidence1 ;
             iee:hasViolatingEvidence ?evidence2 .
}
=>
{
  ?valueInst iee:hasConflict true ;
             iee:hasPolarity 0 .
}
```

**Automated Reasoning Capabilities:**
- **Subsumption**: Classify scenarios by ethical type
- **Consistency**: Detect logical contradictions in analysis
- **Entailment**: Derive implicit value activations from explicit frame/role data
- **Explanation**: Trace inference chains (why is Autonomy salient?)

#### 5.5 Integration with CCO (Common Core Ontologies)

**CCO Extensions:**
```owl
# Agent Ontology
iee:IntentionalAgent rdfs:subClassOf cco:Agent .
iee:MoralAgent rdfs:subClassOf iee:IntentionalAgent ;
  rdfs:comment "Agent capable of moral responsibility" .

# Event Ontology
iee:EthicalAction rdfs:subClassOf cco:Act .
iee:MoralDecision rdfs:subClassOf iee:EthicalAction, cco:DecisionMakingAct .

# Information Ontology
iee:ValueDefinition rdfs:subClassOf cco:InformationContentEntity .
iee:EthicalGuideline rdfs:subClassOf cco:Directive, iee:ValueDefinition .
```

**Semantic Achievement (Projected):** ⭐⭐⭐⭐⭐ (5/5)
- **Formally grounded** in BFO + SHML
- **Automated reasoning** over ethical structures
- **Inferential capability** (derive new knowledge)
- **Ontologically rigorous** (clear metaphysical commitments)
- **Interoperable** with broader ontology ecosystem

---

## Implementation Timeline

### Phase 1: Foundation (Complete) ✅
**Duration:** Weeks 1-2 (Jan 10-24, 2026)
**Tiers:** 1-2

**Deliverables:**
- ✅ Semantic role extraction (Tier 1)
- ✅ Context intensity analysis (Tier 2)
- ✅ 12-dimensional process-aware representation

**Semantic Milestones:**
- Ontological commitments documented
- Process philosophy integrated
- Social ontology captured

### Phase 2: Value Integration (In Progress) ⏳
**Duration:** Week 3-4 (Jan 27 - Feb 7, 2026)
**Tier:** 3

**Deliverables:**
- ⏳ 50-value ontology implementation
- ⏳ Frame-value entailment rules
- ⏳ Role-value mapping system
- ⏳ Polarity + conflict detection

**Semantic Milestones:**
- Value realism formalized
- Normative semantics operational
- Pluralism (conflict) recognized

### Phase 3: Linked Data (Planned) 📋
**Duration:** Months 2-3 (Feb-Mar 2026)
**Tier:** 4

**Deliverables:**
- IEE Semantic Adapter Layer
- JSON-LD @context for all output
- BFO/FOAF/DC alignment
- RDF triple store
- SPARQL endpoint

**Semantic Milestones:**
- Machine-readable semantics
- Linked Open Data publishing
- Cross-system interoperability

### Phase 4: Formal Ontology (Future) 🔮
**Duration:** Months 4-6 (Apr-Jun 2026)
**Tier:** 5

**Deliverables:**
- Complete OWL-DL ontology
- SHML formalization
- Reasoner integration (Pellet/HermiT)
- Automated inference rules
- CCO integration

**Semantic Milestones:**
- Full ontological grounding
- Automated reasoning
- Explanation generation
- Research publication

---

## Ontological Commitments Summary

### Metaphysical Commitments

**1. Process over Substance** (Whitehead, SHML)
- Reality is fundamentally processual
- Substances are abstractions from processes
- Time is constitutive, not container

**2. Relational Ontology** (Care Ethics, Social Ontology)
- Persons exist in constitutive relations
- Relationships generate obligations
- Power, intimacy, trust are sui generis relations

**3. Value Realism** (Moore, Parfit)
- Values are objective abstract entities
- Not reducible to preferences or conventions
- Can be instantiated in particular situations

**4. Intentionality** (BFO, Phenomenology)
- Agents have intrinsic intentionality
- Actions are purposeful processes
- Information entities are "about" things

### Ethical Commitments

**1. Pluralism** (Berlin, Williams)
- Multiple irreducible values exist
- Tragic conflicts are real (not resolvable)
- No single supreme value

**2. Domain Differentiation**
- Dignity, Care, Virtue, Community, Transcendence are distinct
- Different modes of ethical evaluation
- Complementary, not competitive

**3. Context Sensitivity** (Particularism)
- Context is constitutive of meaning
- Universal principles require contextual judgment
- No algorithm can replace practical wisdom

**4. Epistemic Humility**
- Uncertainty affects responsibility
- Knowledge gaps are ethically significant
- "Ought implies can know"

### Formal Commitments

**1. BFO as Upper Ontology**
- Top-level categories from BFO 2.0
- Continuant/Occurrent distinction fundamental
- Quality inheres in entity/process

**2. SHML as Middle Layer**
- Process-aware semantic representation
- Temporal modes essential
- Relational qualities irreducible

**3. OWL-DL as Formal Language**
- Description logic for reasoning
- Open World Assumption
- Monotonic inference

**4. JSON-LD as Exchange Format**
- Lightweight Linked Data
- RDF compatibility
- Developer-friendly

---

## Success Criteria by Tier

### Tier 1: Semantic Roles ✅
- [ ] ✅ Extracts agent, action, patient from 80%+ scenarios
- [ ] ✅ Classifies semantic frames with 75%+ accuracy
- [ ] ✅ Captures modality (must, should, may)
- [ ] ✅ Ontologically grounded (not mere syntax)

### Tier 2: Context Intensity ✅
- [ ] ✅ Scores all 12 dimensions (temporal, relational, consequential, epistemic)
- [ ] ✅ Achieves ±0.2 accuracy on 80%+ dimensions
- [ ] ✅ Uses differentiated defaults (not uniform 0.5)
- [ ] ✅ Recognizes process-aware semantics

### Tier 3: Values ⏳
- [ ] ⏳ Detects relevant values with 80%+ precision
- [ ] ⏳ Recalls 70%+ of human-identified values
- [ ] ⏳ Assigns polarity (+1, 0, -1) with 75%+ accuracy
- [ ] ⏳ Detects conflicts (value pluralism)
- [ ] ⏳ Frame-value entailments working

### Tier 4: Linked Data 📋
- [ ] 📋 JSON-LD @context for all output
- [ ] 📋 Valid RDF triples generated
- [ ] 📋 SPARQL queries return correct results
- [ ] 📋 Aligned with BFO, FOAF, Dublin Core
- [ ] 📋 Published as Linked Open Data

### Tier 5: Formal Ontology 🔮
- [ ] 🔮 Complete OWL-DL ontology (no inconsistencies)
- [ ] 🔮 Reasoner classifies scenarios correctly
- [ ] 🔮 Inference rules derive correct entailments
- [ ] 🔮 Explanation generation working
- [ ] 🔮 CCO integration complete

---

## Architectural Principles

### 1. Incremental Semantics
**Never lose ground** - each tier builds on previous, preserving semantics
- Tier 2 adds context WITHOUT losing Tier 1 roles
- Tier 3 adds values WITHOUT losing Tier 2 context
- Tier 4 adds linked data WITHOUT changing Tier 3 content

### 2. Semantic Honesty (SHML)
**Represent what we mean** - no claims beyond capabilities
- If we don't understand something, we mark it as uncertain
- If values conflict, we show conflict (not forced resolution)
- If context is ambiguous, we preserve ambiguity

### 3. Ontological Transparency
**Make commitments explicit** - document what we believe exists
- This roadmap makes all ontological commitments visible
- Researchers can evaluate metaphysical assumptions
- Enables principled disagreement and refinement

### 4. Pragmatic Delivery
**Ship working code** - don't wait for perfection
- Tier 1-2 deployable without Tier 5
- Each tier provides value independently
- Future tiers enhance, not replace, earlier work

---

## Research Contributions

This semantic roadmap represents **novel contributions** to ethical AI:

### 1. Process-Aware Ethical Ontology
**First formal ontology treating context as constitutive**
- Most ethical AI: context = metadata/features
- IEE/SHML: context = essential properties of processes
- Grounds in Whitehead + care ethics

### 2. Value Pluralism in Computational Ethics
**Explicit representation of incommensurable values**
- Most systems: single value function (utility)
- IEE: 50 values across 5 domains, conflicts preserved
- Aligns with Berlin, Williams, moral philosophy

### 3. Semantically Honest Middle Layer (SHML)
**Pragmatic semantic representation without ontological overcommitment**
- Strong enough for ethical reasoning
- Light enough to implement
- Path to formal ontology (not dead-end)

### 4. Incremental Ontological Alignment
**Methodology for building from code to formal ontology**
- Not: Design perfect ontology first
- But: Iterate from working system toward formalization
- Validates ontology through implementation

---

## Open Questions

### Philosophical
1. **Value Commensurability**: Can we numerically compare harms/benefits across domains?
2. **Moral Realism**: Are our value instantiations discovering or constructing ethical facts?
3. **Process Identity**: What makes a process "the same" across time?
4. **Collective Intentionality**: How do groups (family, organization) have intentions?

### Technical
1. **Scalability**: Can OWL reasoners handle 10,000+ scenarios in real-time?
2. **Uncertainty Propagation**: How do epistemic uncertainties compound through inference?
3. **Conflict Resolution**: Can we provide principled guidance when values conflict?
4. **Explanation Quality**: Will inference traces be comprehensible to users?

### Integration
1. **Cross-Domain Alignment**: How do medical ontologies (SNOMED) map to ethical ontologies?
2. **Multi-Lingual**: Can semantic content survive translation?
3. **Cultural Variation**: Are value weightings universal or culturally specific?
4. **Version Control**: How do we manage ontology evolution without breaking compatibility?

---

## Conclusion

The IEE semantic roadmap represents a **methodologically sound, philosophically grounded, and pragmatically executable** path from syntactic parsing to formal ontology.

**Current Achievement (Tier 2.5/5):**
- Strong semantic foundation ✅
- Process-aware representation ✅
- Ontological commitments explicit ✅
- Value integration in progress ⏳

**Unique Contributions:**
- Process philosophy in computational ethics
- Value pluralism with conflict detection
- Semantically honest middle layer (SHML)
- Incremental ontological alignment methodology

**Next Milestones:**
- Week 2b: Value semantics complete (Tier 3)
- Months 2-3: Linked Data publishing (Tier 4)
- Months 4-6: Formal ontology + reasoning (Tier 5)

This is not just **engineering** - it's **ontological engineering** with philosophical rigor and practical delivery.

---

**Document Status:** Living - will be updated as tiers progress
**Maintained By:** IEE Architecture Team
**Last Updated:** January 18, 2026
**Next Review:** February 7, 2026 (after Week 2b completion)
