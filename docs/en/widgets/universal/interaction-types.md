# Universal Widget — Interaction Types

The **Type** setting in the **Common** group defines what happens when a user clicks the Universal Widget tile. Choose the type that matches your use case.

---

## Switch

**Use for:** Toggling a datapoint between two values — on/off, open/closed, auto/manual, or any other pair.

**How it works:** Each click alternates between **Value true** and **Value false**. When the current datapoint value equals **Value true**, clicking writes **Value false**, and vice versa.

**Settings:**
- **Object ID** — The datapoint to write to.
- **Value true** — Value written for the "on" state.
- **Value false** — Value written for the "off" state.

**Tip:** In **Separated buttons** mode, each button writes its own state's value — this makes the Universal Widget behave like a multi-option selector.

---

## Button

**Use for:** Triggering an action — activating a scene, sending a command, setting a specific value.

**How it works:** Each click writes **Value true** to the datapoint.

**Settings:**
- **Object ID** — The datapoint to write to.
- **Value true** — The value written on click.
- **Hold value** — When enabled, the value is written when the button is pressed down and the datapoint is restored to its previous value when the button is released. This creates a "hold to activate" behavior (e.g. for as-long-as-pressed actions).

---

## Nav

**Use for:** Navigating between VIS views — room selection tiles, menu tiles.

**How it works:** Clicking the tile switches VIS to the configured **View**.

**Settings:**
- **View** — The VIS view to open on click. (Visible when not in **Separated buttons** mode.)
- **Value true** — Optional. If set, the tile's state comparison uses this value to detect when the target view is the currently active one (for visual highlighting).

**Tip:** Configure a second state that matches when the target view is active (compare by view or by value) and give it a different background/border color. This highlights the active room tile in your navigation bar.

---

## Read only

**Use for:** Status displays that show a value but must not react to clicks.

**How it works:** The tile reads the datapoint value and switches between its configured visual states — but all click interactions are completely ignored.

**Settings:**
- **Object ID** — The datapoint to read.

---

## View in dialog

**Use for:** Opening a detail view as an overlay popup without leaving the current dashboard page.

**How it works:** Clicking the tile opens a dialog window with the configured VIS view inside it.

**Settings (in the Common group):**
- **View** — The VIS view to show inside the dialog.

**Dialog settings (in the "Type — View in dialog" group):**

| Setting | What it does |
|---------|-------------|
| **Dialog fullscreen** | Stretches the dialog to fill the entire screen. |
| **Close on click outside** | Clicking anywhere outside the dialog closes it. (Not available in fullscreen mode.) |
| **Dialog width** | Width of the dialog in pixels. |
| **Dialog height** | Height of the dialog in pixels. |
| **Padding** | Space between the dialog border and the embedded view inside it. |
| **Close after x seconds** | Auto-closes the dialog after this many seconds. Set to 0 to disable. |
| **Background** | Background color behind the embedded view inside the dialog. |
| **Position** | Where the dialog appears: Center, Top, Bottom, Left, Right, Top left, Top right, Bottom left, Bottom right, or Custom X/Y coordinates. |

**Title bar settings:**

| Setting | What it does |
|---------|-------------|
| **Hide** | Hides the title bar completely. |
| **Dialog title** | Text shown in the title bar. |
| **Title color** | Color of the title text. |
| **Title font size** | Font size of the title text. |
| **Title padding top/bottom/left/right** | Spacing around the title text. |

**Close button settings:**

| Setting | What it does |
|---------|-------------|
| **Close button background** | Background color of the × close button. |
| **Close button color** | Icon color of the × close button. |
| **Close button size** | Size of the close button. |

**Dialog border radius:** Independently round each corner of the dialog box (top-left, top-right, bottom-right, bottom-left).

---

## Increase/decrease value

**Use for:** Plus and minus increment buttons — adjusting a temperature setpoint, brightness level, or similar numeric value step by step.

**How it works:** Clicking reads the current datapoint value and adds the configured delta. Use a positive delta for increment (+), a negative delta for decrement (–).

**Settings:**
- **Object ID** — The numeric datapoint to increment/decrement.
- **Value true** — The delta added to the current value on each click. Enter a negative number to decrease.

**Example:** To build a +/– button pair for a setpoint:
1. Add two Universal Widget tiles next to each other.
2. First tile: Type = Increase/decrease value, Value true = `0.5`
3. Second tile: Type = Increase/decrease value, Value true = `-0.5`

---

## Send HTTP request / Open URL

**Use for:** Triggering HTTP actions — controlling devices via their local web API, opening a camera stream, or navigating to an external page.

**Settings:**
- **URL** — The full URL to call or open.
- **Http type:**
  - **Send request** — Sends an HTTP GET request in the background. The page does not navigate. Use this to trigger an API endpoint.
  - **Open URL** — Navigates the current browser tab to the URL.
  - **Open URL in new tab** — Opens the URL in a new browser tab.

---

## Single Button vs. Separated Buttons

The **Mode** setting changes how states are displayed:

### Single button (default)
One tile, one action. The tile's appearance changes depending on which state is currently active (based on the datapoint value). Clicking always performs the same action (defined by **Type**).

### Separated buttons
Each state becomes its own independent button tile, arranged side by side (or top/bottom). Each button shows the content and style of its own state. Clicking a button writes that state's configured value to the datapoint.

This is equivalent to a radio button list — great for mode selectors like `Off / Low / Medium / High`.

Additional settings for separated buttons:
- **Direction** — Arrange buttons in a **Row** (side by side) or **Column** (stacked).
- **Button size** — Width (row) or height (column) of each individual button tile in pixels.
- **Button spacing** — Gap between buttons in pixels.

---

## Back to

- [Universal Widget Overview](../universal-widget.md)
- [Content Types](content-types.md)
- [Styling and Shapes](styling-and-shapes.md)
