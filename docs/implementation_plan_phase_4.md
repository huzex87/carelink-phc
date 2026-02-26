# Phase 4: Operationalization & Scale

This phase transforms CareLink PHC from a localized tool into an enterprise-grade, field-ready platform.

## Proposed Changes

### [DevOps & Automation]
Automate code quality and verification to ensure clinical safety.

#### [NEW] [.github/workflows/ci.yml](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/.github/workflows/ci.yml)
- GitHub Action for automated linting and type checking on every push.

### [Lab Module]
Enabling diagnostic tracking within the Primary Health Care context.

#### [NEW] [backend/src/models/lab_result.ts](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/backend/src/models/lab_result.ts)
- Sequelize model for lab orders and results (Malaria RDT, Hemoglobin, HIV, etc.).

#### [NEW] [frontend/src/modules/lab/LabDashboard.tsx](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/frontend/src/modules/lab/LabDashboard.tsx)
- UI for ordering and viewing lab results.

### [Pharmacy & Inventory Module]
Tracking medical stock and prescription fulfillment.

#### [NEW] [backend/src/models/pharmacy.ts](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/backend/src/models/pharmacy.ts)
- Model for `DrugInventory` and `Prescription`.

#### [NEW] [frontend/src/modules/pharmacy/InventoryView.tsx](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/frontend/src/modules/pharmacy/InventoryView.tsx)
- Unified stock management view with glassmorphism alerts for low stock.

---

## Verification Plan

### Automated Tests
- `npm run lint` and `npm run build` verified in CI runners for both workspace root and sub-packages.

### Manual Verification
- Verify successful lab order creation and pharmacy stock deduction on fulfillment.
