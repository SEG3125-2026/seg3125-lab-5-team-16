# Lab 5 - Hair Salon Booking Website

## Overview
Single-page booking website for **Elite Cuts**, a premium hair salon and barbershop. **Built on Lab 4** with Lab 5 additions: one-pager navigation, payment section, regex validation, calendar constraints (weekends and staff off-days), and enhanced feedback. Uses Bootstrap 5 and Vanilla JavaScript. Implements Don Norman's Design Principles including **Visibility**, **Affordance**, **Mapping**, **Consistency**, **Feedback**, and **Constraints**.

## Icons Used

| Section   | Icon              | Purpose                    |
|----------|-------------------|----------------------------|
| Services | bi-scissors       | Hair cutting services      |
| Experts  | bi-people-fill    | Stylist selection          |
| Payment  | bi-credit-card    | Payment section            |
| Location | bi-geo-alt-fill   | Business address (Info)     |
| Hours    | bi-clock-fill     | Business hours (Info)      |

## Design Principles (Lab 4 + Lab 5)

### Visibility and Affordance
- Tooltips on input fields (contact and payment) explain what to provide and why
- Reactive inputs: color and scale on hover/focus (Lab 4 styles)
- Icons with labels on all interactive elements

### Constraints (Lab 5)
- **Phone**: `(XXX) XXX-XXXX` or `XXX-XXX-XXXX` (regex validation)
- **Credit card**: 16 digits (auto-spaced), expiry `MM/YY`, CVV 3–4 digits
- **Name**: Letters and spaces only, no numbers (contact and card name)
- **Calendar**: Weekends not available; staff off-days not available

### Feedback
- Error messages for invalid input (name with numbers, bad phone, invalid card)
- Inline validation with Bootstrap `invalid-feedback`
- Loading spinner on submit

### Consistency
- Purple theme throughout (Lab 4)
- Same icons and colors across sections
- Bootstrap components for familiar interactions

## Booking Flow

1. **Choose Service**
2. **Choose Stylist** (optional; “Any Stylist” available)
3. **Select Date and Time** (weekdays only; staff off-days disabled)
4. **Enter Contact Info** (name, email, phone)
5. **Enter Payment Info** (card number, expiry, CVV, name on card)
6. **Confirmation**

## Staff Off-Days

- **Sarah Johnson**: Saturday, Sunday  
- **Michael Chen**: Sunday  
- **Emma Rodriguez**: Saturday, Sunday  
- **James Wilson**: Saturday  

## Technical Details

- **Bootstrap 5.3.2**, Bootstrap Icons  
- **Vanilla JavaScript** (no frameworks)  
- **Regex validation** for phone, name, and credit card  
- **One-pager** with sticky navbar for section navigation (Info, Services, Experts, Schedule, Contact, Payment)  
- Collapsible navbar on mobile  

## File Structure

```
seg3125-lab-5-team-16/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── img/          # Service and staff images (from Lab 4)
└── README.md
```

## How to Test

1. Open the folder in Cursor (or your editor).
2. Run a local server: `python3 -m http.server 8000` (or `8080` if you prefer).
3. Open in a browser: **http://localhost:8000**
4. Follow the booking flow and try invalid inputs to see validation (e.g. name with numbers, wrong phone format, invalid card).

---

**Lab 5 - SEG3125 Analysis and Design of User Interfaces**  
**Team 16**  
**Based on Lab 4 submission:** [seg3125-lab-4-team-16](https://github.com/SEG3125-2026/seg3125-lab-4-team-16)
