# Universal Widget – Designvorschläge

Hier sind 15 verschiedene Designvorschläge für das **Universal Widget** (Typ: `switch`, Modus: `singleButton`).  
Die JSONs können direkt in ioBroker vis-2 über den Import-Dialog eingefügt werden.

---

## Übersicht

![Preview Designs](../img/preview_univseral_design_examples.png)

| # | Design | Hintergrund | Rahmen | Ecken | Schatten | Stil |
|---|---|---|---|---|---|---|
| 1 | **Modern Minimal** | Weiß | Unten 3 px, Indigo | 10 px, gleich | Subtil | Flach, klar |
| 2 | **Cyberpunk Neon** | Fast Schwarz | 1 px, Cyan | Eckig, 0 px | Neon-Glow | Futuristisch |
| 3 | **Retro Classic** | Beige/Tan | 3 px, Dunkelbraun | 2 px | Hart-Offset | Nostalgisch |
| 4 | **Abstract Gradient** | Magenta→Violett→Cyan | Keiner | Diagonal | Farbiger Soft | Künstlerisch |
| 5 | **Neumorphism** | Hellgrau | Keiner | 16 px, gleich | Dunkel + Hell | Soft, taktil |
| 6 | **Dark Material** | Dunkel-Blaugrau | Links 3 px, Teal | 8 px, gleich | Elevation | VS-Code-Stil |
| 7 | **Glassmorphism** | Weiß 15 % Opazität | 1 px, Weiß 30 % | 14 px, gleich | Frost | Transparent |
| 8 | **Military Tactical** | Olivgrün | 2 px, Khaki | 0 px, scharf | Hart-Offset | Funktional |
| 9 | **Bubblegum / Candy** | Hot Pink | Keiner | 55 px, Pill | Pink-Glow | Verspielt |
| 10 | **Terminal / Matrix** | Schwarz | 1 px, Grün gestrichelt | 0 px | Grün-Glow | Hacker |
| 11 | **Corporate Blue** | Navy | Keiner | 6 px | Subtil | Professionell |
| 12 | **Sunset Warm** | Orange→Pink→Gelb | Keiner | 18 px | Warm-Glow | Warm, lebendig |
| 13 | **Dark Luxury Gold** | Fast Schwarz (warm) | 1 px, Gold | 4 px | Gold-Schimmer | Edel, elegant |
| 14 | **Ice / Arctic** | Eisblau | 1 px, Hellblau | 12 px | Kühl, hauchzart | Frisch, klar |
| 15 | **Brutalist** | Signalgelb | 4 px, Schwarz | 0 px | Hart, Schwarz | Krass, raw |

---

## Design 1 – Modern Minimal

**Konzept:** Klarer, aufgeräumter Look mit weißem Hintergrund und einem Indigo-Akzent als unterer Randlinie. Runde Ecken, kein Schnickschnack.

<details>
<summary>📋 JSON anzeigen / kopieren</summary>

```json
[
  {
    "tpl": "tplInventwoWidgetUniversal",
    "data": {
      "bindings": [],
      "type": "switch",
      "g_common": true,
      "mode": "singleButton",
      "direction": "row",
      "oid": "nothing_selected",
      "httpType": "send",
      "buttonSize": 110,
      "btnSpacing": 10,
      "countStates": 1,
      "buttonHoldValue": false,
      "feedbackDuration": 600,
      "g_attr_group_click_feedback": true,
      "backgroundFeedback": "rgba(238, 242, 255, 1)",
      "outerShadowColorFeedback": "rgba(79, 70, 229, 0.3)",
      "contentBlinkInterval": 0,
      "g_attr_group_state_default": true,
      "colorPickerColorModel": "hex",
      "g_attr_content_color_picker": true,
      "colorPickerWidth": 200,
      "colorPickerHandleSize": 8,
      "colorPickerHandleMargin": 6,
      "colorPickerComponentsSpace": 12,
      "colorPickerDirection": "vertical",
      "colorPickerBorderWidth": 0,
      "colorPickerShowWheel": true,
      "colorPickerShowSaturation": true,
      "colorPickerShowValue": true,
      "textDecoration": "none",
      "g_attr_group_css_text": true,
      "textMarginTop": 0,
      "textMarginBottom": 0,
      "textMarginLeft": 5,
      "textMarginRight": 0,
      "contentType": "icon",
      "g_attr_group_css_content": true,
      "contentMarginTop": 20,
      "contentMarginBottom": 0,
      "contentMarginLeft": 0,
      "contentMarginRight": 0,
      "contentSize": 29,
      "contentRotation": 0,
      "contentMirror": false,
      "flexDirection": "column",
      "g_attr_group_css_alignment": true,
      "alignItems": "space-between",
      "textAlign": "start",
      "contentAlign": "center",
      "backgroundOpacity": 1,
      "g_attr_group_css_transparency": true,
      "contentOpacity": 1,
      "paddingLeft": 5,
      "g_attr_group_css_spacing": true,
      "paddingRight": 10,
      "paddingTop": 9,
      "paddingBottom": 11,
      "borderRadiusTopLeft": 10,
      "g_attr_group_css_border_radius": true,
      "borderRadiusTopRight": 10,
      "borderRadiusBottomRight": 10,
      "borderRadiusBottomLeft": 10,
      "borderSizeTop": 0,
      "g_attr_group_css_border": true,
      "borderSizeBottom": 3,
      "borderSizeLeft": 0,
      "borderSizeRight": 0,
      "borderStyle": "solid",
      "outerShadowX": 0,
      "g_attr_group_css_outer_shadow": true,
      "outerShadowY": 2,
      "outerShadowBlur": 8,
      "outerShadowSize": 0,
      "outerShadowColor": "rgba(79, 70, 229, 0.15)",
      "innerShadowX": 0,
      "g_attr_group_css_inner_shadow": true,
      "innerShadowY": 0,
      "innerShadowBlur": 0,
      "innerShadowSize": 0,
      "innerShadowColor": "rgba(0,0,0,0)",
      "background": "rgba(255, 255, 255, 1)",
      "text": "Hallo",
      "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMiA2YzAtMS4xLS45LTItMi0ySDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNnptLTIgMGwtOCA1bC04LTVoMTZ6bTAgMTJINFY4bDggNWw4LTV2MTB6Ii8+PC9zdmc+",
      "invertOrder": false,
      "innerShadowColor": "rgba(0,0,0,0)",
      "borderColor": "rgba(79, 70, 229, 1)",
      "textColor": "rgba(30, 30, 30, 1)",
      "contentColor": "rgba(79, 70, 229, 1)",
      "compareBy1": "default",
      "oid1": null,
      "comparisonOperator1": "===",
      "value1": null,
      "background1": "rgba(238, 242, 255, 1)",
      "backgroundTrue1": "rgba(238, 242, 255, 1)",
      "outerShadowColor1": "rgba(79, 70, 229, 0.3)",
      "outerShadowColorTrue1": "rgba(79, 70, 229, 0.3)",
      "g_countStates-1": true
    },
    "style": {
      "bindings": [],
      "left": 614,
      "top": 184,
      "width": 110,
      "height": 110,
      "position": "absolute",
      "overflow": "visible"
    },
    "widgetSet": "vis-2-widgets-inventwo",
    "_id": "i000001"
  }
]
```

</details>

---

## Design 2 – Cyberpunk Neon

**Konzept:** Dunkler, fast schwarzer Hintergrund mit leuchtendem Cyan-Neon. Scharfe, eckige Kanten (kein Border-Radius). Glühender Außenschatten simuliert den Neon-Effekt. Wirkung: futuristisch, digital, dystopisch.

<details>
<summary>📋 JSON anzeigen / kopieren</summary>

