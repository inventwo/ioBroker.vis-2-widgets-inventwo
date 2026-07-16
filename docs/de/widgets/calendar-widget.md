> 🌐 [English](../../en/widgets/calendar-widget.md) | **Deutsch**

# Kalender Widget

Das Kalender Widget zeigt eine vollständige Monatsansicht basierend auf [MUI's Date Calendar](https://mui.com/x/react-date-pickers/date-calendar/). Es kann als Datepicker (Datum aus einem Datenpunkt lesen und schreiben), als reine Anzeige eines Datums oder einfach zur Hervorhebung des heutigen Tages verwendet werden — auch alle drei Funktionen gleichzeitig.

![Kalender Widget](../img/widget-calendar.png)

---

## Widget hinzufügen

1. Ziehe **Calendar** aus der Widget-Liste **inventwo design** auf deine Ansicht.
2. Klicke auf **Objekt-ID** und wähle den Datenpunkt, der das Datum enthält.
3. Stelle **Format des Datenpunktwerts** passend zum Speicherformat deines Datenpunkts ein (Zeitstempel oder ISO-Datumsstring).
4. Aktiviere **Schreibgeschützt**, wenn das Widget das Datum nur anzeigen, aber nicht ändern soll.
5. Gestalte den Kalender in den Gruppen **inventwo - Kalender-...**.

---

## Einstellungen

### Common

| Einstellung | Beschreibung |
|-------------|--------------|
| **Objekt-ID** | Der Datenpunkt, aus dem das ausgewählte Datum gelesen wird. Wird auch beschrieben, sofern **Schreibgeschützt** nicht aktiviert ist. |
| **Format des Datenpunktwerts** | Wie der Datenpunktwert gelesen/geschrieben wird: **Zeitstempel** (Zahl, Millisekunden seit Epoch) oder **ISO-Datum** (String, `JJJJ-MM-TT`). |
| **Schreibgeschützt** | Bei Aktivierung zeigt der Kalender nur das Datum aus dem Datenpunkt an — ein Klick auf einen Tag schreibt nichts. |
| **Heute hervorheben** | Markiert den heutigen Tag mit einem eigenen Rahmen/Hintergrund, gemäß den Farben aus **inventwo - Kalender-Heute**. |
| **Vergangene Tage sperren** | Tage vor heute können nicht ausgewählt werden. |
| **Zukünftige Tage sperren** | Tage nach heute können nicht ausgewählt werden. |
| **Monats-/Jahresnavigation erlauben** | Bei Aktivierung (Standard) kann der Nutzer über einen Klick auf die Kopfzeile direkt zu einem bestimmten Monat oder Jahr springen. Bei Deaktivierung wird nur das Tagesraster mit Pfeilen für den vorherigen/nächsten Monat angezeigt. |
| **Erster Wochentag** | Ob Wochen mit **Montag** oder **Sonntag** beginnen. Wirkt sich sowohl auf das Tagesraster als auch auf die Kalenderwochen aus. |
| **Kalenderwochen anzeigen** | Fügt links neben jeder Zeile eine Spalte mit der Kalenderwoche hinzu. |
| **Art der Kalenderwoche** | Nur sichtbar, wenn Kalenderwochen angezeigt werden. **ISO-8601**: Wochen beginnen am Montag, KW 1 ist die Woche mit dem ersten Donnerstag des Jahres (europäischer Standard). **Einfach**: KW 1 ist die Woche, die den 1. Januar enthält. |
| **Größe der Tageszellen** | Größe jeder Tageszelle in Pixel (20–80). Bestimmt auch die Größe der Wochentags- und Kalenderwochen-Beschriftungen. |

---

### inventwo - Kalender-Kopfzeile

Die Kopfzeile mit der Monats-/Jahresbeschriftung und den Navigationspfeilen.

| Einstellung | Beschreibung |
|-------------|--------------|
| **From widget** | Kopiert alle Einstellungen der Kopfzeile von einem anderen Kalender Widget. |
| **Textfarbe Kopfzeile** | Farbe der Monats-/Jahresbeschriftung. |
| **Symbolfarbe Kopfzeile** | Farbe der Navigationspfeile und des Umschalt-Symbols. |
| **Symbolfarbe Kopfzeile (Hover)** | Farbe dieser Symbole beim Überfahren mit der Maus. |

---

### inventwo - Kalender-Wochentage

Die Zeile mit den Wochentagsabkürzungen (Mo, Di, Mi, …).

| Einstellung | Beschreibung |
|-------------|--------------|
| **From widget** | Kopiert die Wochentag-Einstellungen von einem anderen Kalender Widget. |
| **Textfarbe Wochentage** | Farbe der Wochentagsabkürzungen. |

---

### inventwo - Kalender-Tag

Die normalen, nicht ausgewählten Tageszellen.

| Einstellung | Beschreibung |
|-------------|--------------|
| **From widget** | Kopiert die Tag-Einstellungen von einem anderen Kalender Widget. |
| **Textfarbe Tag** | Textfarbe eines normalen Tages. |
| **Hover-Farbe Tag** | Hintergrundfarbe beim Überfahren eines Tages (im Edit-Modus / bei Schreibschutz hat Hover keine Wirkung). |
| **Rahmenradius Tag** | Wie rund die Tageszelle ist (0–100 %). 50 % ergibt einen Kreis, 0 % ein Quadrat. |
| **Textfarbe Tag außerhalb des Monats** | Textfarbe für die führenden/nachfolgenden Tage des vorherigen/nächsten Monats, die das Raster auffüllen. |
| **Textfarbe gesperrter Tag** | Textfarbe für Tage, die über **Vergangene/Zukünftige Tage sperren** deaktiviert sind. |

---

### inventwo - Kalender-ausgewählter Tag

Das aktuell ausgewählte Datum.

| Einstellung | Beschreibung |
|-------------|--------------|
| **From widget** | Kopiert die Einstellungen von einem anderen Kalender Widget. |
| **Hintergrundfarbe ausgewählter Tag** | Hintergrund des ausgewählten Tages. |
| **Textfarbe ausgewählter Tag** | Textfarbe des ausgewählten Tages. |
| **Schatten ausgewählter Tag** | Schlagschatten auf dem ausgewählten Tag. X-Versatz, Y-Versatz, Unschärfe, Größe und Farbe einstellbar. |

---

### inventwo - Kalender-Heute

Wird nur angezeigt, wenn **Heute hervorheben** aktiviert ist.

| Einstellung | Beschreibung |
|-------------|--------------|
| **From widget** | Kopiert die Einstellungen von einem anderen Kalender Widget. |
| **Rahmenfarbe Heute** | Rahmenfarbe zur Markierung des heutigen Tages. |
| **Hintergrundfarbe Heute** | Hintergrundfarbe des heutigen Tages. |
| **Textfarbe Heute** | Textfarbe des heutigen Tages. |

---

### inventwo - Kalender-Kalenderwoche

Wird nur angezeigt, wenn **Kalenderwochen anzeigen** aktiviert ist.

| Einstellung | Beschreibung |
|-------------|--------------|
| **From widget** | Kopiert die Einstellungen von einem anderen Kalender Widget. |
| **Textfarbe Kalenderwoche** | Textfarbe der Kalenderwochen-Spalte. |

---

## Tipps

- **Reiner Datepicker:** **Schreibgeschützt** deaktiviert lassen, **Zeitstempel** oder **ISO-Datum** passend zum Typ deines Datenpunkts wählen.
- **Schreibgeschützte Anzeige mit "Heute"-Markierung:** **Schreibgeschützt** und **Heute hervorheben** aktivieren — der Kalender zeigt das gespeicherte Datum als Auswahl und den heutigen Tag separat markiert, ohne dass Änderungen möglich sind.
- **Sprache:** Monatsnamen, Wochentagsbeschriftungen und die Regeln für die Kalenderwoche richten sich automatisch nach der Browsersprache.
- **Farben der Monats-/Jahresauswahl:** Klickst du auf die Kopfzeile, um direkt zu einem Monat oder Jahr zu springen, verwendet dieses Raster die Farben aus **inventwo - Kalender-Tag** (Text, Hover, gesperrt) sowie aus **inventwo - Kalender-ausgewählter Tag** für den markierten Eintrag — eigene Einstellungen dafür gibt es nicht.
- **Stil-Wiederverwendung:** Nutze **From widget** in jeder Design-Gruppe, um mehrere Kalender optisch konsistent zu halten.

---

## Siehe auch

- [Tabelle Widget](table-widget.md) — zur Anzeige von Datumswerten als Teil einer größeren Datentabelle
