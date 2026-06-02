# inventwo Widgets for ioBroker VIS 2 — User Guide

Welcome to the inventwo widget documentation. This guide explains how to use each widget in the VIS 2 editor to build your own smart home dashboards.

## What are inventwo widgets?

The inventwo widget set adds highly customizable tiles, controls, and display elements to VIS 2. All styling is done directly in the VIS 2 editor sidebar — no CSS knowledge required.

---

## Widget Overview

### Universal Widget
**The most powerful widget in the set.** One tile that can act as a button, switch, navigation link, dialog opener, or read-only status display — and changes its appearance depending on the datapoint value.

→ [Universal Widget](widgets/universal-widget.md)

![Universal Widget](img/widget-universal.png)

---

### Slider
**A horizontal or vertical slider for numeric values.** Drag the thumb to set a value, e.g. brightness, temperature, or volume. Fully styled — rail color, active color, thumb shape, and step marks.

→ [Slider Widget](widgets/slider-widget.md)

![Slider Widget](img/widget-slider.png)

---

### Radial Slider
**A circular arc slider for numeric values.** Works the same as the regular slider but is displayed as a round dial, great for thermostat-style tiles.

→ [Radial Slider Widget](widgets/radial-slider-widget.md)

![Radial Slider Widget](img/widget-radial-slider.png)

---

### Switch
**A toggle switch for on/off or any two-state datapoint.** Looks like a classic on/off switch. Track and thumb are independently styled.

→ [Switch Widget](widgets/switch-widget.md)

![Switch Widget](img/widget-switch.png)

---

### Checkbox
**A checkbox for on/off or any two-state datapoint.** Simpler than the switch — just a checkbox with a label.

→ [Checkbox Widget](widgets/checkbox-widget.md)

![Checkbox Widget](img/widget-checkbox.png)

---

### Table
**Displays a JSON array datapoint as a formatted table.** Sort columns, filter rows, highlight rows by value, and format cells as text, numbers, dates, or images.

→ [Table Widget](widgets/table-widget.md)

![Table Widget](img/widget-table.png)

---

### Dropdown
**A dropdown menu that reads its options from an ioBroker object's state list.** Select a value and it is written back to the datapoint.

→ [Dropdown Widget](widgets/dropdown-widget.md)

![Dropdown Widget](img/widget-dropdown.png)

---

### Marquee
**Scrolling text from a datapoint or manually entered text.** Useful for news tickers, status messages, or long labels that don't fit in a fixed space.

→ [Marquee Widget](widgets/marquee-widget.md)

---

### Value List
**Splits a text value into a formatted bullet list.** Great for displaying comma-separated or newline-separated values as a readable list.

→ [Value List Widget](widgets/value-list-widget.md)

---

## Where to Start

- **Building a control panel with buttons?** → [Universal Widget](widgets/universal-widget.md)
- **Controlling a dimmer or temperature?** → [Slider Widget](widgets/slider-widget.md) or [Radial Slider Widget](widgets/radial-slider-widget.md)
- **Simple on/off controls?** → [Switch Widget](widgets/switch-widget.md) or [Checkbox Widget](widgets/checkbox-widget.md)
- **Displaying tabular data?** → [Table Widget](widgets/table-widget.md)
- **Selecting a mode or scene?** → [Dropdown Widget](widgets/dropdown-widget.md)