```json
[
  {
    "tpl": "tplInventwoWidgetUniversal",
    "data": {
      "bindings": [],
      "type": "switch",
      "g_common": true,
      "mode": "singleButton",
      "direction": "row",
      "oid": "nothing_selected",
      "httpType": "send",
      "buttonSize": 110,
      "btnSpacing": 10,
      "countStates": 1,
      "buttonHoldValue": false,
      "feedbackDuration": 600,
      "g_attr_group_click_feedback": true,
      "backgroundFeedback": "rgba(0, 40, 30, 1)",
      "outerShadowColorFeedback": "rgba(0, 255, 200, 1)",
      "contentBlinkInterval": 0,
      "g_attr_group_state_default": true,
      "colorPickerColorModel": "hex",
      "g_attr_content_color_picker": true,
      "colorPickerWidth": 200,
      "colorPickerHandleSize": 8,
      "colorPickerHandleMargin": 6,
      "colorPickerComponentsSpace": 12,
      "colorPickerDirection": "vertical",
      "colorPickerBorderWidth": 0,
      "colorPickerShowWheel": true,
      "colorPickerShowSaturation": true,
      "colorPickerShowValue": true,
      "textDecoration": "none",
      "g_attr_group_css_text": true,
      "textMarginTop": 0,
      "textMarginBottom": 0,
      "textMarginLeft": 5,
      "textMarginRight": 0,
      "contentType": "icon",
      "g_attr_group_css_content": true,
      "contentMarginTop": 20,
      "contentMarginBottom": 0,
      "contentMarginLeft": 0,
      "contentMarginRight": 0,
      "contentSize": 29,
      "contentRotation": 0,
      "contentMirror": false,
      "flexDirection": "column",
      "g_attr_group_css_alignment": true,
      "alignItems": "space-between",
      "textAlign": "start",
      "contentAlign": "center",
      "backgroundOpacity": 1,
      "g_attr_group_css_transparency": true,
      "contentOpacity": 1,
      "paddingLeft": 5,
      "g_attr_group_css_spacing": true,
      "paddingRight": 10,
      "paddingTop": 9,
      "paddingBottom": 11,
      "borderRadiusTopLeft": 0,
      "g_attr_group_css_border_radius": true,
      "borderRadiusTopRight": 0,
      "borderRadiusBottomRight": 0,
      "borderRadiusBottomLeft": 0,
      "borderSizeTop": 1,
      "g_attr_group_css_border": true,
      "borderSizeBottom": 1,
      "borderSizeLeft": 1,
      "borderSizeRight": 1,
      "borderStyle": "solid",
      "outerShadowX": 0,
      "g_attr_group_css_outer_shadow": true,
      "outerShadowY": 0,
      "outerShadowBlur": 20,
      "outerShadowSize": 2,
      "outerShadowColor": "rgba(0, 255, 200, 0.7)",
      "innerShadowX": 0,
      "g_attr_group_css_inner_shadow": true,
      "innerShadowY": 0,
      "innerShadowBlur": 15,
      "innerShadowSize": 0,
      "innerShadowColor": "rgba(0, 255, 200, 0.12)",
      "background": "rgba(8, 8, 20, 1)",
      "text": "Hallo",
      "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMiA2YzAtMS4xLS45LTItMi0ySDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNnptLTIgMGwtOCA1bC04LTVoMTZ6bTAgMTJINFY4bDggNWw4LTV2MTB6Ii8+PC9zdmc+",
      "invertOrder": false,
      "borderColor": "rgba(0, 255, 200, 1)",
      "textColor": "rgba(0, 255, 200, 1)",
      "contentColor": "rgba(0, 255, 200, 1)",
      "compareBy1": "default",
      "oid1": null,
      "comparisonOperator1": "===",
      "value1": null,
      "background1": "rgba(0, 40, 30, 1)",
      "backgroundTrue1": "rgba(0, 40, 30, 1)",
      "outerShadowColor1": "rgba(0, 255, 200, 1)",
      "outerShadowColorTrue1": "rgba(0, 255, 200, 1)",
      "g_countStates-1": true
    },
    "style": {
      "bindings": [],
      "left": 614,
      "top": 184,
      "width": 110,
      "height": 110,
      "position": "absolute",
      "overflow": "visible"
    },
    "widgetSet": "vis-2-widgets-inventwo",
    "_id": "i000001"
  }
]
```

</details>

---

## Design 3 – Retro Classic

**Konzept:** Warme Erdtöne, dicker Rahmen, kaum abgerundete Ecken. Harter Schlagschatten ohne Weichzeichnung (Offset, aber kein Blur) erinnert an gedruckte Knöpfe aus den 80ern. Wirkung: altmodisch, robust, nostalgisch.

<details>
<summary>📋 JSON anzeigen / kopieren</summary>

```json
[
  {
    "tpl": "tplInventwoWidgetUniversal",
    "data": {
      "bindings": [],
      "type": "switch",
      "g_common": true,
      "mode": "singleButton",
      "direction": "row",
      "oid": "nothing_selected",
      "httpType": "send",
      "buttonSize": 110,
      "btnSpacing": 10,
      "countStates": 1,
      "buttonHoldValue": false,
      "feedbackDuration": 600,
      "g_attr_group_click_feedback": true,
      "backgroundFeedback": "rgba(160, 120, 60, 1)",
      "outerShadowColorFeedback": "rgba(60, 30, 0, 0.9)",
      "contentBlinkInterval": 0,
      "g_attr_group_state_default": true,
      "colorPickerColorModel": "hex",
      "g_attr_content_color_picker": true,
      "colorPickerWidth": 200,
      "colorPickerHandleSize": 8,
      "colorPickerHandleMargin": 6,
      "colorPickerComponentsSpace": 12,
      "colorPickerDirection": "vertical",
      "colorPickerBorderWidth": 0,
      "colorPickerShowWheel": true,
      "colorPickerShowSaturation": true,
      "colorPickerShowValue": true,
      "textDecoration": "none",
      "g_attr_group_css_text": true,
      "textMarginTop": 0,
      "textMarginBottom": 0,
      "textMarginLeft": 5,
      "textMarginRight": 0,
      "contentType": "icon",
      "g_attr_group_css_content": true,
      "contentMarginTop": 20,
      "contentMarginBottom": 0,
      "contentMarginLeft": 0,
      "contentMarginRight": 0,
      "contentSize": 29,
      "contentRotation": 0,
      "contentMirror": false,
      "flexDirection": "column",
      "g_attr_group_css_alignment": true,
      "alignItems": "space-between",
      "textAlign": "start",
      "contentAlign": "center",
      "backgroundOpacity": 1,
      "g_attr_group_css_transparency": true,
      "contentOpacity": 1,
      "paddingLeft": 5,
      "g_attr_group_css_spacing": true,
      "paddingRight": 10,
      "paddingTop": 9,
      "paddingBottom": 11,
      "borderRadiusTopLeft": 2,
      "g_attr_group_css_border_radius": true,
      "borderRadiusTopRight": 2,
      "borderRadiusBottomRight": 2,
      "borderRadiusBottomLeft": 2,
      "borderSizeTop": 3,
      "g_attr_group_css_border": true,
      "borderSizeBottom": 3,
      "borderSizeLeft": 3,
      "borderSizeRight": 3,
      "borderStyle": "solid",
      "outerShadowX": 5,
      "g_attr_group_css_outer_shadow": true,
      "outerShadowY": 5,
      "outerShadowBlur": 0,
      "outerShadowSize": 0,
      "outerShadowColor": "rgba(60, 30, 0, 0.85)",
      "innerShadowX": 2,
      "g_attr_group_css_inner_shadow": true,
      "innerShadowY": 2,
      "innerShadowBlur": 4,
      "innerShadowSize": 0,
      "innerShadowColor": "rgba(255, 220, 160, 0.4)",
      "background": "rgba(200, 170, 120, 1)",
      "text": "Hallo",
      "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMiA2YzAtMS4xLS45LTItMi0ySDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNnptLTIgMGwtOCA1bC04LTVoMTZ6bTAgMTJINFY4bDggNWw4LTV2MTB6Ii8+PC9zdmc+",
      "invertOrder": false,
      "borderColor": "rgba(100, 55, 10, 1)",
      "textColor": "rgba(55, 25, 5, 1)",
      "contentColor": "rgba(100, 55, 10, 1)",
      "compareBy1": "default",
      "oid1": null,
      "comparisonOperator1": "===",
      "value1": null,
      "background1": "rgba(160, 120, 60, 1)",
      "backgroundTrue1": "rgba(160, 120, 60, 1)",
      "outerShadowColor1": "rgba(60, 30, 0, 0.9)",
      "outerShadowColorTrue1": "rgba(60, 30, 0, 0.9)",
      "g_countStates-1": true
    },
    "style": {
      "bindings": [],
      "left": 614,
      "top": 184,
      "width": 110,
      "height": 110,
      "position": "absolute",
      "overflow": "visible"
    },
    "widgetSet": "vis-2-widgets-inventwo",
    "_id": "i000001"
  }
]
```

</details>

---

## Design 4 – Abstract Gradient

**Konzept:** Fetter Farbverlauf von Magenta über Violett nach Cyan – diagonal. Organisch-asymmetrische Ecken (diagonal gegenüberliegende Seiten sind groß/klein). Kein Rand, nur der Verlauf selbst wirkt. Wirkung: künstlerisch, lebendig, modern-abstrakt.

<details>
<summary>📋 JSON anzeigen / kopieren</summary>

