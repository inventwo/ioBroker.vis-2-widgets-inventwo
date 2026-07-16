> 🌐 [English](../../en/widgets/table-widget.md) | **Deutsch**

# Table Widget

Das Table Widget zeigt Daten aus einem ioBroker-Datenpunkt als formatierte Tabelle an. Der Datenpunkt muss ein **JSON-Array** enthalten — eine Liste von Objekten, bei der jedes Objekt eine Zeile darstellt. Das ist ideal zum Anzeigen von Sensor-Messwerten, Gerätlisten, Protokollen oder strukturierten Daten, die ein Adapter als JSON schreibt.

![Table Widget](../../en/img/widget-table.png)

---

## Widget hinzufügen

1. Ziehe **Table** aus der Widget-Liste **inventwo design** auf deine Ansicht.
2. Klicke auf **Objekt-ID** und wähle einen Datenpunkt aus, der ein JSON-Array enthält (siehe den Abschnitt zum Datenformat weiter unten).
3. Die Tabelle wird automatisch mit einer Spalte pro JSON-Schlüssel gerendert.
4. Um Spalten anzupassen (Titel, Breiten, Formatierung), erhöhe **Spalten zählen** und konfiguriere jede Spalte.

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
| **Objekt-ID** | Der Datenpunkt, der das JSON-Array enthält. |
| **Spalten zählen** | Anzahl der manuell konfigurierten Spalten. Bei **0** werden Spalten automatisch erzeugt (alle Schlüssel in der Reihenfolge, in der sie im JSON erscheinen). Erhöhe diesen Wert, um jede Spalte individuell zu konfigurieren. |
| **Max. Zeilen** | Maximale Anzahl der anzuzeigenden Zeilen. Bei **0** werden alle Zeilen angezeigt. |
| **Kopf anzeigen** | Zeigt oder versteckt die Kopfzeile mit den Spaltentiteln. |
| **Paginierung** | Bei Aktivierung werden die Zeilen auf Seiten aufgeteilt, mit Navigation am unteren Rand der Tabelle, anstatt alle Zeilen auf einmal anzuzeigen. |
| **Zeilen pro Seite** | *(Nur bei Paginierung)* Anzahl der pro Seite angezeigten Zeilen. |
| **Klebriger Header** | Bei Aktivierung bleibt die Kopfzeile beim Durchscrollen vieler Zeilen sichtbar. |
| **Summenzeile** | Bei Aktivierung wird unterhalb der vorletzten Zeile eine doppelte Trennlinie gezeichnet, die die letzte Zeile optisch als Summen- oder Ergebniszeile hervorhebt. |

---

### Sorting (Sortierung)

| Einstellung | Beschreibung |
|-------------|--------------|
| **Standard-Sortierspalte** | Der Spalten-Schlüssel, nach dem beim ersten Laden der Tabelle sortiert wird. |
| **Standard-Sortierreihenfolge** | **Ascending** (aufsteigend) oder **Descending** (absteigend). |
| **Mehrspaltensortierung** | Ermöglicht das Sortieren nach mehreren Spalten gleichzeitig. Klicke auf einen Spalten-Header, um ihn zur Sortierreihenfolge hinzuzufügen. Nochmals klicken kehrt die Richtung um. Ein dritter Klick entfernt die Spalte aus der Sortierung. Das Zahlen-Badge auf dem Header zeigt die Sortierpriorität. |
| **Anzahl Standardsortierungen** | *(Nur Multi-Sort)* Anzahl der Standard-Sortierspalten, die konfiguriert werden sollen. |

Benutzer können zur Laufzeit auf Spalten-Header klicken, um die Sortierreihenfolge zu ändern (wenn **Sortierbar** für diese Spalte aktiviert ist).

---

### Spalteneinstellungen (pro Spalte)

Wenn **Spalten zählen** größer als 0 ist, hat jede Spalte folgende Einstellungen:

