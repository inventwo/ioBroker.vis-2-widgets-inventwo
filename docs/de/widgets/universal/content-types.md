> 🌐 [English](../../../en/widgets/universal/content-types.md) | **Deutsch**

# Universal Widget — Inhaltstypen

Die **Content type**-Einstellung (in der Gruppe **Common**) legt fest, was innerhalb der Universal-Widget-Kachel angezeigt wird. Der Inhalt und sein Aussehen können für jeden Zustand separat konfiguriert werden.

![Übersicht der Inhaltstypen](../../../en/img/preview_content_types.png)

---

## Icon

**Einsatz:** Symbolische visuelle Darstellung eines Zustands — eine Glühbirne für Ein/Aus, ein Schloss für Gesichert/Entsperrt, ein Thermometer für Heizung usw.

**Funktionsweise:** Du wählst eine Icon-Datei aus der ioBroker-Icon-Bibliothek aus (oder lädst eine eigene hoch). Das Icon wird in der Kachel gerendert und kann in jede Farbe eingefärbt werden.

![Icon-Inhaltstyp](../../../en/img/preview_content_icon.png)

**Einstellungen pro Zustand (in den Gruppen Default state / State):**
- **Icon** — Das Icon, das in diesem Zustand angezeigt wird, auswählen.
- **Content color** — Die Einfärbe-Farbe, die in diesem Zustand auf das Icon angewendet wird.
- **Content color true** — *(Separated buttons / True-Wert-Zustand)* Einfärbe-Farbe für den aktiven Zustand.

**Inhalts-Styling (in der Gruppe "inventwo - Content"):**
- **Content size** — Größe des Icons in Pixeln oder als Prozentsatz der Kachel.
- **Rotation** — Das Icon um einen beliebigen Winkel drehen.
- **Mirror** — Das Icon horizontal spiegeln.

---

## Image

**Einsatz:** Fotos, Hintergrundgrafiken, benutzerdefinierte Illustrationen oder jede Bilddatei als visuellen Inhalt der Kachel.

**Funktionsweise:** Du gibst eine URL oder einen Dateipfad zu einem Bild ein, das innerhalb der Kachel angezeigt wird.

![Image-Inhaltstyp](../../../en/img/preview_content_image.png)

**Einstellungen pro Zustand:**
- **Image** — URL oder Pfad zur Bilddatei für diesen Zustand.
- **Image true** — Bild, das im aktiven/True-Zustand verwendet wird (für Switch-Kacheln).

**Bild-Styling (in der Gruppe "inventwo - Content"):**
- **Fill type** — Wie das Bild den Kachelbereich füllt:
  - **Contain** — Das Bild passt vollständig in die Kachel (kann leere Bereiche hinterlassen).
  - **Cover** — Das Bild füllt die Kachel vollständig aus (kann Ränder beschneiden).
  - **Fill** — Das Bild wird gestreckt, um die Kachel genau auszufüllen.
  - **Repeat** — Das Bild wird gekachelt (wiederholt), um den Bereich zu füllen.
- **Position** — Wo das Bild innerhalb der Kachel positioniert wird (wird mit Contain verwendet).

---

## Text html

**Einsatz:** Formatierten Text, Werte oder einfachen HTML-Inhalt innerhalb einer Kachel anzeigen.

**Funktionsweise:** Du gibst Text oder HTML-Markup in das **Text**-Feld ein. Der Inhalt wird als HTML innerhalb der Kachel gerendert.

![HTML-Inhaltstyp](../../../en/img/preview_content_html.png)

**Einstellungen pro Zustand:**
- **Text** — Der Text- oder HTML-Inhalt für diesen Zustand. Du kannst `<b>`, `<i>`, `<span style="...">` und ähnliche Tags verwenden.
- **Text true** — Textinhalt für den aktiven/True-Zustand.

**Textstyling** wird durch die Gruppe **inventwo - Text** gesteuert (Schriftgröße, -stärke, Ausrichtung, Dekoration, Abstände).

> **Sicherheitshinweis:** Verwende nur vertrauenswürdige Inhalte im Text-html-Feld. Übergib keine unvalidierten Benutzereingaben direkt in dieses Feld.

---

## View in widget

**Einsatz:** Eine andere VIS-Ansicht als Inhalt einer Kachel einbetten — z. B. eine Mini-Übersicht oder ein Unterpanel.

**Funktionsweise:** Wähle einen VIS-Ansichtsnamen aus, und er wird innerhalb der Kachel gerendert.

**Einstellungen pro Zustand:**
- **View in widget** — Die VIS-Ansicht, die in diesem Zustand eingebettet wird.
- **View in widget true** — Eingebettete Ansicht im aktiven/True-Zustand.

**Inhalts-Styling:**
- **Scale to fit** — Skaliert die eingebettete Ansicht herunter, um in die Kachel zu passen. Aktiviere dies, wenn die eingebettete Ansicht größer als die Kachelgröße ist.

---

## Color picker

**Einsatz:** Interaktive Farbsteuerung — RGB-Lichter, LED-Streifen oder jedes Gerät, das Farbeingaben akzeptiert.