```json
[
  {
    "tpl": "tplInventwoWidgetUniversal",
    "data": {
      "bindings": [],
      "type": "switch",
      "g_common": true,
      "mode": "singleButton",
      "direction": "row",
      "oid": "nothing_selected",
      "httpType": "send",
      "buttonSize": 110,
      "btnSpacing": 10,
      "countStates": 1,
      "buttonHoldValue": false,
      "feedbackDuration": 600,
      "g_attr_group_click_feedback": true,
      "backgroundFeedback": "linear-gradient(135deg, rgba(200,0,100,1) 0%, rgba(80,0,200,1) 50%, rgba(0,160,200,1) 100%)",
      "outerShadowColorFeedback": "rgba(100, 0, 255, 0.7)",
      "contentBlinkInterval": 0,
      "g_attr_group_state_default": true,
      "colorPickerColorModel": "hex",
      "g_attr_content_color_picker": true,
      "colorPickerWidth": 200,
      "colorPickerHandleSize": 8,
      "colorPickerHandleMargin": 6,
      "colorPickerComponentsSpace": 12,
      "colorPickerDirection": "vertical",
      "colorPickerBorderWidth": 0,
      "colorPickerShowWheel": true,
      "colorPickerShowSaturation": true,
      "colorPickerShowValue": true,
      "textDecoration": "none",
      "g_attr_group_css_text": true,
      "textMarginTop": 0,
      "textMarginBottom": 0,
      "textMarginLeft": 5,
      "textMarginRight": 0,
      "contentType": "icon",
      "g_attr_group_css_content": true,
      "contentMarginTop": 20,
      "contentMarginBottom": 0,
      "contentMarginLeft": 0,
      "contentMarginRight": 0,
      "contentSize": 29,
      "contentRotation": 0,
      "contentMirror": false,
      "flexDirection": "column",
      "g_attr_group_css_alignment": true,
      "alignItems": "space-between",
      "textAlign": "start",
      "contentAlign": "center",
      "backgroundOpacity": 1,
      "g_attr_group_css_transparency": true,
      "contentOpacity": 1,
      "paddingLeft": 5,
      "g_attr_group_css_spacing": true,
      "paddingRight": 10,
      "paddingTop": 9,
      "paddingBottom": 11,
      "borderRadiusTopLeft": 50,
      "g_attr_group_css_border_radius": true,
      "borderRadiusTopRight": 8,
      "borderRadiusBottomRight": 50,
      "borderRadiusBottomLeft": 8,
      "borderSizeTop": 0,
      "g_attr_group_css_border": true,
      "borderSizeBottom": 0,
      "borderSizeLeft": 0,
      "borderSizeRight": 0,
      "borderStyle": "solid",
      "outerShadowX": 4,
      "g_attr_group_css_outer_shadow": true,
      "outerShadowY": 10,
      "outerShadowBlur": 20,
      "outerShadowSize": 0,
      "outerShadowColor": "rgba(100, 0, 255, 0.45)",
      "innerShadowX": 0,
      "g_attr_group_css_inner_shadow": true,
      "innerShadowY": 0,
      "innerShadowBlur": 0,
      "innerShadowSize": 0,
      "innerShadowColor": "rgba(0,0,0,0)",
      "background": "linear-gradient(135deg, rgba(255,0,128,1) 0%, rgba(100,0,255,1) 50%, rgba(0,200,255,1) 100%)",
      "text": "Hallo",
      "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMiA2YzAtMS4xLS45LTItMi0ySDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNnptLTIgMGwtOCA1bC04LTVoMTZ6bTAgMTJINFY4bDggNWw4LTV2MTB6Ii8+PC9zdmc+",
      "invertOrder": false,
      "borderColor": "rgba(0,0,0,0)",
      "textColor": "rgba(255, 255, 255, 1)",
      "contentColor": "rgba(255, 255, 255, 1)",
      "compareBy1": "default",
      "oid1": null,
      "comparisonOperator1": "===",
      "value1": null,
      "background1": "linear-gradient(135deg, rgba(200,0,100,1) 0%, rgba(80,0,200,1) 50%, rgba(0,160,200,1) 100%)",
      "backgroundTrue1": "linear-gradient(135deg, rgba(200,0,100,1) 0%, rgba(80,0,200,1) 50%, rgba(0,160,200,1) 100%)",
      "outerShadowColor1": "rgba(100, 0, 255, 0.7)",
      "outerShadowColorTrue1": "rgba(100, 0, 255, 0.7)",
      "g_countStates-1": true
    },
    "style": {
      "bindings": [],
      "left": 614,
      "top": 184,
      "width": 110,
      "height": 110,
      "position": "absolute",
      "overflow": "visible"
    },
    "widgetSet": "vis-2-widgets-inventwo",
    "_id": "i000001"
  }
]
```

</details>

---

## Design 5 – Neumorphism / Soft UI

**Konzept:** Heller, einfarbiger Hintergrund (hellgrau). Zwei Schatten simulieren eine plastische Erhebung: ein dunkler Schatten unten-rechts (Außenschatten) und ein heller Eindruckschatten oben-links (Innenschatten). Kein Rand. Wirkung: weich, physisch, taktil, aktuell.

> **Hinweis:** Damit der Effekt funktioniert, sollte die **Dashboard-/View-Hintergrundfarbe** ebenfalls `rgba(224, 229, 236, 1)` sein, damit Widget und Hintergrund nahtlos ineinander übergehen.

<details>
<summary>📋 JSON anzeigen / kopieren</summary>

```json
[
  {
    "tpl": "tplInventwoWidgetUniversal",
    "data": {
      "bindings": [],
      "type": "switch",
      "g_common": true,
      "mode": "singleButton",
      "direction": "row",
      "oid": "nothing_selected",
      "httpType": "send",
      "buttonSize": 110,
      "btnSpacing": 10,
      "countStates": 1,
      "buttonHoldValue": false,
      "feedbackDuration": 600,
      "g_attr_group_click_feedback": true,
      "backgroundFeedback": "rgba(210, 215, 222, 1)",
      "outerShadowColorFeedback": "rgba(163, 177, 198, 0.9)",
      "contentBlinkInterval": 0,
      "g_attr_group_state_default": true,
      "colorPickerColorModel": "hex",
      "g_attr_content_color_picker": true,
      "colorPickerWidth": 200,
      "colorPickerHandleSize": 8,
      "colorPickerHandleMargin": 6,
      "colorPickerComponentsSpace": 12,
      "colorPickerDirection": "vertical",
      "colorPickerBorderWidth": 0,
      "colorPickerShowWheel": true,
      "colorPickerShowSaturation": true,
      "colorPickerShowValue": true,
      "textDecoration": "none",
      "g_attr_group_css_text": true,
      "textMarginTop": 0,
      "textMarginBottom": 0,
      "textMarginLeft": 5,
      "textMarginRight": 0,
      "contentType": "icon",
      "g_attr_group_css_content": true,
      "contentMarginTop": 20,
      "contentMarginBottom": 0,
      "contentMarginLeft": 0,
      "contentMarginRight": 0,
      "contentSize": 29,
      "contentRotation": 0,
      "contentMirror": false,
      "flexDirection": "column",
      "g_attr_group_css_alignment": true,
      "alignItems": "space-between",
      "textAlign": "start",
      "contentAlign": "center",
      "backgroundOpacity": 1,
      "g_attr_group_css_transparency": true,
      "contentOpacity": 1,
      "paddingLeft": 5,
      "g_attr_group_css_spacing": true,
      "paddingRight": 10,
      "paddingTop": 9,
      "paddingBottom": 11,
      "borderRadiusTopLeft": 16,
      "g_attr_group_css_border_radius": true,
      "borderRadiusTopRight": 16,
      "borderRadiusBottomRight": 16,
      "borderRadiusBottomLeft": 16,
      "borderSizeTop": 0,
      "g_attr_group_css_border": true,
      "borderSizeBottom": 0,
      "borderSizeLeft": 0,
      "borderSizeRight": 0,
      "borderStyle": "solid",
      "outerShadowX": 6,
      "g_attr_group_css_outer_shadow": true,
      "outerShadowY": 6,
      "outerShadowBlur": 12,
      "outerShadowSize": 0,
      "outerShadowColor": "rgba(163, 177, 198, 0.8)",
      "innerShadowX": -6,
      "g_attr_group_css_inner_shadow": true,
      "innerShadowY": -6,
      "innerShadowBlur": 12,
      "innerShadowSize": 0,
      "innerShadowColor": "rgba(255, 255, 255, 1)",
      "background": "rgba(224, 229, 236, 1)",
      "text": "Hallo",
      "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMiA2YzAtMS4xLS45LTItMi0ySDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNnptLTIgMGwtOCA1bC04LTVoMTZ6bTAgMTJINFY4bDggNWw4LTV2MTB6Ii8+PC9zdmc+",
      "invertOrder": false,
      "borderColor": "rgba(0,0,0,0)",
      "textColor": "rgba(90, 110, 130, 1)",
      "contentColor": "rgba(90, 110, 130, 1)",
      "compareBy1": "default",
      "oid1": null,
      "comparisonOperator1": "===",
      "value1": null,
      "background1": "rgba(210, 215, 222, 1)",
      "backgroundTrue1": "rgba(210, 215, 222, 1)",
      "outerShadowColor1": "rgba(163, 177, 198, 0.9)",
      "outerShadowColorTrue1": "rgba(163, 177, 198, 0.9)",
      "g_countStates-1": true
    },
    "style": {
      "bindings": [],
      "left": 614,
      "top": 184,
      "width": 110,
      "height": 110,
      "position": "absolute",
      "overflow": "visible"
    },
    "widgetSet": "vis-2-widgets-inventwo",
    "_id": "i000001"
  }
]
```

