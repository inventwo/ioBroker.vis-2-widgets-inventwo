# Marquee Widget

The Marquee Widget displays text that continuously scrolls across the widget area — like a classic ticker or news banner. The text can come from an ioBroker datapoint (e.g. a status message, sensor value, or notification) or you can type it in manually.

---

## How to Add the Widget

1. Drag **Marquee** from the **inventwo design** widget list onto your view.
2. Resize the widget to the width you want for the scrolling area.
3. Either select an **Object ID** or type the text directly into **Scrolling text (static)**.
4. Adjust speed and direction to your liking.

---

## Settings

### Common

| Setting | What it does |
|---------|-------------|
| **Object ID** | When set, the scrolling text is the current value of this datapoint. The manual text field is hidden when an OID is selected. |
| **Scrolling text (static)** | Manual text to scroll. Only visible when no Object ID is set. |
| **Direction** | Scroll direction: **Left** (right-to-left, default) or **Right** (left-to-right). |
| **Speed (px/s)** | How fast the text scrolls in pixels per second. Range: 10–500. Default: 80. Higher = faster. The speed is constant regardless of how many copies are shown. |
| **Text copies** | How many times the text is repeated side by side in the animation loop. Default: 3. Increase this if short text leaves visible gaps during scrolling. |
| **Gap between copies (px)** | Space in pixels between two copies of the text. Default: 50. |
| **Pause on hover** | When enabled, the scrolling animation pauses when the mouse cursor is over the widget. |
| **Background** | Optional background fill color for the widget area. |

---

## Text Appearance

Font family, font size, text color, font weight, and letter spacing are all set through the standard VIS widget CSS settings (the **CSS** tab or **Font** section in the sidebar) — not through the inventwo settings panel.

---

## Tips

- **Avoid gaps:** If your text is short and you see a gap between the end of one pass and the start of the next, increase **Text copies** until the gap disappears.
- **Live data:** Connect the **Object ID** to a string datapoint (e.g. an adapter that writes news headlines, stock prices, or weather summaries) for a fully live ticker.
- **Speed vs. readability:** For text that should be read comfortably, stay below 100 px/s. For a pure visual effect, higher speeds work well.

---

## See Also

- [Value List Widget](value-list-widget.md) — displays a list instead of scrolling text
- [Universal Widget](universal-widget.md) — for static text inside a styled tile
