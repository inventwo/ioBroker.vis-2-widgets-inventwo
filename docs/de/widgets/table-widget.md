> 🌐 [English](../../en/widgets/table-widget.md) | **Deutsch**

# Table Widget

Das Table Widget zeigt Daten aus einem ioBroker-Datenpunkt als formatierte Tabelle an. Der Datenpunkt muss ein **JSON-Array** enthalten — eine Liste von Objekten, bei der jedes Objekt eine Zeile darstellt. Das ist ideal zum Anzeigen von Sensor-Messwerten, Gerätlisten, Protokollen oder strukturierten Daten, die ein Adapter als JSON schreibt.

![Table Widget](../../en/img/widget-table.png)

---

## Widget hinzufügen

1. Ziehe **Table** aus der Widget-Liste **inventwo design** auf deine Ansicht.
2. Klicke auf **Object ID** und wähle einen Datenpunkt aus, der ein JSON-Array enthält (siehe den Abschnitt zum Datenformat weiter unten).
3. Die Tabelle wird automatisch mit einer Spalte pro JSON-Schlüssel gerendert.
4. Um Spalten anzupassen (Titel, Breiten, Formatierung), erhöhe **Count columns** und konfiguriere jede Spalte.

---

## Erwartetes Datenformat

Der Datenpunkt muss ein JSON-Array von Objekten enthalten. Jedes Objekt ist eine Zeile, und jeder Schlüssel wird zu einer Spalte.

```json
[
  { "name": "Wohnzimmer", "temp": 21.3, "humidity": 58 },
  { "name": "Küche",      "temp": 22.1, "humidity": 62 },
  { "name": "Schlafzimmer", "temp": 19.8, "humidity": 55 }
]
```

Wenn der Datenpunktwert kein gültiges JSON ist, zeigt die Tabelle eine Fehlermeldung an.

---

## Einstellungen

### Common

| Einstellung | Beschreibung |
|-------------|--------------|
| **Object ID** | Der Datenpunkt, der das JSON-Array enthält. |
| **Count columns** | Anzahl der manuell konfigurierten Spalten. Bei **0** werden Spalten automatisch erzeugt (alle Schlüssel in der Reihenfolge, in der sie im JSON erscheinen). Erhöhe diesen Wert, um jede Spalte individuell zu konfigurieren. |
| **Max rows** | Maximale Anzahl der anzuzeigenden Zeilen. Bei **0** werden alle Zeilen angezeigt. |
| **Show head** | Zeigt oder versteckt die Kopfzeile mit den Spaltentiteln. |
| **Sticky header** | Bei Aktivierung bleibt die Kopfzeile beim Durchscrollen vieler Zeilen sichtbar. |

---

### Sorting (Sortierung)

| Einstellung | Beschreibung |
|-------------|--------------|
| **Default sort column** | Der Spalten-Schlüssel, nach dem beim ersten Laden der Tabelle sortiert wird. |
| **Default sort order** | **Ascending** (aufsteigend) oder **Descending** (absteigend). |
| **Multi-column sorting** | Ermöglicht das Sortieren nach mehreren Spalten gleichzeitig. Klicke auf einen Spalten-Header, um ihn zur Sortierreihenfolge hinzuzufügen. Nochmals klicken kehrt die Richtung um. Ein dritter Klick entfernt die Spalte aus der Sortierung. Das Zahlen-Badge auf dem Header zeigt die Sortierpriorität. |
| **Number of default sort columns** | *(Nur Multi-Sort)* Anzahl der Standard-Sortierspalten, die konfiguriert werden sollen. |

Benutzer können zur Laufzeit auf Spalten-Header klicken, um die Sortierreihenfolge zu ändern (wenn **Sortable** für diese Spalte aktiviert ist).

---

### Spalteneinstellungen (pro Spalte)

Wenn **Count columns** größer als 0 ist, hat jede Spalte folgende Einstellungen:

| Einstellung | Beschreibung |
|-------------|--------------|
| **Hide column** | Versteckt diese Spalte in der Tabelle, ohne ihre Konfiguration zu entfernen. |
| **Key** | Der JSON-Eigenschaftsname, der in dieser Spalte angezeigt wird, z. B. `temp`. Wenn leer, verwendet die Spalte den Schlüssel an dieser Position im JSON. |
| **Title** | Beschriftung des Spalten-Headers. Wenn leer, wird der JSON-Schlüsselname verwendet. |
| **Width** | Feste Spaltenbreite in Pixeln (0 = automatisch). |
| **Prefix** | Text, der vor dem Zellenwert hinzugefügt wird, z. B. `~`. |
| **Suffix** | Text, der nach dem Zellenwert hinzugefügt wird, z. B. ` °C`. |
| **Placeholder** | Text, der angezeigt wird, wenn der Zellenwert leer oder null ist. |
| **Title align** | Ausrichtung des Spalten-Headers: Left, Center, Right. |
| **Content align** | Ausrichtung der Zellenwerte: Left, Center, Right. |
| **Format** | Wie der Wert angezeigt wird: **Text** (einfach), **Number** (mit Dezimalstellen), **Datetime** (Datum/Uhrzeit-Formatierung), **Image** (rendert eine URL als Bild), **IP address** (behandelt den Wert als IPv4-Adresse für korrekte numerische Sortierung). |
| **Decimals** | *(Nur Number-Format)* Anzahl der Dezimalstellen. |
| **Datetime format** | *(Nur Datetime-Format)* **Datetime** (Datum und Uhrzeit), **Date** (nur Datum), **Time** (nur Uhrzeit), **Custom format** (eigenes Muster eingeben). |
| **Custom format** | *(Nur Custom Datetime)* Formatmuster — siehe Token-Tabelle unten. |
| **Sortable** | Fügt dem Spalten-Header einen Sortier-Pfeil hinzu, auf den Benutzer klicken können. |
| **Enable filter** | Fügt dem Spalten-Header ein Filter-Icon hinzu. Ein Klick öffnet eine Checkliste zum Ein-/Ausblenden von Zeilen nach Wert. |