| Einstellung | Beschreibung |
|-------------|--------------|
| **Spalte ausblenden** | Versteckt diese Spalte in der Tabelle, ohne ihre Konfiguration zu entfernen. |
| **Schlüssel** | Der JSON-Eigenschaftsname, der in dieser Spalte angezeigt wird, z. B. `temp`. Wenn leer, verwendet die Spalte den Schlüssel an dieser Position im JSON. |
| **Formel** | Optionaler Rechenausdruck, der aus den JSON-Feldern der Zeile berechnet wird. Wenn gesetzt, ersetzt das Ergebnis den rohen Wert des Schlüssels. JSON-Schlüssel werden direkt als Variablen verwendet, z. B. `preis * menge` oder `wert * 100`. Unterstützte Operatoren: `+` `-` `*` `/` `%` `**` und Klammern `()`. Das Ergebnis wird anschließend durch die **Format**-Einstellung weiterverarbeitet (z. B. als Zahl gerundet). |
| **Titel** | Beschriftung des Spalten-Headers. Wenn leer, wird der JSON-Schlüsselname verwendet. |
| **Breite** | Feste Spaltenbreite in Pixeln (0 = automatisch). |
| **Präfix** | Text, der vor dem Zellenwert hinzugefügt wird, z. B. `~`. |
| **Suffix** | Text, der nach dem Zellenwert hinzugefügt wird, z. B. ` °C`. |
| **Platzhalter** | Text, der angezeigt wird, wenn der Zellenwert leer oder null ist. |
| **Titel ausrichten** | Ausrichtung des Spalten-Headers: Left, Center, Right. |
| **Inhalt ausrichten** | Ausrichtung der Zellenwerte: Left, Center, Right. |
| **Format** | Wie der Wert angezeigt wird: **Text** (einfach), **Number** (mit Dezimalstellen), **Boolean** (zeigt eine schreibgeschützte Checkbox an), **Datetime** (Datum/Uhrzeit-Formatierung), **Image** (rendert eine URL als Bild), **URL** (rendert den Wert als anklickbaren Link), **IP-Adresse** (behandelt den Wert als IPv4-Adresse für korrekte numerische Sortierung). |
| **Link-Ziel** | *(Nur URL-Format)* Wo der Link geöffnet wird: **Neues Tab** (`_blank`), **Gleiches Tab** (`_self`), **Übergeordnetes Frame** (`_parent`), **Oberstes Frame** (`_top`). |
| **Dezimalstellen** | *(Nur Number-Format)* Anzahl der Dezimalstellen. |
| **Dezimaltrennzeichen** | *(Nur Number-Format)* Zeichen für die Dezimaltrennung, z. B. `.` oder `,`. Leer lassen für den Browser-Standard. |
| **Tausendertrennzeichen** | *(Nur Number-Format)* Zeichen für die Tausendertrennung, z. B. `,` oder `.`. Leer lassen für kein Trennzeichen. |
| **Farbe (aktiviert)** | *(Nur Boolean-Format)* Farbe der Checkbox, wenn der Wert wahr ist. |
| **Farbe (deaktiviert)** | *(Nur Boolean-Format)* Farbe der Checkbox, wenn der Wert falsch ist. |
| **Datum/Uhrzeit Format** | *(Nur Datetime-Format)* **Datetime** (Datum und Uhrzeit), **Date** (nur Datum), **Time** (nur Uhrzeit), **Custom format** (eigenes Muster eingeben). |
| **Benutzerdefiniertes Format** | *(Nur Custom Datetime)* Formatmuster — siehe Token-Tabelle unten. |
| **Sortierbar** | Fügt dem Spalten-Header einen Sortier-Pfeil hinzu, auf den Benutzer klicken können. |
| **Filter aktivieren** | Fügt dem Spalten-Header ein Filter-Icon hinzu. Ein Klick öffnet eine Checkliste zum Ein-/Ausblenden von Zeilen nach Wert. |

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
| `WD` | Wochentag kurz | `Mo` |
| `WDL` | Wochentag ausgeschrieben | `Montag` |
| `KW` | Kalenderwoche (mit führender Null) | `27` |
| `K` | Kalenderwoche (ohne führende Null) | `27` |

Beispiel: `DD.MM.YYYY hh:mm` → `04.07.2025 09:05`
Beispiel: `WDL, YYYY (KW/52)` → `Freitag, 2025 (27/52)`

---

### Zeilenfarbkonditionen

Du kannst die Hintergrundfarbe einer Zeile automatisch je nach dem Wert einer bestimmten Zelle ändern. Das ist ideal, um kritische oder auffällige Zeilen hervorzuheben.

