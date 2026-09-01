> 🌐 **English** | [Deutsch](../../de/widgets/radial-slider-widget.md)

# Radial Slider Widget

The Radial Slider Widget is a circular arc dial for numeric datapoints. It works like the regular Slider Widget, but the user drags around a circular track instead of along a straight line. It is perfect for thermostat tiles, volume knobs, or any control where a round dial fits the design.

![Radial Slider Widget](../img/widget-radial-slider.png)

---

## How to Add the Widget

1. Drag **Radial Slider** from the **inventwo design** widget list onto your view.
2. Resize the widget — it renders as a square; the widget size determines the dial size.
3. Click **Object ID** and select your numeric datapoint. Min, max, and step are filled in automatically from the object definition.
4. Adjust **Start angle** and **End angle** to define the arc shape.
5. Style the track and thumb in the **inventwo - Radial track** and **inventwo - Radial thumb** groups.

---

## Settings

### Common

| Setting | What it does |
|---------|-------------|
| **Object ID** | The datapoint to read and write. Min, max, and step are filled in automatically from the object definition when you select an OID. |
| **Min value** | The value at the start of the arc. Default: 0. |
| **Max value** | The value at the end of the arc. Default: 100. |
| **Step** | How much the value changes per increment. Default: 1. |
| **Start angle** | The angle (0–360°) where the arc begins. 0° is at the top, angles increase clockwise. Default: 225 (bottom-left). |
| **End angle** | The angle (0–360°) where the arc ends. Default: 135 (bottom-right). Together with the default start angle this creates a classic "270° dial" shape. |
| **Show value** | Displays the current numeric value in the center of the dial. |
| **Show label** | Displays a text label below the value in the center. Only visible when a label text is entered. |
| **Label** | The text to show as the center label, e.g. `°C` or `%`. Only visible when **Show label** is enabled. |
| **Read only** | When enabled, the dial displays the current value but cannot be dragged. Useful for read-only gauges. |

---

### inventwo — Radial track

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy all track settings from another Radial Slider Widget. |
| **Track color** | Color of the background arc (the full arc that is not yet reached). Supports gradient strings, e.g. `linear-gradient(90deg, #aaa, #444)`. |
| **Track active color** | Color of the filled arc (the part from Start to the current value). Also supports gradient strings. |
| **Track width** | Thickness of the arc in pixels. Default: 10. |
| **Track shadow** | Drop shadow on the background arc. Set X offset, Y offset, blur, and color. |

---

### inventwo — Radial thumb

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy all thumb settings from another Radial Slider Widget. |
| **Thumb color** | Color of the circular handle. |
| **ThumbSize** | Diameter of the thumb circle in pixels. Default: 16. |
| **Thumb shadow** | Drop shadow on the thumb. |

---

### inventwo — Radial value

| Setting | What it does |
|---------|-------------|
| **Value size** | Font size of the center value in pixels (8–100). Default: 32. |
| **Value color** | Color of the center value text. |
| **Label size** | Font size of the center label in pixels (8–50). Default: 14. |
| **Label color** | Color of the center label text. |

---

## Understanding Angles

The angles are measured clockwise from the top (12 o'clock position = 0°).

| Angle | Position on the dial |
|-------|---------------------|
| 0° | Top (12 o'clock) |
| 90° | Right (3 o'clock) |
| 180° | Bottom (6 o'clock) |
| 270° | Left (9 o'clock) |

**Example — Classic thermostat dial:**
- Start angle: 225 (bottom-left, roughly 7 o'clock)
- End angle: 135 (bottom-right, roughly 5 o'clock)
- This creates a large arc that goes from bottom-left, up and over the top, to bottom-right.

**Example — Right-side half arc:**
- Start angle: 270 (left)
- End angle: 90 (right)
- This creates a semicircle on the right side.

---

## Tips

- **Thermostat tile:** Set Start angle 225, End angle 135, label to `°C`, and connect to your heating datapoint. The arc sweeps 270° — the classic thermostat look.
- **Battery indicator:** Set Start angle 180, End angle 0, active color to green and track color to dark grey. The arc fills from left to right as the battery charges.
- **Style reuse:** Use **From widget** to copy track and thumb settings across multiple dials.

---

## See Also

- [Slider Widget](slider-widget.md) — the same control as a straight horizontal or vertical slider
