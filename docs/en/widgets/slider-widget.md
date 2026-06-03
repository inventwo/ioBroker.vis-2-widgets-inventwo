# Slider Widget

The Slider Widget lets users set a numeric value by dragging a handle along a track. It works horizontally or vertically and is ideal for controlling dimmers, thermostats, blinds, volume, or any other numeric datapoint.

![Slider Widget](../img/widget-slider.png)

---

## How to Add the Widget

1. Drag **Slider** from the **inventwo design** widget list onto your view.
2. Click **Object ID** and select the numeric datapoint you want to control.
3. The minimum, maximum, and step values are automatically filled in from the object definition — adjust them if needed.
4. Choose **Orientation** (Horizontal or Vertical).
5. Style the track and thumb in the **inventwo - Slider track** and **inventwo - Slider thumb** groups.

---

## Settings

### Common

| Setting | What it does |
|---------|-------------|
| **Object ID** | The datapoint to read and write. When selected, **Min value**, **Max value**, and **Step** are automatically populated from the object definition. |
| **Min value** | The lowest value the slider can set. Default: 0. |
| **Max value** | The highest value the slider can set. Default: 100. |
| **Step** | How much the value changes per increment. Default: 1. |
| **Orientation** | **Horizontal** (left/right, default) or **Vertical** (up/down). |
| **Show min max** | Shows the minimum and maximum values as labels at both ends of the slider. |
| **Read only** | When enabled, the slider displays the current value but cannot be dragged. Useful for read-only gauges. |

#### Value Label

| Setting | What it does |
|---------|-------------|
| **Value label display** | When the current value is shown above the thumb: **On drag (default)** — only while dragging; **Always** — permanently visible; **Never** — never shown. |

#### Step Marks

| Setting | What it does |
|---------|-------------|
| **Show steps** | Displays tick marks along the slider rail. |
| **Steps inside slider** | Places tick marks inside the rail instead of below/beside it. |
| **Show step marks above / left** | *(Only when steps are not inside)* Positions tick marks above the track (horizontal) or to the left (vertical) instead of below/right. |
| **Step mode** | **Auto**: marks are placed at a regular interval you specify. **Custom**: you enter the exact positions manually. |
| **Step display** | *(Auto mode only)* The interval between marks. For example, with Min=0, Max=100, and Step display=25, marks appear at 0, 25, 50, 75, and 100. |
| **Custom steps** | *(Custom mode only)* Comma-separated values for mark positions, e.g. `0,20,50,80,100`. |

---

### inventwo — Slider track

This group controls the appearance of the rail (the track the thumb slides along).

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy all track settings from another Slider Widget. |
| **Slider rail color** | Color of the inactive part of the rail (the part behind the thumb). |
| **Slider rail active color** | Color of the active part of the rail (the part between Min and the thumb). |
| **Track bar type** | **Normal**: the active fill is on the low-value side (standard). **Inverted**: the active fill is on the high-value side (useful for blinds). **None**: no active fill shown at all. |
| **Track width** | Thickness of the rail in pixels (1–50). Default: 10. |
| **Track border radius** | Rounds the ends of the rail (1–100). Default: 100 (fully rounded). |
| **Track shadow** | Drop shadow for the rail. Set X offset, Y offset, blur, size, and color. |

---

### inventwo — Slider thumb

This group controls the handle that the user drags.

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy all thumb settings from another Slider Widget. |
| **Slider thumb color** | Fill color of the thumb. |
| **ThumbSize** | Diameter of the thumb in pixels (0–50). Set to 0 to hide the thumb completely (e.g. for a read-only bar). |
| **Thumb border radius** | How round the thumb is (1–100 %). At 100 % it is a perfect circle. |
| **Thumb shadow** | Drop shadow for the thumb. Same settings as the track shadow. |

---

## Tips

- **Vertical blinds slider:** Use **Orientation: Vertical** and **Track bar type: Inverted** so the filled part shows how far the blind is closed (top = closed, bottom = open).
- **Read-only gauge:** Enable **Read only** and set **ThumbSize** to 0 to display a clean progress bar without a draggable handle.
- **Style reuse:** Style one slider exactly how you want it, then use **From widget** in all others to copy those settings.

---

## See Also

- [Radial Slider Widget](radial-slider-widget.md) — the same control displayed as a circular arc dial
