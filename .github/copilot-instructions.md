# Copilot Instructions – ioBroker vis-2-widgets-inventwo

## Übersetzungen
- Übersetzungen **nur für Deutsch (`de.json`) und Englisch (`en.json`)** anlegen. Der Rest wird automatisch erstellt (z. B. via `translate-adapter`).
- Alle Übersetzungsschlüssel liegen in `src-widgets/src/i18n/`.
- Der globale Präfix ist `vis_2_widgets_inventwo_` – wird in `getI18nPrefix()` und in `translations.ts` definiert.
- In `visAttrs`-Feldern wird bei `label`, `tooltip` und `text` (help) immer nur der **Schlüssel ohne Präfix** angegeben, z. B. `label: 'read_only'`. Das Framework fügt den Präfix automatisch hinzu.
- Bei `type: 'help'`-Feldern wird der vollständige Schlüssel mit Präfix angegeben, z. B. `text: 'vis_2_widgets_inventwo_steps'`.

---

## Projektstruktur
```
src-widgets/src/          ← TypeScript/React-Quellcode
  InventwoGeneric.tsx      ← Basisklasse für alle Widgets
  Inventwo*.tsx            ← Einzelne Widgets
  translations.ts          ← Sprachbindung (importiert alle i18n/*.json)
  i18n/                    ← Übersetzungsdateien
  types/                   ← Gemeinsame TypeScript-Typen

src-widgets/build/        ← Build-Output (nicht bearbeiten)
widgets/                  ← Kopierte Build-Artefakte für ioBroker (nicht bearbeiten)
io-package.json           ← Adapter-Konfiguration (Widgets registrieren hier)
tasks.js                  ← Build-Skript (clean → npm install → vite build → copy)
```

---

## Widget-Klassen

### Basisklasse `InventwoGeneric`
Alle Widgets erben von `InventwoGeneric<RxData, State>`, welches seinerseits von `VisRxWidget` erbt.

```typescript
export default class InventwoWidgetFoo extends InventwoGeneric<FooRxData, FooState> {}
```

### Pflichtmethoden
| Methode | Zweck |
|---|---|
| `static getWidgetInfo(): RxWidgetInfo` | Widget-Definition (ID, Felder, Vorschau) |
| `getWidgetInfo(): RxWidgetInfo` | Instanz-Wrapper – **niemals löschen**, wird von vis gelesen |
| `renderWidgetBody(props): JSX.Element` | Haupt-Render-Methode |
| `static getI18nPrefix(): string` | Gibt `'vis_2_widgets_inventwo_'` zurück |

### Optionale Lifecycle-Methoden
| Methode | Zweck |
|---|---|
| `componentDidMount()` | Initialisierung – immer `super.componentDidMount()` aufrufen |
| `onStateUpdated(id, state)` | Wird bei OID-Wertänderungen aufgerufen |

### Hilfsmethoden in `InventwoGeneric`
| Methode | Zweck |
|---|---|
| `getValue(oid)` | Aktuellen Wert einer OID lesen |
| `onChange(e, value)` | Wert einer OID schreiben (prüft `editMode` automatisch) |
| `getStyle(widgetFieldName, attrList, index?)` | Attributwerte aus einem Referenz-Widget lesen ("From Widget"-Muster) |
| `validOid(oid)` | Prüft ob eine OID gesetzt und gültig ist |
| `valWithUnit(value)` | Fügt `px` hinzu, wenn Wert eine Zahl ist |
| `isInteractionAllowed(e)` | Prüft ob Interaktion erlaubt (kein Edit-Modus, kein readonly) |

---

## Widget-Definition (`getWidgetInfo`)

```typescript
static getWidgetInfo(): RxWidgetInfo {
    return {
        id: 'tplInventwoWidgetFoo',          // Eindeutige ID, immer mit tplInventwo... beginnen
        visSet: 'vis-2-widgets-inventwo',    // Fixture – immer gleich
        visWidgetLabel: 'widget_foo',        // i18n-Schlüssel ohne Präfix
        visName: 'widget_foo',              // i18n-Schlüssel ohne Präfix
        visAttrs: [ /* Attributgruppen */ ],
        visDefaultStyle: { width: 150, height: 40 },
        visPrev: 'widgets/vis-2-widgets-inventwo/img/vorschau.png',
    };
}
```

### Attribut-Feldtypen (`visAttrs`)
| `type` | Beschreibung |
|---|---|
| `'id'` | ioBroker Object-ID Auswahl |
| `'text'` / `'html'` | Texteingabe |
| `'number'` | Zahleneingabe |
| `'checkbox'` | Boolean |
| `'color'` | Farbwähler – akzeptiert auch Gradient-Strings wie `linear-gradient(...)` |
| `'select'` | Dropdown mit `options: [{value, label}]` |
| `'slider'` | Schieberegler mit `min`, `max`, `step` |
| `'widget'` | Referenz auf ein anderes Widget ("From Widget") |
| `'delimiter'` | Trennlinie |
| `'help'` | Hilfetext (benötigt vollen i18n-Schlüssel inkl. Präfix) |

