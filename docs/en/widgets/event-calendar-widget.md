> 🌐 **English** | [Deutsch](../../de/widgets/event-calendar-widget.md)

# Event Calendar Widget

The Event Calendar Widget shows events/appointments (e.g. from an iCal calendar) in a Google-Calendar-style view, based on [FullCalendar](https://fullcalendar.io/). Every color, font size, and border is configurable, and all views available in FullCalendar's free/MIT bundle are supported: Month, Week, Day, Multi-month (year), and four List views.

Looking for a plain date picker instead? Use the [Calendar Widget](calendar-widget.md).

---

## How to Add the Widget

1. Drag **Event Calendar** from the **inventwo design** widget list onto your view.
2. Click **Events (datapoint)** and select the datapoint that holds the JSON event list (see [Showing events](#showing-events) below).
3. Choose the **View** and adjust the header/navigation/week-number and color settings.

---

## Settings

### Common

| Setting | What it does |
|---------|-------------|
| **Events (datapoint)** | Datapoint holding a JSON list of events (see [Showing events](#showing-events) below). This is the only datapoint the widget needs. |
| **First day of week** | Whether weeks start on **Monday** or **Sunday**. |
| **View** | **Month**, **Week**, **Day**, **Multi-month (year)** (a grid/stack of several months), or one of four **List** views (**List - day/week/month/year**, an agenda-style list of upcoming events). |
| **Show header bar** | Enabled by default. Disable to hide the toolbar (title + navigation buttons) entirely. |
| **Allow month/week/day navigation** | Only shown when **Show header bar** is enabled. Enabled by default. Disable to keep the title visible but remove the prev/next/today buttons, so the user can't switch to a different month/week/day. |
| **Show calendar week numbers** | Adds a week-number badge to each day cell (mainly visible in Month/Multi-month views). |
| **Calendar week type** | Only visible when week numbers are shown. **ISO-8601**: weeks start on Monday, week 1 is the week containing the first Thursday of the year (the European standard). **Simple**: locale-dependent week numbering. |

---

### Event color rules

The ioBroker **ical** adapter only exposes one color per calendar (`_calColor`), not per event - unlike Google Calendar itself, which colors individual events. So events from the same calendar all come through with the same color and can't be told apart. Event color rules let you assign colors manually based on the event title instead.

| Setting | What it does |
|---------|-------------|
| **Number of rules** | How many rules to configure below. |
| **Title contains** *(per rule)* | Text to match against the event title. Matching is case-insensitive and matches if the title *contains* this text (not just an exact match) - e.g. `Geburtstag` matches "Geburtstag Mama" and "Geburtstag Papa" alike. |
| **Background color** *(per rule)* | The color used for events whose title matches. |

Rules are checked in order (rule 1, then rule 2, ...) and the first match wins. A matching rule overrides any color the event itself provides (its own `color`/`_calColor`, and the fallback **Event background color** from the *event tiles* group below) - that's the point, since the adapter's own color is not useful for telling events apart.

---

### inventwo — Calendar events: header

The FullCalendar toolbar: title and the prev/next/today navigation buttons.

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy these settings from another Event Calendar Widget. |
| **Header title color** | Color of the month/year/day title. |
| **Title font size** | Font size of the title, in pixels. |
| **Button text color** | Text color of the prev/next/today buttons. |
| **Button background color** | Background color of the buttons. Accepts `transparent`. |
| **Button border color** | Border color of the buttons. |
| **Button border radius** | Corner rounding of the buttons, in pixels. |
| **Button text color (hover)** | Text color while hovering/focusing/active. |
| **Button background color (hover)** | Background color while hovering/focusing/active. |

---

### inventwo — Calendar events: weekdays

The row of weekday column headers (Month/Week/Day/Multi-month views) - and, since it's the same kind of heading, also the day/date title bar shown above each day's events in the List views.

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy these settings from another Event Calendar Widget. |
| **Weekday text color** | Color of the weekday abbreviations/column headers, and of the day/date text in the List views' title bar. |
| **Weekday background color** | Background color of the weekday header row, and of the List views' title bar. Accepts `transparent`. |
| **Weekday font size** | Font size of the weekday labels, and of the List views' title bar text, in pixels. |

---

### inventwo — Calendar events: day

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy these settings from another Event Calendar Widget. |
| **Day number text color** | Color of the day number shown in each tile (Month/Multi-month views). |
| **Day number font size** | Font size of the day number, in pixels. |
| **Day outside month text color** | Text color of the leading/trailing days from the previous/next month shown to fill the month grid. |
| **Weekend background color** | Background color of Saturday/Sunday columns. Accepts `transparent` to leave them unstyled. |
| **Week number text color** | Only shown when **Show calendar week numbers** is enabled. Text color of the week-number badge. |
| **Week number background color** | Only shown when **Show calendar week numbers** is enabled. Background color of the week-number badge. |
| **Week number font size** | Only shown when **Show calendar week numbers** is enabled. Font size of the week-number badge, in pixels. |

---

### inventwo — Calendar events: today

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy these settings from another Event Calendar Widget. |
| **Today background color** | Background color of today's cell/column. |
| **Today text color** | Text color of today's day number/column header. |
| **Today border color** | Color of the highlight border drawn around today's cell/column. |
| **Today border width** | Thickness of that border, in pixels (0–10). |
| **Show current time indicator** | Enabled by default. Only visible in the Week/Day views. Shows a live line at the current time. |
| **Current time indicator color** | Only shown when the indicator is enabled. Color of that line (and its arrow marker). |

---

### inventwo — Calendar events: event tiles

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy these settings from another Event Calendar Widget. |
| **Event background color** | Fallback background color for an event tile, used when the event itself doesn't provide a `color` (see below). |
| **Event text color** | Text color of event tiles. |
| **Event border color** | Border color of event tiles. |
| **Event border radius** | Corner rounding of event tiles, in pixels. |
| **Event font size** | Font size of the event title text, in pixels. |
| **"+N more" link color** | Color of the "+N more" link shown in Month view when a day has more events than fit in the cell. |

---

### inventwo — Calendar events: borders

The grid lines between day cells/columns.

| Setting | What it does |
|---------|-------------|
| **From widget** | Copy these settings from another Event Calendar Widget. |
| **Show grid borders** | Enabled by default. Disable to remove all grid lines. |
| **Border width** | Only shown when borders are enabled. Thickness in pixels (0–5). |
| **Border color** | Only shown when borders are enabled. Color of the grid lines. |

---

## Showing events

The Event Calendar Widget does not parse iCal (`.ics`) data itself. Instead, point **Events (datapoint)** at a datapoint whose value is a JSON array of events. Each event is an object with:

| Field | Alternative field | Required | Description |
|-------|--------------------|----------|--------------|
| `title` | `summary`, `event` | Yes | The text shown on the event tile. |
| `start` | `_date` | Yes | Start of the event. ISO date/time string (e.g. `2026-08-03T10:00:00`) or a timestamp in milliseconds. |
| `end` | `_end` | No | End of the event, same formats as `start`. Defaults to `start` (single-day event). |
| `allDay` | `_allDay` | No | Set to `true` for all-day events. Following the standard iCal/FullCalendar convention, `end`/`_end` is then treated as **exclusive** — the day *after* the last visible day, not the last day itself. |
| `color` | `_calColor` | No | Overrides **Event background color** for this specific event. |

The "alternative field" column exists because the widget also accepts the JSON produced directly by the ioBroker **ical** adapter's JSON datapoint (e.g. `ical.0.data.table`) — no conversion script needed, just point **Events (datapoint)** at it. Example of that native shape:

```json
[
  {
    "event": "Wertstoff",
    "_date": "2026-07-28T22:00:00.000Z",
    "_end": "2026-07-29T22:00:00.000Z",
    "_allDay": true,
    "_calColor": "#FF0000"
  }
]
```

Or, with the simple custom shape:

```json
[
  { "title": "Team meeting", "start": "2026-08-03T10:00:00", "end": "2026-08-03T11:00:00" },
  { "title": "Vacation", "start": "2026-08-05", "end": "2026-08-10", "allDay": true, "color": "#c0743c" }
]
```

Note the exclusive end for the all-day "Vacation" example above: to show the event on August 5th–9th, `end` is set to August 10th (the day after).

---

## Tips

- **Language:** Month/weekday names follow the browser language automatically.
- **Resizing:** The calendar keeps its size in sync live when you resize the widget in the vis editor — no page reload needed.
- **List views:** Great for a compact "upcoming events" widget — pick **List - week** or **List - month** and disable the header bar/navigation for a fixed agenda view.
- **Style reuse:** Use **From widget** in each style group to keep multiple event calendars visually consistent.

---

## See Also

- [Calendar Widget](calendar-widget.md) — plain date picker without events
- [Table Widget](table-widget.md) — for displaying date values as part of a larger data table
