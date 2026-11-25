# cse326project

# Campus Bites — Campus Cafeteria Ordering System

A responsive, interactive frontend web application built to streamline college cafeteria ordering. Students can browse daily rotating menus, check real-time item availability, apply student promo codes, and schedule break-time pickups—eliminating long cafeteria queues.

Built as a team project using pure **HTML5**, **CSS3**, and **Vanilla JavaScript** with zero external frameworks or libraries.

---

## Key Features

**Weekly Rotating Cuisine Timetable:** Automatically highlights today's special regional cuisine (South Indian, North Indian, Chinese, Mughlai, Italian) alongside everyday staples (*), while locking future days from accidental ordering.
**Interactive Menu & Filtering:** Filter dishes across five meal categories (*Breakfast, Lunch, Snacks, Dinner, Beverages*) and toggle between **Veg** and **Non-Veg** options.
**Real-Time Stock & Dietary Indicators:** Displays standardized green/red dietary icons, item-level discount tags, low-stock alerts (*"Only 3 left"*), and sold-out states.
**Dynamic Shopping Cart & Billing:** Instant quantity steppers, floating cart summary bar, one-click coupon copying (STUDENT10, FIRST20, DINNER15), and automatic calculation of MRP savings, coupon discounts, and 5% GST.
**Smart Pickup Time-Slot Selector:** Separates class break timings from dinner slots, disables full slots, and prevents mixing breakfast/lunch items with dinner items in the same order.
**Persistent Client-Side State:** Uses localStorage to retain cart items, user login/registration sessions, remaining dish inventory, and order history across page reloads.
**Responsive Mobile-First Design:** Adapts cleanly across desktop, tablet, and mobile viewports with zero layout shift.

---

## Project Structure

```text
├── index.html      # Main menu page, weekly timetable, offers, and student reviews
├── order.html      # Cart review, coupon input, pickup slot picker, and order history
├── login.html      # Student login and registration portal
├── style.css       # Custom properties, responsive CSS Grid/Flexbox layouts, and UI components
├── data.js         # Menu catalog (47 items), pricing/GST engine, and localStorage state helpers
├── app.js          # Menu rendering, category/diet/day filtering, and rotating quotes
├── order.js        # Checkout logic, slot clash validation, token generation, and stock deduction
└── login.js        # Authentication validation and session redirect handling
