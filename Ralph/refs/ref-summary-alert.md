# Reference: Summary View + Clinical Alert

> Extracted from goal.md — Summary View and Clinical Alert sections. This is the landing view after login.

---

## Summary View

The landing view after login. This mimics the "Patient Summary" screen — the first screen a clinician sees when opening a patient record, showing the most important information at a glance.

**Layout:** A grid of summary cards arranged in a 2-column layout on desktop, single column on mobile. Each card has a header bar with the card title in Inter 600, 14px, uppercase, on a `#F9FAFB` background with `1px solid #E5E7EB` bottom border.

### Card 1: Patient Demographics (spans full width)

```
+--[ Patient Demographics ]------------------------------------------+
| Name:         Andrew Charlwood          Status:    Active (dot)    |
| DOB:          14 February 1993          Location:  Norwich, UK     |
| Registration: GPhC 2211810              Since:     August 2016     |
| Qualification: MPharm (Hons) 2:1        University: UEA, 2015     |
+---------------------------------------------------------------------+
```

A two-column key-value table. Labels in Inter 500, 13px, gray-500. Values in Inter 400, 14px, gray-900. Labels right-aligned, values left-aligned — mimicking clinical system demographics layout.

### Card 2: Active Problems (left column)

```
+--[ Active Problems ]-----------------------------------------------+
| (green dot) Deputy Head, Pop. Health & Data Analysis   Jul 2024-Present   |
|   NHS Norfolk & Waveney ICB                                         |
| (green dot) 220M prescribing budget management          Ongoing            |
| (amber dot) Patient-level SQL analytics transformation  In progress        |
+---------------------------------------------------------------------+
```

A list with green dots for active/current items, amber dots for in-progress items. Each entry has a title in Inter 500, 14px, and a date range or status in Geist Mono, 12px, right-aligned. Click an entry to navigate to the corresponding Consultation.

### Card 3: Current Medications — Quick View (right column)

```
+--[ Current Medications (Quick View) ]-------------------------------+
| Python          | 90%  | Daily     | Active (green dot)            |
| SQL             | 88%  | Daily     | Active (green dot)            |
| Power BI        | 92%  | Daily     | Active (green dot)            |
| Data Analysis   | 95%  | Daily     | Active (green dot)            |
| JS / TypeScript | 70%  | Weekly    | Active (green dot)            |
|                                          [View Full List ->]        |
+---------------------------------------------------------------------+
```

A compact 4-column table showing the top 5 skills. "View Full List" links to the Medications view. Table headers are uppercase, 12px, gray-400. Table rows alternate between `#FFFFFF` and `#F9FAFB` backgrounds.

### Card 4: Last Consultation (spans full width)

```
+--[ Last Consultation ]----------------------------------------------+
| Date: May 2025   Clinician: A. Charlwood   Location: NHS N&W ICB    |
|                                                                      |
| Interim Head, Population Health & Data Analysis                      |
| Led strategic delivery of population health initiatives and          |
| data-driven medicines optimisation across Norfolk & Waveney ICS...   |
|                                            [View Full Record ->]     |
+---------------------------------------------------------------------+
```

A preview of the most recent role, truncated to 2-3 lines. "View Full Record" navigates to Consultations with that entry expanded.

### Card 5: Alerts (full width, positioned above all other cards)

This is the Clinical Alert — see below.

---

## The Clinical Alert (Signature Interaction)

When the user first loads the Summary view (immediately after the login transition), a clinical alert banner slides down from beneath the patient banner.

### Alert Styling

```
+--[ WARNING CLINICAL ALERT ]------------------------------------------+
| WARNING  ALERT: This patient has identified 14.6M in prescribing     |
|    efficiency savings across Norfolk & Waveney ICS.                  |
|                                                         [Acknowledge]|
+----------------------------------------------------------------------+
```

- Background: amber (`#FEF3C7` — amber-100, light amber)
- Left border: 4px solid `#F59E0B` (amber-500)
- Warning icon: `AlertTriangle` from Lucide, amber-600
- Text: Inter 500, 14px, `#92400E` (amber-800)
- "Acknowledge" button: small outlined button, amber border and text

### Behavior

1. The alert slides down from beneath the patient banner with a spring animation (250ms, slight overshoot) after the PMR interface finishes materializing.
2. It pushes the Summary content downward, so it's impossible to miss.
3. Clicking "Acknowledge" triggers a brief animation: a green checkmark replaces the warning icon (200ms), then the alert collapses upward (200ms, ease-out) and is gone.
4. The dismiss state is stored in React state (session-only) — refreshing the page shows the alert again.

### Why This Works

Clinical alerts are the mechanism that clinical systems use to put critical information in front of clinicians before they do anything else. They are the highest-priority information in the system. By framing Andy's most impressive metric ("14.6M") as a clinical alert, it gets the same treatment — it's the first thing the user reads, it demands acknowledgment, and its format gives the number institutional weight. This is not a boast in a paragraph; it's a system-generated alert based on data. The framing makes the achievement feel objective.

### Second Alert (on Consultations view)

When the user first navigates to Consultations, a secondary alert appears:

```
WARNING  NOTE: Patient has developed a Python-based switching algorithm
   identifying 14,000 patients for cost-effective medication alternatives.
   2.6M annual savings potential. Review recommended.
```

This second alert reinforces the key technical achievement in clinical language. It appears only once (on first navigation to Consultations) and is dismissible with the same "Acknowledge" interaction.
