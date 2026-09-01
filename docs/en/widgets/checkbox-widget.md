> 🌐 **English** | [Deutsch](../../de/widgets/checkbox-widget.md)

# Checkbox Widget

The Checkbox Widget displays a standard checkbox that toggles a datapoint between two values. Like the Switch Widget, you define what "checked" and "unchecked" mean — so it works with booleans, numbers, or any other value pair.

![Checkbox Widget](../img/widget-checkbox.png)

---

## How to Add the Widget

1. Drag **Checkbox** from the **inventwo design** widget list onto your view.
2. Click **Object ID** in the sidebar and select your datapoint.
3. Set **Value true** (checked state) and **Value false** (unchecked state).
4. Optionally enter a label in **Text false** / **Text true** and choose its position.

---

## Settings

### Common

| Setting | What it does |
|---------|-------------|
| **Object ID** | The datapoint this checkbox reads from and writes to. |
| **Value true** | Written to the datapoint when the checkbox is checked. Leave empty to use `true`. |
| **Value false** | Written to the datapoint when the checkbox is unchecked. Leave empty to use `false`. |
| **Text false** | Label shown when the checkbox is unchecked. Leave empty for no label. |
| **Text true** | Label shown when the checkbox is checked. Leave empty for no label. |
| **Text position** | Where the label appears: **End** (right, default), **Start** (left), **Top**, or **Bottom**. |

---

### inventwo — Style

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy all style settings from another Checkbox Widget. |
| **Box color** | Color of the checkbox border and icon when unchecked. |
| **Box color active** | Color of the checkbox when checked (fill and icon). |
| **Box size** | Size of the checkbox in pixels (0–50). Default is 24 px. |

---

## Tips

- **Consistent styling:** Use **From widget** to copy the color and size settings from a master checkbox widget so all checkboxes on your dashboard look the same.
- **Font and text color:** The label's font, size, and color come from the standard VIS widget CSS settings, not from the inventwo settings.

---

## See Also

- [Switch Widget](switch-widget.md) — similar behavior with a toggle-switch appearance
- [Universal Widget](universal-widget.md) — fully custom tile with the same toggle behavior plus icons and shapes