**Funktionsweise:** Ein interaktiver Farbwähler wird innerhalb der Kachel gerendert. Die ausgewählte Farbe wird in einen oder mehrere Datenpunkte geschrieben.

![Farbwähler-Inhaltstyp](../../../en/img/preview_content_colorpicker.png)

**Einstellungen (in der Gruppe "Widget content - Color picker"):**

| Einstellung | Beschreibung |
|-------------|--------------|
| **Object ID (color picker)** | Haupt-Datenpunkt, in den die Farbe geschrieben wird (im Format deines Farbmodells). |
| **Oid value 1 / 2 / 3** | Zusätzliche Datenpunkte für einzelne Farbkomponenten (z. B. R, G, B separat). |
| **Color model** | Das Format des geschriebenen Werts: **HSV**, **HSL**, **RGB**, **CIE**, **Hex**, **Hex 8** (Hex mit Alpha). |
| **Show wheel** | Zeigt das kreisförmige Farbrad an. |
| **Show box** | Zeigt die Farb-/Sättigungsbox an. |
| **Show hue** | Zeigt den Farbton-Schieberegler an. |
| **Show Saturation** | Zeigt den Sättigungs-Schieberegler an. |
| **Show value** | Zeigt den Helligkeit-(Wert-)Schieberegler an. |
| **Show red / green / blue** | Zeigt die einzelnen R-, G-, B-Schieberegler an. |
| **Show Alpha** | Zeigt den Deckkraft-/Alpha-Schieberegler an. |
| **Show kelvin** | Zeigt den Farbtemperatur-(Kelvin-)Schieberegler an. |
| **Width** | Breite des Farbwählers in Pixeln. |
| **Handle size** | Größe der Farbwähler-Griffe. |
| **Handle margin** | Abstand um die Griffe herum. |
| **Components space** | Vertikaler Abstand zwischen den Farbwähler-Komponenten. |
| **Border width / Border color** | Fügt einen Rahmen um die Farbwähler-Komponenten hinzu. |
| **Direction** | Layout-Richtung: **Horizontal** oder **Vertical**. |

**Tipp für RGB-Lichter:** Setze **Color model** auf **Hex** und verbinde **Object ID (color picker)** mit dem Farb-Datenpunkt deines Lichtadapters. Aktiviere nur die Steuerelemente, die dein Licht unterstützt — z. B. nur das Rad für den Farbton und den Value-Schieberegler für die Helligkeit.

---

## Analog clock

**Einsatz:** Dashboard-Uhr-Kacheln, die die aktuelle Ortszeit anzeigen.

**Funktionsweise:** Eine live aktualisierte Analoguhr wird innerhalb der Kachel gerendert und aktualisiert sich jede Sekunde. Es wird keine Datenpunkt-Verbindung benötigt.

![Analoguhr-Inhaltstyp](../../../en/img/preview_content_clock.png)

**Einstellungen (in der Gruppe "Widget content - Analog clock"):**

**Zifferblatt:**

| Einstellung | Beschreibung |
|-------------|--------------|
| **Design** | Zifferblatt-Stil: **Classic** (Zahlen + lange Striche), **Modern** (minimalistische Striche), **Minimal** (sehr klar, keine Zahlen), **Dashes** (nur Strichmarkierungen), **Custom** (Striche und Zahlen manuell konfigurieren). |
| **Face color** | Farbe der Zifferblatt-Elemente (Striche, Zahlen). |
| **Background color** | Füllfarbe hinter dem Zifferblatt. |

**Benutzerdefinierte Zifferblatt-Einstellungen** (nur wenn **Design** auf **Custom** gesetzt ist):

| Einstellung | Beschreibung |
|-------------|--------------|
| **Tick interval** | Welche Markierungen angezeigt werden: **Hours only** (nur Stunden), **Both** (Stunden und Minuten). |
| **Tick thickness** | Dicke der Minutenmarkierungen. |
| **Main tick thickness** | Dicke der Stundenmarkierungen. |
| **Tick length** | Länge der Minutenmarkierungen. |
| **Main tick length** | Länge der Stundenmarkierungen. |
| **Show numbers** | Welche Zahlen angezeigt werden: **All numbers** (alle 12), **Main hours only** (12, 3, 6, 9), **None**. |
| **Number size** | Schriftgröße der Stundenzahlen. |
| **Number offset** | Abstand der Zahlen von den Strichmarkierungen. |

**Uhrenring:**

| Einstellung | Beschreibung |
|-------------|--------------|
| **Show ring** | Zeichnet einen Kreis um das gesamte Zifferblatt. |
| **Ring thickness** | Dicke des Rings. |

**Zeiger** (Stunden, Minuten, Sekunden — jeweils unabhängig):

| Einstellung | Beschreibung |
|-------------|--------------|
| **Show** | Ob dieser Zeiger sichtbar ist. |
| **Design** | Zeiger-Stil: **Classic** (Standard-Verjüngungszeiger), **Modern** (dünner rechteckiger Zeiger), **Arrow** (Pfeilspitzenform). |
| **Color** | Farbe dieses Zeigers. |

---

## Zurück zu

- [Universal Widget Übersicht](../universal-widget.md)
- [Interaktionstypen](interaction-types.md)
- [Styling und Formen](styling-and-shapes.md)