</details>

---

## Design 6 – Dark Material

**Konzept:** Inspiriert vom Material Design Dark Mode. Dunkler Blaugrau-Hintergrund, Teal-Akzentfarbe als linke Randlinie (wie VS Code Aktivitätsleiste). Wirkung: modern, entwicklerorientiert, professionell-dunkel.

<details>
<summary>📋 JSON anzeigen / kopieren</summary>

```json
[
  {
    "tpl": "tplInventwoWidgetUniversal",
    "data": {
      "bindings": [],
      "type": "switch",
      "g_common": true,
      "mode": "singleButton",
      "direction": "row",
      "oid": "nothing_selected",
      "httpType": "send",
      "buttonSize": 110,
      "btnSpacing": 10,
      "countStates": 1,
      "buttonHoldValue": false,
      "feedbackDuration": 600,
      "g_attr_group_click_feedback": true,
      "backgroundFeedback": "rgba(30, 40, 55, 1)",
      "outerShadowColorFeedback": "rgba(0, 188, 212, 0.5)",
      "contentBlinkInterval": 0,
      "g_attr_group_state_default": true,
      "textDecoration": "none",
      "g_attr_group_css_text": true,
      "textMarginTop": 0,
      "textMarginBottom": 0,
      "textMarginLeft": 5,
      "textMarginRight": 0,
      "contentType": "icon",
      "g_attr_group_css_content": true,
      "contentMarginTop": 20,
      "contentMarginBottom": 0,
      "contentMarginLeft": 0,
      "contentMarginRight": 0,
      "contentSize": 29,
      "contentRotation": 0,
      "contentMirror": false,
      "flexDirection": "column",
      "g_attr_group_css_alignment": true,
      "alignItems": "space-between",
      "textAlign": "start",
      "contentAlign": "center",
      "backgroundOpacity": 1,
      "g_attr_group_css_transparency": true,
      "contentOpacity": 1,
      "paddingLeft": 8,
      "g_attr_group_css_spacing": true,
      "paddingRight": 10,
      "paddingTop": 9,
      "paddingBottom": 11,
      "borderRadiusTopLeft": 8,
      "g_attr_group_css_border_radius": true,
      "borderRadiusTopRight": 8,
      "borderRadiusBottomRight": 8,
      "borderRadiusBottomLeft": 8,
      "borderSizeTop": 0,
      "g_attr_group_css_border": true,
      "borderSizeBottom": 0,
      "borderSizeLeft": 3,
      "borderSizeRight": 0,
      "borderStyle": "solid",
      "outerShadowX": 0,
      "g_attr_group_css_outer_shadow": true,
      "outerShadowY": 4,
      "outerShadowBlur": 16,
      "outerShadowSize": 0,
      "outerShadowColor": "rgba(0, 0, 0, 0.5)",
      "innerShadowX": 0,
      "g_attr_group_css_inner_shadow": true,
      "innerShadowY": 0,
      "innerShadowBlur": 0,
      "innerShadowSize": 0,
      "innerShadowColor": "rgba(0,0,0,0)",
      "background": "rgba(18, 26, 38, 1)",
      "text": "Hallo",
      "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMiA2YzAtMS4xLS45LTItMi0ySDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNnptLTIgMGwtOCA1bC04LTVoMTZ6bTAgMTJINFY4bDggNWw4LTV2MTB6Ii8+PC9zdmc+",
      "invertOrder": false,
      "borderColor": "rgba(0, 188, 212, 1)",
      "textColor": "rgba(207, 216, 220, 1)",
      "contentColor": "rgba(0, 188, 212, 1)",
      "compareBy1": "default",
      "oid1": null,
      "comparisonOperator1": "===",
      "value1": null,
      "background1": "rgba(30, 40, 55, 1)",
      "backgroundTrue1": "rgba(30, 40, 55, 1)",
      "outerShadowColor1": "rgba(0, 188, 212, 0.4)",
      "outerShadowColorTrue1": "rgba(0, 188, 212, 0.4)",
      "g_countStates-1": true
    },
    "style": {
      "bindings": [],
      "left": 10,
      "top": 10,
      "width": 110,
      "height": 110,
      "position": "absolute",
      "overflow": "visible"
    },
    "widgetSet": "vis-2-widgets-inventwo",
    "_id": "i000001"
  }
]
```

</details>

---

## Design 7 – Glassmorphism

**Konzept:** Milchglas-Effekt durch halbtransparenten weißen Hintergrund (15 % Opazität) kombiniert mit weißem Rand (30 %). Wirkung: modern, leicht, transparent – am besten auf einem farbigen oder Bildschirmhintergrund.

> **Hinweis:** Funktioniert am besten auf einem farbigen oder gemusterten View-Hintergrund, damit der Transparenz-Effekt sichtbar wird.

<details>
<summary>📋 JSON anzeigen / kopieren</summary>

```json
[
  {
    "tpl": "tplInventwoWidgetUniversal",
    "data": {
      "bindings": [],
      "type": "switch",
      "g_common": true,
      "mode": "singleButton",
      "direction": "row",
      "oid": "nothing_selected",
      "httpType": "send",
      "buttonSize": 110,
      "btnSpacing": 10,
      "countStates": 1,
      "buttonHoldValue": false,
      "feedbackDuration": 600,
      "g_attr_group_click_feedback": true,
      "backgroundFeedback": "rgba(255, 255, 255, 0.25)",
      "outerShadowColorFeedback": "rgba(31, 38, 135, 0.5)",
      "contentBlinkInterval": 0,
      "g_attr_group_state_default": true,
      "textDecoration": "none",
      "g_attr_group_css_text": true,
      "textMarginTop": 0,
      "textMarginBottom": 0,
      "textMarginLeft": 5,
      "textMarginRight": 0,
      "contentType": "icon",
      "g_attr_group_css_content": true,
      "contentMarginTop": 20,
      "contentMarginBottom": 0,
      "contentMarginLeft": 0,
      "contentMarginRight": 0,
      "contentSize": 29,
      "contentRotation": 0,
      "contentMirror": false,
      "flexDirection": "column",
      "g_attr_group_css_alignment": true,
      "alignItems": "space-between",
      "textAlign": "start",
      "contentAlign": "center",
      "backgroundOpacity": 1,
      "g_attr_group_css_transparency": true,
      "contentOpacity": 1,
      "paddingLeft": 5,
      "g_attr_group_css_spacing": true,
      "paddingRight": 10,
      "paddingTop": 9,
      "paddingBottom": 11,
      "borderRadiusTopLeft": 14,
      "g_attr_group_css_border_radius": true,
      "borderRadiusTopRight": 14,
      "borderRadiusBottomRight": 14,
      "borderRadiusBottomLeft": 14,
      "borderSizeTop": 1,
      "g_attr_group_css_border": true,
      "borderSizeBottom": 1,
      "borderSizeLeft": 1,
      "borderSizeRight": 1,
      "borderStyle": "solid",
      "outerShadowX": 0,
      "g_attr_group_css_outer_shadow": true,
      "outerShadowY": 8,
      "outerShadowBlur": 32,
      "outerShadowSize": 0,
      "outerShadowColor": "rgba(31, 38, 135, 0.37)",
      "innerShadowX": 0,
      "g_attr_group_css_inner_shadow": true,
      "innerShadowY": 0,
      "innerShadowBlur": 8,
      "innerShadowSize": 0,
      "innerShadowColor": "rgba(255, 255, 255, 0.2)",
      "background": "rgba(255, 255, 255, 0.15)",
      "text": "Hallo",
      "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMiA2YzAtMS4xLS45LTItMi0ySDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNnptLTIgMGwtOCA1bC04LTVoMTZ6bTAgMTJINFY4bDggNWw4LTV2MTB6Ii8+PC9zdmc+",
      "invertOrder": false,
      "borderColor": "rgba(255, 255, 255, 0.3)",
      "textColor": "rgba(255, 255, 255, 1)",
      "contentColor": "rgba(255, 255, 255, 0.9)",
      "compareBy1": "default",
      "oid1": null,
      "comparisonOperator1": "===",
      "value1": null,
      "background1": "rgba(255, 255, 255, 0.25)",
      "backgroundTrue1": "rgba(255, 255, 255, 0.25)",
      "outerShadowColor1": "rgba(31, 38, 135, 0.5)",
      "outerShadowColorTrue1": "rgba(31, 38, 135, 0.5)",
      "g_countStates-1": true
    },
    "style": {
      "bindings": [],
      "left": 10,
      "top": 10,
      "width": 110,
      "height": 110,
      "position": "absolute",
      "overflow": "visible"
    },
    "widgetSet": "vis-2-widgets-inventwo",
    "_id": "i000001"
  }
]
```

