# Superset plugin chart mixed bar area
[![Node.js Package](https://github.com/LAMPSpace/superset-plugin-chart-mixed-bar-area/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/LAMPSpace/superset-plugin-chart-mixed-bar-area/actions/workflows/npm-publish.yml)

This is the Superset Plugin Chart Mixed Bar Area Superset Chart Plugin.

### Usage

To build the plugin, run the following commands:

```
npm i superset-plugin-chart-mixed-bar-area
```

After this edit the `superset-frontend/src/visualizations/presets/MainPreset.js` and make the following changes:

```js
import { SupersetPluginChartMixedBarArea } from 'superset-plugin-chart-mixed-bar-area';
```

to import the plugin and later add the following to the array that's passed to the `plugins` property:
```js
new SupersetPluginChartMixedBarArea().configure({ key: 'superset-plugin-chart-mixed-bar-area' }),
```
