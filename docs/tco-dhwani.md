## Total Cost of Operation for Voice AI Proof of Concept (PoC) in Indian Languages

### Scenario 1: 6 Languages
#### Storage Requirements
| Component              | Size per Unit | Units | Total Size |
|------------------------|---------------|-------|------------|
| ASR (6 languages)      | 550 MB        | 6     | 3.5 GB     |
| Translation (Distilled)| 930 MB        | 3     | 3 GB       |
| Text-to-Speech         | 4.5 GB        | 1     | 4.5 GB     |
| **Total**              |               |       | **11 GB**  |

#### Hardware Options and Costs
| Hardware  | Capacity | Cost per Hour | Monthly Cost (720 hours) |
|-----------|----------|---------------|--------------------------|
| T4 Small  | 16 GB    | $0.40         | $288                     |
| L4        | 24 GB    | $0.80         | $576                     |
| A10 Small | 24 GB    | $1.00         | $720                     |

---

### Scenario 2: 22 Languages
#### Storage Requirements
| Component              | Size per Unit | Units | Total Size |
|------------------------|---------------|-------|------------|
| ASR (22 languages)     | 550 MB        | 22    | 11 GB      |
| Translation (Base)     | 4.5 GB        | 3     | 15 GB      |
| Text-to-Speech         | 4.5 GB        | 1     | 4.5 GB     |
| **Total**              |               |       | **31 GB**  |

#### Hardware Options and Costs
| Hardware | Capacity | Cost per Hour | Monthly Cost (720 hours) |
|----------|----------|---------------|--------------------------|
| L40s     | 48 GB    | $1.80         | $1,296                   |

---

### Notes
- Monthly costs are calculated assuming 720 hours per month (24 hours/day × 30 days).
- All sizes are in gigabytes (GB) unless specified otherwise.
- Hardware selection should account for total storage requirements and performance needs.