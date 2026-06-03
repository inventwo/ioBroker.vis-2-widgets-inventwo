> 🌐 [English](../../en/widgets/radial-slider-widget.md) | **Deutsch**

# Radial Slider Widget

Das Radial Slider Widget ist ein kreisförmiger Bogenschieberegler für numerische Datenpunkte. Es funktioniert wie das normale Slider Widget, aber der Benutzer zieht entlang einer kreisförmigen Bahn statt einer geraden Linie. Es eignet sich perfekt für Thermostat-Kacheln, Lautstärkeknöpfe oder jede Steuerung, bei der ein rundes Drehregler-Element zum Design passt.

![Radial Slider Widget](../../en/img/widget-radial-slider.png)

---

## Widget hinzufügen

1. Ziehe **Radial Slider** aus der Widget-Liste **inventwo design** auf deine Ansicht.
2. Passe die Größe des Widgets an — es wird als Quadrat gerendert; die Widget-Größe bestimmt die Reglergröße.
3. Klicke auf **Object ID** und wähle deinen numerischen Datenpunkt. Min, Max und Step werden automatisch aus der Objektdefinition übernommen.
4. Passe **Start angle** und **End angle** an, um die Bogenform zu definieren.
5. Gestalte Schiene und Regler in den Gruppen **inventwo - Radial track** und **inventwo - Radial thumb**.

---

## Einstellungen

### Common

| Einstellung | Beschreibung |
|-------------|--------------|
| **Object ID** | Der Datenpunkt zum Lesen und Schreiben. Min, Max und Step werden bei der Auswahl einer OID automatisch aus der Objektdefinition befüllt. |
| **Min value** | Der Wert am Anfang des Bogens. Standard: 0. |
| **Max value** | Der Wert am Ende des Bogens. Standard: 100. |
| **Step** | Um wie viel sich der Wert pro Schritt ändert. Standard: 1. |
| **Start angle** | Der Winkel (0–360°), an dem der Bogen beginnt. 0° ist oben, Winkel steigen im Uhrzeigersinn. Standard: 225 (unten links). |
| **End angle** | Der Winkel (0–360°), an dem der Bogen endet. Standard: 135 (unten rechts). Zusammen mit dem Standard-Startwinkel ergibt das die klassische "270°-Drehregler"-Form. |
| **Show value** | Zeigt den aktuellen numerischen Wert in der Mitte des Reglers an. |
| **Show label** | Zeigt eine Textbeschriftung unterhalb des Werts in der Mitte an. Nur sichtbar, wenn ein Beschriftungstext eingegeben wurde. |
| **Label** | Der Text, der als Mittelbeschriftung angezeigt wird, z. B. `°C` oder `%`. Nur sichtbar, wenn **Show label** aktiviert ist. |

---

### inventwo — Radial track

| Einstellung | Beschreibung |
|-------------|--------------|
| **From widget** | Alle Track-Einstellungen von einem anderen Radial Slider Widget kopieren. |
| **Track color** | Farbe des Hintergrundbogens (der vollständige Bogen, der noch nicht erreicht wurde). Unterstützt Gradient-Strings, z. B. `linear-gradient(90deg, #aaa, #444)`. |
| **Track active color** | Farbe des gefüllten Bogens (der Teil vom Start bis zum aktuellen Wert). Unterstützt ebenfalls Gradient-Strings. |
| **Track width** | Dicke des Bogens in Pixeln. Standard: 10. |
| **Track shadow** | Schlagschatten auf dem Hintergrundbogen. X-Offset, Y-Offset, Unschärfe und Farbe einstellen. |

---

### inventwo — Radial thumb

| Einstellung | Beschreibung |
|-------------|--------------|
| **From widget** | Alle Thumb-Einstellungen von einem anderen Radial Slider Widget kopieren. |
| **Thumb color** | Farbe des kreisförmigen Reglers. |
| **ThumbSize** | Durchmesser des Regler-Kreises in Pixeln. Standard: 16. |
| **Thumb shadow** | Schlagschatten auf dem Regler. |

---

### inventwo — Radial value

| Einstellung | Beschreibung |
|-------------|--------------|
| **Value size** | Schriftgröße des mittleren Werts in Pixeln (8–100). Standard: 32. |
| **Value color** | Farbe des mittleren Werttexts. |
| **Label size** | Schriftgröße der mittleren Beschriftung in Pixeln (8–50). Standard: 14. |
| **Label color** | Farbe des mittleren Beschriftungstexts. |

---

## Winkel verstehen

Die Winkel werden im Uhrzeigersinn von oben gemessen (12-Uhr-Position = 0°).

| Winkel | Position auf dem Regler |
|--------|------------------------|
| 0° | Oben (12 Uhr) |
| 90° | Rechts (3 Uhr) |
| 180° | Unten (6 Uhr) |
| 270° | Links (9 Uhr) |

**Beispiel — Klassischer Thermostat-Regler:**
- Start angle: 225 (unten links, ca. 7 Uhr)
- End angle: 135 (unten rechts, ca. 5 Uhr)
- Ergibt einen großen Bogen, der von unten links, über die Spitze, nach unten rechts verläuft.

**Beispiel — Rechter Halbkreis:**
- Start angle: 270 (links)
- End angle: 90 (rechts)
- Ergibt einen Halbkreis auf der rechten Seite.

---

## Tipps

- **Thermostat-Kachel:** Start angle 225, End angle 135, Label auf `°C` setzen und mit dem Heizungs-Datenpunkt verbinden. Der Bogen überspannt 270° — der klassische Thermostat-Look.
- **Batterieanzeige:** Start angle 180, End angle 0, aktive Farbe auf Grün und Track-Farbe auf Dunkelgrau setzen. Der Bogen füllt sich von links nach rechts, während die Batterie lädt.
- **Stil-Wiederverwendung:** Verwende **From widget**, um Track- und Thumb-Einstellungen auf mehrere Regler zu übertragen.

---

## Siehe auch

- [Slider Widget](slider-widget.md) — dieselbe Steuerung als gerader horizontaler oder vertikaler Schieberegler
