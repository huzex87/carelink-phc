# Phase 7: Integrated Logistics (LMIS) & Clinical Timeline

This phase bridges the gap between clinical dispensing and medical supply chain management.

## User Review Required

> [!IMPORTANT]
> This phase assumes that every drug dispensed in the Pharmacy module should automatically decrement the corresponding stock item in the LMIS. We will implement "Low Stock" triggers that integrate with the Alert Center.

## Proposed Changes

### [Integrated Logistics - LMIS]
Connecting prescriptions to inventory depletion.

#### [NEW] [backend/src/services/InventoryService.ts](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/backend/src/services/InventoryService.ts)
- Service to handle atomic stock updates when prescriptions are "dispensed".
- Logic for calculating "Average Monthly Consumption" (AMC) for facilities.

#### [MODIFY] [frontend/src/modules/pharmacy/InventoryView.tsx](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/frontend/src/modules/pharmacy/InventoryView.tsx)
- Integration of supply chain analytics (Stock out risks, consumption trends).

### [Longitudinal Clinical Timeline]
A world-class visual representation of a patient's health journey.

#### [NEW] [frontend/src/components/ClinicalTimeline.tsx](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/frontend/src/components/ClinicalTimeline.tsx)
- A vertical, chronologically grouped timeline of OPD encounters, Lab results, Pharmacy dispensing, and Referrals.

#### [MODIFY] [frontend/src/modules/encounters/EncounterDashboard.tsx](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/frontend/src/modules/encounters/EncounterDashboard.tsx)
- Embedding the Clinical Timeline in the patient's primary care view.

---

## Verification Plan

### Automated Verification
- Unit test: verify that dispensing 5 units of "Paracetamol" reduces inventory from 100 to 95.
- Analytics check: Verify AMC (Average Monthly Consumption) calculation logic.

### Manual Verification
- Dispense a medication for a patient.
- Navigate to the "Inventory" tab and verify the stock level decreased.
- Navigate to the patient's dashboard and verify the dispensing event appears in their "Clinical Timeline".