#### Tokens für benutzerdefinierte Datetime-Formate

| Token | Bedeutung | Beispiel |
|-------|-----------|---------|
| `YYYY` | 4-stelliges Jahr | `2025` |
| `YY` | 2-stelliges Jahr | `25` |
| `MM` | Monat (mit führender Null) | `07` |
| `M` | Monat (ohne führende Null) | `7` |
| `DD` | Tag (mit führender Null) | `04` |
| `D` | Tag (ohne führende Null) | `4` |
| `hh` | Stunden (mit führender Null) | `09` |
| `h` | Stunden (ohne führende Null) | `9` |
| `mm` | Minuten (mit führender Null) | `05` |
| `ss` | Sekunden (mit führender Null) | `00` |
| `sss` | Millisekunden | `123` |

Beispiel: `DD.MM.YYYY hh:mm` → `04.07.2025 09:05`

---

### Zeilenfarbkonditionen

Du kannst die Hintergrundfarbe einer Zeile automatisch je nach dem Wert einer bestimmten Zelle ändern. Das ist ideal, um kritische oder auffällige Zeilen hervorzuheben.

| Einstellung | Beschreibung |
|-------------|--------------|
| **Number of conditions** | Anzahl der Farbregeln, die hinzugefügt werden sollen. |
| **Column key or index** | Der JSON-Schlüsselname oder ein (0-basierter) Spaltenindex zur Auswertung. |
| **Value** | Der Wert, gegen den verglichen wird. |
| **Row color** | Die Hintergrundfarbe für übereinstimmende Zeilen. |

Die erste zutreffende Bedingung gewinnt. Alle anderen Zeilenfarben (ungerade/gerade im Wechsel) werden von einer zutreffenden Bedingung überschrieben.

---

### inventwo — Table

| Einstellung | Beschreibung |
|-------------|--------------|
| **Background header** | Hintergrundfarbe der Kopfzeile. |
| **Background odd row** | Hintergrundfarbe ungerader Zeilen (1., 3., ...). |
| **Background even row** | Hintergrundfarbe gerader Zeilen (2., 4., ...). |
| **Header height** | Höhe der Kopfzeile in Pixeln. |
| **Column height** | Höhe jeder Datenzeile in Pixeln. |
| **Thickness header** | Dicke des unteren Rahmens der Kopfzeile. |
| **Color header** | Farbe des unteren Rahmens der Kopfzeile. |
| **Thickness** | Dicke des unteren Rahmens jeder Datenzeile. |
| **Color** | Farbe des unteren Rahmens der Datenzeilen. |

---

### inventwo — Border radius

Rundet die Ecken des Tabellen-Containers ab. Kann für oben links, oben rechts, unten rechts und unten links individuell eingestellt werden. Mit **From widget** von einem anderen Table Widget kopieren.

---

### inventwo — Border

Fügt einen äußeren Rahmen um den Tabellen-Container hinzu. Rahmenstil (solid, dashed, dotted usw.), Größe pro Seite und Farbe einstellen. Mit **From widget** von einem anderen Table Widget kopieren.

---

### inventwo — Outer shadow

Fügt einen Schlagschatten um den Tabellen-Container hinzu. X-Offset, Y-Offset, Unschärfe, Größe und Farbe einstellen. Mit **From widget** von einem anderen Table Widget kopieren.

---

## Tipps

- **Mit automatischen Spalten beginnen:** Lass **Count columns** zunächst auf 0, um die Rohdaten zu sehen. Erhöhe dann den Wert, um Titel, Reihenfolge und Formatierung zu steuern.
- **Temperatur mit Einheit:** Setze **Format** auf **Number**, **Decimals** auf 1 und **Suffix** auf ` °C` — die Zelle zeigt dann `21.3 °C` an.
- **Bildspalte:** Wenn eine JSON-Eigenschaft eine URL zu einem Bild enthält, setze **Format** auf **Image**, und die Zelle rendert das Bild direkt.
- **Standardsortierung:** Trage den JSON-Schlüssel in **Default sort column** ein (z. B. `temp`), um die Tabelle beim Laden der Ansicht vorzusortieren.

---

## Siehe auch

- [Dropdown Widget](dropdown-widget.md) — zum Auswählen aus einer Liste vordefinierter Werte
- [Value List Widget](value-list-widget.md) — für einfache Aufzählungslisten aus Textwerten
