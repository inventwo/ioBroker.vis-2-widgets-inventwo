> 🌐 [English](../../../en/widgets/universal/interaction-types.md) | **Deutsch**

# Universal Widget — Interaktionstypen

Die **Type**-Einstellung in der Gruppe **Common** legt fest, was passiert, wenn ein Benutzer auf die Universal-Widget-Kachel klickt. Wähle den Typ, der zu deinem Anwendungsfall passt.

---

## Switch

**Einsatz:** Einen Datenpunkt zwischen zwei Werten umschalten — Ein/Aus, Offen/Geschlossen, Auto/Manuell oder jedes andere Wertepaar.

**Funktionsweise:** Jeder Klick wechselt zwischen **Value true** und **Value false**. Wenn der aktuelle Datenpunktwert **Value true** entspricht, schreibt ein Klick **Value false**, und umgekehrt.

**Einstellungen:**
- **Object ID** — Der Datenpunkt, in den geschrieben wird.
- **Value true** — Wert, der für den "Ein"-Zustand geschrieben wird.
- **Value false** — Wert, der für den "Aus"-Zustand geschrieben wird.

**Tipp:** Im **Separated buttons**-Modus schreibt jede Schaltfläche den Wert ihres eigenen Zustands — das macht das Universal Widget zu einem Mehrfach-Optionsselektor.

---

## Button

**Einsatz:** Eine Aktion auslösen — eine Szene aktivieren, einen Befehl senden, einen bestimmten Wert setzen.

**Funktionsweise:** Jeder Klick schreibt **Value true** in den Datenpunkt.

**Einstellungen:**
- **Object ID** — Der Datenpunkt, in den geschrieben wird.
- **Value true** — Der beim Klick geschriebene Wert.
- **Hold value** — Bei Aktivierung wird der Wert geschrieben, wenn die Schaltfläche gedrückt wird, und der Datenpunkt wird auf seinen vorherigen Wert zurückgesetzt, wenn die Schaltfläche losgelassen wird. Das erzeugt ein "Halten zum Aktivieren"-Verhalten (z. B. für Aktionen, die so lange andauern, wie die Taste gedrückt wird).

---

## Nav

**Einsatz:** Zwischen VIS-Ansichten navigieren — Raumauswahl-Kacheln, Menükacheln.

**Funktionsweise:** Ein Klick auf die Kachel wechselt VIS zur konfigurierten **View**.

**Einstellungen:**
- **View** — Die VIS-Ansicht, die beim Klick geöffnet wird. (Sichtbar, wenn nicht im **Separated buttons**-Modus.)
- **Value true** — Optional. Wenn gesetzt, verwendet der Zustandsvergleich dieses Werts, um zu erkennen, wann die Zielansicht die aktuell aktive ist (für visuelle Hervorhebung).

**Tipp:** Konfiguriere einen zweiten Zustand, der zutrifft, wenn die Zielansicht aktiv ist (Vergleich nach Ansicht oder Wert), und gib ihm eine andere Hintergrund-/Rahmenfarbe. Damit wird die aktive Raumkachel in deiner Navigationsleiste hervorgehoben.

---

## Read only

**Einsatz:** Statusanzeigen, die einen Wert anzeigen, aber nicht auf Klicks reagieren dürfen.

**Funktionsweise:** Die Kachel liest den Datenpunktwert und wechselt zwischen den konfigurierten visuellen Zuständen — aber alle Klick-Interaktionen werden vollständig ignoriert.

**Einstellungen:**
- **Object ID** — Der Datenpunkt, der gelesen wird.

---

## View in dialog

**Einsatz:** Eine Detailansicht als Overlay-Popup öffnen, ohne die aktuelle Dashboard-Seite zu verlassen.

**Funktionsweise:** Ein Klick auf die Kachel öffnet ein Dialogfenster mit der konfigurierten VIS-Ansicht darin.

**Einstellungen (in der Common-Gruppe):**
- **View** — Die VIS-Ansicht, die im Dialog angezeigt werden soll.

**Dialog-Einstellungen (in der Gruppe "Type — View in dialog"):**

| Einstellung | Beschreibung |
|-------------|--------------|
| **Dialog fullscreen** | Dehnt den Dialog auf den gesamten Bildschirm aus. |
| **Close on click outside** | Ein Klick außerhalb des Dialogs schließt ihn. (Im Vollbildmodus nicht verfügbar.) |
| **Dialog width** | Breite des Dialogs in Pixeln. |
| **Dialog height** | Höhe des Dialogs in Pixeln. |
| **Padding** | Abstand zwischen dem Dialog-Rahmen und der eingebetteten Ansicht darin. |
| **Close after x seconds** | Schließt den Dialog automatisch nach dieser Anzahl von Sekunden. Bei 0 deaktiviert. |
| **Background** | Hintergrundfarbe hinter der eingebetteten Ansicht im Dialog. |
| **Position** | Wo der Dialog erscheint: Center, Top, Bottom, Left, Right, Top left, Top right, Bottom left, Bottom right oder benutzerdefinierte X/Y-Koordinaten. |