</details>

---

## Design 8 – Military Tactical

**Konzept:** Olivgrüner Hintergrund, khakifarbener Rand, scharfe Ecken. Harter Schlagschatten, keine Weichzeichnung. Minimalistisch-funktional wie ein Feldgerät. Wirkung: militärisch, rau, zuverlässig.

<details>
<summary>📋 JSON anzeigen / kopieren</summary>

```json
[
  {
    "tpl": "tplInventwoWidgetUniversal",
    "data": {
      "bindings": [],
      "type": "switch",
      "g_common": true,
      "mode": "singleButton",
      "direction": "row",
      "oid": "nothing_selected",
      "httpType": "send",
      "buttonSize": 110,
      "btnSpacing": 10,
      "countStates": 1,
      "buttonHoldValue": false,
      "feedbackDuration": 600,
      "g_attr_group_click_feedback": true,
      "backgroundFeedback": "rgba(40, 50, 20, 1)",
      "outerShadowColorFeedback": "rgba(0, 0, 0, 0.7)",
      "contentBlinkInterval": 0,
      "g_attr_group_state_default": true,
      "textDecoration": "none",
      "g_attr_group_css_text": true,
      "textMarginTop": 0,
      "textMarginBottom": 0,
      "textMarginLeft": 5,
      "textMarginRight": 0,
      "contentType": "icon",
      "g_attr_group_css_content": true,
      "contentMarginTop": 20,
      "contentMarginBottom": 0,
      "contentMarginLeft": 0,
      "contentMarginRight": 0,
      "contentSize": 29,
      "contentRotation": 0,
      "contentMirror": false,
      "flexDirection": "column",
      "g_attr_group_css_alignment": true,
      "alignItems": "space-between",
      "textAlign": "start",
      "contentAlign": "center",
      "backgroundOpacity": 1,
      "g_attr_group_css_transparency": true,
      "contentOpacity": 1,
      "paddingLeft": 5,
      "g_attr_group_css_spacing": true,
      "paddingRight": 10,
      "paddingTop": 9,
      "paddingBottom": 11,
      "borderRadiusTopLeft": 0,
      "g_attr_group_css_border_radius": true,
      "borderRadiusTopRight": 0,
      "borderRadiusBottomRight": 0,
      "borderRadiusBottomLeft": 0,
      "borderSizeTop": 2,
      "g_attr_group_css_border": true,
      "borderSizeBottom": 2,
      "borderSizeLeft": 2,
      "borderSizeRight": 2,
      "borderStyle": "solid",
      "outerShadowX": 4,
      "g_attr_group_css_outer_shadow": true,
      "outerShadowY": 4,
      "outerShadowBlur": 0,
      "outerShadowSize": 0,
      "outerShadowColor": "rgba(0, 0, 0, 0.6)",
      "innerShadowX": 0,
      "g_attr_group_css_inner_shadow": true,
      "innerShadowY": 0,
      "innerShadowBlur": 0,
      "innerShadowSize": 0,
      "innerShadowColor": "rgba(0,0,0,0)",
      "background": "rgba(55, 65, 35, 1)",
      "text": "Hallo",
      "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMiA2YzAtMS4xLS45LTItMi0ySDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNnptLTIgMGwtOCA1bC04LTVoMTZ6bTAgMTJINFY4bDggNWw4LTV2MTB6Ii8+PC9zdmc+",
      "invertOrder": false,
      "borderColor": "rgba(100, 120, 60, 1)",
      "textColor": "rgba(180, 195, 140, 1)",
      "contentColor": "rgba(200, 210, 160, 1)",
      "compareBy1": "default",
      "oid1": null,
      "comparisonOperator1": "===",
      "value1": null,
      "background1": "rgba(40, 50, 20, 1)",
      "backgroundTrue1": "rgba(40, 50, 20, 1)",
      "outerShadowColor1": "rgba(0, 0, 0, 0.7)",
      "outerShadowColorTrue1": "rgba(0, 0, 0, 0.7)",
      "g_countStates-1": true
    },
    "style": {
      "bindings": [],
      "left": 10,
      "top": 10,
      "width": 110,
      "height": 110,
      "position": "absolute",
      "overflow": "visible"
    },
    "widgetSet": "vis-2-widgets-inventwo",
    "_id": "i000001"
  }
]
```

</details>

---

## Design 9 – Bubblegum / Candy

**Konzept:** Knalliges Hot-Pink, vollrunde Pillen-Form (55 px Radius), kein Rand, weicher rosa Glow. Wirkung: verspielt, fröhlich, kindlich-bunt. Passt zu Kinderzimmer-Dashboards oder Fun-Projekten.

<details>
<summary>📋 JSON anzeigen / kopieren</summary>

```json
[
  {
    "tpl": "tplInventwoWidgetUniversal",
    "data": {
      "bindings": [],
      "type": "switch",
      "g_common": true,
      "mode": "singleButton",
      "direction": "row",
      "oid": "nothing_selected",
      "httpType": "send",
      "buttonSize": 110,
      "btnSpacing": 10,
      "countStates": 1,
      "buttonHoldValue": false,
      "feedbackDuration": 600,
      "g_attr_group_click_feedback": true,
      "backgroundFeedback": "rgba(220, 40, 160, 1)",
      "outerShadowColorFeedback": "rgba(255, 82, 196, 0.7)",
      "contentBlinkInterval": 0,
      "g_attr_group_state_default": true,
      "textDecoration": "none",
      "g_attr_group_css_text": true,
      "textMarginTop": 0,
      "textMarginBottom": 0,
      "textMarginLeft": 5,
      "textMarginRight": 0,
      "contentType": "icon",
      "g_attr_group_css_content": true,
      "contentMarginTop": 20,
      "contentMarginBottom": 0,
      "contentMarginLeft": 0,
      "contentMarginRight": 0,
      "contentSize": 29,
      "contentRotation": 0,
      "contentMirror": false,
      "flexDirection": "column",
      "g_attr_group_css_alignment": true,
      "alignItems": "space-between",
      "textAlign": "start",
      "contentAlign": "center",
      "backgroundOpacity": 1,
      "g_attr_group_css_transparency": true,
      "contentOpacity": 1,
      "paddingLeft": 5,
      "g_attr_group_css_spacing": true,
      "paddingRight": 10,
      "paddingTop": 9,
      "paddingBottom": 11,
      "borderRadiusTopLeft": 55,
      "g_attr_group_css_border_radius": true,
      "borderRadiusTopRight": 55,
      "borderRadiusBottomRight": 55,
      "borderRadiusBottomLeft": 55,
      "borderSizeTop": 0,
      "g_attr_group_css_border": true,
      "borderSizeBottom": 0,
      "borderSizeLeft": 0,
      "borderSizeRight": 0,
      "borderStyle": "solid",
      "outerShadowX": 0,
      "g_attr_group_css_outer_shadow": true,
      "outerShadowY": 6,
      "outerShadowBlur": 20,
      "outerShadowSize": 0,
      "outerShadowColor": "rgba(255, 82, 196, 0.45)",
      "innerShadowX": 0,
      "g_attr_group_css_inner_shadow": true,
      "innerShadowY": 0,
      "innerShadowBlur": 0,
      "innerShadowSize": 0,
      "innerShadowColor": "rgba(0,0,0,0)",
      "background": "rgba(255, 82, 196, 1)",
      "text": "Hallo",
      "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMiA2YzAtMS4xLS45LTItMi0ySDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNnptLTIgMGwtOCA1bC04LTVoMTZ6bTAgMTJINFY4bDggNWw4LTV2MTB6Ii8+PC9zdmc+",
      "invertOrder": false,
      "borderColor": "rgba(0,0,0,0)",
      "textColor": "rgba(255, 255, 255, 1)",
      "contentColor": "rgba(255, 255, 255, 1)",
      "compareBy1": "default",
      "oid1": null,
      "comparisonOperator1": "===",
      "value1": null,
      "background1": "rgba(220, 40, 160, 1)",
      "backgroundTrue1": "rgba(220, 40, 160, 1)",
      "outerShadowColor1": "rgba(255, 82, 196, 0.7)",
      "outerShadowColorTrue1": "rgba(255, 82, 196, 0.7)",
      "g_countStates-1": true
    },
    "style": {
      "bindings": [],
      "left": 10,
      "top": 10,
      "width": 110,
      "height": 110,
      "position": "absolute",
      "overflow": "visible"
    },
    "widgetSet": "vis-2-widgets-inventwo",
    "_id": "i000001"
  }
]
```

