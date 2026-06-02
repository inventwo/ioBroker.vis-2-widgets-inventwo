# Universal Widget — Styling and Shapes

The Universal Widget has a rich set of styling options, all configured directly in the VIS 2 editor sidebar. Styles are organized into named groups. Most groups have a **From widget** field that lets you copy settings from another Universal Widget.

---

## How States and Styling Work Together

The **Default state** group and each numbered **State** group define what the tile looks like when a particular datapoint value is active. Within each state you set:

- **Background** color
- **Content color** (icon tint, image filter)
- **Text color**
- **Border color**
- **Outer / inner shadow colors**
- **Content blink interval** (flashing speed in ms — 0 = no blinking)
- The icon, image, text, or embedded view to show

The **inventwo Widget Design** group (shown when you click on the state groups) is where these per-state colors are configured.

---

## Style Groups

### inventwo — Text

Controls the appearance of the text label inside the tile.

| Setting | What it does |
|---------|-------------|
| **Text decoration** | Underline, overline, or strikethrough. |
| **Text align** | Horizontal alignment of the text: Start, Center, End. |
| **Margin top / bottom / left / right** | Space around the text inside the tile. |

Font family, size, weight, and color are set in the standard VIS widget CSS settings and in the per-state **Text color** fields.

---

### inventwo — Content

Controls the size and positioning of the content (icon, image, etc.) inside the tile.

| Setting | What it does |
|---------|-------------|
| **Content size** | Size of the icon or image. Can be a pixel value or a percentage of the tile size. |
| **Rotation** | Rotates the content by any angle (degrees). |
| **Mirror** | Flips the content horizontally. |
| **Scale to fit** | *(View in widget only)* Scales the embedded view down to fit the tile. |
| **Fill type** | *(Image content only)* How the image fills the tile: Contain, Cover, Fill, Repeat. |
| **Position** | *(Image content only)* Image position within the tile. |

---

### inventwo — Alignment

Controls how the content and text are arranged relative to each other inside the tile.

| Setting | What it does |
|---------|-------------|
| **Content align** | Horizontal alignment of the content element: Start, Center, End, Space between. |
| **Text align (alignment group)** | Vertical or horizontal alignment position of the text. |
| **Invert order** | Swaps the order of content and text (e.g. text above icon instead of below). |

---

### inventwo — Transparency

| Setting | What it does |
|---------|-------------|
| **Background opacity** | Opacity of the tile background (0 = fully transparent, 1 = fully opaque). |
| **Content opacity** | Opacity of the content element (icon, image, etc.). |

---

### inventwo — Spacing

Sets the inner padding of the tile — the space between the tile border and its content.

| Setting | What it does |
|---------|-------------|
| **Padding top / bottom / left / right** | Space from the edge of the tile to the content inside it, in pixels. |

---

### inventwo — Border radius

Rounds the corners of the tile. Set each corner independently.

| Setting | What it does |
|---------|-------------|
| **Top left / Top right / Bottom right / Bottom left** | Corner radius in pixels for each corner. |

> **Note:** When a polygon shape is active, the standard border-radius has no effect. Use the **Corner radius** setting inside the **inventwo - Shape** group instead.

---

### inventwo — Border

Adds a border around the tile.

| Setting | What it does |
|---------|-------------|
| **Border style** | Line style: None, Solid, Dashed, Dotted, Double, Groove, Ridge, Outset. |
| **Size top / bottom / left / right** | Border thickness per side in pixels. |
| **Border color** | Default border color (also set per state in the Default state / State groups). |

---

### inventwo — Outer shadow

Adds a drop shadow outside the tile.

| Setting | What it does |
|---------|-------------|
| **Outer shadow color** | Shadow color (default state). Also set per state in the state groups. |
| **X offset** | Horizontal shadow offset in pixels. |
| **Y offset** | Vertical shadow offset in pixels. |
| **Blur** | Shadow blur radius. |
| **Size** | Shadow spread size. |

---

### inventwo — Inner shadow

Adds an inset shadow inside the tile (creates a recessed/pressed effect).

Same settings as the outer shadow. A per-state color can be set in the state groups.

---

### inventwo — Shape

The shape system lets you clip the tile into a geometric shape. All shapes other than Rectangle use CSS clip-path, so the background, border, and shadow still appear in the selected shape.

![Shape system overview](../../img/preview_shapes.png)

| Setting | What it does |
|---------|-------------|
| **Shape** | The shape of the tile: Rectangle (default, no clipping), Triangle, Diamond, Pentagon, Hexagon, Heptagon, Octagon, Star, Custom. |
| **Shape rotation** | Rotates the polygon clip shape. Independent of the content rotation. |
| **Corner radius** | Rounds the corners of polygon shapes. The standard border-radius setting from **inventwo - Border radius** is ignored for polygon shapes — use this instead. |
| **Custom polygon points** | *(Custom shape only)* Comma-separated X%/Y% pairs in clockwise order, e.g. `40% 0%, 100% 50%, 40% 100%, 0% 50%`. The `%` sign is optional. If the path is invalid, the tile falls back to rectangle. |

> **Tip:** Create custom polygon shapes visually using the tool at [bennettfeely.com/clippy](https://bennettfeely.com/clippy/) and paste the result into **Custom polygon points**.

---

### Click feedback

When clicked, the tile can briefly flash to a different color, giving the user visual confirmation that the click was registered.

| Setting | What it does |
|---------|-------------|
| **Background** | Background color during the pressed moment. |
| **Content color** | Content (icon) color during the pressed moment. |
| **Text color** | Text color during the pressed moment. |
| **Border color** | Border color during the pressed moment. |
| **Outer shadow color** | Outer shadow color during the pressed moment. |
| **Inner shadow color** | Inner shadow color during the pressed moment. |
| **Duration** | How long the pressed color is visible in milliseconds. |

---

## Style Reuse with "From Widget"

Most style groups have a **From widget** option at the top. When you select another Universal Widget here, all settings in that group are copied from the selected widget at runtime.

**How to use it:**
1. Create one "master" Universal Widget and configure its look exactly how you want it.
2. On all other tiles, select that master widget in each **From widget** field.
3. Whenever you change the master widget's style, all tiles that reference it update automatically.

This is the recommended approach for dashboards with many consistent-looking tiles — configure the style once, reuse everywhere.

---

## Back to

- [Universal Widget Overview](../universal-widget.md)
- [Interaction Types](interaction-types.md)
- [Content Types](content-types.md)
