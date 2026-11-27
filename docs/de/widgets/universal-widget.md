> 🌐 [English](../../en/widgets/universal-widget.md) | **Deutsch**

# Universal Widget

Das Universal Widget ist das vielseitigste Widget im inventwo-Set. Es kombiniert **Interaktionsverhalten**, **visuellen Inhalt** und **zustandsbasiertes Styling** in einer einzigen Kachel. Verwende es, wenn du eine einheitlich aussehende Kachel haben möchtest, die auf deinen Datenpunkt reagiert — und dabei je nach Wert ihr Icon, ihre Farbe, ihren Text oder ihre Form ändert.

![Universal Widget](../../en/img/widget-universal.png)

**Typische Einsatzbereiche:**
- Lichtschalter-Kachel, die Icon und Farbe beim Einschalten ändert
- Raumnavigations-Schaltflächen, die die aktuell aktive Ansicht hervorheben
- Schaltfläche, die eine Detailansicht in einem Dialog-Overlay öffnet
- Reine Statusanzeige-Kachel mit benutzerdefinierten Icons
- RGB-Farbwähler, eingebettet in eine Kachel
- Analoguhr-Kachel auf dem Dashboard
- Plus/Minus-Schrittschaltflächen

---

## Schnellstart

1. Ziehe **Universal (Switch, Button, Nav, Image & more)** aus der Widget-Liste **inventwo design** auf deine Ansicht.
2. Wähle einen **Typ** — das ist die wichtigste Einstellung und legt fest, was beim Klick auf die Kachel passiert. Siehe [Interaktionstypen](universal/interaction-types.md).
3. Klicke auf **Objekt-ID** und wähle den Datenpunkt aus (wenn dein Typ einen Wert liest oder schreibt).
4. Wähle einen **Content type**, um festzulegen, was in der Kachel angezeigt wird (Icon, Bild, Text, eingebettete Ansicht usw.). Siehe [Inhaltstypen](universal/content-types.md).
5. Konfiguriere den Standardzustand in der Gruppe **Default state** — Hintergrund, Farben, Text, Icon.
6. Füge weitere Zustände in den **State**-Gruppen hinzu, um das Aussehen der Kachel je nach Datenpunktwert zu ändern.
7. Gestalte die Kachel (Form, Rahmen, Schatten usw.) in den inventwo-Style-Gruppen. Siehe [Styling und Formen](universal/styling-and-shapes.md).

---

## Grundkonzepte

### Typ (Interaktionsverhalten)
Was passiert, wenn du auf die Kachel klickst. Optionen: Switch, Button, Nav, Read only, View in dialog, Increase/decrease value, Send HTTP request. → [Detaillierte Erklärung](universal/interaction-types.md)

### Modus
- **Single button**: Eine Kachel, die jeweils einen einzelnen Zustand anzeigt.
- **Separated buttons**: Jeder Zustand wird als eigene anklickbare Schaltfläche dargestellt, nebeneinander angeordnet. Nützlich für Mehrfach-Optionsauswahlen (ähnlich wie die frühere Radio-Button-Liste).

### States (Zustände)
Das Universal Widget unterstützt mehrere visuelle Zustände. Jeder Zustand wird ausgelöst, wenn der Datenpunktwert einer von dir definierten Bedingung entspricht. Beispiel: Zustand 1 = Icon einer leuchtenden Glühbirne bei Wert `true`, Zustand 2 = Icon einer dunklen Glühbirne bei Wert `false`.

Der **Default state** (Zustand 1) wird immer angezeigt, wenn keine andere Zustandsbedingung zutrifft oder kein OID gebunden ist.

### Content Type (Inhaltstyp)
Was innerhalb der Kachel gerendert wird. Optionen: Icon, Image, Text/HTML, View in widget, Color picker, Analog clock. → [Detaillierte Erklärung](universal/content-types.md)

### Vom Widget (Stil-Wiederverwendung)
Die meisten Style-Gruppen haben ein **Vom Widget**-Feld. Wähle ein anderes Universal Widget aus, und alle Einstellungen dieser Gruppe werden von dort übernommen. So hältst du viele Kacheln optisch konsistent, ohne jede einzeln konfigurieren zu müssen.

### Presets
In der Gruppe **inventwo - Presets** kannst du das Design einer Kachel kopieren und einfügen, als benanntes Preset speichern, auf mehrere ausgewählte Widgets gleichzeitig anwenden und Presets als Datei exportieren oder importieren. Übertragen wird nur das Design, nie Datenpunkte, Texte, Icons oder Aktionen. → [Presets](../design-presets.md)

### Themes
In der Gruppe **inventwo - Theme** koppelst du eine Kachel an ein Theme: Hintergrund, Farben, Rahmen, Ecken und Schatten kommen dann aus dem Theme und ändern sich mit ihm, eigene Werte haben Vorrang. **Theme-Hintergrund** legt fest, ob die Kachel die Kachel-Fläche, die Karten-Fläche oder ihren eigenen Hintergrund verwendet. **Aktiver Zustand** wählt, wie der aktive Zustand aussieht (volle Akzentfläche oder dezent mit Icon in Akzentfarbe), **Leuchten im aktiven Zustand** gibt ihm einen Schein in Akzentfarbe, **Beschriftung** die Textfarbe im inaktiven Zustand. → [Themes](../themes.md)

---

## Detailseiten

- [Interaktionstypen](universal/interaction-types.md) — Switch, Button, Nav, Dialog, HTTP und mehr
- [Inhaltstypen](universal/content-types.md) — Icon, Image, HTML, View in widget, Color picker, Analoguhr
- [Styling und Formen](universal/styling-and-shapes.md) — Alle Style-Gruppen, Formen, Klick-Feedback, Hover
- [Presets](../design-presets.md) — Design einer Kachel kopieren, speichern, anwenden, exportieren und importieren
- [Themes](../themes.md) — Design dieses Widgets an ein gemeinsames Theme koppeln (Farben, Ecken, Rahmen, Schatten, Schrift)

---

## Siehe auch

- [Switch Widget](switch-widget.md) — einfacherer Ein/Aus-Schalter
- [Checkbox Widget](checkbox-widget.md) — einfachere Checkbox-Steuerung
- [Dropdown Widget](dropdown-widget.md) — zum Auswählen aus einer States-Liste
