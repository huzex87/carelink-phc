# Phase 5: Intelligence & Extended Ecosystem

This phase introduces advanced analytics and inter-facility coordination to the CareLink PHC ecosystem.

## Proposed Changes

### [Epidemic Alerting System]
Implementing a background service to detect anomalous spikes in clinical data.

#### [NEW] [indicator-engine/src/alerts.ts](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/indicator-engine/src/alerts.ts)
- Alerting logic using statistical thresholding (simulating ML) to identify morbidity outbreaks.

#### [NEW] [frontend/src/modules/analytics/AlertCenter.tsx](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/frontend/src/modules/analytics/AlertCenter.tsx)
- Unified view for LGA/State health officers to monitor system-generated epidemic alerts.

### [Digital Referral Pathway]
Formalizing the chain of care from PHC to secondary facilities.

#### [NEW] [backend/src/models/referral.ts](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/backend/src/models/referral.ts)
- Model to track referrals, receiving facility acceptance, and feedback loops.

#### [NEW] [frontend/src/modules/patients/ReferralModule.tsx](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/frontend/src/modules/patients/ReferralModule.tsx)
- UI for clinicians to initiate and track patient referrals.

### [Advanced Security / SSO]
Hardening access for multi-facility institutional users.

#### [MODIFY] [backend/src/middleware/auth.ts](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/backend/src/middleware/auth.ts)
- Placeholder logic to support OIDC/JWT from institutional identity providers.

---

## Verification Plan

### Automated Verification
- Unit tests for the anomaly detection logic in the Indicator Engine.

### Manual Verification
- Simulate a "Malaria Spike" (100+ encounters in 24 hours) and verify the 🚨 Alert appears in the Alert Center.
- Create a referral and verify it appears in the patient's longitudinal history.
