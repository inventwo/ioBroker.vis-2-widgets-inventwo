> 🌐 [English](../../../en/widgets/universal/styling-and-shapes.md) | **Deutsch**

# Universal Widget — Styling und Formen

Das Universal Widget bietet umfangreiche Styling-Optionen, die alle direkt in der VIS-2-Editor-Seitenleiste konfiguriert werden. Styles sind in benannte Gruppen organisiert. Die meisten Gruppen haben ein **From widget**-Feld, mit dem du Einstellungen von einem anderen Universal Widget kopieren kannst.

---

## Zusammenspiel von Zuständen und Styling

Die Gruppe **Default state** und jede nummerierte **State**-Gruppe legen fest, wie die Kachel aussieht, wenn ein bestimmter Datenpunktwert aktiv ist. In jedem Zustand setzt du:

- **Background**-Farbe
- **Content color** (Icon-Einfärbung, Bildfilter)
- **Text color**
- **Border color**
- **Outer / inner shadow**-Farben
- **Content blink interval** (Blinkgeschwindigkeit in ms — 0 = kein Blinken)
- **Disable click when active** — Wenn für einen Zustand aktiviert, wird ein Klick auf die Kachel ignoriert, solange dieser Zustand aktuell aktiv ist. Nützlich für Navigationskacheln (verhindert erneutes Klicken auf die bereits aktive Ansicht) oder Mehrfach-Optionsselektoren (verhindert das erneute Schreiben desselben Werts). Nicht verfügbar für den Typ **Read only**.
- Das Icon, Bild, den Text oder die eingebettete Ansicht, die angezeigt werden soll

Die Gruppe **inventwo Widget Design** (erscheint beim Klicken auf die Zustandsgruppen) ist der Ort, wo diese Farben pro Zustand konfiguriert werden.

---

## Style-Gruppen

### inventwo — Text

Steuert das Aussehen des Textlabels innerhalb der Kachel.

| Einstellung | Beschreibung |
|-------------|--------------|
| **Text decoration** | Unterstrichen, überstrichen oder durchgestrichen. |
| **Text align** | Horizontale Ausrichtung des Texts: Start, Center, End. |
| **Margin top / bottom / left / right** | Abstand um den Text innerhalb der Kachel. |

Schriftfamilie, -größe, -stärke und -farbe werden in den Standard-VIS-Widget-CSS-Einstellungen und in den **Text color**-Feldern pro Zustand gesetzt.

---

### inventwo — Content

Steuert Größe und Positionierung des Inhalts (Icon, Bild usw.) innerhalb der Kachel.

| Einstellung | Beschreibung |
|-------------|--------------|
| **Content size** | Größe des Icons oder Bilds. Kann ein Pixelwert oder ein Prozentsatz der Kachelgröße sein. |
| **Rotation** | Dreht den Inhalt um einen beliebigen Winkel (Grad). |
| **Mirror** | Spiegelt den Inhalt horizontal. |
| **Scale to fit** | *(Nur View in widget)* Skaliert die eingebettete Ansicht herunter, um in die Kachel zu passen. |
| **Fill type** | *(Nur Image-Inhalt)* Wie das Bild die Kachel füllt: Contain, Cover, Fill, Repeat. |
| **Position** | *(Nur Image-Inhalt)* Bildposition innerhalb der Kachel. |

---

### inventwo — Alignment

Steuert, wie Inhalt und Text relativ zueinander innerhalb der Kachel angeordnet werden.

| Einstellung | Beschreibung |
|-------------|--------------|
| **Content align** | Horizontale Ausrichtung des Inhalts-Elements: Start, Center, End, Space between. |
| **Text align (alignment group)** | Vertikale oder horizontale Ausrichtungsposition des Texts. |
| **Invert order** | Tauscht die Reihenfolge von Inhalt und Text (z. B. Text über Icon statt darunter). |

---

### inventwo — Transparency

| Einstellung | Beschreibung |
|-------------|--------------|
| **Background opacity** | Deckkraft des Kachel-Hintergrunds (0 = vollständig transparent, 1 = vollständig undurchsichtig). |
| **Content opacity** | Deckkraft des Inhalts-Elements (Icon, Bild usw.). |

---

### inventwo — Spacing

Setzt den inneren Abstand der Kachel — den Bereich zwischen dem Kachelrand und ihrem Inhalt.

| Einstellung | Beschreibung |
|-------------|--------------|
| **Padding top / bottom / left / right** | Abstand vom Rand der Kachel zum Inhalt darin, in Pixeln. |

---

### inventwo — Border radius

Rundet die Ecken der Kachel ab. Jede Ecke kann unabhängig eingestellt werden.

| Einstellung | Beschreibung |
|-------------|--------------|
| **Top left / Top right / Bottom right / Bottom left** | Eckenradius in Pixeln für jede Ecke. |