| Einstellung | Beschreibung |
|-------------|--------------|
| **Anzahl der Bedingungen** | Anzahl der Farbregeln, die hinzugefügt werden sollen. |
| **Spaltenschlüssel oder Index** | Der JSON-Schlüsselname oder ein (0-basierter) Spaltenindex zur Auswertung. |
| **Vergleichsoperator** | Art des Vergleichs: **Gleich**, **Nicht gleich**, **Größer**, **Untere**, **Größer gleich**, **Untere gleich**. |
| **Wert** | Der Wert, gegen den verglichen wird. |
| **Zeilenfarbe** | Hintergrundfarbe, die auf die gesamte übereinstimmende Zeile angewendet wird. |
| **Wertfarbe (ganze Zeile)** | Textfarbe, die auf alle Zellen der übereinstimmenden Zeile angewendet wird. |
| **Wertfarbe (nur Spalte)** | Textfarbe, die nur auf die Zelle in der Bedingungsspalte angewendet wird. |

Die erste zutreffende Bedingung gewinnt. Alle anderen Zeilenfarben (ungerade/gerade im Wechsel) werden von einer zutreffenden Bedingung überschrieben.

---

### inventwo - Table

| Einstellung | Beschreibung |
|-------------|--------------|
| **Hintergrundkopfzeile** | Hintergrundfarbe der Kopfzeile. |
| **Hintergrund ungerade Zeile** | Hintergrundfarbe ungerader Zeilen (1., 3., ...). |
| **Hintergrund gerade Zeile** | Hintergrundfarbe gerader Zeilen (2., 4., ...). |
| **Headerhöhe** | Höhe der Kopfzeile in Pixeln. |
| **Säulenhöhe** | Höhe jeder Datenzeile in Pixeln. |
| **Höhe Paginierung** | *(Nur bei Paginierung)* Höhe der Paginierungsleiste in Pixeln. |
| **Dicke Kopfzeile** | Dicke des unteren Rahmens der Kopfzeile. |
| **Farbe Kopfzeile** | Farbe des unteren Rahmens der Kopfzeile. |
| **Dicke** | Dicke des unteren Rahmens jeder Datenzeile. |
| **Farbe** | Farbe des unteren Rahmens der Datenzeilen. |

---

### inventwo - Rahmenradius

Rundet die Ecken des Tabellen-Containers ab. Kann für oben links, oben rechts, unten rechts und unten links individuell eingestellt werden. Mit **Vom Widget** von einem anderen Table Widget kopieren.

---

### inventwo - Rahmen

Fügt einen äußeren Rahmen um den Tabellen-Container hinzu. Rahmenstil (solid, dashed, dotted usw.), Größe pro Seite und Farbe einstellen. Mit **Vom Widget** von einem anderen Table Widget kopieren.

---

### inventwo - Äußerer Schatten

Fügt einen Schlagschatten um den Tabellen-Container hinzu. X-Offset, Y-Offset, Unschärfe, Größe und Farbe einstellen. Mit **Vom Widget** von einem anderen Table Widget kopieren.

---

## Tipps

- **Mit automatischen Spalten beginnen:** Lass **Spalten zählen** zunächst auf 0, um die Rohdaten zu sehen. Erhöhe dann den Wert, um Titel, Reihenfolge und Formatierung zu steuern.
- **Temperatur mit Einheit:** Setze **Format** auf **Number**, **Dezimalstellen** auf 1 und **Suffix** auf ` °C` — die Zelle zeigt dann `21.3 °C` an.
- **Bildspalte:** Wenn eine JSON-Eigenschaft eine URL zu einem Bild enthält, setze **Format** auf **Image**, und die Zelle rendert das Bild direkt.
- **Linkspalte:** Wenn eine JSON-Eigenschaft eine URL enthält, setze **Format** auf **URL**, um einen anklickbaren Link anzuzeigen. Mit **Link-Ziel** steuerst du, ob der Link in einem neuen oder dem gleichen Tab öffnet.
- **Summenzeile:** Lege deine Gesamtwerte als letzte Zeile im JSON-Array ab und aktiviere **Summenzeile**, um sie mit einer doppelten Linie abzutrennen.
- **Große Datenmengen:** Aktiviere **Paginierung** und stelle **Zeilen pro Seite** ein, damit große Tabellen übersichtlich bleiben, statt durch Hunderte von Zeilen zu scrollen. **Max. Zeilen** wirkt weiterhin als übergeordnete Obergrenze vor der Seitenaufteilung.
- **Standardsortierung:** Trage den JSON-Schlüssel in **Standard-Sortierspalte** ein (z. B. `temp`), um die Tabelle beim Laden der Ansicht vorzusortieren.

---

## Siehe auch

- [Dropdown Widget](dropdown-widget.md) — zum Auswählen aus einer Liste vordefinierter Werte
- [Value List Widget](value-list-widget.md) — für einfache Aufzählungslisten aus Textwerten