### `hidden`-Bedingungen
- Wird als **JavaScript-Ausdruck als String** angegeben, der `data.*` referenziert.
- Beispiel: `hidden: '!data.showSteps'` oder `hidden: '!!data.sliderTrackFromWidget'`

---

## Styling mit MUI

- Widgets verwenden **MUI v6** (`@mui/material`).
- Styling über den `sx`-Prop mit dem Typ `SxProps`.
- MUI-interne Klassen werden mit CSS-Selektoren überschrieben, z. B. `'& .MuiSlider-thumb': { ... }`.
- **Wichtig:** Für Farbverläufe (Gradient-Strings) immer `background` statt `backgroundColor` verwenden, da `backgroundColor` keine Gradient-Strings (`linear-gradient(...)`) unterstützt.
- Farbwerte aus den Widget-Einstellungen können direkt Gradient-Strings enthalten – diese werden dann unverändert an `background` übergeben.

```typescript
// Korrekt – unterstützt einfache Farben UND Gradient-Strings
'& .MuiSlider-rail': {
    background: railColor,  // kann z.B. 'repeating-linear-gradient(...)' sein
}
```

---

## Edit-Modus

- Im Edit-Modus (`this.props.editMode === true`) dürfen **keine Werte geschrieben** werden.
- `onChange()` in `InventwoGeneric` prüft das automatisch.
- MUI-Komponenten wie `<Slider>` bekommen `disabled={this.props.editMode}`.
- Für Read-Only im Live-Betrieb: Wrapper-`<div>` mit `pointerEvents: 'none'`, **nicht** den `disabled`-Prop nutzen (würde das Widget grau färben).

---

## Zustandsverwaltung

- `this.state.rxData` – Alle konfigurierten Widget-Attribute (typisiert über das `RxData`-Interface).
- `this.state.rxStyle` – CSS-Stile aus dem vis-Editor (z. B. `font-size`, `color`).
- `this.state.values[`${oid}.val`]` – Aktuelle OID-Werte (über `getValue(oid)` abrufen).
- Eigene Zustände (z. B. `sliderValue`) im Widget-State speichern und im `RxData`-Interface definieren.

---

## "From Widget"-Muster

Erlaubt, Styling-Attribute von einem anderen Widget zu erben:

1. Feld mit `type: 'widget'` und `name: 'xyzFromWidget'` definieren (Name muss auf `FromWidget` enden).
2. Im Konstruktor werden alle Felder der Gruppe automatisch in `this.groupAttrs` gesammelt (außer `FromWidget`-Felder selbst).
3. Mit `this.getStyle('xyzFromWidget', this.groupAttrs.attr_group_name)` die Werte abrufen.

---

## Neues Widget hinzufügen – Checkliste

1. **Neue Datei** `src-widgets/src/InventwoWidgetFoo.tsx` anlegen (von `InventwoGeneric` erben).
2. **`vite.config.ts`** – Widget in `exposes` eintragen:
   ```typescript
   './InventwoWidgetFoo': './src/InventwoWidgetFoo',
   ```
3. **`io-package.json`** – Widget in `visWidgets.vis2Inventwo.components` eintragen:
   ```json
   "InventwoWidgetFoo"
   ```
4. **Übersetzungsschlüssel** in `de.json` und `en.json` ergänzen.
5. **`translations.ts`** – muss nicht geändert werden, importiert alle JSON-Dateien automatisch.

---

## Build-Prozess

```bash
# Im Verzeichnis src-widgets/
npm run build    # TypeScript kompilieren + Vite Build

# Im Root-Verzeichnis
node tasks.js    # Clean + Build + Dateien nach /widgets/ kopieren
```

- Build-Output landet in `src-widgets/build/`.
- `tasks.js` kopiert automatisch `customWidgets.js` und `assets/` nach `widgets/vis-2-widgets-inventwo/`.
- Das `widgets/`-Verzeichnis wird von ioBroker vis-2 geladen.
- Nach dem Build muss vis-2 **neu gestartet** werden, damit Änderungen wirksam werden.

---

## Wichtige Hinweise

- `getWidgetInfo()` als **Instanzmethode** darf **niemals gelöscht** werden (wird von vis zur Laufzeit aufgerufen).
- Die `id` in `getWidgetInfo()` muss **global eindeutig** sein und mit `tplInventwo` beginnen.
- `visSet` ist immer `'vis-2-widgets-inventwo'` – nicht ändern.
- `renderWidgetBody()` muss immer `super.renderWidgetBody(props)` am Anfang aufrufen.
- `componentDidMount()` muss immer `super.componentDidMount()` aufrufen.
- Farbfelder (`type: 'color'`) können beliebige CSS-Farbstrings enthalten, also auch Gradient-Funktionen – diese müssen dann mit der CSS-Eigenschaft `background` (nicht `backgroundColor`) angewendet werden.
- Der Translator-Befehl (`npm run translate`) übersetzt automatisch alle Sprachen außer `de` und `en` – deshalb nur diese beiden manuell pflegen.
