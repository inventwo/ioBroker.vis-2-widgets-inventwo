> 🌐 [English](../../en/widgets/marquee-widget.md) | **Deutsch**

# Marquee Widget

Das Marquee Widget zeigt Text an, der kontinuierlich durch den Widget-Bereich scrollt — wie ein klassischer Ticker oder Nachrichtenbanner. Der Text kann aus einem ioBroker-Datenpunkt stammen (z. B. eine Statusmeldung, ein Sensorwert oder eine Benachrichtigung) oder du gibst ihn manuell ein.

---

## Widget hinzufügen

1. Ziehe **Marquee** aus der Widget-Liste **inventwo design** auf deine Ansicht.
2. Passe die Breite des Widgets an den gewünschten Scrollbereich an.
3. Wähle entweder eine **Object ID** aus oder gib den Text direkt in **Scrolling text (static)** ein.
4. Passe Geschwindigkeit und Richtung nach deinen Wünschen an.

---

## Einstellungen

### Common

| Einstellung | Beschreibung |
|-------------|--------------|
| **Object ID** | Wenn gesetzt, ist der Scrolltext der aktuelle Wert dieses Datenpunkts. Das manuelle Textfeld wird ausgeblendet, wenn eine OID ausgewählt ist. |
| **Scrolling text (static)** | Manuell einzugebender Scrolltext. Nur sichtbar, wenn keine Object ID gesetzt ist. |
| **Direction** | Scroll-Richtung: **Left** (von rechts nach links, Standard) oder **Right** (von links nach rechts). |
| **Speed (px/s)** | Wie schnell der Text in Pixeln pro Sekunde scrollt. Bereich: 10–500. Standard: 80. Höher = schneller. Die Geschwindigkeit ist konstant, unabhängig davon, wie viele Kopien angezeigt werden. |
| **Text copies** | Wie oft der Text nebeneinander in der Animationsschleife wiederholt wird. Standard: 3. Erhöhe diesen Wert, wenn kurzer Text beim Scrollen sichtbare Lücken hinterlässt. |
| **Gap between copies (px)** | Abstand in Pixeln zwischen zwei Kopien des Texts. Standard: 50. |
| **Pause on hover** | Bei Aktivierung pausiert die Scrollanimation, wenn der Mauszeiger über das Widget bewegt wird. |
| **Background** | Optionale Hintergrundfüllfarbe für den Widget-Bereich. |

---

## Textdarstellung

Schriftfamilie, Schriftgröße, Textfarbe, Schriftstärke und Buchstabenabstand werden alle über die Standard-VIS-Widget-CSS-Einstellungen gesetzt (der **CSS**-Tab oder der **Font**-Bereich in der Seitenleiste) — nicht über das inventwo-Einstellungspanel.

---

## Tipps

- **Lücken vermeiden:** Wenn dein Text kurz ist und du eine Lücke zwischen dem Ende eines Durchlaufs und dem Start des nächsten siehst, erhöhe **Text copies**, bis die Lücke verschwindet.
- **Live-Daten:** Verbinde die **Object ID** mit einem String-Datenpunkt (z. B. einem Adapter, der Nachrichtenzeilen, Börsenkurse oder Wetterzusammenfassungen schreibt) für einen vollständig live aktualisierten Ticker.
- **Geschwindigkeit vs. Lesbarkeit:** Für Text, der komfortabel gelesen werden soll, bleibe unter 100 px/s. Für einen rein visuellen Effekt eignen sich höhere Geschwindigkeiten gut.

---

## Siehe auch

- [Value List Widget](value-list-widget.md) — zeigt eine Liste statt Scrolltext an
- [Universal Widget](universal-widget.md) — für statischen Text in einer gestalteten Kachel
