# A Realist Ontological Model of Sincerity: A Prototype for Modeling Moral Character

## Abstract

This whitepaper presents a **BFO 2020-compliant ontological model of Sincerity** grounded in the Basic Formal Ontology (BFO) and Common Core Ontologies (CCO). It serves as a prototype for representing moral character within realist ontology frameworks. Sincerity, as a disposition realized in expressive acts and evaluable via information processing, is explored in detail with comprehensive citations to philosophical and empirical sources. The model is then generalized into a blueprint for modeling other moral character traits, offering a philosophically grounded, formally rigorous, interoperable structure for ethical discourse across belief systems.

**Keywords**: BFO, moral character, sincerity, virtue ethics, ontology, disposition, authenticity

---

## 1. Introduction

Character is foundational to ethical reasoning, yet ontological representations of character remain underdeveloped, especially in systems that prioritize realism and formal rigor. This paper proposes a **BFO 2020-compliant ontological model of Sincerity** as a test case for modeling character traits within the Basic Formal Ontology framework (Arp, Smith, & Spear, 2015). Drawing on CCO patterns and rooted in realist philosophy, we demonstrate how sincerity can be modeled in a way that is both operationalizable and respectful of diverse philosophical traditions.

**Motivation**: Existing moral ontologies often conflate descriptive and normative claims, making them unsuitable for multi-perspectival ethical reasoning. A realist approach models the **structures of reality** underlying ethical evaluations without asserting universal moral truths, enabling mediation between diverse value systems (Smith, 2016).

---

## 2. Philosophical Background

### 2.1 Sincerity in Moral Philosophy

The concept of *sincerity* has been central across moral traditions:

**Virtue Ethics (Aristotle)**:
- Aristotle does not use "sincerity" as a distinct virtue but discusses **truthfulness** (aletheia) as a virtue concerning self-presentation (Nicomachean Ethics IV.7, 1127a-1127b).
- The truthful person is a mean between the boaster (excess) and the self-deprecator (deficiency).
- Aristotle, *Nicomachean Ethics*, trans. W.D. Ross, Book IV, Chapter 7. Oxford University Press, 1925.

**Deontology (Kant)**:
- Kant's doctrine of the **Categorical Imperative** forbids lying as a violation of rational autonomy and human dignity (Groundwork 4:429-430).
- Kant emphasizes **inner truthfulness** - one must not deceive oneself about one's maxims.
- Kant, I. (1785/1997). *Groundwork of the Metaphysics of Morals*, trans. Mary Gregor. Cambridge University Press.

**Existentialism (Sartre)**:
- Sartre contrasts **authenticity** (living in accord with one's freedom) with **bad faith** (self-deception about one's freedom).
- Sincerity can itself be a form of bad faith if one identifies with a fixed essence.
- Sartre, J.-P. (1943/1956). *Being and Nothingness*, trans. Hazel E. Barnes, Part 1, Chapter 2. Philosophical Library.

**Contemporary Philosophy (Frankfurt)**:
- Frankfurt distinguishes **sincerity** from **authenticity**: sincerity is alignment between belief and assertion; authenticity is alignment between one's will and one's higher-order desires.
- Frankfurt, H. G. (1988). "The Importance of What We Care About." In *The Importance of What We Care About*, pp. 80-94. Cambridge University Press.
- Frankfurt, H. G. (2006). "On Truth, Lies, and Bullshit." In *On Bullshit*. Princeton University Press.

### 2.2 Empirical Research on Honesty and Deception

**Developmental Psychology**:
- Lee, K. (2013). Little Liars: Development of Verbal Deception in Children. *Child Development Perspectives*, 7(2), 91-96.
- Children develop lie-telling around age 3-4, with increasing sophistication through adolescence.

**Moral Psychology**:
- Bok, S. (1978). *Lying: Moral Choice in Public and Private Life*. Pantheon Books.
- Levine, E. E., & Schweitzer, M. E. (2015). Prosocial lies: When deception breeds trust. *Organizational Behavior and Human Decision Processes*, 126, 88-106.
- Distinguishes prosocial lies (benefiting others) from self-serving lies.

**Neuroscience of Deception**:
- Spence, S. A., et al. (2001). Behavioural and functional anatomical correlates of deception in humans. *NeuroReport*, 12(13), 2849-2853.
- Lying activates prefrontal cortex regions associated with executive control and inhibition.

**Personality Psychology**:
- Serota, K. B., Levine, T. R., & Boster, F. J. (2010). The prevalence of lying in America: Three studies of self-reported lies. *Human Communication Research*, 36(1), 2-25.
- Most people tell few lies; distribution heavily skewed (prolific liars account for most lies).

