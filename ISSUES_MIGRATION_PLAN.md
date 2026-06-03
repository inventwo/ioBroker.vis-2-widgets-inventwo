# Migration Plan: vis-1 Issues → vis-2 Adapter

Analyse der offenen Issues im alten vis-1 Adapter ([inventwo/ioBroker.vis-inventwo](https://github.com/inventwo/ioBroker.vis-inventwo/issues))
und deren Status im neuen vis-2 Adapter.

---

## Legende

| Symbol | Bedeutung |
|--------|-----------|
| ✅ | Bereits in vis-2 umgesetzt |
| 🔧 | Teilweise umgesetzt / noch Handlungsbedarf |
| ❌ | Fehlt noch – Umsetzung geplant |
| ⏭️ | Wird nicht übernommen (Begründung siehe unten) |

---

## ✅ Bereits erledigt



## 🔧 Teilweise umgesetzt – Handlungsbedarf

### #419 – Popup Window Menü
**Wunsch:** Button Klick setzt Datenpunktwert, beim halten öffnet ein Popup-Fenster mit weiterem Inhalt (View).  

---

### ~~#432 – MultiWidget deaktivieren können~~ ✅ Erledigt
**Wunsch:** MultiWidgets als Button sperren, damit kein Wert gesendet wird.  
**Umgesetzt:** Neue Checkbox „Klick deaktivieren wenn aktiv" pro Zustand im Universal Widget. Wenn der Zustand aktiv ist (Bedingung trifft zu / Wert stimmt überein) und die Option gesetzt ist, wird kein Wert gesendet und der Cursor zeigt `not-allowed`.

---

### ~~#505 – Slider: konfigurierbare Position von Wert und Schrittmarken~~ ✅ Erledigt
**Wunsch:** Position des angezeigten Werts und der Schrittmarken soll konfigurierbar sein.  
**Umgesetzt:**
- Neue Select-Option `Wertetikett anzeigen` (Beim Ziehen / Immer / Nie) → steuert `valueLabelDisplay`
- Neue Checkbox `Schrittmarken oben / links anzeigen` → positioniert Marken oberhalb der Schiene (horizontal) oder links (vertikal), sichtbar nur wenn Schrittmarken aktiv und nicht „innerhalb"

---

### ~~#644 – ColorPicker Datenpunktbeschriftung (`vis 2`-Label!)~~
**Wunsch:** Datenpunkte im ColorPicker sollen besser beschriftet sein als generisch „Object ID, First Value, Second Value".  
**Aktueller Stand:** Universal Widget hat ColorPicker-Typ integriert. Ob alle Datenpunkte mit sprechenden Labels versehen sind, muss geprüft werden.  
**To-do:** Attribute für H/S/V bzw. RGB-Datenpunkte im Widget prüfen und ggf. mit sprechenderen Labels versehen (Datenpunkt-Bezeichnung wie „Farbton", „Sättigung", „Helligkeit").

**Aufwand:** Klein.

---

## ❌ Fehlt noch – Umsetzung geplant

### #620 – Range-Slider (mehrere Werte / Datenpunkte)
**Wunsch:** Slider mit zwei Griffen für Start- und Endwert (z. B. Heizzeitraum 06:00–22:00).  
**Warum wichtig:** Häufige Use-Case für Zeitpläne und Temperatur-Bereiche.  
**Umsetzung:** MUI `Slider` unterstützt Range-Modus nativ (`value={[start, end]}`). Neuer Modus im vorhandenen Slider-Widget oder separates Widget.  
**Aufwand:** Mittel.

---

### #562 – Radiobutton-Liste: aktive Textfarbe + Element-IDs
**Wunsch:** Aktive Textfarbe konfigurierbar; CSS-freundliche Element-IDs statt Widget-Nummern.  
**Aktueller Stand:** Kein eigenständiges Radiobutton-Listen-Widget in vis-2. Auswahl ist nur über Dropdown möglich, nicht als sichtbare Radio-Buttons.  
**Umsetzung:** Neues Widget `InventwoWidgetRadioList` mit konfigurierbarer aktiver Farbe und passivem Styling. Alternativ: Erweiterung des Dropdown-Widgets um einen „Radio"-Darstellungsmodus.  
**Aufwand:** Mittel.

---

### #627 – Bild spiegeln basierend auf Bedingung (true/false)
**Wunsch:** Bild-Widget soll ähnlich wie Farbe und Farb-Invertierung auch das Spiegeln (horizontal/vertikal) an eine Bedingung knüpfen können.  
**Aktueller Stand:** Kein dediziertes Image-Widget in vis-2.  
**Umsetzung:** Image-Unterstützung ist bereits im Universal Widget via Icon-Feld vorhanden. Prüfen ob `scaleX(-1)` / `scaleY(-1)` CSS-Transform bedingt angewendet werden kann.  
**Aufwand:** Klein bis mittel (je nachdem ob eigenes Widget oder Erweiterung des Universal).

---

### #621 – Graufilter / CSS-Filter für Bilder bedingt anwenden
**Wunsch:** Grayscale-Filter (und weitere CSS-Filter) per Bedingung (true/false) auf ein Bild anwenden.  
**Aktueller Stand:** Kein Image-Widget mit CSS-Filter-Option in vis-2.  
**Umsetzung:** Erweiterung des Universal Widgets um ein `imageFilter`-Feld (ähnlich wie `hex-to-css-filter` bereits im Projekt vorhanden) mit true/false-Bedingung.  
**Aufwand:** Klein (Library ist schon eingebunden).

---

### #650 – Timeline/History Widget (wie Home Assistant)
**Wunsch:** Verlaufsanzeige, wann ein Gerät ein- und ausgeschaltet wurde, ähnlich der Lovelace History-Card.  
**Aktueller Stand:** Kein vergleichbares Widget vorhanden.  
**Umsetzung:** Komplett neues Widget. Benötigt ioBroker History-Adapter (influxdb, sql, history) als Datenquelle und eine Zeitleisten-Darstellung.  
**Aufwand:** Hoch. Niedrige Priorität wegen Komplexität und Abhängigkeit von externen Adaptern.

---

## ⏭️ Wird nicht übernommen

### #588 – Blur-Effekt bei Image-Widget
**Begründung:** Bezieht sich auf ein eigenständiges Image-Widget aus vis-1, das es in vis-2 nicht geben wird. Blur-Effekte lassen sich im vis-2-Editor direkt über CSS-Eigenschaften (`filter: blur(...)`) auf jedes Widget anwenden. Kein Mehrwert durch Widget-spezifische Implementierung.

---

### #438 – Checkbox/Radiobutton alphabetisch sortierbar
**Begründung:** Betrifft ein vis-1-spezifisches Widget-Konzept. Im vis-2 Adapter gibt es kein Multi-Checkbox-Widget; der Dropdown sortiert Werte direkt aus dem Datenpunkt. Alphabetische Sortierung sollte auf Datenpunkt-Ebene erfolgen, nicht im Widget.

---

### #444 – Einfache Berechnungen in JSON-Attributen
**Begründung:** Mathematische Ausdrücke in Widget-Feldern sind ein sehr spezieller Wunsch mit hohem Implementierungsaufwand (Expression-Parser) und Sicherheitsrisiko (eval). Besser gelöst durch ioBroker-eigene Lösungen wie JavaScript-Adapter oder Skript-Datenpunkte.

---

## Zusammenfassung

| Kategorie | Anzahl |
|-----------|--------|
| ✅ Bereits erledigt | 7 |
| 🔧 Teilweise / Nachbessern | 2 |
| ❌ Zu implementieren | 5 |
| ⏭️ Nicht übernehmen | 3 |

---

## Priorisierung der offenen Punkte

| Priorität | Issue | Aufwand |
|-----------|-------|---------|
| 1 | **#505** Slider: permanente Wertanzeige + Markenposition | Klein |
| 2 | **#644** ColorPicker: Labels für Datenpunkte prüfen | Klein |
| 3 | **#621** Bild-Graufilter bedingt (Universal Widget) | Klein |
| 4 | **#627** Bild spiegeln bedingt (Universal Widget) | Klein–Mittel |
| 5 | **#620** Range-Slider (zwei Griffe) | Mittel |
| 6 | **#562** Radiobutton-Liste Widget | Mittel |
| 7 | **#650** Timeline/History Widget | Hoch |
