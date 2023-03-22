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
import React, { useEffect, createRef } from 'react';
import { styled } from '@superset-ui/core';
import { getCategoricalSchemeRegistry } from '@superset-ui/core';
import { SupersetPluginChartMixedBarAreaProps, SupersetPluginChartMixedBarAreaStylesProps } from './types';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ComposedChart,
  LabelList,
} from "recharts";
import { showAreaYAxis, showBarYAxis } from './plugin/controlPanel';

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

const Styles = styled.div<SupersetPluginChartMixedBarAreaStylesProps>`
  padding: ${({ theme }) => theme.gridUnit * 0}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  h4 {
    /* You can use your props to control CSS! */
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.gridUnit * 1}px;
    font-size: ${({ theme, headerFontSize }) => theme.typography.sizes[headerFontSize]}px;
    font-weight: ${({ theme, boldText }) => theme.typography.weights[boldText ? 'bold' : 'normal']};
  }
`;

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function SupersetPluginChartMixedBarArea(props: SupersetPluginChartMixedBarAreaProps) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const { data, height, width } = props;

  const rootElem = createRef<HTMLDivElement>();

  // Often, you just want to get a hold of the DOM and go nuts.
  // Here, you can do that with createRef, and the useEffect hook.
  useEffect(() => {
    const root = rootElem.current as HTMLElement;
    console.log('Plugin element', root);
  });

  console.log('Plugin props', props);

  const keys = Object.keys(data[0]);

  const numberOfTicks = 5;

  const groupFields = keys.filter(key => typeof (data[0][key]) === 'string');

  const numberFields = keys.slice(groupFields.length);

  const itemLabel = groupFields[groupFields.length - 1];

  const customFieldNames = props.customFieldNames !== undefined ? props.customFieldNames.split(';').map(field => {
    return field.trim();
  }) : [];

  const areaFields = props.areaFields !== undefined ? props.areaFields : [];

  const barFields = numberFields.filter(key => !areaFields.includes(key));

  const colors: any = getCategoricalSchemeRegistry().get(props.colorScheme)?.colors;

  const numberFormatter = (num: any) => {
    const lookup = [
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "B" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    let result = num.toFixed(2);
    lookup.forEach((item, index) => {
      if (index !== 0) {
        let preLookup = lookup[index - 1];
        if (item.value >= Math.abs(num) && Math.abs(num) > preLookup.value) {
          result = (num / preLookup.value).toFixed(2) + preLookup.symbol;
        }
      }
    })
    return result;
  }

  const roundUpToNearestDecimal = (number: number, exponent: number) => {
    let nearestDecimal: number = Math.pow(10, exponent);
    let newNumber = Math.abs(number) % nearestDecimal === 0 ? Math.abs(number) : Math.round(Math.abs(number) / nearestDecimal) * nearestDecimal + nearestDecimal;;
    return number < 0 ? -1 * newNumber : newNumber;
  }

  const getMaxMinValueByKey = (key: string) => {
    let maxValue: any = 0;
    let minValue: any = 0;
    data.forEach(item => {
      let values: any = Object.keys(item).map((itemKey) => {
        if (typeof item[itemKey] == 'number' && key === itemKey) {
          return item[itemKey];
        } else {
          return 0;
        }
      });
      maxValue = maxValue > Math.max(...values) ? maxValue : Math.max(...values);
      minValue = minValue < Math.min(...values) ? minValue : Math.min(...values);
    });
    return [roundUpToNearestDecimal(minValue, Math.round(Math.abs(minValue)).toString().length - 1), roundUpToNearestDecimal(maxValue, Math.round(Math.abs(maxValue)).toString().length - 1)];
  }

  const roundIndex = (number: number) => {
    const lookup = [
      { percent: 0, value: 0 },
      { percent: 0.25, value: 1 },
      { percent: 0.5, value: 2 },
      { percent: 0.75, value: 3 },
      { percent: 1, value: 4 },
    ]
    let newIndex = 0;
    lookup.slice(1).forEach((item, index) => {
      if (item.percent >= number && number > lookup[index].percent) {
        newIndex = Math.abs(item.percent - number) > Math.abs(lookup[index].percent - number) ? lookup[index].value : item.value;
      }
    });
    return newIndex;
  }

  const getNewZeroIndex = (fieldRanges: any) => {
    let index = 0;
    fieldRanges.forEach(range => {
      index += range.indexOf(0) / (range.length - 1);
    });
    return roundIndex(index / fieldRanges.length);
  }

  const generateTicks = (fieldRanges: any, zeroIndex: number) => {
    let fieldTicks: any = [];
    fieldRanges.forEach(value => {
      let minRange = zeroIndex === 0 ? Math.abs(Math.min(...value)) : Math.abs(Math.min(...value)) / zeroIndex;
      let maxRange = numberOfTicks - 1 - zeroIndex === 0 ? Math.abs(Math.max(...value)) : Math.abs(Math.max(...value)) / (4 - zeroIndex);
      let range = Math.max(...[minRange, maxRange]);
      let ticks = [0, 0, 0, 0, 0].map((tick, index) => {
        return range * (index - zeroIndex);
      });
      fieldTicks.push(ticks);
    });
    return fieldTicks;
  }

  const getFieldTicks = () => {
    let fieldRanges: any = [];
    areaFields.forEach(field => {
      if (numberFields.includes(field)) {
        let range = getMaxMinValueByKey(field);
        if (!range.includes(0)) {
          range.push(0);
        }
        fieldRanges.push(range.sort(function (a, b) { return a - b }));
      }
    });
    return generateTicks(fieldRanges, getNewZeroIndex(fieldRanges));
  }

  const areaTicks = getFieldTicks();

  return (
    <Styles
      ref={rootElem}
      boldText={props.boldText}
      headerFontSize={props.headerFontSize}
      height={height}
      width={width}
    >
      <h4 style={{ textAlign: props.textAlign !== undefined ? props.textAlign : 'left' }}>{props.headerText}</h4>
      <ComposedChart
        width={width}
        height={height}
        data={data}
      >
        <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
        <XAxis
          label={{ value: props.xLabel, angle: 0, position: 'insideBottom' }}
          dataKey={itemLabel}
          type='category'
          angle={props.xAxisAngle !== undefined ? parseInt(props.xAxisAngle) : 0}
          hide={!props.xAxis}
          scale='auto'
          tickLine={props.xTick !== undefined ? props.xTick : true}
          tickSize={props.xAxisTickSize !== undefined ? parseInt(props.xAxisTickSize) : 6}
          padding={{ left: 30, right: 30 }}
          height={props.xAxisHeight !== undefined ? parseInt(props.xAxisHeight) : 30}
          interval={props.numberXAxis !== undefined ? props.numberXAxis : 'preserveEnd'}
        ></XAxis>
        {numberFields.map((key, index) => {
          let ticks: any = (areaFields.includes(key) && numberFields.includes(key)) ? areaTicks[areaFields.indexOf(key)] : [];
          return (areaFields.includes(key) && numberFields.includes(key)) ? (
            <YAxis
              yAxisId={index}
              label={{
                value: props.yLabel,
                angle: props.areaYOrientation !== undefined && props.areaYOrientation === 'right' ? 90 : -90,
                position: props.areaYOrientation !== undefined && props.areaYOrientation === 'right' ? 'insideRight' : 'insideLeft'
              }}
              dataKey={key}
              type='number'
              hide={props.yAxis !== undefined && [showBarYAxis, 'none'].includes(props.yAxis) ? true : false}
              ticks={ticks}
              stroke={colors[index]}
              angle={props.yAxisAngle !== undefined ? parseInt(props.yAxisAngle) : 0}
              orientation={props.areaYOrientation !== undefined ? props.areaYOrientation : 'left'}
              tickFormatter={numberFormatter} >
            </YAxis>) :
            (
              <YAxis
                yAxisId={index}
                label={{
                  value: props.yLabel,
                  angle: props.barYOrientation !== undefined && props.barYOrientation === 'right' ? 90 : -90,
                  position: props.barYOrientation !== undefined && props.barYOrientation === 'right' ? 'insideRight' : 'insideLeft'
                }}
                dataKey={key}
                type='number'
                hide={props.yAxis !== undefined && [showAreaYAxis, 'none'].includes(props.yAxis) ? true : false}
                stroke={colors[index]}
                angle={props.yAxisAngle !== undefined ? parseInt(props.yAxisAngle) : 0}
                orientation={props.barYOrientation !== undefined ? props.barYOrientation : 'left'}
                tickFormatter={numberFormatter}>
              </YAxis>);
        })}
        <Tooltip />
        {(props.legend !== undefined && props.legend) && <Legend verticalAlign={props.legendPosition !== undefined ? props.legendPosition : 'top'} />}
        {barFields.length > 0 && barFields.map(key => {
          let index = numberFields.indexOf(key);
          let fieldColor = colors[index];
          let fieldName = customFieldNames.length === 0 ? '' : customFieldNames[index];
          return (
            <Bar
              yAxisId={index}
              dataKey={key}
              name={fieldName}
              fill={fieldColor}
            >
              {(props.barLabel !== undefined && props.barLabel) &&
                <LabelList
                  dataKey={key}
                  position={props.barLabelPosition !== undefined ? props.barLabelPosition : 'right'}
                  angle={props.barLabelAngle !== undefined ? parseInt(props.barLabelAngle) : 0}
                  formatter={numberFormatter}
                  style={{ color: 'black', fontSize: props.barLabelFontSize !== undefined ? parseInt(props.barLabelFontSize) : 10, textShadow: '-1px 0px 0px white, 1px 0px 0px white, 0px -1px 0px white, 0px 1px 0px white' }}
                ></LabelList>}
            </Bar>
          );
        })}
        {areaFields.length > 0 && areaFields.map(key => {
          let index = numberFields.indexOf(key);
          let fieldColor = colors[index];
          let fieldName = customFieldNames.length === 0 ? '' : customFieldNames[index];
          return numberFields.includes(key) ? (
            <Area type="monotone"
              yAxisId={index}
              dataKey={key}
              name={fieldName}
              stroke={fieldColor}
              fill={fieldColor}
              dot={{ fill: 'white', stroke: fieldColor, strokeWidth: 2 }}
            >
              {(props.areaLabel !== undefined && props.areaLabel) &&
                <LabelList
                  dataKey={key}
                  position={props.areaLabelPosition !== undefined ? props.areaLabelPosition : 'right'}
                  angle={props.areaLabelAngle !== undefined ? parseInt(props.areaLabelAngle) : 0}
                  formatter={numberFormatter}
                  style={{ color: 'black', fontSize: props.areaLabelFontSize !== undefined ? parseInt(props.areaLabelFontSize) : 10, textShadow: '-1px 0px 0px white, 1px 0px 0px white, 0px -1px 0px white, 0px 1px 0px white' }}
                ></LabelList>}
            </Area>
          ) : (<></>);
        })}
      </ComposedChart>
    </Styles >
  );
}
