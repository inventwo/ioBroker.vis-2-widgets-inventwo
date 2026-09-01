> 🌐 [English](../../en/widgets/switch-widget.md) | **Deutsch**

# Switch Widget

Das Switch Widget zeigt einen klassischen Umschalter an, der einen Datenpunkt ein- oder ausschaltet. Du legst fest, welcher Wert als "ein" und welcher als "aus" gilt — somit funktioniert es mit booleschen Datenpunkten (`true`/`false`), numerischen (`0`/`1`) oder jedem anderen Wertepaar.

![Switch Widget](../../en/img/widget-switch.png)

---

## Widget hinzufügen

1. Öffne den VIS-2-Editor und wechsle zu deiner Ansicht.
2. Suche in der Widget-Liste links **inventwo design** und ziehe **Switch** auf die Arbeitsfläche.
3. Klicke in der Seitenleiste rechts auf **Objekt-ID** und wähle den Datenpunkt aus, den du steuern möchtest.
4. Setze **Wert true** und **Wert false** auf die Werte, die dein Datenpunkt verwendet.
5. Wechsle in die Laufzeitansicht, um das Widget zu testen.

---

## Einstellungen

### Common

| Einstellung | Beschreibung |
|-------------|--------------|
| **Objekt-ID** | Der Datenpunkt, den dieser Schalter liest und schreibt. |
| **Wert true** | Der Wert, der geschrieben wird, wenn der Schalter eingeschaltet wird. Leer lassen, um `true` zu verwenden. |
| **Wert false** | Der Wert, der geschrieben wird, wenn der Schalter ausgeschaltet wird. Leer lassen, um `false` zu verwenden. |
| **Text falsch** | Beschriftung, die neben dem Schalter angezeigt wird, wenn er ausgeschaltet ist. Leer lassen für keine Beschriftung. |
| **Text wahr** | Beschriftung, die neben dem Schalter angezeigt wird, wenn er eingeschaltet ist. Leer lassen für keine Beschriftung. |
| **Textposition** | Wo die Beschriftung relativ zum Schalter erscheint: **End** (rechts), **Start** (links), **Top** oder **Bottom**. Standard: **End**. |

---

### inventwo - Track

Der Track ist der längliche Hintergrund des Schalters.

| Einstellung | Beschreibung |
|-------------|--------------|
| **Vom Widget** | Alle Track-Einstellungen von einem anderen Switch Widget kopieren. Nützlich, um mehrere Schalter optisch konsistent zu halten. |
| **Spurfarbe** | Track-Farbe, wenn der Schalter ausgeschaltet ist. |
| **Spurfarbe wahr** | Track-Farbe, wenn der Schalter eingeschaltet ist. |
| **Spurbreite** | Höhe des Tracks in Pixeln (1–50). |
| **Gleisrandradius** | Wie rund die Track-Enden sind (1–100 %). Bei 100 % ist der Track vollständig gerundet (Pillenform). |
| **Spurleiste Schatten** | Schlagschatten unterhalb des Tracks. X-Offset, Y-Offset, Unschärfe, Größe und Farbe einstellen. **Shadow color true** ist die Schattenfarbe, wenn der Schalter eingeschaltet ist. |

---

### inventwo - Daumen

Der Thumb ist der runde Griff, der hin- und hergleitet.

| Einstellung | Beschreibung |
|-------------|--------------|
| **Vom Widget** | Alle Thumb-Einstellungen von einem anderen Switch Widget kopieren. |
| **Daumenfarbe** | Thumb-Farbe, wenn der Schalter ausgeschaltet ist. |
| **Daumenfarbe echt** | Thumb-Farbe, wenn der Schalter eingeschaltet ist. |
| **Daumengröße** | Durchmesser des Thumbs in Pixeln. Sollte etwas größer als die Track-Breite sein. |
| **Daumenrandradius** | Wie rund der Thumb ist (1–100 %). Bei 100 % ist der Thumb ein perfekter Kreis. |
| **Regler Schatten** | Schlagschatten auf dem Thumb. Gleiche Einstellungen wie beim Track-Schatten. |

---

## Tipps

- **Benutzerdefinierte Werte:** Wenn dein Gerät die Strings `"on"`/`"off"` statt `true`/`false` verwendet, trage diese einfach in **Wert true** und **Wert false** ein.
- **Stil-Wiederverwendung:** Erstelle ein "Vorlage"-Switch Widget, gestalte es genau nach deinen Wünschen und verwende dann **Vom Widget** in allen anderen Switch Widgets, um diese Einstellungen zu übernehmen — das spart viel Zeit.
- **Schriftformatierung:** Textfarbe, -größe und Schriftfamilie der Beschriftung werden über die Standard-VIS-Widget-CSS-Einstellungen (CSS-Tab in der Seitenleiste) gesteuert, nicht über die inventwo-Einstellungen.

---

## Siehe auch

- [Checkbox Widget](checkbox-widget.md) — ähnliches Verhalten, als Checkbox dargestellt statt als Schalter
- [Universal Widget](universal-widget.md) — vollständig anpassbare Kachel mit demselben Schaltverhalten plus Icons und Formen
