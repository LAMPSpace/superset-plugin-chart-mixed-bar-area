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
import { ChartProps } from '@superset-ui/core';
import transformProps from '../../src/plugin/transformProps';

describe('SupersetPluginChartMixedBarArea transformProps', () => {
  const formData = {
    colorScheme: 'bnbColors',
    datasource: '3__table',
    granularity_sqla: 'ds',
    metric: 'sum__num',
    series: 'name',
    boldText: true,
    headerFontSize: 'xs',
    headerText: 'my text',
    textAlign: 'top',
    legend: true,
    legendPosition: 'bottom',
    yLabel: 'y label',
    xLabel: 'x label',
    yAxis: 'all',
    xAxis: false,
    yAxisAngle: 0,
    xAxisAngle: 0,
    areaYOrientation: 'left',
    barYOrientation: 'left',
    areaFields: '',
    areaLabel: false,
    barLabel: false,
    areaLabelPosition: 'top',
    barLabelPosition: top,
    areaLabelAngle: 0,
    barLabelAngle: 0,
    areaLabelFontSize: 10,
    barLabelFontSize: 10,
    xAxisHeight: 30,
    xAxisTickSize: 6,
    xTick: true,
    numberXAxis: 0,
    customLinearColorScheme: 'schemeCool',
    customFieldNames: '',
  };
  const chartProps = new ChartProps({
    formData,
    width: 800,
    height: 600,
    queriesData: [{
      data: [{ name: 'Hulk', sum__num: 1 }],
    }],
  });

  it('should transform chart props for viz', () => {
    expect(transformProps(chartProps)).toEqual({
      width: 800,
      height: 600,
      boldText: true,
      headerFontSize: 'xs',
      headerText: 'my text',
      textAlign: 'top',
      legend: true,
      legendPosition: 'bottom',
      yLabel: 'y label',
      xLabel: 'x label',
      yAxis: 'all',
      xAxis: false,
      yAxisAngle: 0,
      xAxisAngle: 0,
      areaYOrientation: 'left',
      barYOrientation: 'left',
      areaFields: '',
      areaLabel: false,
      barLabel: false,
      areaLabelPosition: 'top',
      barLabelPosition: top,
      areaLabelAngle: 0,
      barLabelAngle: 0,
      areaLabelFontSize: 10,
      barLabelFontSize: 10,
      xAxisHeight: 30,
      xAxisTickSize: 6,
      xTick: true,
      numberXAxis: 0,
      customFieldNames: '',
      data: [{ name: 'Hulk', sum__num: 1 }],
    });
  });
});
