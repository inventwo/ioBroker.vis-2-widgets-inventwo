> 🌐 [English](../en/migration.md) | **Deutsch**

# inventwo-vis-1-Widgets migrieren

Wenn du ein vis-1-Projekt in VIS 2 importiert hast, das die alten Widgets des Adapters **vis-inventwo** (Templates `i-vis-*`) verwendet, können die Einstellungen dieses Adapters sie auf die VIS-2-Widgets dieses Sets umstellen.

Die Migration ist ein Assistent, keine Ein-Klick-Lösung: Häufige Fälle werden vollständig umgestellt, andere nur teilweise und einige wenige Widgets gar nicht. Nach der Migration bekommst du eine Liste mit allem, was du von Hand prüfen solltest.

> Die Idee und Teile des Mappings basieren auf dem Community-Tool [inventwo-vis1-to-vis2](https://github.com/crunchip77/inventwo-vis1-to-vis2) von crunchip77.

> **Keine Garantie:** Die Migration wurde mit Sorgfalt gebaut, wir können aber nicht versprechen, dass sie bei jedem Projekt fehlerfrei funktioniert — dafür gibt es bei vis-1-Projekten zu viele verschiedene Konstellationen. Behalte immer das Original (neues Projekt oder Backup, siehe unten) und prüfe das Ergebnis. Wird etwas nicht wie erwartet umgestellt, [öffne bitte ein Issue](https://github.com/inventwo/ioBroker.vis-2-widgets-inventwo/issues) und beschreibe das Widget und seine Einstellungen. Deine Rückmeldung hilft, das Tool zu verbessern.

---

## So geht's

1. Das vis-1-Projekt in VIS 2 importieren (falls noch nicht geschehen).
2. **Den VIS-2-Editor** dieses Projekts **schließen**. Ein offener Editor überschreibt eventuell das Ergebnis.
3. Im ioBroker-Admin **Instanzen** öffnen und dort die Einstellungen von `vis-2-widgets-inventwo`.
4. Unter **1. Projekt** das **VIS-2-Projekt** auswählen.
   - **Name des neuen Projekts** (optional): Mit Namen wird das Projekt samt allen Dateien in ein neues Projekt kopiert und dort umgestellt — das Original bleibt unberührt. Ohne Namen wird das Projekt selbst überschrieben (vorher wird ein Backup gespeichert, siehe unten).
   - **Ursprüngliches vis-1-Projekt** (optional): auswählen, wenn nach dem Import Widgets fehlen (siehe [Nach dem Import fehlende Widgets](#nach-dem-import-fehlende-widgets)).
5. Auf **Analysieren** klicken. Es wird noch nichts geändert — du siehst nur eine Vorschau:
   - wie viele Widgets ohne Nacharbeit umstellbar sind,
   - wie viele umstellbar, aber zu prüfen sind,
   - wie viele nicht umstellbar sind und unverändert bleiben.
6. Auf **Projekt … umstellen** bzw. **Projekt … anlegen** klicken und bestätigen.
7. VIS 2 neu laden und die Liste **Umgestellte Widgets, die zu prüfen sind** abarbeiten.

Der Abschnitt **Was kann umgestellt werden?** oben auf der Seite listet alle unterstützten Widgets auf.

Mit **Bericht herunterladen** lässt sich das Ergebnis als JSON-Datei speichern.

---

## Backup und Rückgängigmachen

Wird ein Projekt direkt umgestellt (ohne neuen Namen), wird die ursprüngliche `vis-views.json` im Projektordner als `vis-views-backup-inventwo-<Datum>-<Uhrzeit>.json` gespeichert. Das Projekt wird erst überschrieben, nachdem dieses Backup geschrieben und erfolgreich zurückgelesen wurde.

Wurde das Ergebnis in ein neues Projekt geschrieben, gibt es nichts rückgängig zu machen: Das ursprüngliche Projekt ist unverändert, das neue lässt sich einfach löschen.

Um eine direkte Umstellung rückgängig zu machen, im Admin den Reiter **Dateien** öffnen, nach `vis-2.0/<Projekt>/` wechseln und die `vis-views.json` durch die Backup-Datei ersetzen.

---

## Nach dem Import fehlende Widgets

vis-1 speichert ein Widget, das in mehreren Views angezeigt wird, einmal pro View und hängt dabei den View-Namen an die ID an (z. B. `w00220_02_EG`). VIS 2 entfernt beim Laden eines Projekts jedes Widget mit einem Unterstrich in der ID. Nach dem Import sind diese Widgets deshalb weg — die Kacheln fehlen im Editor und die Widget-Liste ist kürzer als vorher.

Um sie zurückzuholen, unter **Ursprüngliches vis-1-Projekt (optional)** das ursprüngliche Projekt auswählen. Es dient nur als Referenz und wird nicht verändert. Es muss dafür noch in vis-1 vorhanden sein (Dateiablage `vis.0`). Der Assistent legt jedes dieser Widgets dann einmal an und trägt die übrigen Views in dessen Attribut **Zeige in Views** ein — so speichert VIS 2 solche Widgets. Die wiederhergestellten Widgets stehen in der Vorschau und werden im selben Durchlauf umgestellt.

---

## Was umgestellt wird

| vis-1-Widget | VIS-2-Widget | Ergebnis |
|---|---|---|
| Universal — Switch | Universal Widget, Typ *Schalten* | vollständig |
| Universal — Background | Universal Widget, Typ *Schreibgeschützt* | vollständig |
| Universal — Navigation | Universal Widget, Typ *Navigation* | vollständig |
| Universal — View in Popup | Universal Widget, Typ *Im Dialog anzeigen* | vollständig |
| Universal — State | Universal Widget, Typ *Taste* | Wert und Klickverhalten prüfen |
| Universal — Wert erhöhen/verringern | Universal Widget, Typ *Wert erhöhen/verringern* | Schrittweite prüfen |
| Universal — HTTP | Universal Widget, Typ *HTTP-Anfrage senden/URL öffnen* | URL prüfen |
| Universal mit Analoguhr | Universal Widget, Inhalt *Analoge Uhr* | Ziffernblatt prüfen, Zeitzone wird nicht übernommen |
| Multi | Universal Widget mit mehreren Zuständen | Bedingungen und Aussehen der Zustände prüfen |
| Switch, Switch small | Universal Widget, Typ *Schalten* | vollständig |
| Background, Background small | Universal Widget, Typ *Schreibgeschützt* | vollständig |
| Button, Button small | Universal Widget, Typ *Taste* | vollständig |
| Navigation, Navigation small | Universal Widget, Typ *Navigation* | vollständig |
| Image, Image (new) | Universal Widget, Inhalt *Bild* | Skalierung, Farben und Schatten prüfen |
| Radiobutton-Liste | Universal Widget mit *getrennten Tasten* | Größe und Abstände prüfen |
| Color-Picker | Universal Widget, Inhalt *Color-Picker* | Datenpunkte und angezeigte Elemente prüfen |
| Checkbox | Checkbox Widget | nur die erste Checkbox des Widgets; Aussehen wird nicht übernommen |
| Switch basic | Switch Widget | nur der erste Schalter des Widgets |
| Switch (Wippe) | Switch Widget | Größe und Farben prüfen |
| Value List | Value List Widget | vollständig (einige Listenstile gibt es nicht) |
| Marquee | Marquee Widget | Geschwindigkeit neu einstellen |
| JSON-Tabelle | Table Widget | Spalten, Formate und Farben werden übernommen; Aussehen prüfen |
| Slider (simple) | Slider Widget | Beschriftungen und Wertanzeige prüfen |

Farben, Texte, Bilder, Eckenradius, Schatten, Rahmen, Ausrichtung, Abstände und Transparenz der Universal- und Multi-Widgets werden übernommen. Textgröße und Textschatten wandern in die CSS-Einstellungen des Widgets (`font-size`, `text-shadow`).

### Nicht umgestellt

Für die Farb-Slider (`i-vis-slider-color-hor`, `i-vis-slider-color-vert`) gibt es kein Gegenstück. Sie bleiben unverändert und stehen unter **Widgets ohne Umstellung**.

In VIS 2 nicht vorhanden und deshalb verworfen: Hover-Farben, die Digitaluhr, das Zurücksetzen eines Werts nach einer Zeit, der separate Datenpunkt zum Schließen eines Dialogs, die Matrix-Anordnung von Radiobuttons, Schwellwerte pro Tabellenzelle, die Drehung von Slidern.

Ein Dialog lässt sich in VIS 2 weiterhin per Datenpunkt schließen: Er folgt der **Objekt-ID** des Widgets und ist nur geöffnet, solange dieser Datenpunkt **Wert true** enthält (siehe [Interaktionstypen](widgets/universal/interaction-types.md#view-in-dialog)). Nur für den zusätzlichen Schließen-Datenpunkt aus vis-1 gibt es kein Gegenstück.

