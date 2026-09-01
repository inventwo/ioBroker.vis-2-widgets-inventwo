> 🌐 [English](../en/index.md) | **Deutsch**

# inventwo Widgets für ioBroker VIS 2 — Benutzerhandbuch

Willkommen zur inventwo-Widget-Dokumentation. Dieser Leitfaden erklärt, wie du jedes Widget im VIS-2-Editor verwendest, um dein eigenes Smart-Home-Dashboard zu bauen.

## Was sind inventwo Widgets?

Das inventwo-Widget-Set fügt VIS 2 hochgradig anpassbare Kacheln, Steuerelemente und Anzeigeelemente hinzu. Das gesamte Styling wird direkt in der Seitenleiste des VIS-2-Editors vorgenommen — keine CSS-Kenntnisse erforderlich.

---

## Widget-Übersicht

### Universal Widget
**Das leistungsstärkste Widget im Set.** Eine Kachel, die als Schaltfläche, Schalter, Navigationslink, Dialog-Öffner oder reine Status-Anzeige fungieren kann — und ihr Aussehen je nach Datenpunktwert ändert.

→ [Universal Widget](widgets/universal-widget.md)

![Universal Widget](../en/img/widget-universal.png)

---

### Slider
**Ein horizontaler oder vertikaler Schieberegler für numerische Werte.** Ziehe den Regler, um einen Wert einzustellen, z. B. Helligkeit, Temperatur oder Lautstärke. Vollständig anpassbar — Schienen­farbe, aktive Farbe, Regler­form und Stufenmarkierungen.

→ [Slider Widget](widgets/slider-widget.md)

![Slider Widget](../en/img/widget-slider.png)

---

### Radial Slider
**Ein kreisförmiger Bogenschieberegler für numerische Werte.** Funktioniert genauso wie der normale Schieberegler, wird aber als rundes Drehregler-Element angezeigt — ideal für Thermostat-Kacheln.

→ [Radial Slider Widget](widgets/radial-slider-widget.md)

![Radial Slider Widget](../en/img/widget-radial-slider.png)

---

### Switch
**Ein Umschalter für Ein/Aus oder beliebige Zwei-Zustand-Datenpunkte.** Sieht aus wie ein klassischer Ein/Aus-Schalter. Track und Thumb sind unabhängig voneinander gestaltbar.

→ [Switch Widget](widgets/switch-widget.md)

![Switch Widget](../en/img/widget-switch.png)

---

### Checkbox
**Eine Checkbox für Ein/Aus oder beliebige Zwei-Zustand-Datenpunkte.** Einfacher als der Switch — nur eine Checkbox mit Label.

→ [Checkbox Widget](widgets/checkbox-widget.md)

![Checkbox Widget](../en/img/widget-checkbox.png)

---

### Table
**Zeigt einen JSON-Array-Datenpunkt als formatierte Tabelle an.** Spalten sortieren, Zeilen filtern, Zeilen farblich hervorheben und Zellen als Text, Zahlen, Datum/Uhrzeit oder Bilder formatieren.

→ [Table Widget](widgets/table-widget.md)

![Table Widget](../en/img/widget-table.png)

---

### Dropdown
**Ein Auswahlmenü, das seine Optionen aus der States-Liste eines ioBroker-Objekts lädt.** Wähle einen Wert aus und er wird zurück in den Datenpunkt geschrieben.

→ [Dropdown Widget](widgets/dropdown-widget.md)

![Dropdown Widget](../en/img/widget-dropdown.png)

---

### Marquee
**Laufschrift aus einem Datenpunkt oder manuell eingegebenem Text.** Nützlich für Nachrichten-Ticker, Status­meldungen oder lange Texte, die nicht in einen festen Bereich passen.

→ [Marquee Widget](widgets/marquee-widget.md)

---

### Value List
**Teilt einen Textwert in eine formatierte Aufzählungsliste auf.** Ideal zum Anzeigen von komma- oder zeilenumbruch-getrennten Werten als lesbare Liste.

→ [Value List Widget](widgets/value-list-widget.md)

---

### Calendar
**Eine vollständige Monatskalenderansicht.** Funktioniert als Datepicker (Datum lesen und schreiben), als schreibgeschützte Datumsanzeige oder als "Heute"-Hervorhebung — frei kombinierbar, mit voller Farb- und Layout-Anpassung.

→ [Calendar Widget](widgets/calendar-widget.md)

---

## Wo anfangen?

- **Bedienfeld mit Schaltflächen aufbauen?** → [Universal Widget](widgets/universal-widget.md)
- **Dimmer oder Temperatur steuern?** → [Slider Widget](widgets/slider-widget.md) oder [Radial Slider Widget](widgets/radial-slider-widget.md)
- **Einfache Ein/Aus-Steuerung?** → [Switch Widget](widgets/switch-widget.md) oder [Checkbox Widget](widgets/checkbox-widget.md)
- **Tabellendaten anzeigen?** → [Table Widget](widgets/table-widget.md)
- **Ein Datum auswählen oder anzeigen?** → [Calendar Widget](widgets/calendar-widget.md)
- **Modus oder Szene auswählen?** → [Dropdown Widget](widgets/dropdown-widget.md)
