# Phase 8: Community Outreach & GIS Intelligence

This phase extends CareLink PHC from the facility walls directly into households through Community Health Volunteers (CHVs) and spatial intelligence.

## User Review Required

> [!IMPORTANT]
> The CHV Mobile Workflow will be built as an offline-first PWA module, optimized for low-bandwidth environments during household visits. GIS Heatmapping will utilize Leaflet.js for interactive spatial visualizations.

## Proposed Changes

### [Community Health Outreach]
Tools for field workers to conduct household census and basic screening.

#### [NEW] [frontend/src/modules/community/CHVDashboard.tsx](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/frontend/src/modules/community/CHVDashboard.tsx)
- Simplified mobile interface for household registration and health referrals.

#### [MODIFY] [backend/src/models/patient.ts](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/backend/src/models/patient.ts)
- Adding `geolocation` (latitude/longitude) and `household_id` to patient records.

### [GIS Intelligence Hub]
Visualizing health data across the state map.

#### [NEW] [frontend/src/modules/analytics/GISMap.tsx](file:///Users/huzex/.gemini/antigravity/scratch/carelink-phc/frontend/src/modules/analytics/GISMap.tsx)
- Interactive map showing disease clusters vs. facility resource locations.
- Heatmap overlay for epidemic hot-zones.

---

## Verification Plan

### Automated Verification
- Schema check: Ensure `latitude` and `longitude` fields are correctly indexed.
- Referral check: Verify that CHV-initiated referrals appear in the facility dashboard.

### Manual Verification
- Register a "Household" and "Patient" using the CHV mobile view.
- Open the GIS Map and verify that the patient appears at the correct coordinate point.
- Verify that morbidity spikes detected in Phase 5 are visualized as heatmaps on the GIS Map.