> **Hinweis:** Wenn eine Polygon-Form aktiv ist, hat der Standard-Border-Radius keine Wirkung. Verwende stattdessen die **Corner radius**-Einstellung innerhalb der Gruppe **inventwo - Shape**.

---

### inventwo — Border

Fügt einen Rahmen um die Kachel hinzu.

| Einstellung | Beschreibung |
|-------------|--------------|
| **Border style** | Linienstil: None, Solid, Dashed, Dotted, Double, Groove, Ridge, Outset. |
| **Size top / bottom / left / right** | Rahmendicke pro Seite in Pixeln. |
| **Border color** | Standard-Rahmenfarbe (auch pro Zustand in den Default state / State-Gruppen setzbar). |

---

### inventwo — Outer shadow

Fügt einen Schlagschatten außerhalb der Kachel hinzu.

| Einstellung | Beschreibung |
|-------------|--------------|
| **Outer shadow color** | Schattenfarbe (Standard-Zustand). Auch pro Zustand in den Zustandsgruppen setzbar. |
| **X offset** | Horizontaler Schatten-Offset in Pixeln. |
| **Y offset** | Vertikaler Schatten-Offset in Pixeln. |
| **Blur** | Schatten-Unschärferadius. |
| **Size** | Schatten-Streuungsgröße. |

---

### inventwo — Inner shadow

Fügt einen eingebetteten Schatten innerhalb der Kachel hinzu (erzeugt einen vertieften/gedrückten Effekt).

Gleiche Einstellungen wie beim äußeren Schatten. Eine Farbe pro Zustand kann in den Zustandsgruppen gesetzt werden.

---

### inventwo — Shape

Das Form-System ermöglicht es, die Kachel in eine geometrische Form zu beschneiden. Alle Formen außer Rechteck verwenden CSS clip-path, sodass Hintergrund, Rahmen und Schatten weiterhin in der ausgewählten Form erscheinen.

![Übersicht des Form-Systems](../../../en/img/preview_shapes.png)

| Einstellung | Beschreibung |
|-------------|--------------|
| **Shape** | Die Form der Kachel: Rectangle (Standard, kein Beschneiden), Triangle, Diamond, Pentagon, Hexagon, Heptagon, Octagon, Star, Custom. |
| **Shape rotation** | Dreht die Polygon-Clip-Form. Unabhängig von der Inhaltsrotation. |
| **Corner radius** | Rundet die Ecken von Polygon-Formen ab. Die Standard-Border-Radius-Einstellung aus **inventwo - Border radius** wird für Polygon-Formen ignoriert — verwende stattdessen diese. |
| **Custom polygon points** | *(Nur Custom-Form)* Kommagetrennte X%/Y%-Paare im Uhrzeigersinn, z. B. `40% 0%, 100% 50%, 40% 100%, 0% 50%`. Das `%`-Zeichen ist optional. Wenn der Pfad ungültig ist, fällt die Kachel auf Rechteck zurück. |

> **Tipp:** Erstelle benutzerdefinierte Polygon-Formen visuell mit dem Tool auf [bennettfeely.com/clippy](https://bennettfeely.com/clippy/) und füge das Ergebnis in **Custom polygon points** ein.

---

### Click feedback (Klick-Feedback)

Beim Klicken kann die Kachel kurz zu einer anderen Farbe blinken, um dem Benutzer eine visuelle Bestätigung zu geben, dass der Klick registriert wurde.

| Einstellung | Beschreibung |
|-------------|--------------|
| **Background** | Hintergrundfarbe während des Drückmoments. |
| **Content color** | Inhaltsfarbe (Icon) während des Drückmoments. |
| **Text color** | Textfarbe während des Drückmoments. |
| **Border color** | Rahmenfarbe während des Drückmoments. |
| **Outer shadow color** | Äußere Schattenfarbe während des Drückmoments. |
| **Inner shadow color** | Innere Schattenfarbe während des Drückmoments. |
| **Duration** | Wie lange die gedrückte Farbe in Millisekunden sichtbar ist. |

---

## Stil-Wiederverwendung mit "From Widget"

Die meisten Style-Gruppen haben eine **From widget**-Option oben. Wenn du dort ein anderes Universal Widget auswählst, werden alle Einstellungen in dieser Gruppe zur Laufzeit von dem ausgewählten Widget übernommen.

**Verwendung:**
1. Erstelle ein "Master"-Universal Widget und konfiguriere sein Aussehen genau nach deinen Wünschen.
2. Wähle bei allen anderen Kacheln dieses Master-Widget in jedem **From widget**-Feld aus.
3. Wann immer du den Stil des Master-Widgets änderst, aktualisieren sich alle Kacheln, die darauf verweisen, automatisch.

Das ist der empfohlene Ansatz für Dashboards mit vielen optisch konsistenten Kacheln — Stil einmal konfigurieren, überall wiederverwenden.

---

## Zurück zu

- [Universal Widget Übersicht](../universal-widget.md)
- [Interaktionstypen](interaction-types.md)
- [Inhaltstypen](content-types.md)
