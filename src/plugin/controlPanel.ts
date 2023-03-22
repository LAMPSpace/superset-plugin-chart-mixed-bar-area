/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { t, validateNonEmpty } from '@superset-ui/core';
import { ControlPanelConfig, sections, sharedControls } from '@superset-ui/chart-controls';
import { getSequentialSchemeRegistry } from '@superset-ui/core';
import { GenericDataType } from '@superset-ui/core';

const sequentialSchemeRegistry = getSequentialSchemeRegistry();
const config: ControlPanelConfig = {
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
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'cols',
            config: {
              ...sharedControls.groupby,
              label: t('Columns'),
              description: t('Columns to group by'),
            },
          },
        ],
        [
          {
            name: 'metrics',
            config: {
              ...sharedControls.metrics,
              // it's possible to add validators to controls if
              // certain selections/types need to be enforced
              validators: [validateNonEmpty],
            },
          },
        ],
        ['adhoc_filters'],
        [
          {
            name: 'row_limit',
            config: sharedControls.row_limit,
          },
        ],
      ],
    },
    {
      label: t('Header Controls'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'header_text',
            config: {
              type: 'TextControl',
              default: '',
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('Header Text'),
              description: t('The text you want to see in the header'),
            },
          },
        ],
        [
          {
            name: 'bold_text',
            config: {
              type: 'CheckboxControl',
              label: t('Bold Text'),
              renderTrigger: true,
              default: true,
              description: t('A checkbox to make the bold header'),
            },
          },
        ],
        [
          {
            name: 'text_align',
            config: {
              type: 'SelectControl',
              label: t('Text Align'),
              default: 'left',
              choices: [
                // [value, label]
                ['left', 'Left'],
                ['center', 'Center'],
                ['right', 'Right'],
              ],
              renderTrigger: true,
              description: t('The size of your header font'),
            },
          },
        ],
        [
          {
            name: 'header_font_size',
            config: {
              type: 'SelectControl',
              label: t('Font Size'),
              default: 'm',
              choices: [
                // [value, label]
                ['xxs', 'xx-small'],
                ['xs', 'x-small'],
                ['s', 'small'],
                ['m', 'medium'],
                ['l', 'large'],
                ['xl', 'x-large'],
                ['xxl', 'xx-large'],
              ],
              renderTrigger: true,
              description: t('The size of your header font'),
            },
          },
        ],
      ],
    },
    {
      label: t('Y Axis Controls'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'y_axis',
            config: {
              type: 'CheckboxControl',
              label: t('Y Axis'),
              renderTrigger: true,
              default: false,
              description: t('A checkbox to make the y-axis'),
            },
          },
        ],
        [
          {
            name: 'y_label',
            config: {
              type: 'TextControl',
              default: '',
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('Y Label'),
              description: t('The y-label of chart'),
            },
          },
        ],
        [
          {
            name: 'y_axis_angle',
            config: {
              type: 'TextControl',
              default: '0',
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('Y Axis Angle'),
              description: t('The y-axis angle of chart'),
            },
          },
        ],
      ],
    },
    {
      label: t('X Axis Controls'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'x_axis',
            config: {
              type: 'CheckboxControl',
              label: t('X Axis'),
              renderTrigger: true,
              default: false,
              description: t('A checkbox to make the x-axis'),
            },
          },
        ],
        [
          {
            name: 'number_x_axis',
            config: {
              type: 'SelectControl',
              label: t('Number Of X Ticks'),
              default: 'preserveEnd',
              choices: [
                // [value, label]
                [0, 'All'],
                ['preserveEnd', 'Auto'],
              ],
              renderTrigger: true,
              description: t('The size of your header font'),
            },
          },
        ],
        [
          {
            name: 'x_label',
            config: {
              type: 'TextControl',
              default: '',
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('X Label'),
              description: t('The x-label of chart'),
            },
          },
        ],
        [
          {
            name: 'x_axis_angle',
            config: {
              type: 'TextControl',
              default: '0',
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('X Axis Angle'),
              description: t('The x-axis angle of chart'),
            },
          },
        ],
        [
          {
            name: 'x_axis_height',
            config: {
              type: 'TextControl',
              default: '30',
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('X Axis height'),
              description: t('The x-axis height of chart'),
            },
          },
        ],
      ],
    },
    {
      label: t('Chart Custom Controls'),
      expanded: true,
      controlSetRows: [
        // [
        //   {
        //     name: 'secondary_entity',
        //     config: {
        //       type: 'SelectControl',
        //       label: t('Secondary Entity'),
        //       renderTrigger: true,
        //       multi: true,
        //       description: t('The custom field names you want to show in your chart, each element should be splited by ;'),
        //       mapStateToProps: (explore, _, chart) => {
        //         const { colnames, coltypes } =
        //           chart?.queriesResponse?.[0] ?? {};
        //         const numericColumns =
        //           Array.isArray(colnames) && Array.isArray(coltypes)
        //             ? colnames
        //               .filter(
        //                 (colname: string, index: number) =>
        //                   coltypes[index] === GenericDataType.NUMERIC,
        //               )
        //               .map(colname => ([colname, colname]))
        //             : [];
        //         console.log('Debug ', numericColumns);
        //         return {
        //           choices: numericColumns,
        //         };
        //       },
        //     },
        //   }
        // ],
        [
          {
            name: 'custom_field_names',
            config: {
              type: 'TextControl',
              default: '',
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('Custom Field Names'),
              description: t('The custom field names you want to show in your chart, each element should be splited by ;'),
            },
          },
        ],
        [
          {
            name: 'legend',
            config: {
              type: 'CheckboxControl',
              label: t('Legend'),
              renderTrigger: true,
              default: true,
              description: t('A checkbox to make the legend'),
            },
          },
        ],
        [
          {
            name: 'legend_position',
            config: {
              type: 'SelectControl',
              label: t('Legend Position'),
              default: 'top',
              choices: [
                // [value, label]
                ['top', 'Top'],
                ['bottom', 'Bottom'],
              ],
              renderTrigger: true,
              description: t('The position of legend'),
            },
          },
        ],
        [
          {
            name: 'custom_linear_color_scheme',
            config: {
              type: 'ColorSchemeControl',
              label: t('Linear color scheme'),
              choices: () =>
                sequentialSchemeRegistry.values().map(value => [value.id, value.label]),
              default: sequentialSchemeRegistry.getDefaultKey(),
              clearable: false,
              description: '',
              renderTrigger: true,
              schemes: () => sequentialSchemeRegistry.getMap(),
              isLinear: true,
            },
          },
        ],
      ],
    },
    {
      label: t('Area Chart Controls'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'area_fields',
            config: {
              type: 'TextControl',
              default: '',
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('Area Fields'),
              description: t('The fields that you want to show using area chart, each element should be splited by ;'),
            },
          },
        ],
        [
          {
            name: 'area_label',
            config: {
              type: 'CheckboxControl',
              label: t('Area Chart Label'),
              renderTrigger: true,
              default: false,
              description: t('A checkbox to make the area chart labels'),
            },
          },
        ],
        [
          {
            name: 'area_label_position',
            config: {
              type: 'SelectControl',
              label: t('Area Chart Label Position'),
              default: 'top',
              choices: [
                // [value, label]
                ['top', 'Top'],
                ['bottom', 'Bottom'],
                ['left', 'Left'],
                ['right', 'Right'],
              ],
              renderTrigger: true,
              description: t('The position of area chart labels'),
            },
          },
        ],
        [
          {
            name: 'area_label_angle',
            config: {
              type: 'TextControl',
              default: '0',
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('Area Label Angle'),
              description: t('The angle of area chart labels'),
            },
          },
        ],
        [
          {
            name: 'area_label_font_size',
            config: {
              type: 'SelectControl',
              default: '10',
              choices: [
                // [value, label]
                ['8', '8'],
                ['10', '10'],
                ['12', '12'],
                ['14', '14'],
              ],
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('Area Label Font Size'),
              description: t('The font size of area chart labels'),
            },
          },
        ],
      ],
    },
    {
      label: t('Bar Chart Controls'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'bar_label',
            config: {
              type: 'CheckboxControl',
              label: t('Bar Chart Label'),
              renderTrigger: true,
              default: false,
              description: t('A checkbox to make the bar chart labels'),
            },
          },
        ],
        [
          {
            name: 'bar_label_position',
            config: {
              type: 'SelectControl',
              label: t('Bar Chart Label Position'),
              default: 'top',
              choices: [
                // [value, label]
                ['top', 'Top'],
                ['bottom', 'Bottom'],
                ['left', 'Left'],
                ['right', 'Right'],
                ['center', 'Center'],
                ['insideTop', 'Inside Top'],
                ['insideBottom', 'Inside Bottom'],
                ['insideLeft', 'Inside Left'],
                ['insideRight', 'Inside Right'],
              ],
              renderTrigger: true,
              description: t('The position of bar chart labels'),
            },
          },
        ],
        [
          {
            name: 'bar_label_angle',
            config: {
              type: 'TextControl',
              default: '0',
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('Bar Label Angle'),
              description: t('The angle of bar chart labels'),
            },
          },
        ],
        [
          {
            name: 'bar_label_font_size',
            config: {
              type: 'SelectControl',
              default: '10',
              choices: [
                // [value, label]
                ['8', '8'],
                ['10', '10'],
                ['12', '12'],
                ['14', '14'],
              ],
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('Bar Label Font Size'),
              description: t('The font size of bar chart labels'),
            },
          },
        ],
      ],
    },
  ],
};

export default config;
