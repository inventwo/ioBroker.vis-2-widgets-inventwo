> 🌐 [English](../../en/widgets/event-calendar-widget.md) | **Deutsch**

# Terminkalender Widget

Das Terminkalender Widget zeigt Termine (z. B. aus einem iCal-Kalender) in einer Ansicht im Google-Calendar-Stil, basierend auf [FullCalendar](https://fullcalendar.io/). Jede Farbe, Schriftgröße und jeder Rahmen ist einstellbar, und alle Ansichten aus FullCalendars kostenlosem/MIT-Paket werden unterstützt: Monat, Woche, Tag, Mehrere Monate (Jahr) und vier Listen-Ansichten.

Du suchst stattdessen einen reinen Datepicker? Nutze das [Kalender Widget](calendar-widget.md).

---

## Widget hinzufügen

1. Ziehe **Terminkalender** aus der Widget-Liste **inventwo design** auf deine Ansicht.
2. Klicke auf **Termine (Datenpunkt)** und wähle den Datenpunkt mit der JSON-Terminliste (siehe [Termine anzeigen](#termine-anzeigen) unten).
3. Wähle die **Ansicht** und passe Kopfzeile/Navigation/Kalenderwochen und Farben an.

---

## Einstellungen

### Common

| Einstellung | Beschreibung |
|-------------|--------------|
| **Termine (Datenpunkt)** | Datenpunkt mit einer JSON-Terminliste (siehe [Termine anzeigen](#termine-anzeigen) unten). Das ist der einzige Datenpunkt, den das Widget benötigt. |
| **Erster Wochentag** | Ob Wochen mit **Montag** oder **Sonntag** beginnen. |
| **Ansicht** | **Monat**, **Woche**, **Tag**, **Mehrere Monate (Jahr)** (ein Raster/Stapel mehrerer Monate) oder eine der vier **Listen**-Ansichten (**Liste - Tag/Woche/Monat/Jahr**, eine Agenda-artige Liste kommender Termine). |
| **Kopfzeile anzeigen** | Standardmäßig aktiv. Deaktivieren, um die komplette Kopfzeile (Titel + Navigations-Buttons) auszublenden. |
| **Monats-/Wochen-/Tageswechsel erlauben** | Nur sichtbar, wenn **Kopfzeile anzeigen** aktiv ist. Standardmäßig aktiv. Deaktivieren, um den Titel sichtbar zu lassen, aber die Zurück-/Vor-/Heute-Buttons zu entfernen, sodass der Nutzer nicht zu einem anderen Monat/einer anderen Woche/einem anderen Tag wechseln kann. |
| **Kalenderwochen anzeigen** | Fügt jeder Tageszelle ein Kalenderwochen-Abzeichen hinzu (vor allem in Monats-/Mehrere-Monate-Ansichten sichtbar). |
| **Art der Kalenderwoche** | Nur sichtbar, wenn Kalenderwochen angezeigt werden. **ISO-8601**: Wochen beginnen am Montag, KW 1 ist die Woche mit dem ersten Donnerstag des Jahres (europäischer Standard). **Einfach**: Sprachraum-abhängige Wochennummerierung. |

---

### Termin-Farbregeln

Der ioBroker-Adapter **ical** liefert nur eine Farbe pro Kalender (`_calColor`), nicht pro Termin — anders als Google Calendar selbst, das einzelne Termine einfärbt. Termine desselben Kalenders kommen also alle mit derselben Farbe an und lassen sich nicht unterscheiden. Mit Termin-Farbregeln kannst du Farben stattdessen anhand des Termintitels manuell zuweisen.

| Einstellung | Beschreibung |
|-------------|--------------|
| **Anzahl Regeln** | Wie viele Regeln unten konfiguriert werden. |
| **Titel enthält** *(pro Regel)* | Text, der mit dem Termintitel abgeglichen wird. Der Abgleich ist nicht groß-/kleinschreibungssensitiv und trifft zu, wenn der Titel diesen Text *enthält* (nicht nur bei exakter Übereinstimmung) — z. B. passt `Geburtstag` sowohl auf "Geburtstag Mama" als auch "Geburtstag Papa". |
| **Hintergrundfarbe** *(pro Regel)* | Die Farbe, die für Termine mit passendem Titel verwendet wird. |

Regeln werden der Reihe nach geprüft (Regel 1, dann Regel 2, ...), die erste passende Regel gewinnt. Eine passende Regel überschreibt jede vom Termin selbst mitgelieferte Farbe (dessen eigene `color`/`_calColor` sowie die Fallback-**Termin-Hintergrundfarbe** aus der Gruppe *Termin-Kacheln* weiter unten) — das ist der Sinn der Sache, da die Farbe des Adapters selbst nicht zur Unterscheidung taugt.

---

### inventwo - Kalender-Termine: Kopfzeile

Die FullCalendar-Kopfzeile: Titel sowie die Zurück-/Vor-/Heute-Navigations-Buttons.

| Einstellung | Beschreibung |
|-------------|--------------|
| **From widget** | Kopiert diese Einstellungen von einem anderen Terminkalender Widget. |
| **Kopfzeilen-Titelfarbe** | Farbe des Monats-/Jahres-/Tagestitels. |
| **Schriftgröße Titel** | Schriftgröße des Titels in Pixel. |
| **Button-Textfarbe** | Textfarbe der Zurück-/Vor-/Heute-Buttons. |
| **Button-Hintergrundfarbe** | Hintergrundfarbe der Buttons. Akzeptiert `transparent`. |
| **Button-Rahmenfarbe** | Rahmenfarbe der Buttons. |
| **Button-Rahmenradius** | Eckenradius der Buttons in Pixel. |
| **Button-Textfarbe (Hover)** | Textfarbe beim Überfahren/Fokussieren/Aktivsein. |
| **Button-Hintergrundfarbe (Hover)** | Hintergrundfarbe beim Überfahren/Fokussieren/Aktivsein. |

---

### inventwo - Kalender-Termine: Wochentage

Die Zeile mit den Wochentags-Spaltenköpfen (Monats-/Wochen-/Tages-/Mehrere-Monate-Ansichten) — und, da es sich um dieselbe Art von Titelzeile handelt, auch die Datums-/Wochentag-Titelleiste, die in den Listen-Ansichten über den Terminen jedes Tages steht.

| Einstellung | Beschreibung |
|-------------|--------------|
| **From widget** | Kopiert diese Einstellungen von einem anderen Terminkalender Widget. |
| **Wochentag-Textfarbe** | Farbe der Wochentagsabkürzungen/Spaltenköpfe sowie des Datumstexts in der Titelleiste der Listen-Ansichten. |
| **Wochentag-Hintergrundfarbe** | Hintergrundfarbe der Wochentagszeile sowie der Titelleiste in den Listen-Ansichten. Akzeptiert `transparent`. |
| **Schriftgröße Wochentage** | Schriftgröße der Wochentagsbeschriftungen sowie des Texts in der Titelleiste der Listen-Ansichten, in Pixel. |

---

### inventwo - Kalender-Termine: Tag

| Einstellung | Beschreibung |
|-------------|--------------|
| **From widget** | Kopiert diese Einstellungen von einem anderen Terminkalender Widget. |
| **Tageszahl-Textfarbe** | Farbe der Tageszahl in jeder Kachel (Monats-/Mehrere-Monate-Ansichten). |
| **Schriftgröße Tageszahl** | Schriftgröße der Tageszahl in Pixel. |
| **Textfarbe Tag außerhalb des Monats** | Textfarbe der führenden/nachfolgenden Tage des vorherigen/nächsten Monats, die das Monatsraster auffüllen. |
| **Wochenend-Hintergrundfarbe** | Hintergrundfarbe der Samstags-/Sonntagsspalten. Akzeptiert `transparent`, um sie ungestylt zu lassen. |
| **Textfarbe Kalenderwoche** | Nur sichtbar, wenn **Kalenderwochen anzeigen** aktiviert ist. Textfarbe des Kalenderwochen-Abzeichens. |
| **Hintergrundfarbe Kalenderwoche** | Nur sichtbar, wenn **Kalenderwochen anzeigen** aktiviert ist. Hintergrundfarbe des Kalenderwochen-Abzeichens. |
| **Schriftgröße Kalenderwoche** | Nur sichtbar, wenn **Kalenderwochen anzeigen** aktiviert ist. Schriftgröße des Kalenderwochen-Abzeichens in Pixel. |

---

### inventwo - Kalender-Termine: Heute

| Einstellung | Beschreibung |
|-------------|--------------|
| **From widget** | Kopiert diese Einstellungen von einem anderen Terminkalender Widget. |
| **Heute-Hintergrundfarbe** | Hintergrundfarbe der heutigen Zelle/Spalte. |
| **Heute-Textfarbe** | Textfarbe der heutigen Tageszahl/Spaltenkopf. |
| **Heute-Rahmenfarbe** | Farbe des Rahmens, der um die heutige Zelle/Spalte gezeichnet wird. |
| **Heute-Rahmenbreite** | Dicke dieses Rahmens in Pixel (0–10). |
| **Aktuelle Uhrzeit anzeigen** | Standardmäßig aktiv. Nur in den Ansichten Woche/Tag sichtbar. Zeigt eine live mitlaufende Linie an der aktuellen Uhrzeit. |
| **Farbe Uhrzeit-Linie** | Nur sichtbar, wenn die Anzeige aktiviert ist. Farbe dieser Linie (und ihres Pfeil-Markers). |

---

### inventwo - Kalender-Termine: Termin-Kacheln

| Einstellung | Beschreibung |
|-------------|--------------|
| **From widget** | Kopiert diese Einstellungen von einem anderen Terminkalender Widget. |
| **Termin-Hintergrundfarbe** | Fallback-Hintergrundfarbe einer Termin-Kachel, verwendet wenn der Termin selbst keine eigene `color` mitliefert (siehe unten). |
| **Termin-Textfarbe** | Textfarbe der Termin-Kacheln. |
| **Termin-Rahmenfarbe** | Rahmenfarbe der Termin-Kacheln. |
| **Termin-Rahmenradius** | Eckenradius der Termin-Kacheln in Pixel. |
| **Schriftgröße Termine** | Schriftgröße des Termin-Titeltexts in Pixel. |
| **Farbe "+N weitere"-Link** | Farbe des "+N weitere"-Links, der in der Monatsansicht erscheint, wenn ein Tag mehr Termine hat, als in die Zelle passen. |

---

### inventwo - Kalender-Termine: Rahmen

Die Rasterlinien zwischen Tageszellen/-spalten.

| Einstellung | Beschreibung |
|-------------|--------------|
| **From widget** | Kopiert diese Einstellungen von einem anderen Terminkalender Widget. |
| **Rahmenlinien anzeigen** | Standardmäßig aktiv. Deaktivieren, um alle Rasterlinien zu entfernen. |
| **Rahmenbreite** | Nur sichtbar, wenn Rahmenlinien aktiv sind. Dicke in Pixel (0–5). |
| **Rahmenfarbe** | Nur sichtbar, wenn Rahmenlinien aktiv sind. Farbe der Rasterlinien. |

---

## Termine anzeigen

Das Terminkalender Widget parst iCal-Daten (`.ics`) nicht selbst. Stattdessen wird **Termine (Datenpunkt)** auf einen Datenpunkt gesetzt, dessen Wert ein JSON-Array von Terminen ist. Jeder Termin ist ein Objekt mit:

| Feld | Alternatives Feld | Erforderlich | Beschreibung |
|------|--------------------|--------------|--------------|
| `title` | `summary`, `event` | Ja | Der Text, der auf der Termin-Kachel angezeigt wird. |
| `start` | `_date` | Ja | Beginn des Termins. ISO-Datums-/Zeitstring (z. B. `2026-08-03T10:00:00`) oder Zeitstempel in Millisekunden. |
| `end` | `_end` | Nein | Ende des Termins, gleiche Formate wie `start`. Standardwert ist `start` (eintägiger Termin). |
| `allDay` | `_allDay` | Nein | Auf `true` setzen für ganztägige Termine. Nach der üblichen iCal-/FullCalendar-Konvention wird `end`/`_end` dann als **exklusiv** behandelt — der Tag *nach* dem letzten sichtbaren Tag, nicht der letzte Tag selbst. |
| `color` | `_calColor` | Nein | Überschreibt die **Termin-Hintergrundfarbe** für diesen einzelnen Termin. |

Die Spalte "Alternatives Feld" gibt es, weil das Widget auch das JSON akzeptiert, das der ioBroker-Adapter **ical** direkt über seinen JSON-Datenpunkt liefert (z. B. `ical.0.data.table`) — ganz ohne Konvertierungs-Skript, einfach **Termine (Datenpunkt)** darauf zeigen lassen. Beispiel für dieses native Format:

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

Oder im einfachen, eigenen Format:

```json
[
  { "title": "Team-Meeting", "start": "2026-08-03T10:00:00", "end": "2026-08-03T11:00:00" },
  { "title": "Urlaub", "start": "2026-08-05", "end": "2026-08-10", "allDay": true, "color": "#c0743c" }
]
```

Beachte das exklusive Ende beim Beispiel "Urlaub" oben: Damit der Termin vom 5. bis 9. August angezeigt wird, ist `end` auf den 10. August (den Tag danach) gesetzt.

---

## Tipps

- **Sprache:** Monats-/Wochentagsnamen richten sich automatisch nach der Browsersprache.
- **Größenanpassung:** Der Kalender bleibt beim Skalieren des Widgets im vis-Editor live synchron — kein Neuladen der Seite nötig.
- **Listen-Ansichten:** Praktisch für ein kompaktes "Nächste Termine"-Widget — wähle **Liste - Woche** oder **Liste - Monat** und deaktiviere Kopfzeile/Navigation für eine feste Agenda-Ansicht.
- **Stil-Wiederverwendung:** Nutze **From widget** in jeder Design-Gruppe, um mehrere Terminkalender optisch konsistent zu halten.

---

## Siehe auch

- [Kalender Widget](calendar-widget.md) — reiner Datepicker ohne Termine
- [Tabelle Widget](table-widget.md) — zur Anzeige von Datumswerten als Teil einer größeren Datentabelle