### 2.3 Realist Ontology and Moral Modeling

A realist ontological model seeks to avoid encoding normative claims directly. Instead, it models the **structures of reality** that underlie ethical evaluations, providing a common representational framework without asserting universal moral truths (Smith, 2016). In this way, ontologies can mediate between diverse value systems.

**Key Principle**: Model *what is* (descriptive), not *what ought to be* (normative), while enabling normative reasoning as a separate layer.

---

## 3. The Sincerity Model

### 3.1 Overview

The Sincerity model leverages **BFO 2020** (Arp, Smith, & Spear, 2015) and **CCO** (Civilian & Military Equipment Ontology, https://github.com/CommonCoreOntology/CommonCoreOntologies) to capture the following pattern:

**Core Structure**:
1. A **disposition** (`Sincerity`) that inheres in a **person**
2. The disposition depends on a **quality substrate** (`SinceritySubstrate`) that also inheres in the person
3. The disposition is **realized in** an **expressive act** (a process)
4. The act **concretizes** an **assertion** (an information content entity)
5. A separate **belief** (another information content entity) is held by the person
6. An **information processing** activity compares belief and assertion
7. The result is a **sincerity judgment** that reflects a **spectrum of values** (e.g., "highly sincere", "moderately sincere", "insincere")

**Critical BFO Principle**: We do **not** model `insincerity` as a separate disposition. To do so would violate BFO's principle of parsimony and misrepresent how dispositions work. A disposition may be realized to varying degrees or fail to be realized, but the disposition itself remains singular (Arp, Smith, & Spear, 2015, Chapter 6).

### 3.2 BFO 2020-Aligned Definitions

| Term | Definition | BFO 2020 Class | BFO URI |
|------|------------|----------------|---------|
| **Sincerity** | A disposition to express beliefs congruently through expressive acts. | Disposition | bfo:0000016 |
| **Sincerity Substrate** | A quality inhering in a person which grounds the sincerity disposition. | Quality | bfo:0000019 |
| **Sincerity Degree** | A quality value specification representing a scalar degree of sincerity. | Quality (specifically dependent) | bfo:0000019 |
| **Sincerity Evaluation** | An information processing activity that assesses congruence between belief and assertion. | Process | bfo:0000015 |
| **Assertion** | An information content entity representing a truth-claim expressed by an agent. | Generically Dependent Continuant | bfo:0000031 |
| **Belief** | An information content entity held by a person, representing their internal epistemic state. | Generically Dependent Continuant | bfo:0000031 |
| **Expressive Act** | A process in which a person externalizes an assertion, verbally or nonverbally. | Process | bfo:0000015 |
| **Communicator** | A person bearing the role of expressing symbolic content. | Material Entity (Person) | bfo:0000040 |
| **Communication Role** | A role borne by a communicator during expressive acts. | Role | bfo:0000023 |
| **Sincerity Judgment** | An information content entity representing the evaluated degree of sincerity. | Generically Dependent Continuant | bfo:0000031 |

**Note**: All BFO URIs reference BFO 2020 specification (http://purl.obolibrary.org/obo/bfo.owl).

### 3.3 Key BFO Relations

Using proper BFO 2020 object property URIs:

| Relation | BFO Property | Domain → Range | Example |
|----------|--------------|----------------|---------|
| `SinceritySubstrate` **inheres in** `Person` | bfo:0000052 | Quality → Independent Continuant | The quality of sincerity inheres in Alice |
| `Sincerity` **inheres in** `Person` | bfo:0000052 | Disposition → Independent Continuant | The disposition of sincerity inheres in Alice |
| `ExpressiveAct` **realizes** `Sincerity` | bfo:0000055 | Process → Disposition | Alice's speech act realizes her sincerity disposition |
| `Person` **participates in** `ExpressiveAct` | bfo:0000056 | Independent Continuant → Process | Alice participates in the expressive act |
| `ExpressiveAct` **has participant** `Person` | bfo:0000057 | Process → Continuant | The expressive act has Alice as participant |
| `Assertion` **concretizes** `PropositionContent` | cco:concretizes | ICE → Abstract | The assertion concretizes propositional content |
| `SincerityEvaluation` **has input** `Assertion`, `Belief` | cco:has_input | Process → ICE | Evaluation takes belief and assertion as inputs |
| `SincerityEvaluation` **has output** `SincerityJudgment` | cco:has_output | Process → ICE | Evaluation produces sincerity judgment |

**BFO Dependence Note**:
- In BFO 2020, dispositions do not "depend on" qualities in a formal sense captured by a standard relation.
- Rather, dispositions are **grounded in** or **based on** physical/quality substrates, but this is typically represented through domain modeling conventions, not a single BFO relation.
- We use the pattern: both quality and disposition inhere in the same bearer, with the understanding that the disposition's existence is grounded in the quality substrate.

### 3.4 Mermaid Diagram (BFO 2020 Compliant)

```mermaid
graph TD

%% BFO 2020 Core Classes
BFO_Entity["bfo:0000001<br/>Entity"]
BFO_Continuant["bfo:0000002<br/>Continuant"]
BFO_Occurrent["bfo:0000003<br/>Occurrent"]
BFO_IC["bfo:0000004<br/>Independent Continuant"]
BFO_SDC["bfo:0000020<br/>Specifically Dependent Continuant"]
BFO_GDC["bfo:0000031<br/>Generically Dependent Continuant"]
BFO_Quality["bfo:0000019<br/>Quality"]
BFO_Disposition["bfo:0000016<br/>Disposition"]
BFO_Role["bfo:0000023<br/>Role"]
BFO_Process["bfo:0000015<br/>Process"]
BFO_MaterialEntity["bfo:0000040<br/>Material Entity"]

%% Domain Classes
Person["Person<br/>(CCO: cco:Person)"]
SinceritySubstrate["Sincerity Substrate<br/>(Quality)"]
Sincerity["Sincerity<br/>(Disposition)"]
CommRole["Communication Role<br/>(Role)"]
ExpressiveAct["Expressive Act<br/>(Process)"]
SincerityEval["Sincerity Evaluation<br/>(Process)"]
Assertion["Assertion<br/>(ICE)"]
Belief["Belief<br/>(ICE)"]
SincerityJudgment["Sincerity Judgment<br/>(ICE)"]

%% BFO Hierarchy (rdfs:subClassOf)
BFO_Entity -.->|subClassOf| BFO_Continuant
BFO_Entity -.->|subClassOf| BFO_Occurrent
BFO_Continuant -.->|subClassOf| BFO_IC
BFO_Continuant -.->|subClassOf| BFO_SDC
BFO_Continuant -.->|subClassOf| BFO_GDC
BFO_SDC -.->|subClassOf| BFO_Quality
BFO_SDC -.->|subClassOf| BFO_Disposition
BFO_SDC -.->|subClassOf| BFO_Role
BFO_Occurrent -.->|subClassOf| BFO_Process
BFO_IC -.->|subClassOf| BFO_MaterialEntity

%% Instance typing (rdf:type)
Person -->|rdf:type| BFO_MaterialEntity
SinceritySubstrate -->|rdf:type| BFO_Quality
Sincerity -->|rdf:type| BFO_Disposition
CommRole -->|rdf:type| BFO_Role
ExpressiveAct -->|rdf:type| BFO_Process
SincerityEval -->|rdf:type| BFO_Process
Assertion -->|rdf:type| BFO_GDC
Belief -->|rdf:type| BFO_GDC
SincerityJudgment -->|rdf:type| BFO_GDC

%% BFO Relations (solid arrows with labels)
SinceritySubstrate -->|bfo:0000052<br/>inheres in| Person
Sincerity -->|bfo:0000052<br/>inheres in| Person
CommRole -->|bfo:0000052<br/>inheres in| Person
ExpressiveAct -->|bfo:0000055<br/>realizes| Sincerity
ExpressiveAct -->|bfo:0000057<br/>has participant| Person
ExpressiveAct -->|cco:concretizes| Assertion
SincerityEval -->|cco:has_input| Assertion
SincerityEval -->|cco:has_input| Belief
SincerityEval -->|cco:has_output| SincerityJudgment
SincerityEval -->|bfo:0000057<br/>has participant| Person

%% Styling
classDef bfoClass fill:#e1f5ff,stroke:#333,stroke-width:2px
classDef domainClass fill:#fff4e1,stroke:#333,stroke-width:2px
class BFO_Entity,BFO_Continuant,BFO_Occurrent,BFO_IC,BFO_SDC,BFO_GDC,BFO_Quality,BFO_Disposition,BFO_Role,BFO_Process,BFO_MaterialEntity bfoClass
class Person,SinceritySubstrate,Sincerity,CommRole,ExpressiveAct,SincerityEval,Assertion,Belief,SincerityJudgment domainClass
```

**Diagram Key**:
- **Dotted arrows** (-.->): rdfs:subClassOf (class hierarchy)
- **Solid arrows** (-->): rdf:type (instance classification) or BFO object properties (relations)
- **Blue boxes**: BFO core classes
- **Orange boxes**: Domain-specific classes

### 3.5 Illustrative Example: Alice's Dinner Compliment

**Scenario**:
Alice is asked by her friend Bob if she enjoyed the meatloaf he cooked for dinner. Alice has previously stated her dislike of meatloaf. Internally, she believes the food was unpleasant (belief ICE). However, she smiles and says "It was great!" (assertion ICE concretized in expressive act).

**BFO Analysis**:

1. **Alice** (instance of Person, bfo:0000040)
   - Bears **SinceritySubstrate** (quality, bfo:0000019) via bfo:0000052 (inheres in)
   - Bears **Sincerity** (disposition, bfo:0000016) via bfo:0000052 (inheres in)
   - Bears **CommunicatorRole** (role, bfo:0000023) via bfo:0000052 (inheres in)

2. **Alice's Belief** (ICE, bfo:0000031)
   - Content: "The meatloaf was unpleasant"
   - Held by Alice (epistemic state)

3. **Expressive Act** (process, bfo:0000015)
   - Temporal interval: t1 to t2
   - bfo:0000055 (realizes) Alice's Sincerity disposition
   - bfo:0000057 (has participant) Alice
   - cco:concretizes the Assertion ICE

4. **Alice's Assertion** (ICE, bfo:0000031)
   - Content: "The meatloaf was great"
   - Expressed in the expressive act

5. **Sincerity Evaluation** (process, bfo:0000015)
   - cco:has_input: Alice's Belief, Alice's Assertion
   - Comparison algorithm: Checks semantic alignment
   - cco:has_output: SincerityJudgment

6. **Sincerity Judgment** (ICE, bfo:0000031)
   - Value: "Insincere" (low degree on sincerity spectrum)
   - Reasoning: Assertion contradicts belief

**Key Insight**: Alice does **not** possess a separate `insincerity` disposition. Rather, her **sincerity disposition** was realized in a manner that produced an insincere expression. The disposition remains singular; the *degree of realization* varies.

**Empirical Note**: Levine & Schweitzer (2015) would classify this as a "prosocial lie" - deception intended to preserve social harmony and Bob's feelings. Research shows such lies are common and sometimes increase trust in relationships.

---

## 4. Modeling Dispositions and Their Variable Realizations

### 4.1 BFO Principle: Singular Dispositions, Variable Realizations

Rather than modeling opposite dispositions (e.g., `Sincerity` vs. `Insincerity`), we adopt the **BFO-aligned pattern of singular dispositions with variable realizations** (Arp, Smith, & Spear, 2015, Chapter 6).

**Why This Matters**:
- A person may bear the disposition of sincerity and yet express it imperfectly, or not at all, in a given instance.
- This avoids an **ontological explosion** of mirroring classes: `happy`/`unhappy`, `brave`/`cowardly`, `kind`/`cruel`, etc.
- The **disposition remains singular**; the **expression or evaluative output** varies along a spectrum.

**Physical Science Analogy**:
- A thermometer always measures temperature—even if that temperature is low or negative.
- Similarly, sincerity can be measured as low, moderate, or high, but it is the same disposition being evaluated.

**Philosophical Grounding**:
- Aristotle's *doctrine of the mean*: Virtues are dispositions to hit the mean between excess and deficiency (NE II.6).
- The disposition is singular (e.g., courage); its realization varies situationally (sometimes more, sometimes less courageous).

### 4.2 Quality Substrates and Dispositional Grounding

**BFO Pattern**:
- Dispositions (bfo:0000016) are grounded in quality substrates (bfo:0000019)
- Both inhere in the same bearer (bfo:0000052)
- The quality substrate provides the "physical basis" for the disposition

**Example**:
```turtle
:AliceSinceritySubstrate a bfo:0000019 ;  # quality
    bfo:0000052 :Alice ;  # inheres in Alice
    :hasQualityValue :HighSincerityDegree .

:AliceSincerity a bfo:0000016 ;  # disposition
    bfo:0000052 :Alice ;  # inheres in Alice
    :groundedIn :AliceSinceritySubstrate .
```

**Empirical Measurement**:
- Personality psychology measures trait sincerity/honesty via self-report (HEXACO model; Lee & Ashton, 2004)
- Behavioral measures: consistency between private belief and public assertion across contexts
- Neuroscience: Prefrontal cortex activation during deceptive vs. truthful responses (Spence et al., 2001)

---

## 5. Generalizing the Model to Other Character Traits

### 5.1 General Pattern for Character Traits

The sincerity model provides a **template** for modeling any character trait:

**Core Components**:
1. **Disposition** (bfo:0000016) - The character trait itself
   - Inheres in person (bfo:0000052)
   - Realized in characteristic acts (bfo:0000055)

2. **Quality Substrate** (bfo:0000019) - Physical/psychological basis
   - Inheres in person (bfo:0000052)
   - Grounds the disposition

3. **Characteristic Act** (bfo:0000015) - Process realizing disposition
   - Has person as participant (bfo:0000057)
   - Realizes disposition (bfo:0000055)

4. **Evaluation Process** (bfo:0000015) - Assessment activity
   - Takes contextual inputs (situations, norms, beliefs)
   - Produces evaluative judgment (ICE)

5. **Character Judgment** (bfo:0000031) - ICE representing evaluation
   - Spectrum of values (e.g., "very courageous", "moderately courageous", "cowardly")

### 5.2 Worked Example: Courage

**Aristotelian Definition**: Courage is the mean regarding fear and confidence, particularly facing death in noble causes (NE III.6-9).

**BFO Model**:

| Component | BFO Class | Definition |
|-----------|-----------|------------|
| **Courage** | bfo:0000016 (Disposition) | Disposition to face appropriate fear for noble ends |
| **Courage Substrate** | bfo:0000019 (Quality) | Quality of risk tolerance and fear regulation in bearer |
| **Courageous Act** | bfo:0000015 (Process) | Process in which agent faces danger for worthy goal |
| **Courage Evaluation** | bfo:0000015 (Process) | Assessment comparing fear level, danger level, goal nobility |
| **Courage Judgment** | bfo:0000031 (ICE) | "Courageous" / "Moderately Courageous" / "Cowardly" / "Rash" |

**Key Inputs to Evaluation**:
- Fear level (agent's subjective state)
- Danger level (objective threat assessment)
- Goal worthiness (ethical evaluation of end)
- Mean determination (Aristotle: relative to us, determined by phronesis)

**Empirical Research**:
- Pury, C. L., & Lopez, S. J. (Eds.). (2010). *The Psychology of Courage: Modern Research on an Ancient Virtue*. American Psychological Association.
- Rate, C. R., et al. (2007). Implicit theories of courage. *Journal of Positive Psychology*, 2(2), 80-98.

### 5.3 Worked Example: Compassion

**Definition**: Disposition to empathetically recognize others' suffering and be motivated to alleviate it (Goetz et al., 2010).

**BFO Model**:

| Component | BFO Class | Definition |
|-----------|-----------|------------|
| **Compassion** | bfo:0000016 (Disposition) | Disposition to empathetic concern and altruistic motivation for suffering others |
| **Compassion Substrate** | bfo:0000019 (Quality) | Empathic sensitivity and prosocial motivation in bearer |
| **Compassionate Act** | bfo:0000015 (Process) | Process of helping motivated by empathetic concern |
| **Compassion Evaluation** | bfo:0000015 (Process) | Assessment of empathic concern, motivation, and helping behavior |
| **Compassion Judgment** | bfo:0000031 (ICE) | "Highly Compassionate" / "Moderately Compassionate" / "Callous" |

**Key Distinction** (Goetz et al., 2010):
- **Compassion** = Empathetic concern + Altruistic motivation
- **Empathy** = Feeling with another (may lead to personal distress without helping)
- **Personal Distress** = Self-focused aversive arousal from witnessing suffering

**Empirical Research**:
- Goetz, J. L., Keltner, D., & Simon-Thomas, E. (2010). Compassion: An evolutionary analysis and empirical review. *Psychological Bulletin*, 136(3), 351-374.
- Klimecki, O. M., et al. (2014). Differential pattern of functional brain plasticity after compassion and empathy training. *Social Cognitive and Affective Neuroscience*, 9(6), 873-879.

### 5.4 Differences Across Character Traits

**Virtue-Specific Differences**:

1. **Evaluation Complexity**:
   - Sincerity: Binary comparison (belief vs. assertion)
   - Courage: Multi-factor (fear, danger, goal, mean)
   - Wisdom: Highly complex (experience, judgment, practical reasoning, situation)

2. **Temporal Structure**:
   - Temperance: Often involves resisting immediate impulses (temporal discounting)
   - Perseverance: Extended commitment over time despite obstacles
   - Kindness: May be episodic or dispositionally consistent

3. **Social vs. Individual**:
   - Justice: Inherently relational (giving each their due)
   - Courage: Can be individual or social
   - Intellectual Humility: Primarily epistemic/individual

4. **Aristotelian Mean Structure**:
   - **Two-sided mean**: Courage (Rashness ↔ Mean ↔ Cowardice)
   - **One-sided mean**: Wisdom (no "excess of wisdom" - Aristotle NE VI)

**Implication for Modeling**: The general pattern remains constant, but evaluation processes and input parameters vary by virtue.

---

## 6. Applications and Implications

### 6.1 Ethical AI and Machine Ethics

**Use Cases**:
1. **Trust Assessment**: AI agents evaluate human sincerity to calibrate trust levels
2. **Dialogue Management**: Conversational AI detects potential deception or insincerity
3. **Virtue Learning**: Reinforcement learning agents develop character dispositions through habituation

**Example - Sincerity Detection**:
```python
def evaluate_sincerity(belief_state, assertion, context):
    """
    BFO-aligned sincerity evaluation process.

    :param belief_state: Agent's internal epistemic state (ICE)
    :param assertion: Expressed claim (ICE)
    :param context: Situational factors (social norms, stakes)
    :return: Sincerity judgment (ICE) with degree value
    """
    semantic_alignment = compare_propositions(belief_state, assertion)
    contextual_allowance = assess_prosocial_context(context)

    if semantic_alignment > 0.8:
        return SincerityJudgment("highly_sincere", degree=0.9)
    elif semantic_alignment > 0.5 and contextual_allowance:
        return SincerityJudgment("prosocially_insincere", degree=0.6)
    else:
        return SincerityJudgment("insincere", degree=0.2)
```

**Research**:
- Cointe, N., et al. (2016). Ethical judgment of agents' behaviors in multi-agent systems. *International Conference on Autonomous Agents and Multiagent Systems*, 1106-1114.

### 6.2 Interoperability Across Worldviews

By modeling *how* character manifests (not *whether it is good*), the model provides a **shared representational framework** for religious, philosophical, and secular ethical systems.

**Examples**:

| Worldview | Sincerity Interpretation | Evaluation Criteria |
|-----------|--------------------------|---------------------|
| **Kantian Deontology** | Moral duty to be truthful; lying violates rational autonomy | Categorical: Never insincere |
| **Utilitarianism** | Sincerity valued when it maximizes utility; prosocial lies acceptable | Consequential: Insincere if utility-maximizing |
| **Virtue Ethics** | Sincerity as component of broader truthfulness virtue; context-sensitive | Mean-relative: Depends on situation and phronesis |
| **Buddhism** | Right Speech (samma vaca): Truthful, kind, beneficial, timely | Four-factor: True + Kind + Beneficial + Timely |
| **Islam** | Sidq (truthfulness) as central virtue; lying forbidden except narrow exceptions | Deontological with exceptions (e.g., saving life) |

**Shared Ontology, Divergent Norms**: All worldviews can use the same BFO model while applying different evaluative standards.

### 6.3 Cognitive and Psychological Research

**Alignment with Dual-Process Theory**:
- System 1 (Fast): Automatic sincerity/deception detection
- System 2 (Slow): Deliberative evaluation of belief-assertion alignment

**Research**:
- Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux.
- Greene, J. D. (2007). The secret joke of Kant's soul. *Moral Psychology*, Vol. 3, 35-79.

**Moral Foundations Theory**:
- Character traits map to different moral foundations (Haidt, 2012)
- Sincerity/Honesty ↔ Fairness/Reciprocity foundation
- Courage ↔ Liberty/Oppression foundation
- Compassion ↔ Care/Harm foundation

**Research**:
- Haidt, J. (2012). *The Righteous Mind: Why Good People Are Divided by Politics and Religion*. Pantheon.
- Graham, J., et al. (2013). Moral foundations theory: The pragmatic validity of moral pluralism. *Advances in Experimental Social Psychology*, 47, 55-130.

### 6.4 Character Education and Development

**Aristotelian Habituation Model**:
- Character traits develop through repeated practice (NE II.1)
- Virtuous acts → Virtuous dispositions (via habituation)
- BFO modeling enables tracking character development over time

**Empirical Research**:
- Berkowitz, M. W., & Bier, M. C. (2005). What works in character education: A research-driven guide for educators. *Character Education Partnership*.
- Narvaez, D., & Lapsley, D. K. (2009). Moral identity, moral functioning, and the development of moral character. *Psychology of Learning and Motivation*, 50, 237-274.

**BFO Temporal Modeling**:
```turtle
:CharacterDevelopmentProcess a bfo:0000015 ;  # process
    bfo:0000057 :Student ;  # has participant
    :cultivates :CourageDisposition ;
    :through :RepeatedCourageousActs ;
    :temporallyExtendedOver :TrainingPeriod .
```

---

## 7. Limitations and Future Work

### 7.1 Current Limitations

1. **Situational Variability**: Current model doesn't fully capture situation-dependence of trait expression (situationist challenge; Doris, 2002)

2. **Implicit Bias**: Model assumes conscious belief states; doesn't account for implicit biases affecting behavior

3. **Cultural Variation**: Virtue concepts vary across cultures (e.g., Chinese *ren* 仁 vs. Western compassion)

4. **Developmental Psychology**: Model is static; needs temporal dimension for character development

5. **Measurement**: Operationalizing quality substrates and dispositional degrees requires empirical validation

### 7.2 Future Directions

1. **Whole Trait Theory Integration** (Fleeson & Jayawickreme, 2015):
   - Model traits as density distributions of states
   - Capture within-person variability across situations

2. **Cross-Cultural Ontology**:
   - Map Western virtue terms to non-Western equivalents
   - Identify cultural universals vs. culturally specific virtues

3. **Neuroscience Integration**:
   - Map quality substrates to neural systems
   - Use fMRI/EEG data to validate disposition models

4. **Computational Implementation**:
   - Build reasoning engines using character ontologies
   - Test on moral dilemmas and character assessment tasks

5. **Integration with Process Philosophy**:
   - Model character as temporally extended processes (Whitehead)
   - Dynamic character development trajectories

---

## 8. Conclusion

The Sincerity model provides a **formally grounded, BFO 2020-compliant, empirically-informed realist ontology** for character modeling. By representing character traits as dispositions realized in expressive acts and evaluated via comparison to internal states, this approach supports:

1. **Ethical Discourse**: Shared framework across diverse philosophical and religious traditions
2. **Semantic Interoperability**: BFO/CCO alignment enables integration with other domain ontologies
3. **Empirical Grounding**: Integration with personality psychology, neuroscience, moral psychology
4. **AI Development**: Principled ethical AI with character-based reasoning
5. **Character Education**: Formal modeling of character development processes

As a **general prototype**, the sincerity model offers a **scaffold for modeling the broader domain of moral character**, with demonstrated generalizability to courage, compassion, and other virtues. Future work will extend this framework to capture temporal dynamics, situational variability, and cross-cultural diversity in character concepts.

---

## 9. References

### Primary Philosophical Sources

**Ancient & Medieval**:
- Aristotle (350 BCE/1925). *Nicomachean Ethics*, trans. W. D. Ross. Oxford University Press.
- Plato (380 BCE/1992). *Republic*, trans. G. M. A. Grube, rev. C. D. C. Reeve. Hackett Publishing.
- Aquinas, T. (1265-74/1947). *Summa Theologica*, trans. Fathers of the English Dominican Province. Benziger Brothers.

**Modern**:
- Kant, I. (1785/1997). *Groundwork of the Metaphysics of Morals*, trans. Mary Gregor. Cambridge University Press.
- Hume, D. (1739-40/2000). *A Treatise of Human Nature*, ed. David Fate Norton & Mary J. Norton. Oxford University Press.

**Contemporary**:
- Frankfurt, H. G. (1988). *The Importance of What We Care About: Philosophical Essays*. Cambridge University Press.
- Frankfurt, H. G. (2006). *On Bullshit*. Princeton University Press.
- Sartre, J.-P. (1943/1956). *Being and Nothingness*, trans. Hazel E. Barnes. Philosophical Library.
- Bok, S. (1978). *Lying: Moral Choice in Public and Private Life*. Pantheon Books.

### Virtue Ethics

- Anscombe, G. E. M. (1958). Modern moral philosophy. *Philosophy*, 33(124), 1-19.
- MacIntyre, A. (1981). *After Virtue: A Study in Moral Theory*. University of Notre Dame Press.
- Foot, P. (1978). *Virtues and Vices and Other Essays in Moral Philosophy*. University of California Press.
- Hursthouse, R. (1999). *On Virtue Ethics*. Oxford University Press.
- Annas, J. (2011). *Intelligent Virtue*. Oxford University Press.

### Formal Ontology

- Arp, R., Smith, B., & Spear, A. D. (2015). *Building Ontologies with Basic Formal Ontology*. MIT Press.
- Smith, B. (2016). Basic Formal Ontology 2.0: Specification and Users' Guide. Retrieved from https://basic-formal-ontology.org
- Common Core Ontologies. (2023). Retrieved from https://github.com/CommonCoreOntology/CommonCoreOntologies

### Empirical Research - Moral Psychology

- Haidt, J. (2001). The emotional dog and its rational tail: A social intuitionist approach to moral judgment. *Psychological Review*, 108(4), 814-834.
- Haidt, J. (2012). *The Righteous Mind: Why Good People Are Divided by Politics and Religion*. Pantheon.
- Graham, J., et al. (2013). Moral foundations theory: The pragmatic validity of moral pluralism. *Advances in Experimental Social Psychology*, 47, 55-130.
- Narvaez, D., & Lapsley, D. K. (2009). Moral identity, moral functioning, and the development of moral character. *Psychology of Learning and Motivation*, 50, 237-274.

### Empirical Research - Honesty/Deception

- Levine, E. E., & Schweitzer, M. E. (2015). Prosocial lies: When deception breeds trust. *Organizational Behavior and Human Decision Processes*, 126, 88-106.
- Serota, K. B., Levine, T. R., & Boster, F. J. (2010). The prevalence of lying in America: Three studies of self-reported lies. *Human Communication Research*, 36(1), 2-25.
- Lee, K. (2013). Little liars: Development of verbal deception in children. *Child Development Perspectives*, 7(2), 91-96.
- Spence, S. A., et al. (2001). Behavioural and functional anatomical correlates of deception in humans. *NeuroReport*, 12(13), 2849-2853.

### Empirical Research - Courage

- Pury, C. L., & Lopez, S. J. (Eds.). (2010). *The Psychology of Courage: Modern Research on an Ancient Virtue*. American Psychological Association.
- Rate, C. R., Clarke, J. A., Lindsay, D. R., & Sternberg, R. J. (2007). Implicit theories of courage. *Journal of Positive Psychology*, 2(2), 80-98.

### Empirical Research - Compassion

- Goetz, J. L., Keltner, D., & Simon-Thomas, E. (2010). Compassion: An evolutionary analysis and empirical review. *Psychological Bulletin*, 136(3), 351-374.
- Klimecki, O. M., et al. (2014). Differential pattern of functional brain plasticity after compassion and empathy training. *Social Cognitive and Affective Neuroscience*, 9(6), 873-879.

### Empirical Research - Personality Psychology

- Lee, K., & Ashton, M. C. (2004). Psychometric properties of the HEXACO personality inventory. *Multivariate Behavioral Research*, 39(2), 329-358.
- Fleeson, W., & Jayawickreme, E. (2015). Whole trait theory. *Journal of Research in Personality*, 56, 82-92.
- Doris, J. M. (2002). *Lack of Character: Personality and Moral Behavior*. Cambridge University Press.

### Character Education

- Berkowitz, M. W., & Bier, M. C. (2005). What works in character education: A research-driven guide for educators. *Character Education Partnership*.
- Peterson, C., & Seligman, M. E. P. (2004). *Character Strengths and Virtues: A Handbook and Classification*. Oxford University Press.

### Cognitive Science

- Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux.
- Greene, J. D. (2007). The secret joke of Kant's soul. *Moral Psychology*, Vol. 3, 35-79.

### Machine Ethics

- Cointe, N., et al. (2016). Ethical judgment of agents' behaviors in multi-agent systems. *International Conference on Autonomous Agents and Multiagent Systems*, 1106-1114.

---

## Appendix A: BFO 2020 Property Reference

| BFO Property | URI | Domain | Range | Definition |
|--------------|-----|--------|-------|------------|
| inheres in | bfo:0000052 | Specifically Dependent Continuant | Independent Continuant | b inheres in c = b is an instance of a specifically dependent continuant and c is an instance of an independent continuant and b s-depends on c |
| bearer of | bfo:0000053 | Independent Continuant | Specifically Dependent Continuant | Inverse of inheres in |
| realizes | bfo:0000055 | Process | Realizable Entity | p realizes r = p is an instance of a process and r is an instance of a realizable entity and there is some material entity m and some site s such that r inheres in m and p has participant m and s is the location of m during p |
| realized in | bfo:0000054 | Realizable Entity | Process | Inverse of realizes |
| participates in | bfo:0000056 | Continuant | Process | a participates in p = a is an instance of a continuant and p is an instance of a process and a is located at some spatial region r during some temporal interval t and r is the location of p |
| has participant | bfo:0000057 | Process | Continuant | Inverse of participates in |

Source: BFO 2020 Specification (http://purl.obolibrary.org/obo/bfo.owl)

---

**Document Version**: 2.0
**Last Updated**: December 21, 2025
**Authors**: Integral Ethics Engine Project
**License**: CC BY 4.0
**BFO Version**: BFO 2020
**Status**: ✅ Peer-Reviewed and Citation-Complete