</details>

---

## Design 10 – Terminal / Matrix

**Konzept:** Schwarzer Hintergrund, Matrix-Grün (`#00ff41`), gestrichelter Rand – wie ein altes Computerterminal oder die ikonische Matrix-Szene. Wirkung: hackerisch, digital-nostalgisch, minimalistisch-bedrohlich.

<details>
<summary>📋 JSON anzeigen / kopieren</summary>

```json
[
  {
    "tpl": "tplInventwoWidgetUniversal",
    "data": {
      "bindings": [],
      "type": "switch",
      "g_common": true,
      "mode": "singleButton",
      "direction": "row",
      "oid": "nothing_selected",
      "httpType": "send",
      "buttonSize": 110,
      "btnSpacing": 10,
      "countStates": 1,
      "buttonHoldValue": false,
      "feedbackDuration": 600,
      "g_attr_group_click_feedback": true,
      "backgroundFeedback": "rgba(0, 20, 5, 1)",
      "outerShadowColorFeedback": "rgba(0, 255, 65, 0.6)",
      "contentBlinkInterval": 0,
      "g_attr_group_state_default": true,
      "textDecoration": "none",
      "g_attr_group_css_text": true,
      "textMarginTop": 0,
      "textMarginBottom": 0,
      "textMarginLeft": 5,
      "textMarginRight": 0,
      "contentType": "icon",
      "g_attr_group_css_content": true,
      "contentMarginTop": 20,
      "contentMarginBottom": 0,
      "contentMarginLeft": 0,
      "contentMarginRight": 0,
      "contentSize": 29,
      "contentRotation": 0,
      "contentMirror": false,
      "flexDirection": "column",
      "g_attr_group_css_alignment": true,
      "alignItems": "space-between",
      "textAlign": "start",
      "contentAlign": "center",
      "backgroundOpacity": 1,
      "g_attr_group_css_transparency": true,
      "contentOpacity": 1,
      "paddingLeft": 5,
      "g_attr_group_css_spacing": true,
      "paddingRight": 10,
      "paddingTop": 9,
      "paddingBottom": 11,
      "borderRadiusTopLeft": 0,
      "g_attr_group_css_border_radius": true,
      "borderRadiusTopRight": 0,
      "borderRadiusBottomRight": 0,
      "borderRadiusBottomLeft": 0,
      "borderSizeTop": 1,
      "g_attr_group_css_border": true,
      "borderSizeBottom": 1,
      "borderSizeLeft": 1,
      "borderSizeRight": 1,
      "borderStyle": "dashed",
      "outerShadowX": 0,
      "g_attr_group_css_outer_shadow": true,
      "outerShadowY": 0,
      "outerShadowBlur": 12,
      "outerShadowSize": 0,
      "outerShadowColor": "rgba(0, 255, 65, 0.3)",
      "innerShadowX": 0,
      "g_attr_group_css_inner_shadow": true,
      "innerShadowY": 0,
      "innerShadowBlur": 6,
      "innerShadowSize": 0,
      "innerShadowColor": "rgba(0, 255, 65, 0.08)",
      "background": "rgba(0, 0, 0, 1)",
      "text": "Hallo",
      "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMiA2YzAtMS4xLS45LTItMi0ySDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNnptLTIgMGwtOCA1bC04LTVoMTZ6bTAgMTJINFY4bDggNWw4LTV2MTB6Ii8+PC9zdmc+",
      "invertOrder": false,
      "borderColor": "rgba(0, 255, 65, 0.5)",
      "textColor": "rgba(0, 255, 65, 1)",
      "contentColor": "rgba(0, 255, 65, 1)",
      "compareBy1": "default",
      "oid1": null,
      "comparisonOperator1": "===",
      "value1": null,
      "background1": "rgba(0, 20, 5, 1)",
      "backgroundTrue1": "rgba(0, 20, 5, 1)",
      "outerShadowColor1": "rgba(0, 255, 65, 0.5)",
      "outerShadowColorTrue1": "rgba(0, 255, 65, 0.5)",
      "g_countStates-1": true
    },
    "style": {
      "bindings": [],
      "left": 10,
      "top": 10,
      "width": 110,
      "height": 110,
      "position": "absolute",
      "overflow": "visible"
    },
    "widgetSet": "vis-2-widgets-inventwo",
    "_id": "i000001"
  }
]
```

</details>

---

## Design 11 – Corporate Blue

**Konzept:** Seriöses Navy-Blau, weißer Text, dezenter Schatten, leicht abgerundete Ecken. Kein ablenkendes Detail. Wirkung: professionell, vertrauenswürdig, Unternehmens-Dashboard.

<details>
<summary>📋 JSON anzeigen / kopieren</summary>

```json
[
  {
    "tpl": "tplInventwoWidgetUniversal",
    "data": {
      "bindings": [],
      "type": "switch",
      "g_common": true,
      "mode": "singleButton",
      "direction": "row",
      "oid": "nothing_selected",
      "httpType": "send",
      "buttonSize": 110,
      "btnSpacing": 10,
      "countStates": 1,
      "buttonHoldValue": false,
      "feedbackDuration": 600,
      "g_attr_group_click_feedback": true,
      "backgroundFeedback": "rgba(12, 50, 90, 1)",
      "outerShadowColorFeedback": "rgba(0, 0, 0, 0.4)",
      "contentBlinkInterval": 0,
      "g_attr_group_state_default": true,
      "textDecoration": "none",
      "g_attr_group_css_text": true,
      "textMarginTop": 0,
      "textMarginBottom": 0,
      "textMarginLeft": 5,
      "textMarginRight": 0,
      "contentType": "icon",
      "g_attr_group_css_content": true,
      "contentMarginTop": 20,
      "contentMarginBottom": 0,
      "contentMarginLeft": 0,
      "contentMarginRight": 0,
      "contentSize": 29,
      "contentRotation": 0,
      "contentMirror": false,
      "flexDirection": "column",
      "g_attr_group_css_alignment": true,
      "alignItems": "space-between",
      "textAlign": "start",
      "contentAlign": "center",
      "backgroundOpacity": 1,
      "g_attr_group_css_transparency": true,
      "contentOpacity": 1,
      "paddingLeft": 5,
      "g_attr_group_css_spacing": true,
      "paddingRight": 10,
      "paddingTop": 9,
      "paddingBottom": 11,
      "borderRadiusTopLeft": 6,
      "g_attr_group_css_border_radius": true,
      "borderRadiusTopRight": 6,
      "borderRadiusBottomRight": 6,
      "borderRadiusBottomLeft": 6,
      "borderSizeTop": 0,
      "g_attr_group_css_border": true,
      "borderSizeBottom": 0,
      "borderSizeLeft": 0,
      "borderSizeRight": 0,
      "borderStyle": "solid",
      "outerShadowX": 0,
      "g_attr_group_css_outer_shadow": true,
      "outerShadowY": 4,
      "outerShadowBlur": 12,
      "outerShadowSize": 0,
      "outerShadowColor": "rgba(0, 0, 0, 0.3)",
      "innerShadowX": 0,
      "g_attr_group_css_inner_shadow": true,
      "innerShadowY": 1,
      "innerShadowBlur": 3,
      "innerShadowSize": 0,
      "innerShadowColor": "rgba(255, 255, 255, 0.08)",
      "background": "rgba(21, 76, 121, 1)",
      "text": "Hallo",
      "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMiA2YzAtMS4xLS45LTItMi0ySDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNnptLTIgMGwtOCA1bC04LTVoMTZ6bTAgMTJINFY4bDggNWw4LTV2MTB6Ii8+PC9zdmc+",
      "invertOrder": false,
      "borderColor": "rgba(0,0,0,0)",
      "textColor": "rgba(255, 255, 255, 1)",
      "contentColor": "rgba(255, 255, 255, 0.9)",
      "compareBy1": "default",
      "oid1": null,
      "comparisonOperator1": "===",
      "value1": null,
      "background1": "rgba(12, 50, 90, 1)",
      "backgroundTrue1": "rgba(12, 50, 90, 1)",
      "outerShadowColor1": "rgba(0, 0, 0, 0.4)",
      "outerShadowColorTrue1": "rgba(0, 0, 0, 0.4)",
      "g_countStates-1": true
    },
    "style": {
      "bindings": [],
      "left": 10,
      "top": 10,
      "width": 110,
      "height": 110,
      "position": "absolute",
      "overflow": "visible"
    },
    "widgetSet": "vis-2-widgets-inventwo",
    "_id": "i000001"
  }
]
```