**Titelleisten-Einstellungen:**

| Einstellung | Beschreibung |
|-------------|--------------|
| **Hide** | Versteckt die Titelleiste vollständig. |
| **Dialog title** | Text, der in der Titelleiste angezeigt wird. |
| **Title color** | Farbe des Titeltexts. |
| **Title font size** | Schriftgröße des Titeltexts. |
| **Title padding top/bottom/left/right** | Abstand um den Titeltext herum. |

**Schließen-Schaltfläche-Einstellungen:**

| Einstellung | Beschreibung |
|-------------|--------------|
| **Close button background** | Hintergrundfarbe der × Schließen-Schaltfläche. |
| **Close button color** | Icon-Farbe der × Schließen-Schaltfläche. |
| **Close button size** | Größe der Schließen-Schaltfläche. |

**Dialog border radius:** Runde jede Ecke des Dialogfelds unabhängig (oben links, oben rechts, unten rechts, unten links).

---

## Increase/decrease value

**Einsatz:** Plus- und Minus-Schrittschaltflächen — einen Temperatursollwert, Helligkeitswert oder ähnlichen numerischen Wert schrittweise anpassen.

**Funktionsweise:** Ein Klick liest den aktuellen Datenpunktwert und addiert das konfigurierte Delta. Verwende ein positives Delta zum Erhöhen (+), ein negatives Delta zum Verringern (–).

**Einstellungen:**
- **Object ID** — Der numerische Datenpunkt, der erhöht/verringert werden soll.
- **Value true** — Das Delta, das bei jedem Klick zum aktuellen Wert addiert wird. Gib eine negative Zahl ein, um zu verringern.

**Beispiel:** Um ein +/–-Schaltflächen-Paar für einen Sollwert zu erstellen:
1. Füge zwei Universal-Widget-Kacheln nebeneinander ein.
2. Erste Kachel: Type = Increase/decrease value, Value true = `0.5`
3. Zweite Kachel: Type = Increase/decrease value, Value true = `-0.5`

---

## Send HTTP request / Open URL

**Einsatz:** HTTP-Aktionen auslösen — Geräte über ihre lokale Web-API steuern, einen Kamera-Stream öffnen oder zu einer externen Seite navigieren.

**Einstellungen:**
- **URL** — Die vollständige URL, die aufgerufen oder geöffnet werden soll.
- **Http type:**
  - **Send request** — Sendet eine HTTP-GET-Anfrage im Hintergrund. Die Seite navigiert nicht. Damit wird ein API-Endpunkt ausgelöst.
  - **Open URL** — Navigiert den aktuellen Browser-Tab zur URL.
  - **Open URL in new tab** — Öffnet die URL in einem neuen Browser-Tab.

---

## Single Button vs. Separated Buttons

Die **Mode**-Einstellung ändert, wie Zustände angezeigt werden:

### Single button (Standard)
Eine Kachel, eine Aktion. Das Aussehen der Kachel ändert sich je nachdem, welcher Zustand aktuell aktiv ist (basierend auf dem Datenpunktwert). Ein Klick führt immer dieselbe Aktion aus (definiert durch **Type**).

### Separated buttons
Jeder Zustand wird zu einer eigenen unabhängigen Schaltflächen-Kachel, nebeneinander (oder übereinander) angeordnet. Jede Schaltfläche zeigt den Inhalt und den Stil ihres eigenen Zustands. Ein Klick auf eine Schaltfläche schreibt den konfigurierten Wert dieses Zustands in den Datenpunkt.

Das entspricht einer Radio-Button-Liste — ideal für Modusselektoren wie `Aus / Niedrig / Mittel / Hoch`.

Zusätzliche Einstellungen für Separated buttons:
- **Direction** — Schaltflächen in einer **Row** (nebeneinander) oder **Column** (übereinander) anordnen.
- **Button size** — Breite (Row) oder Höhe (Column) jeder einzelnen Schaltflächen-Kachel in Pixeln.
- **Button spacing** — Abstand zwischen den Schaltflächen in Pixeln.

---

## Zurück zu

- [Universal Widget Übersicht](../universal-widget.md)
- [Inhaltstypen](content-types.md)
- [Styling und Formen](styling-and-shapes.md)
