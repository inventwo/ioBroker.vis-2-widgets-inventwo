> 🌐 [English](../../en/widgets/dropdown-widget.md) | **Deutsch**

# Dropdown Widget

Das Dropdown Widget zeigt eine auswählbare Optionsliste an und schreibt den gewählten Wert zurück in einen Datenpunkt. Die Optionen werden automatisch aus der ioBroker-Objektdefinition geladen — keine manuelle Listenpflege erforderlich. Das ist ideal für die Auswahl von Modi, Szenen, Lüftergeschwindigkeiten oder jeden Datenpunkt, der in seinem Objekt eine feste Liste erlaubter Werte definiert hat.

![Dropdown Widget](../../en/img/widget-dropdown.png)

---

## Widget hinzufügen

1. Ziehe **Dropdown** aus der Widget-Liste **inventwo design** auf deine Ansicht.
2. Klicke auf **Objekt-ID** und wähle einen Datenpunkt aus, dessen ioBroker-Objekt eine `states`-Liste hat (im Objekt-Editor ist das das "States"-Feld unter dem "Common"-Tab).
3. Die Dropdown-Optionen werden automatisch geladen. Wenn du ein leeres Dropdown siehst, hat das ausgewählte Objekt möglicherweise keine States-Liste.
4. Gib optional einen **Titel** ein, um das Dropdown zu beschriften.
5. Gestalte das Widget in der Gruppe **inventwo - Dropdown**.

> **Was ist eine States-Liste?** In ioBroker können Objekte eine vordefinierte Liste erlaubter Werte mit Beschriftungen haben, z. B. `0: "Aus"`, `1: "Niedrig"`, `2: "Mittel"`, `3: "Hoch"`. Das Dropdown Widget liest diese Liste und verwendet sie als Menü-Optionen.

---

## Einstellungen

### Common

| Einstellung | Beschreibung |
|-------------|--------------|
| **Objekt-ID** | Der Datenpunkt zum Lesen und Schreiben. Optionen werden aus der States-Liste dieses Objekts geladen. |
| **Wert im Label anzeigen** | Bei Aktivierung zeigt jede Option den numerischen Schlüssel neben dem Text an, z. B. `1 - Niedrig`. Bei Deaktivierung wird nur der Textlabel angezeigt. Standard: aktiviert. |
| **Text anzeigen** | Bei Aktivierung wird der Textteil der States-Liste angezeigt. Kombiniere mit **Wert im Label anzeigen**, um genau zu steuern, was erscheint. Standard: aktiviert. |
| **Schreibgeschützt** | Bei Aktivierung wird der aktuelle Wert als Klartext in einem gestalteten Feld angezeigt — kein Dropdown-Pfeil, keine Interaktion. |
| **Titel** | Optionale Beschriftung, die über dem Dropdown angezeigt wird, z. B. `Lüftergeschwindigkeit` oder `Modus`. |

**Anzeigeoptionen-Kombinationen:**

| Wert anzeigen | Text anzeigen | Beispiel-Label |
|---------------|---------------|----------------|
| ✓ | ✓ | `1 - Niedrig` (Standard) |
| ✗ | ✓ | `Niedrig` |
| ✓ | ✗ | `1` |

---

### Hintergrundfarb-Bedingungen

Diese Gruppe ermöglicht es, die Hintergrundfarbe des Dropdowns je nach aktuellem Wert zu ändern. Nützlich, um kritische Zustände hervorzuheben (z. B. rot bei "Fehler", grün bei "OK").

| Einstellung | Beschreibung |
|-------------|--------------|
| **Hintergrund-Datenpunkt** | Standardmäßig wird die Bedingung gegen die Haupt-**Objekt-ID** ausgewertet. Setze hier eine andere OID, wenn der Hintergrund einem anderen Datenpunkt folgen soll. |
| **Anzahl der Bedingungen** | Anzahl der Farbregeln, die hinzugefügt werden sollen. Jede Bedingung wird der Reihe nach ausgewertet, und die erste Übereinstimmung gewinnt. |

Jede Bedingung hat:

| Einstellung | Beschreibung |
|-------------|--------------|
| **Vergleichsoperator** | Wie der Wert verglichen wird: Equal, Not equal, Greater, Lower, Greater equal, Lower equal. |
| **Wert** | Der Wert, gegen den verglichen wird. |
| **Hintergrund** | Die Hintergrundfarbe, die verwendet wird, wenn diese Bedingung zutrifft. |

---

### inventwo - Dropdown

| Einstellung | Beschreibung |
|-------------|--------------|
| **Vom Widget** | Alle visuellen Einstellungen von einem anderen Dropdown Widget kopieren. |
| **Schriftgröße** | Textgröße der Dropdown-Optionen und des ausgewählten Werts in Pixeln. |
| **Textfarbe** | Farbe des Texts im Dropdown. |
| **Hintergrund** | Standard-Hintergrundfarbe des Dropdowns. |
| **Hervorhebungsfarbe** | Hintergrundfarbe beim Hovern über eine Option oder für die aktuell ausgewählte Option. |
| **Randfarbe** | Farbe des Dropdown-Rahmens. Wechselt beim Hovern/Fokussieren zur Highlight-Farbe. |
| **Rahmenbreite** | Dicke des Dropdown-Rahmens in Pixeln. |
| **Rahmenradius** | Wie rund die Ecken des Dropdown-Felds sind, in Pixeln. |
| **Titel Schriftgröße** | Schriftgröße für das Titel-Label über dem Dropdown. |
| **Titelfarbe** | Farbe des Titel-Labels. |
| **Hintergrundfarbe aus Bedingung auf Titel anwenden** | Bei Aktivierung ändert sich auch die Hintergrundfarbe des Titelbereichs entsprechend der aktiven Hintergrundbedingungsfarbe. |
| **Titel Abstand oben/unten/links/rechts** | Abstand um das Titel-Label herum. |
| **Dropdown-Schatten** | Schlagschatten für das Dropdown-Auswahlfeld und das geöffnete Menü. X-Offset, Y-Offset, Unschärfe, Streuung und Farbe einstellen. |
| **Widget-Schatten** | Schlagschatten für den gesamten Widget-Container (inkl. Titelbereich). X-Offset, Y-Offset, Unschärfe, Streuung und Farbe einstellen. Alle Werte sind standardmäßig 0 (kein Schatten). |

---

## Tipps

- **Das Dropdown ist leer:** Stelle sicher, dass das ausgewählte Objekt tatsächlich eine States-Liste hat. Öffne den ioBroker Admin, gehe zu Objekte, finde dein Objekt und überprüfe, ob das "States"-Feld unter dem "Common"-Tab ausgefüllt ist.
- **Reine Anzeige:** Aktiviere **Schreibgeschützt**, um das Dropdown ausschließlich als Anzeigewidget zu verwenden — es zeigt den aktuellen Wert im gestalteten Feld an, ohne Dropdown-Verhalten.
- **Farbliches Feedback:** Verwende **Hintergrundfarb-Bedingungen**, damit das Widget den aktuellen Zustand sofort über Farbe kommuniziert, z. B. grün für "Läuft", gelb für "Standby", rot für "Fehler".

---

## Siehe auch

- [Universal Widget](universal-widget.md) — für individuelle Schaltflächen-/Kachelgestaltung mit Styling pro Zustand
- [Table Widget](table-widget.md) — zum Anzeigen von Tabellendaten
