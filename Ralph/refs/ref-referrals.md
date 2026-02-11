# Reference: Referrals View (= Contact)

> Extracted from goal.md — Referrals View section. Contact information presented as a clinical referral form.

---

## Overview

Contact information presented as a clinical referral form — the mechanism for "referring" a patient (Andy) to another service.

## Referral Form Layout

```
+--[ New Referral ]-------------------------------------------------------+
|                                                                          |
|  Referring to:  CHARLWOOD, Andrew (Mr)                                  |
|  NHS Number:    221 181 0                                               |
|                                                                          |
|  Priority:      ( ) Urgent    (*) Routine    ( ) Two-Week Wait          |
|                                                                          |
|  Referrer Name:     [________________________]                          |
|  Referrer Email:    [________________________]                          |
|  Referrer Org:      [________________________]  (optional)              |
|                                                                          |
|  Reason for Referral:                                                   |
|  [                                                                ]     |
|  [                                                                ]     |
|  [                                                                ]     |
|                                                                          |
|  Contact Method:    ( ) Email    ( ) Phone    ( ) LinkedIn              |
|                                                                          |
|                                          [ Cancel ]  [ Send Referral ]  |
+-------------------------------------------------------------------------+
```

## Priority Toggle (tongue-in-cheek)

Three radio options styled like clinical referral priorities:
- **Urgent**: Red label, red dot. Selectable but the tooltip reads "All enquiries are welcome, urgent or not."
- **Routine**: Blue label, blue dot. Default selected.
- **Two-Week Wait**: Amber label. Tooltip: "NHS cancer referral pathway - this isn't that, but the spirit of promptness applies."

This is the design's main moment of humor. The priority options are visually authentic to clinical referral forms, and the tongue-in-cheek tooltips reward exploration without undermining the professional tone.

## Form Fields

Standard clinical form inputs: `1px solid #D1D5DB` border, `4px` radius, `8px 12px` padding. Labels in Inter 500, 13px, gray-600, positioned above inputs. Focus state: border changes to NHS blue, subtle blue glow (`box-shadow: 0 0 0 3px rgba(0, 94, 184, 0.15)`).

## Submit Button

"Send Referral" in NHS blue (`#005EB8`), white text, full width of the right half of the form. On hover: darkens to `#004494`. On click: brief loading state (spinner icon), then a success message:

```
Checkmark Referral sent successfully
  Reference: REF-2026-0210-001
  Expected response time: 24-48 hours
```

The reference number is generated from the current date. The success state mimics the confirmation screen shown after submitting a clinical referral in EMIS.

## Alternative Contact Methods (below the form)

```
+--[ Direct Contact ]-----------------------------------------------------+
| Email:     andy@charlwood.xyz              [Send Email ->]               |
| Phone:     07795553088                     [Call ->]                     |
| LinkedIn:  linkedin.com/in/andycharlwood   [View Profile ->]            |
| Location:  Norwich, UK                                                   |
+-------------------------------------------------------------------------+
```

Styled as a simple key-value table, same format as the Patient Demographics card in Summary view.
