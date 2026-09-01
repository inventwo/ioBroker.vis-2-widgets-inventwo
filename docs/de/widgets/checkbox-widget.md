> 🌐 [English](../../en/widgets/checkbox-widget.md) | **Deutsch**

# Checkbox Widget

Das Checkbox Widget zeigt eine Standard-Checkbox an, die einen Datenpunkt zwischen zwei Werten umschaltet. Wie beim Switch Widget legst du fest, was "aktiviert" und "deaktiviert" bedeutet — es funktioniert also mit booleschen Werten, Zahlen oder jedem anderen Wertepaar.

![Checkbox Widget](../../en/img/widget-checkbox.png)

---

## Widget hinzufügen

1. Ziehe **Checkbox** aus der Widget-Liste **inventwo design** auf deine Ansicht.
2. Klicke in der Seitenleiste auf **Objekt-ID** und wähle deinen Datenpunkt aus.
3. Setze **Wert true** (aktivierter Zustand) und **Wert false** (deaktivierter Zustand).
4. Gib optional eine Beschriftung in **Text falsch** / **Text wahr** ein und wähle ihre Position.

---

## Einstellungen

### Common

| Einstellung | Beschreibung |
|-------------|--------------|
| **Objekt-ID** | Der Datenpunkt, den diese Checkbox liest und schreibt. |
| **Wert true** | Wird in den Datenpunkt geschrieben, wenn die Checkbox aktiviert wird. Leer lassen, um `true` zu verwenden. |
| **Wert false** | Wird in den Datenpunkt geschrieben, wenn die Checkbox deaktiviert wird. Leer lassen, um `false` zu verwenden. |
| **Text falsch** | Beschriftung, die angezeigt wird, wenn die Checkbox deaktiviert ist. Leer lassen für keine Beschriftung. |
| **Text wahr** | Beschriftung, die angezeigt wird, wenn die Checkbox aktiviert ist. Leer lassen für keine Beschriftung. |
| **Textposition** | Wo die Beschriftung erscheint: **End** (rechts, Standard), **Start** (links), **Top** oder **Bottom**. |

---

### inventwo - Stil

| Einstellung | Beschreibung |
|-------------|--------------|
| **Vom Widget** | Alle Style-Einstellungen von einem anderen Checkbox Widget kopieren. |
| **Boxfarbe** | Farbe des Checkbox-Rahmens und Icons, wenn deaktiviert. |
| **Boxfarbe aktiv** | Farbe der Checkbox, wenn aktiviert (Füllung und Icon). |
| **Boxgröße** | Größe der Checkbox in Pixeln (0–50). Standard: 24 px. |

---

## Tipps

- **Einheitliches Styling:** Verwende **Vom Widget**, um die Farb- und Größeneinstellungen von einem Master-Checkbox-Widget zu kopieren, damit alle Checkboxen auf deinem Dashboard gleich aussehen.
- **Schrift und Textfarbe:** Schriftfamilie, -größe und -farbe der Beschriftung werden über die Standard-VIS-Widget-CSS-Einstellungen gesteuert, nicht über die inventwo-Einstellungen.

---

## Siehe auch

- [Switch Widget](switch-widget.md) — ähnliches Verhalten mit Umschalter-Darstellung
- [Universal Widget](universal-widget.md) — vollständig anpassbare Kachel mit demselben Schaltverhalten plus Icons und Formen