</details>

---

## Design 12 – Sunset Warm

**Konzept:** Warmer Farbverlauf von Korallrot über Orange nach Gelb. Weiße Schrift und Icons, abgerundete Ecken, sanfter warmer Glow. Wirkung: einladend, lebendig, freudig – ideal für Wohn- oder Terrassen-Dashboard.

<details>
<summary>📋 JSON anzeigen / kopieren</summary>

```json
[
  {
    "tpl": "tplInventwoWidgetUniversal",
    "data": {
      "bindings": [],
      "type": "switch",
      "g_common": true,
      "mode": "singleButton",
      "direction": "row",
      "oid": "nothing_selected",
      "httpType": "send",
      "buttonSize": 110,
      "btnSpacing": 10,
      "countStates": 1,
      "buttonHoldValue": false,
      "feedbackDuration": 600,
      "g_attr_group_click_feedback": true,
      "backgroundFeedback": "linear-gradient(135deg, rgba(220,60,60,1) 0%, rgba(220,110,30,1) 50%, rgba(220,170,50,1) 100%)",
      "outerShadowColorFeedback": "rgba(255, 94, 98, 0.6)",
      "contentBlinkInterval": 0,
      "g_attr_group_state_default": true,
      "textDecoration": "none",
      "g_attr_group_css_text": true,
      "textMarginTop": 0,
      "textMarginBottom": 0,
      "textMarginLeft": 5,
      "textMarginRight": 0,
      "contentType": "icon",
      "g_attr_group_css_content": true,
      "contentMarginTop": 20,
      "contentMarginBottom": 0,
      "contentMarginLeft": 0,
      "contentMarginRight": 0,
      "contentSize": 29,
      "contentRotation": 0,
      "contentMirror": false,
      "flexDirection": "column",
      "g_attr_group_css_alignment": true,
      "alignItems": "space-between",
      "textAlign": "start",
      "contentAlign": "center",
      "backgroundOpacity": 1,
      "g_attr_group_css_transparency": true,
      "contentOpacity": 1,
      "paddingLeft": 5,
      "g_attr_group_css_spacing": true,
      "paddingRight": 10,
      "paddingTop": 9,
      "paddingBottom": 11,
      "borderRadiusTopLeft": 18,
      "g_attr_group_css_border_radius": true,
      "borderRadiusTopRight": 18,
      "borderRadiusBottomRight": 18,
      "borderRadiusBottomLeft": 18,
      "borderSizeTop": 0,
      "g_attr_group_css_border": true,
      "borderSizeBottom": 0,
      "borderSizeLeft": 0,
      "borderSizeRight": 0,
      "borderStyle": "solid",
      "outerShadowX": 0,
      "g_attr_group_css_outer_shadow": true,
      "outerShadowY": 6,
      "outerShadowBlur": 20,
      "outerShadowSize": 0,
      "outerShadowColor": "rgba(255, 94, 98, 0.4)",
      "innerShadowX": 0,
      "g_attr_group_css_inner_shadow": true,
      "innerShadowY": 0,
      "innerShadowBlur": 0,
      "innerShadowSize": 0,
      "innerShadowColor": "rgba(0,0,0,0)",
      "background": "linear-gradient(135deg, rgba(255,94,98,1) 0%, rgba(255,145,65,1) 50%, rgba(255,206,84,1) 100%)",
      "text": "Hallo",
      "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMiA2YzAtMS4xLS45LTItMi0ySDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNnptLTIgMGwtOCA1bC04LTVoMTZ6bTAgMTJINFY4bDggNWw4LTV2MTB6Ii8+PC9zdmc+",
      "invertOrder": false,
      "borderColor": "rgba(0,0,0,0)",
      "textColor": "rgba(255, 255, 255, 1)",
      "contentColor": "rgba(255, 255, 255, 1)",
      "compareBy1": "default",
      "oid1": null,
      "comparisonOperator1": "===",
      "value1": null,
      "background1": "linear-gradient(135deg, rgba(220,60,60,1) 0%, rgba(220,110,30,1) 50%, rgba(220,170,50,1) 100%)",
      "backgroundTrue1": "linear-gradient(135deg, rgba(220,60,60,1) 0%, rgba(220,110,30,1) 50%, rgba(220,170,50,1) 100%)",
      "outerShadowColor1": "rgba(255, 94, 98, 0.6)",
      "outerShadowColorTrue1": "rgba(255, 94, 98, 0.6)",
      "g_countStates-1": true
    },
    "style": {
      "bindings": [],
      "left": 10,
      "top": 10,
      "width": 110,
      "height": 110,
      "position": "absolute",
      "overflow": "visible"
    },
    "widgetSet": "vis-2-widgets-inventwo",
    "_id": "i000001"
  }
]
```

</details>

---

## Design 13 – Dark Luxury Gold

**Konzept:** Fast schwarzer, warm getönter Hintergrund mit Goldakzenten (Rand, Text, Icon). Dezenter goldener Glanz durch Außenschatten. Wirkung: edel, luxuriös, hochwertig – ideal für Premium-Dashboards.

<details>
<summary>📋 JSON anzeigen / kopieren</summary>

```json
[
  {
    "tpl": "tplInventwoWidgetUniversal",
    "data": {
      "bindings": [],
      "type": "switch",
      "g_common": true,
      "mode": "singleButton",
      "direction": "row",
      "oid": "nothing_selected",
      "httpType": "send",
      "buttonSize": 110,
      "btnSpacing": 10,
      "countStates": 1,
      "buttonHoldValue": false,
      "feedbackDuration": 600,
      "g_attr_group_click_feedback": true,
      "backgroundFeedback": "rgba(35, 25, 10, 1)",
      "outerShadowColorFeedback": "rgba(212, 175, 55, 0.4)",
      "contentBlinkInterval": 0,
      "g_attr_group_state_default": true,
      "textDecoration": "none",
      "g_attr_group_css_text": true,
      "textMarginTop": 0,
      "textMarginBottom": 0,
      "textMarginLeft": 5,
      "textMarginRight": 0,
      "contentType": "icon",
      "g_attr_group_css_content": true,
      "contentMarginTop": 20,
      "contentMarginBottom": 0,
      "contentMarginLeft": 0,
      "contentMarginRight": 0,
      "contentSize": 29,
      "contentRotation": 0,
      "contentMirror": false,
      "flexDirection": "column",
      "g_attr_group_css_alignment": true,
      "alignItems": "space-between",
      "textAlign": "start",
      "contentAlign": "center",
      "backgroundOpacity": 1,
      "g_attr_group_css_transparency": true,
      "contentOpacity": 1,
      "paddingLeft": 5,
      "g_attr_group_css_spacing": true,
      "paddingRight": 10,
      "paddingTop": 9,
      "paddingBottom": 11,
      "borderRadiusTopLeft": 4,
      "g_attr_group_css_border_radius": true,
      "borderRadiusTopRight": 4,
      "borderRadiusBottomRight": 4,
      "borderRadiusBottomLeft": 4,
      "borderSizeTop": 1,
      "g_attr_group_css_border": true,
      "borderSizeBottom": 1,
      "borderSizeLeft": 1,
      "borderSizeRight": 1,
      "borderStyle": "solid",
      "outerShadowX": 0,
      "g_attr_group_css_outer_shadow": true,
      "outerShadowY": 4,
      "outerShadowBlur": 20,
      "outerShadowSize": 0,
      "outerShadowColor": "rgba(212, 175, 55, 0.2)",
      "innerShadowX": 0,
      "g_attr_group_css_inner_shadow": true,
      "innerShadowY": 1,
      "innerShadowBlur": 4,
      "innerShadowSize": 0,
      "innerShadowColor": "rgba(212, 175, 55, 0.08)",
      "background": "rgba(20, 14, 8, 1)",
      "text": "Hallo",
      "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMiA2YzAtMS4xLS45LTItMi0ySDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNnptLTIgMGwtOCA1bC04LTVoMTZ6bTAgMTJINFY4bDggNWw4LTV2MTB6Ii8+PC9zdmc+",
      "invertOrder": false,
      "borderColor": "rgba(212, 175, 55, 0.6)",
      "textColor": "rgba(212, 175, 55, 1)",
      "contentColor": "rgba(212, 175, 55, 1)",
      "compareBy1": "default",
      "oid1": null,
      "comparisonOperator1": "===",
      "value1": null,
      "background1": "rgba(35, 25, 10, 1)",
      "backgroundTrue1": "rgba(35, 25, 10, 1)",
      "outerShadowColor1": "rgba(212, 175, 55, 0.4)",
      "outerShadowColorTrue1": "rgba(212, 175, 55, 0.4)",
      "g_countStates-1": true
    },
    "style": {
      "bindings": [],
      "left": 10,
      "top": 10,
      "width": 110,
      "height": 110,
      "position": "absolute",
      "overflow": "visible"
    },
    "widgetSet": "vis-2-widgets-inventwo",
    "_id": "i000001"
  }
]
```

