# Documentation - Integral Ethics Engine

Core philosophical, architectural, and domain modeling documentation.

## Quick Navigation

### Philosophy
Foundational philosophical commitments and theoretical frameworks.

- [integral-ethics.md](philosophy/integral-ethics.md) - Rudolf Steiner's 12 worldview framework
- [line-in-the-sand.md](philosophy/line-in-the-sand.md) - Non-commodifiable personhood criterion
- [Reclaiming-Process-Qualities.md](philosophy/Reclaiming-Process-Qualities.md) - Process philosophy integration

### Architecture
Technical system design and implementation patterns.

- [ARCHITECTURE.md](ARCHITECTURE.md) - Overall system architecture
- [architecture/GITHUB_PAGES_PWA.md](architecture/GITHUB_PAGES_PWA.md) - PWA deployment guide
- [architecture/Integration-Procedure.md](architecture/Integration-Procedure.md) - 7-step deliberation process

### Domain Models
Formal models for ethical reasoning domains.

- [models/Moral-Character-Model.md](models/Moral-Character-Model.md) - BFO/CCO character modeling patterns
- [models/Domain-Contextualization.md](models/Domain-Contextualization.md) - Context-aware moral evaluation

### ARCHON (Optional)
ARCHON multi-agent system specifications (if still active).

- [archon/ARCHON.md](archon/ARCHON.md) - ARCHON overview
- [archon/ARCHON_Functional_Requirments.md](archon/ARCHON_Functional_Requirments.md) - Functional requirements

## Documentation Principles

### 1. Multi-Level Accessibility
- **Philosophy docs:** Accessible to non-technical stakeholders
- **Architecture docs:** For developers and system designers
- **Model docs:** Bridge philosophy and implementation

### 2. Living Documentation
- Update docs alongside code changes
- Link implementation to conceptual foundations
- Preserve design decision rationale

### 3. Philosophical Grounding
All technical decisions should trace back to philosophical commitments:
- Integral consciousness → Multi-perspectival evaluation
- Non-commodifiable personhood → Irreversible moral costs
- Process philosophy → Temporal context modeling

## Related Documentation

**Active Planning:**
- [../planning/STATUS_SUMMARY.md](../planning/STATUS_SUMMARY.md) - Current project status
- [../planning/stratigicRoadmap.md](../planning/stratigicRoadmap.md) - Development roadmap

**Historical:**
- [../archive/](../archive/) - Completed phase documentation

**Implementation:**
- [../src/concepts/](../src/concepts/) - Source code for reasoning modules
- [../testing/](../testing/) - Test strategies and scenarios

## Contributing to Documentation

When adding new documentation:

1. **Choose the right category:**
   - Philosophy: Foundational principles, worldview theory
   - Architecture: System design, technical patterns
   - Models: Domain-specific formal modeling

2. **Link bidirectionally:**
   - Reference related docs explicitly
   - Update this README with new entries

3. **Maintain narrative flow:**
   - Start with motivation (why)
   - Explain concepts (what)
   - Provide implementation guidance (how)

4. **Preserve design decisions:**
   - Document trade-offs considered
   - Explain why alternatives were rejected
   - Note dependencies and assumptions
