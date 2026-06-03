> 🌐 [English](../../en/widgets/dropdown-widget.md) | **Deutsch**

# Dropdown Widget

Das Dropdown Widget zeigt eine auswählbare Optionsliste an und schreibt den gewählten Wert zurück in einen Datenpunkt. Die Optionen werden automatisch aus der ioBroker-Objektdefinition geladen — keine manuelle Listenpflege erforderlich. Das ist ideal für die Auswahl von Modi, Szenen, Lüftergeschwindigkeiten oder jeden Datenpunkt, der in seinem Objekt eine feste Liste erlaubter Werte definiert hat.

![Dropdown Widget](../../en/img/widget-dropdown.png)

---

## Widget hinzufügen

1. Ziehe **Dropdown** aus der Widget-Liste **inventwo design** auf deine Ansicht.
2. Klicke auf **Object ID** und wähle einen Datenpunkt aus, dessen ioBroker-Objekt eine `states`-Liste hat (im Objekt-Editor ist das das "States"-Feld unter dem "Common"-Tab).
3. Die Dropdown-Optionen werden automatisch geladen. Wenn du ein leeres Dropdown siehst, hat das ausgewählte Objekt möglicherweise keine States-Liste.
4. Gib optional einen **Title** ein, um das Dropdown zu beschriften.
5. Gestalte das Widget in der Gruppe **inventwo - Dropdown**.

> **Was ist eine States-Liste?** In ioBroker können Objekte eine vordefinierte Liste erlaubter Werte mit Beschriftungen haben, z. B. `0: "Aus"`, `1: "Niedrig"`, `2: "Mittel"`, `3: "Hoch"`. Das Dropdown Widget liest diese Liste und verwendet sie als Menü-Optionen.

---

## Einstellungen

### Common

| Einstellung | Beschreibung |
|-------------|--------------|
| **Object ID** | Der Datenpunkt zum Lesen und Schreiben. Optionen werden aus der States-Liste dieses Objekts geladen. |
| **Show value in label** | Bei Aktivierung zeigt jede Option den numerischen Schlüssel neben dem Text an, z. B. `1 - Niedrig`. Bei Deaktivierung wird nur der Textlabel angezeigt. Standard: aktiviert. |
| **Show text** | Bei Aktivierung wird der Textteil der States-Liste angezeigt. Kombiniere mit **Show value in label**, um genau zu steuern, was erscheint. Standard: aktiviert. |
| **Read only** | Bei Aktivierung wird der aktuelle Wert als Klartext in einem gestalteten Feld angezeigt — kein Dropdown-Pfeil, keine Interaktion. |
| **Title** | Optionale Beschriftung, die über dem Dropdown angezeigt wird, z. B. `Lüftergeschwindigkeit` oder `Modus`. |

**Anzeigeoptionen-Kombinationen:**

| Show value | Show text | Beispiel-Label |
|-----------|-----------|----------------|
| ✓ | ✓ | `1 - Niedrig` (Standard) |
| ✗ | ✓ | `Niedrig` |
| ✓ | ✗ | `1` |

---

### Background conditions (Hintergrundbedingungen)

Diese Gruppe ermöglicht es, die Hintergrundfarbe des Dropdowns je nach aktuellem Wert zu ändern. Nützlich, um kritische Zustände hervorzuheben (z. B. rot bei "Fehler", grün bei "OK").

| Einstellung | Beschreibung |
|-------------|--------------|
| **Background OID** | Standardmäßig wird die Bedingung gegen die Haupt-**Object ID** ausgewertet. Setze hier eine andere OID, wenn der Hintergrund einem anderen Datenpunkt folgen soll. |
| **Number of conditions** | Anzahl der Farbregeln, die hinzugefügt werden sollen. Jede Bedingung wird der Reihe nach ausgewertet, und die erste Übereinstimmung gewinnt. |

Jede Bedingung hat:

| Einstellung | Beschreibung |
|-------------|--------------|
| **Comparison operator** | Wie der Wert verglichen wird: Equal, Not equal, Greater, Lower, Greater equal, Lower equal. |
| **Value** | Der Wert, gegen den verglichen wird. |
| **Background** | Die Hintergrundfarbe, die verwendet wird, wenn diese Bedingung zutrifft. |

---

### inventwo — Dropdown

| Einstellung | Beschreibung |
|-------------|--------------|
| **From widget** | Alle visuellen Einstellungen von einem anderen Dropdown Widget kopieren. |
| **Font size** | Textgröße der Dropdown-Optionen und des ausgewählten Werts in Pixeln. |
| **Text color** | Farbe des Texts im Dropdown. |
| **Background** | Standard-Hintergrundfarbe des Dropdowns. |
| **Highlight color** | Hintergrundfarbe beim Hovern über eine Option oder für die aktuell ausgewählte Option. |
| **Border color** | Farbe des Dropdown-Rahmens. Wechselt beim Hovern/Fokussieren zur Highlight-Farbe. |
| **Border width** | Dicke des Dropdown-Rahmens in Pixeln. |
| **Border radius** | Wie rund die Ecken des Dropdown-Felds sind, in Pixeln. |
| **Title font size** | Schriftgröße für das Titel-Label über dem Dropdown. |
| **Title color** | Farbe des Titel-Labels. |
| **Apply conditional background to title** | Bei Aktivierung ändert sich auch die Hintergrundfarbe des Titelbereichs entsprechend der aktiven Hintergrundbedingungsfarbe. |
| **Title padding top/bottom/left/right** | Abstand um das Titel-Label herum. |
| **Dropdown shadow** | Schlagschatten für das Dropdown-Feld. X-Offset, Y-Offset, Unschärfe, Streuung und Farbe einstellen. |

---

## Tipps

- **Das Dropdown ist leer:** Stelle sicher, dass das ausgewählte Objekt tatsächlich eine States-Liste hat. Öffne den ioBroker Admin, gehe zu Objekte, finde dein Objekt und überprüfe, ob das "States"-Feld unter dem "Common"-Tab ausgefüllt ist.
- **Reine Anzeige:** Aktiviere **Read only**, um das Dropdown ausschließlich als Anzeigewidget zu verwenden — es zeigt den aktuellen Wert im gestalteten Feld an, ohne Dropdown-Verhalten.
- **Farbliches Feedback:** Verwende **Background conditions**, damit das Widget den aktuellen Zustand sofort über Farbe kommuniziert, z. B. grün für "Läuft", gelb für "Standby", rot für "Fehler".

---

## Siehe auch

- [Universal Widget](universal-widget.md) — für individuelle Schaltflächen-/Kachelgestaltung mit Styling pro Zustand
- [Table Widget](table-widget.md) — zum Anzeigen von Tabellendaten
