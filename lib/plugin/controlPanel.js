"use strict";

exports.__esModule = true;
exports.showBarYAxis = exports.showAreaYAxis = exports.default = void 0;

var _core = require("@superset-ui/core");

var _chartControls = require("@superset-ui/chart-controls");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var showBarYAxis = 'bar';
exports.showBarYAxis = showBarYAxis;
var showAreaYAxis = 'area';
exports.showAreaYAxis = showAreaYAxis;
var config = {
  /**
   * The control panel is split into two tabs: "Query" and
   * "Chart Options". The controls that define the inputs to
   * the chart data request, such as columns and metrics, usually
   * reside within "Query", while controls that affect the visual
   * appearance or functionality of the chart are under the
   * "Chart Options" section.
   *
   * There are several predefined controls that can be used.
   * Some examples:
   * - groupby: columns to group by (tranlated to GROUP BY statement)
   * - series: same as groupby, but single selection.
   * - metrics: multiple metrics (translated to aggregate expression)
   * - metric: sane as metrics, but single selection
   * - adhoc_filters: filters (translated to WHERE or HAVING
   *   depending on filter type)
   * - row_limit: maximum number of rows (translated to LIMIT statement)
   *
   * If a control panel has both a `series` and `groupby` control, and
   * the user has chosen `col1` as the value for the `series` control,
   * and `col2` and `col3` as values for the `groupby` control,
   * the resulting query will contain three `groupby` columns. This is because
   * we considered `series` control a `groupby` query field and its value
   * will automatically append the `groupby` field when the query is generated.
   *
   * It is also possible to define custom controls by importing the
   * necessary dependencies and overriding the default parameters, which
   * can then be placed in the `controlSetRows` section
   * of the `Query` section instead of a predefined control.
   *
   * import { validateNonEmpty } from '@superset-ui/core';
   * import {
   *   sharedControls,
   *   ControlConfig,
   *   ControlPanelConfig,
   * } from '@superset-ui/chart-controls';
   *
   * const myControl: ControlConfig<'SelectControl'> = {
   *   name: 'secondary_entity',
   *   config: {
   *     ...sharedControls.entity,
   *     type: 'SelectControl',
   *     label: t('Secondary Entity'),
   *     mapStateToProps: state => ({
   *       sharedControls.columnChoices(state.datasource)
   *       .columns.filter(c => c.groupby)
   *     })
   *     validators: [validateNonEmpty],
   *   },
   * }
   *
   * In addition to the basic drop down control, there are several predefined
   * control types (can be set via the `type` property) that can be used. Some
   * commonly used examples:
   * - SelectControl: Dropdown to select single or multiple values,
       usually columns
   * - MetricsControl: Dropdown to select metrics, triggering a modal
       to define Metric details
   * - AdhocFilterControl: Control to choose filters
   * - CheckboxControl: A checkbox for choosing true/false values
   * - SliderControl: A slider with min/max values
   * - TextControl: Control for text data
   *
   * For more control input types, check out the `incubator-superset` repo
   * and open this file: superset-frontend/src/explore/components/controls/index.js
   *
   * To ensure all controls have been filled out correctly, the following
   * validators are provided
   * by the `@superset-ui/core/lib/validator`:
   * - validateNonEmpty: must have at least one value
   * - validateInteger: must be an integer value
   * - validateNumber: must be an intger or decimal value
   */
  // For control input types, see: superset-frontend/src/explore/components/controls/index.js
  controlPanelSections: [_chartControls.sections.legacyRegularTime, {
    label: (0, _core.t)('Query'),
    expanded: true,
    controlSetRows: [[{
      name: 'cols',
      config: _extends({}, _chartControls.sharedControls.groupby, {
        label: (0, _core.t)('Columns'),
        description: (0, _core.t)('Columns to group by')
      })
    }], [{
      name: 'metrics',
      config: _extends({}, _chartControls.sharedControls.metrics, {
        // it's possible to add validators to controls if
        // certain selections/types need to be enforced
        validators: [_core.validateNonEmpty]
      })
    }], ['adhoc_filters'], [{
      name: 'row_limit',
      config: _chartControls.sharedControls.row_limit
    }]]
  }, {
    label: (0, _core.t)('Header Controls'),
    expanded: true,
    controlSetRows: [[{
      name: 'header_text',
      config: {
        type: 'TextControl',
        default: '',
        renderTrigger: true,
        // ^ this makes it apply instantaneously, without triggering a "run query" button
        label: (0, _core.t)('Header Text'),
        description: (0, _core.t)('The text you want to see in the header')
      }
    }], [{
      name: 'bold_text',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Bold Text'),
        renderTrigger: true,
        default: true,
        description: (0, _core.t)('A checkbox to make the bold header')
      }
    }], [{
      name: 'text_align',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Text Align'),
        default: 'left',
        choices: [// [value, label]
        ['left', 'Left'], ['center', 'Center'], ['right', 'Right']],
        renderTrigger: true,
        description: (0, _core.t)('The size of your header font')
      }
    }], [{
      name: 'header_font_size',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Font Size'),
        default: 'm',
        choices: [// [value, label]
        ['xxs', 'xx-small'], ['xs', 'x-small'], ['s', 'small'], ['m', 'medium'], ['l', 'large'], ['xl', 'x-large'], ['xxl', 'xx-large']],
        renderTrigger: true,
        description: (0, _core.t)('The size of your header font')
      }
    }]]
  }, {
    label: (0, _core.t)('Y Axis Controls'),
    expanded: true,
    controlSetRows: [[{
      name: 'y_axis',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Show Y Axis'),
        renderTrigger: true,
        default: 'all',
        choices: [// [value, label]
        ['all', 'All'], [showBarYAxis, 'Bar'], [showAreaYAxis, 'Area'], ['none', 'None']],
        description: (0, _core.t)('A checkbox to make the y-axis')
      }
    }], [{
      name: 'y_label',
      config: {
        type: 'TextControl',
        default: '',
        renderTrigger: true,
        // ^ this makes it apply instantaneously, without triggering a "run query" button
        label: (0, _core.t)('Y Label'),
        description: (0, _core.t)('The y-label of chart')
      }
    }], [{
      name: 'y_axis_angle',
      config: {
        type: 'TextControl',
        default: '0',
        renderTrigger: true,
        // ^ this makes it apply instantaneously, without triggering a "run query" button
        label: (0, _core.t)('Y Axis Angle'),
        description: (0, _core.t)('The y-axis angle of chart')
      }
    }]]
  }, {
    label: (0, _core.t)('X Axis Controls'),
    expanded: true,
    controlSetRows: [[{
      name: 'x_axis',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Show X Axis'),
        renderTrigger: true,
        default: false,
        description: (0, _core.t)('A checkbox to make the x-axis')
      }
    }], [{
      name: 'number_x_axis',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Number Of X Ticks'),
        default: 'preserveEnd',
        choices: [// [value, label]
        [0, 'All'], ['preserveEnd', 'Auto']],
        renderTrigger: true,
        description: (0, _core.t)('The size of your header font')
      }
    }], [{
      name: 'x_label',
      config: {
        type: 'TextControl',
        default: '',
        renderTrigger: true,
        // ^ this makes it apply instantaneously, without triggering a "run query" button
        label: (0, _core.t)('X Label'),
        description: (0, _core.t)('The x-label of chart')
      }
    }], [{
      name: 'x_axis_angle',
      config: {
        type: 'TextControl',
        default: '0',
        renderTrigger: true,
        // ^ this makes it apply instantaneously, without triggering a "run query" button
        label: (0, _core.t)('X Axis Angle'),
        description: (0, _core.t)('The x-axis angle of chart')
      }
    }], [{
      name: 'x_axis_tick_size',
      config: {
        type: 'TextControl',
        default: '6',
        renderTrigger: true,
        // ^ this makes it apply instantaneously, without triggering a "run query" button
        label: (0, _core.t)('Tick Size'),
        description: (0, _core.t)('The x-axis tick size of chart')
      }
    }], [{
      name: 'x_tick',
      config: {
        type: 'CheckboxControl',
        default: true,
        renderTrigger: true,
        // ^ this makes it apply instantaneously, without triggering a "run query" button
        label: (0, _core.t)('Show X Tick'),
        description: (0, _core.t)('A checkbox to make the x-tick')
      }
    }], [{
      name: 'x_axis_height',
      config: {
        type: 'TextControl',
        default: '30',
        renderTrigger: true,
        // ^ this makes it apply instantaneously, without triggering a "run query" button
        label: (0, _core.t)('X Axis Height'),
        description: (0, _core.t)('The x-axis height of chart')
      }
    }]]
  }, {
    label: (0, _core.t)('Chart Custom Controls'),
    expanded: true,
    controlSetRows: [[{
      name: 'custom_field_names',
      config: {
        type: 'TextControl',
        default: '',
        renderTrigger: true,
        // ^ this makes it apply instantaneously, without triggering a "run query" button
        label: (0, _core.t)('Custom Field Names'),
        description: (0, _core.t)('The custom field names you want to show in your chart, each element should be splited by ;')
      }
    }], [{
      name: 'legend',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Show Legend'),
        renderTrigger: true,
        default: true,
        description: (0, _core.t)('A checkbox to make the legend')
      }
    }], [{
      name: 'legend_position',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Legend Position'),
        default: 'top',
        choices: [// [value, label]
        ['top', 'Top'], ['bottom', 'Bottom']],
        renderTrigger: true,
        description: (0, _core.t)('The position of legend')
      }
    }], ['color_scheme']]
  }, {
    label: (0, _core.t)('Area Chart Controls'),
    expanded: true,
    controlSetRows: [[{
      name: 'area_fields',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Area Fields'),
        renderTrigger: true,
        multi: true,
        description: (0, _core.t)('The custom field names you want to show in your chart'),
        mapStateToProps: chart => {
          var metrics = chart.form_data.metrics || [];
          return {
            choices: metrics.map(metric => [metric, metric])
          };
        }
      }
    }], [{
      name: 'area_y_orientation',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Y Axis Orientation'),
        renderTrigger: true,
        default: 'left',
        choices: [// [value, label]
        ['left', 'Left'], ['right', 'Right']],
        description: (0, _core.t)('The area y-axis orientation of chart')
      }
    }], [{
      name: 'area_label',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Show Area Chart Label'),
        renderTrigger: true,
        default: false,
        description: (0, _core.t)('A checkbox to make the area chart labels')
      }
    }], [{
      name: 'area_label_position',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Area Chart Label Position'),
        default: 'top',
        choices: [// [value, label]
        ['top', 'Top'], ['bottom', 'Bottom'], ['left', 'Left'], ['right', 'Right']],
        renderTrigger: true,
        description: (0, _core.t)('The position of area chart labels')
      }
    }], [{
      name: 'area_label_angle',
      config: {
        type: 'TextControl',
        default: '0',
        renderTrigger: true,
        // ^ this makes it apply instantaneously, without triggering a "run query" button
        label: (0, _core.t)('Area Label Angle'),
        description: (0, _core.t)('The angle of area chart labels')
      }
    }], [{
      name: 'area_label_font_size',
      config: {
        type: 'SelectControl',
        default: '10',
        choices: [// [value, label]
        ['8', '8'], ['10', '10'], ['12', '12'], ['14', '14']],
        renderTrigger: true,
        // ^ this makes it apply instantaneously, without triggering a "run query" button
        label: (0, _core.t)('Area Label Font Size'),
        description: (0, _core.t)('The font size of area chart labels')
      }
    }]]
  }, {
    label: (0, _core.t)('Bar Chart Controls'),
    expanded: true,
    controlSetRows: [[{
      name: 'bar_y_orientation',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Y Axis Orientation'),
        renderTrigger: true,
        default: 'left',
        choices: [// [value, label]
        ['left', 'Left'], ['right', 'Right']],
        description: (0, _core.t)('The bar y-axis orientation of chart')
      }
    }], [{
      name: 'bar_label',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Show Bar Chart Label'),
        renderTrigger: true,
        default: false,
        description: (0, _core.t)('A checkbox to make the bar chart labels')
      }
    }], [{
      name: 'bar_label_position',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Bar Chart Label Position'),
        default: 'top',
        choices: [// [value, label]
        ['top', 'Top'], ['bottom', 'Bottom'], ['left', 'Left'], ['right', 'Right'], ['center', 'Center'], ['insideTop', 'Inside Top'], ['insideBottom', 'Inside Bottom'], ['insideLeft', 'Inside Left'], ['insideRight', 'Inside Right']],
        renderTrigger: true,
        description: (0, _core.t)('The position of bar chart labels')
      }
    }], [{
      name: 'bar_label_angle',
      config: {
        type: 'TextControl',
        default: '0',
        renderTrigger: true,
        // ^ this makes it apply instantaneously, without triggering a "run query" button
        label: (0, _core.t)('Bar Label Angle'),
        description: (0, _core.t)('The angle of bar chart labels')
      }
    }], [{
      name: 'bar_label_font_size',
      config: {
        type: 'SelectControl',
        default: '10',
        choices: [// [value, label]
        ['8', '8'], ['10', '10'], ['12', '12'], ['14', '14']],
        renderTrigger: true,
        // ^ this makes it apply instantaneously, without triggering a "run query" button
        label: (0, _core.t)('Bar Label Font Size'),
        description: (0, _core.t)('The font size of bar chart labels')
      }
    }]]
  }]
};
var _default = config;
exports.default = _default;