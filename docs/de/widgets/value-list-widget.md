> 🌐 [English](../../en/widgets/value-list-widget.md) | **Deutsch**

# Value List Widget

Das Value List Widget nimmt einen Textwert — aus einem Datenpunkt oder manuell eingegeben — teilt ihn in einzelne Einträge auf und zeigt sie als formatierte Aufzählungsliste an. Das ist nützlich, um komma- oder zeilenumbruch-getrennte Werte in einem lesbaren Layout darzustellen.

**Beispiel:** Ein Datenpunkt, der `"Wohnzimmer, Küche, Schlafzimmer"` enthält, wird als dreigliedrige Aufzählungsliste angezeigt.

---

## Widget hinzufügen

1. Ziehe **Value List** aus der Widget-Liste **inventwo design** auf deine Ansicht.
2. Wähle entweder eine **Objekt-ID** aus, deren Wert die Listeneinträge enthält, oder gib den Text direkt in **Text (manuell)** ein.
3. Setze das **Trennzeichen** entsprechend der Trennung deiner Einträge (z. B. `,` für kommagetrennte Werte, `\n` für Zeilenumbrüche).
4. Wähle einen Aufzählungsstil in der Gruppe **Appearance**.

---

## Einstellungen

### Common

| Einstellung | Beschreibung |
|-------------|--------------|
| **Objekt-ID** | Wenn gesetzt, stammen die Listeneinträge aus dem aktuellen Wert dieses Datenpunkts. Das manuelle Textfeld wird ausgeblendet, wenn eine OID ausgewählt ist. |
| **Text (manuell)** | Text, der in Listeneinträge aufgeteilt wird. Nur sichtbar, wenn keine Objekt-ID gesetzt ist. |
| **Trennzeichen** | Das Zeichen oder die Zeichenkette, die den Text in Einträge aufteilt. Standard: `,`. Verwende `\n` für Zeilenumbrüche, `\t` für Tabulatoren. |
| **Leerzeichen entfernen** | Bei Aktivierung werden führende und nachfolgende Leerzeichen von jedem Eintrag entfernt. Empfohlen bei kommagetrennte Werten mit Leerzeichen nach dem Komma. |
| **Leere Einträge ignorieren** | Bei Aktivierung werden Einträge, die nach dem Aufteilen (und optionalem Trimmen) leer sind, nicht angezeigt. |

---

### Appearance (Darstellung)

| Einstellung | Beschreibung |
|-------------|--------------|
| **Aufzählungszeichen** | Das Symbol, das vor jedem Eintrag angezeigt wird. Optionen: **Disc** (•), **Circle** (○), **Square** (▪), **Dash** (–), **Arrow** (›), **Numbered** (1. 2. 3.), **None** (kein Aufzählungszeichen), **Custom** (eigenes Zeichen). |
| **Benutzerdefiniertes Zeichen** | Wird nur angezeigt, wenn **Aufzählungszeichen** auf **Custom** gesetzt ist. Gib ein beliebiges Zeichen oder Emoji ein. |
| **Farbe des Aufzählungszeichens** | Farbe des Aufzählungszeichens. Ausgeblendet, wenn Aufzählungszeichen **None** ist. |
| **Abstand Zeichen zu Text (px)** | Horizontaler Abstand zwischen Aufzählungszeichen und Eintragstext. Ausgeblendet, wenn Aufzählungszeichen **None** ist. |
| **Zeilenabstand (px)** | Vertikaler Abstand zwischen Listeneinträgen. |
| **Innenabstand** | Innenabstand um die gesamte Liste in Pixeln. |

---

## Tipps

- **Zeilenumbruch-getrennte Werte:** Setze das Trennzeichen auf `\n`, um eine mehrzeilige Zeichenkette in einzelne Listeneinträge aufzuteilen.
- **Schriftformatierung:** Schriftfamilie, -größe, -stärke und -farbe des Listentexts werden über die Standard-VIS-Widget-CSS-Einstellungen gesetzt, nicht über die inventwo-Einstellungen.
- **Dynamische Listen:** Verbinde das Widget mit einem String-Datenpunkt, der von einem Skript oder Adapter aktualisiert wird. Jedes Mal, wenn sich der Wert ändert, wird die Liste automatisch neu gerendert.

---

## Siehe auch

- [Marquee Widget](marquee-widget.md) — zeigt einen einzelnen Scrolltext statt einer Liste an
- [Table Widget](table-widget.md) — für strukturierte Tabellendaten aus einem JSON-Array
