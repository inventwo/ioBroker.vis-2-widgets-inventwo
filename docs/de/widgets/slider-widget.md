> 🌐 [English](../../en/widgets/slider-widget.md) | **Deutsch**

# Slider Widget

Das Slider Widget ermöglicht es Benutzern, einen numerischen Wert durch Ziehen eines Reglers entlang einer Schiene einzustellen. Es funktioniert horizontal oder vertikal und eignet sich ideal zur Steuerung von Dimmern, Thermostaten, Jalousien, Lautstärke oder jedem anderen numerischen Datenpunkt.

![Slider Widget](../../en/img/widget-slider.png)

---

## Widget hinzufügen

1. Ziehe **Slider** aus der Widget-Liste **inventwo design** auf deine Ansicht.
2. Klicke auf **Objekt-ID** und wähle den numerischen Datenpunkt aus, den du steuern möchtest.
3. Minimum, Maximum und Schrittweite werden automatisch aus der Objektdefinition übernommen — passe sie bei Bedarf an.
4. Wähle die **Orientierung** (Horizontal oder Vertical).
5. Gestalte Schiene und Regler in den Gruppen **inventwo - Slider track** und **inventwo - Slider thumb**.

---

## Einstellungen

### Common

| Einstellung | Beschreibung |
|-------------|--------------|
| **Objekt-ID** | Der Datenpunkt zum Lesen und Schreiben. Bei der Auswahl werden **Mindestwert**, **Maximalwert** und **Schritt** automatisch aus der Objektdefinition befüllt. |
| **Mindestwert** | Der kleinste Wert, den der Schieberegler setzen kann. Standard: 0. |
| **Maximalwert** | Der größte Wert, den der Schieberegler setzen kann. Standard: 100. |
| **Schritt** | Um wie viel sich der Wert pro Schritt ändert. Standard: 1. |
| **Orientierung** | **Horizontal** (links/rechts, Standard) oder **Vertical** (oben/unten). |
| **Min./Max. anzeigen** | Zeigt Minimum und Maximum als Beschriftung an beiden Enden des Schiebereglers an. |
| **Schreibgeschützt** | Bei Aktivierung zeigt der Schieberegler den aktuellen Wert an, kann aber nicht gezogen werden. Nützlich für reine Anzeige-Balken. |

#### Value Label

| Einstellung | Beschreibung |
|-------------|--------------|
| **Wertetikett anzeigen** | Wann der aktuelle Wert über dem Regler angezeigt wird: **On drag (default)** — nur beim Ziehen; **Always** — dauerhaft sichtbar; **Never** — nie angezeigt. |

#### Step Marks

| Einstellung | Beschreibung |
|-------------|--------------|
| **Schritte anzeigen** | Zeigt Stufenmarkierungen entlang der Schiene an. |
| **Schritte im Slider** | Platziert Markierungen innerhalb der Schiene statt darunter/daneben. |
| **Schrittmarken oben / links anzeigen** | *(Nur wenn Markierungen nicht innerhalb der Schiene)* Positioniert Markierungen oberhalb der Schiene (horizontal) oder links davon (vertikal) statt darunter/rechts. |
| **Schrittmodus** | **Auto**: Markierungen werden in einem von dir festgelegten Abstand gesetzt. **Custom**: Du gibst die genauen Positionen manuell ein. |
| **Schrittanzeige** | *(Nur Auto-Modus)* Der Abstand zwischen den Markierungen. Beispiel: Min=0, Max=100, Schrittanzeige=25 → Markierungen bei 0, 25, 50, 75 und 100. |
| **Benutzerdefinierte Schritte** | *(Nur Custom-Modus)* Kommagetrennte Werte für die Markierungspositionen, z. B. `0,20,50,80,100`. |

---

### inventwo - Slider track

Diese Gruppe steuert das Aussehen der Schiene (die Bahn, entlang der der Regler gleitet).

| Einstellung | Beschreibung |
|-------------|--------------|
| **Vom Widget** | Alle Track-Einstellungen von einem anderen Slider Widget kopieren. |
| **Farbe der Gleitschiene** | Farbe des inaktiven Teils der Schiene (der Teil hinter dem Regler). |
| **Gleitschiene aktive Farbe** | Farbe des aktiven Teils der Schiene (der Teil zwischen Minimum und Regler). |
| **Spurleistentyp** | **Normal**: Die aktive Füllung befindet sich auf der Niedrigwert-Seite (Standard). **Inverted**: Die aktive Füllung befindet sich auf der Hochwert-Seite (nützlich für Jalousien). **None**: Keine aktive Füllung angezeigt. |
| **Spurbreite** | Dicke der Schiene in Pixeln (1–50). Standard: 10. |
| **Gleisrandradius** | Rundet die Enden der Schiene (1–100). Standard: 100 (vollständig gerundet). |
| **Spurleiste Schatten** | Schlagschatten für die Schiene. X-Offset, Y-Offset, Unschärfe, Größe und Farbe einstellen. |

---

### inventwo - Slider thumb

Diese Gruppe steuert den Regler, den der Benutzer zieht.

| Einstellung | Beschreibung |
|-------------|--------------|
| **Vom Widget** | Alle Thumb-Einstellungen von einem anderen Slider Widget kopieren. |
| **Farbe des Schiebereglers** | Füllfarbe des Reglers. |
| **Daumengröße** | Durchmesser des Reglers in Pixeln (0–50). Auf 0 setzen, um den Regler vollständig auszublenden (z. B. für einen reinen Anzeige-Balken). |
| **Daumenrandradius** | Wie rund der Regler ist (1–100 %). Bei 100 % ist er ein perfekter Kreis. |
| **Regler Schatten** | Schlagschatten für den Regler. Gleiche Einstellungen wie beim Track-Schatten. |

---

## Tipps

- **Vertikaler Jalousien-Schieberegler:** Verwende **Orientierung: Vertical** und **Spurleistentyp: Inverted**, damit der gefüllte Teil anzeigt, wie weit die Jalousie geschlossen ist (oben = geschlossen, unten = offen).
- **Reiner Anzeige-Balken:** Aktiviere **Schreibgeschützt** und setze **Daumengröße** auf 0, um einen sauberen Fortschrittsbalken ohne ziehbaren Regler anzuzeigen.
- **Stil-Wiederverwendung:** Gestalte einen Schieberegler genau nach deinen Wünschen und verwende dann **Vom Widget** in allen anderen, um diese Einstellungen zu übernehmen.

---

## Siehe auch

- [Radial Slider Widget](radial-slider-widget.md) — dieselbe Steuerung als kreisförmiger Bogenschieberegler