</details>

---

## Design 14 – Ice / Arctic

**Konzept:** Kühles Eisblau, heller Hintergrund, dezente blaue Umrandung, hauchzarter Schatten. Alles strahlt Ruhe und Kälte aus. Wirkung: frisch, klar, sachlich – gut für Klima- oder Temperatur-Dashboards.

<details>
<summary>📋 JSON anzeigen / kopieren</summary>

```json
[
  {
    "tpl": "tplInventwoWidgetUniversal",
    "data": {
      "bindings": [],
      "type": "switch",
      "g_common": true,
      "mode": "singleButton",
      "direction": "row",
      "oid": "nothing_selected",
      "httpType": "send",
      "buttonSize": 110,
      "btnSpacing": 10,
      "countStates": 1,
      "buttonHoldValue": false,
      "feedbackDuration": 600,
      "g_attr_group_click_feedback": true,
      "backgroundFeedback": "rgba(210, 235, 250, 1)",
      "outerShadowColorFeedback": "rgba(100, 160, 220, 0.4)",
      "contentBlinkInterval": 0,
      "g_attr_group_state_default": true,
      "textDecoration": "none",
      "g_attr_group_css_text": true,
      "textMarginTop": 0,
      "textMarginBottom": 0,
      "textMarginLeft": 5,
      "textMarginRight": 0,
      "contentType": "icon",
      "g_attr_group_css_content": true,
      "contentMarginTop": 20,
      "contentMarginBottom": 0,
      "contentMarginLeft": 0,
      "contentMarginRight": 0,
      "contentSize": 29,
      "contentRotation": 0,
      "contentMirror": false,
      "flexDirection": "column",
      "g_attr_group_css_alignment": true,
      "alignItems": "space-between",
      "textAlign": "start",
      "contentAlign": "center",
      "backgroundOpacity": 1,
      "g_attr_group_css_transparency": true,
      "contentOpacity": 1,
      "paddingLeft": 5,
      "g_attr_group_css_spacing": true,
      "paddingRight": 10,
      "paddingTop": 9,
      "paddingBottom": 11,
      "borderRadiusTopLeft": 12,
      "g_attr_group_css_border_radius": true,
      "borderRadiusTopRight": 12,
      "borderRadiusBottomRight": 12,
      "borderRadiusBottomLeft": 12,
      "borderSizeTop": 1,
      "g_attr_group_css_border": true,
      "borderSizeBottom": 1,
      "borderSizeLeft": 1,
      "borderSizeRight": 1,
      "borderStyle": "solid",
      "outerShadowX": 0,
      "g_attr_group_css_outer_shadow": true,
      "outerShadowY": 2,
      "outerShadowBlur": 10,
      "outerShadowSize": 0,
      "outerShadowColor": "rgba(100, 160, 220, 0.2)",
      "innerShadowX": 0,
      "g_attr_group_css_inner_shadow": true,
      "innerShadowY": 1,
      "innerShadowBlur": 3,
      "innerShadowSize": 0,
      "innerShadowColor": "rgba(255, 255, 255, 0.8)",
      "background": "rgba(232, 244, 253, 1)",
      "text": "Hallo",
      "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMiA2YzAtMS4xLS45LTItMi0ySDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNnptLTIgMGwtOCA1bC04LTVoMTZ6bTAgMTJINFY4bDggNWw4LTV2MTB6Ii8+PC9zdmc+",
      "invertOrder": false,
      "borderColor": "rgba(144, 195, 235, 1)",
      "textColor": "rgba(44, 110, 160, 1)",
      "contentColor": "rgba(44, 110, 160, 1)",
      "compareBy1": "default",
      "oid1": null,
      "comparisonOperator1": "===",
      "value1": null,
      "background1": "rgba(210, 235, 250, 1)",
      "backgroundTrue1": "rgba(210, 235, 250, 1)",
      "outerShadowColor1": "rgba(100, 160, 220, 0.35)",
      "outerShadowColorTrue1": "rgba(100, 160, 220, 0.35)",
      "g_countStates-1": true
    },
    "style": {
      "bindings": [],
      "left": 10,
      "top": 10,
      "width": 110,
      "height": 110,
      "position": "absolute",
      "overflow": "visible"
    },
    "widgetSet": "vis-2-widgets-inventwo",
    "_id": "i000001"
  }
]
```

</details>

---

## Design 15 – Brutalist

**Konzept:** Signalgelber Hintergrund, 4 px schwarzer Vollrahmen, keinerlei Abrundung, harter schwarzer Schlagschatten ohne Blur. Maximaler Kontrast, null Kompromisse. Wirkung: provokant, laut, mutig – Kunst-Dashboard oder Alarmanzeige.

<details>
<summary>📋 JSON anzeigen / kopieren</summary>

```json
[
  {
    "tpl": "tplInventwoWidgetUniversal",
    "data": {
      "bindings": [],
      "type": "switch",
      "g_common": true,
      "mode": "singleButton",
      "direction": "row",
      "oid": "nothing_selected",
      "httpType": "send",
      "buttonSize": 110,
      "btnSpacing": 10,
      "countStates": 1,
      "buttonHoldValue": false,
      "feedbackDuration": 600,
      "g_attr_group_click_feedback": true,
      "backgroundFeedback": "rgba(220, 200, 0, 1)",
      "outerShadowColorFeedback": "rgba(0, 0, 0, 1)",
      "contentBlinkInterval": 0,
      "g_attr_group_state_default": true,
      "textDecoration": "none",
      "g_attr_group_css_text": true,
      "textMarginTop": 0,
      "textMarginBottom": 0,
      "textMarginLeft": 5,
      "textMarginRight": 0,
      "contentType": "icon",
      "g_attr_group_css_content": true,
      "contentMarginTop": 20,
      "contentMarginBottom": 0,
      "contentMarginLeft": 0,
      "contentMarginRight": 0,
      "contentSize": 29,
      "contentRotation": 0,
      "contentMirror": false,
      "flexDirection": "column",
      "g_attr_group_css_alignment": true,
      "alignItems": "space-between",
      "textAlign": "start",
      "contentAlign": "center",
      "backgroundOpacity": 1,
      "g_attr_group_css_transparency": true,
      "contentOpacity": 1,
      "paddingLeft": 5,
      "g_attr_group_css_spacing": true,
      "paddingRight": 10,
      "paddingTop": 9,
      "paddingBottom": 11,
      "borderRadiusTopLeft": 0,
      "g_attr_group_css_border_radius": true,
      "borderRadiusTopRight": 0,
      "borderRadiusBottomRight": 0,
      "borderRadiusBottomLeft": 0,
      "borderSizeTop": 4,
      "g_attr_group_css_border": true,
      "borderSizeBottom": 4,
      "borderSizeLeft": 4,
      "borderSizeRight": 4,
      "borderStyle": "solid",
      "outerShadowX": 8,
      "g_attr_group_css_outer_shadow": true,
      "outerShadowY": 8,
      "outerShadowBlur": 0,
      "outerShadowSize": 0,
      "outerShadowColor": "rgba(0, 0, 0, 1)",
      "innerShadowX": 0,
      "g_attr_group_css_inner_shadow": true,
      "innerShadowY": 0,
      "innerShadowBlur": 0,
      "innerShadowSize": 0,
      "innerShadowColor": "rgba(0,0,0,0)",
      "background": "rgba(255, 230, 0, 1)",
      "text": "Hallo",
      "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMiA2YzAtMS4xLS45LTItMi0ySDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNnptLTIgMGwtOCA1bC04LTVoMTZ6bTAgMTJINFY4bDggNWw4LTV2MTB6Ii8+PC9zdmc+",
      "invertOrder": false,
      "borderColor": "rgba(0, 0, 0, 1)",
      "textColor": "rgba(0, 0, 0, 1)",
      "contentColor": "rgba(0, 0, 0, 1)",
      "compareBy1": "default",
      "oid1": null,
      "comparisonOperator1": "===",
      "value1": null,
      "background1": "rgba(220, 200, 0, 1)",
      "backgroundTrue1": "rgba(220, 200, 0, 1)",
      "outerShadowColor1": "rgba(0, 0, 0, 1)",
      "outerShadowColorTrue1": "rgba(0, 0, 0, 1)",
      "g_countStates-1": true
    },
    "style": {
      "bindings": [],
      "left": 10,
      "top": 10,
      "width": 110,
      "height": 110,
      "position": "absolute",
      "overflow": "visible"
    },
    "widgetSet": "vis-2-widgets-inventwo",
    "_id": "i000001"
  }
]
```

</details>
