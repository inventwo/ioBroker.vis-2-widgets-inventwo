> 🌐 **English** | [Deutsch](../../de/widgets/calendar-widget.md)

# Calendar Widget

The Calendar Widget shows a full month view based on [MUI's Date Calendar](https://mui.com/x/react-date-pickers/date-calendar/). It can work as a datepicker (read and write a date from/to a datapoint), as a read-only date display, or simply highlight today's date — all three at once if you like.

![Calendar Widget](../img/widget-calendar.png)

---

## How to Add the Widget

1. Drag **Calendar** from the **inventwo design** widget list onto your view.
2. Click **Object ID** and select the datapoint that holds the date.
3. Set **Datapoint value format** to match how the datapoint stores its value (timestamp or ISO date string).
4. Enable **Read only** if the widget should only display the date without allowing changes.
5. Style the calendar in the **inventwo - Calendar ...** groups.

---

## Settings

### Common

| Setting | What it does |
|---------|-------------|
| **Object ID** | The datapoint this calendar reads the selected date from. Written to as well, unless **Read only** is enabled. |
| **Datapoint value format** | How the datapoint value is read/written: **Timestamp** (number, milliseconds since epoch) or **ISO date** (string, `YYYY-MM-DD`). |
| **Read only** | When enabled, the calendar only displays the date from the datapoint — clicking a day does not write anything. |
| **Highlight today** | Marks today's date with a distinct border/background, using the colors from **inventwo - Calendar today**. |
| **Disable past dates** | Days before today cannot be selected. |
| **Disable future dates** | Days after today cannot be selected. |
| **Allow month/year navigation** | When enabled (default), clicking the header lets the user jump to a specific month or year. When disabled, only the day grid with prev/next month arrows is shown. |
| **First day of week** | Whether weeks start on **Monday** or **Sunday**. Affects both the day grid and the calendar week numbers. |
| **Show calendar week numbers** | Adds a column with the calendar week number to the left of each row. |
| **Calendar week type** | Only visible when week numbers are shown. **ISO-8601**: weeks start on Monday, week 1 is the week containing the first Thursday of the year (the European standard). **Simple**: week 1 is the week that contains January 1st. |
| **Day cell size** | Size of each day cell in pixels (20–80). Also controls the size of the weekday and week-number labels. |

---

### inventwo — Calendar header

The header row with the month/year label and the navigation arrows.

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy all header settings from another Calendar Widget. |
| **Header text color** | Color of the month/year label. |
| **Header icon color** | Color of the navigation arrows and the view-switch icon. |
| **Header icon hover color** | Color of those icons on hover. |

---

### inventwo — Calendar weekdays

The row of weekday abbreviations (Mo, Tu, We, …).

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy weekday settings from another Calendar Widget. |
| **Weekday text color** | Color of the weekday abbreviations. |

---

### inventwo — Calendar day

The regular, unselected day cells.

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy day settings from another Calendar Widget. |
| **Day text color** | Text color of a normal day. |
| **Day hover color** | Background color shown while hovering a day (in edit mode / read only, hover has no effect). |
| **Day border radius** | How round the day cell is (0–100 %). 50 % gives a circle, 0 % a square. |
| **Day outside month text color** | Text color for the leading/trailing days of the previous/next month shown to fill the grid. |
| **Disabled day text color** | Text color for days disabled via **Disable past/future dates**. |

---

### inventwo — Calendar selected day

The currently selected date.

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy settings from another Calendar Widget. |
| **Selected day background color** | Background of the selected day. |
| **Selected day text color** | Text color of the selected day. |
| **Selected day shadow** | Drop shadow on the selected day. Set X offset, Y offset, blur, size, and color. |

---

### inventwo — Calendar today

Only shown when **Highlight today** is enabled.

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy settings from another Calendar Widget. |
| **Today border color** | Border color used to mark today's cell. |
| **Today background color** | Background color of today's cell. |
| **Today text color** | Text color of today's cell. |

---

### inventwo — Calendar week number

Only shown when **Show calendar week numbers** is enabled.

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy settings from another Calendar Widget. |
| **Week number text color** | Text color of the week number column. |

---

## Tips

- **Pure datepicker:** Leave **Read only** off, pick **Timestamp** or **ISO date** to match your datapoint's type.
- **Read-only date display with "today" marker:** Enable **Read only** and **Highlight today** — the calendar shows the stored date as selected and today distinctly marked, without allowing edits.
- **Language:** Month names, weekday labels, and the calendar week rules follow the browser language automatically.
- **Month/year selection colors:** When you click the header to jump to a specific month or year, that grid reuses the **inventwo - Calendar day** colors (text, hover, disabled) and the **inventwo - Calendar selected day** colors for the highlighted entry — there are no separate settings for it.
- **Style reuse:** Use **From widget** in each style group to keep multiple calendars visually consistent.

---

## See Also

- [Table Widget](table-widget.md) — for displaying date values as part of a larger data table
