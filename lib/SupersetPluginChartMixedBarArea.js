"use strict";

exports.__esModule = true;
exports.default = SupersetPluginChartMixedBarArea;

var _react = _interopRequireWildcard(require("react"));

var _core = require("@superset-ui/core");

var _recharts = require("recharts");

var _controlPanel = require("./plugin/controlPanel");

var _templateObject;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled
// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts
var Styles = _core.styled.div(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["\n  padding: ", "px;\n  border-radius: ", "px;\n  height: ", "px;\n  width: ", "px;\n  h4 {\n    /* You can use your props to control CSS! */\n    margin-top: 0;\n    margin-bottom: ", "px;\n    font-size: ", "px;\n    font-weight: ", ";\n  }\n"])), _ref => {
  var {
    theme
  } = _ref;
  return theme.gridUnit * 0;
}, _ref2 => {
  var {
    theme
  } = _ref2;
  return theme.gridUnit * 2;
}, _ref3 => {
  var {
    height
  } = _ref3;
  return height;
}, _ref4 => {
  var {
    width
  } = _ref4;
  return width;
}, _ref5 => {
  var {
    theme
  } = _ref5;
  return theme.gridUnit * 1;
}, _ref6 => {
  var {
    theme,
    headerFontSize
  } = _ref6;
  return theme.typography.sizes[headerFontSize];
}, _ref7 => {
  var {
    theme,
    boldText
  } = _ref7;
  return theme.typography.weights[boldText ? 'bold' : 'normal'];
});
/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */


function SupersetPluginChartMixedBarArea(props) {
  var _getCategoricalScheme;

  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  var {
    data,
    height,
    width
  } = props;
  var rootElem = /*#__PURE__*/(0, _react.createRef)(); // Often, you just want to get a hold of the DOM and go nuts.
  // Here, you can do that with createRef, and the useEffect hook.

  (0, _react.useEffect)(() => {
    var root = rootElem.current;
    console.log('Plugin element', root);
  });
  console.log('Plugin props', props);
  var keys = Object.keys(data[0]);
  var numberOfTicks = 5;
  var groupFields = keys.filter(key => typeof data[0][key] === 'string');
  var numberFields = keys.slice(groupFields.length);
  var itemLabel = groupFields[groupFields.length - 1];
  var customFieldNames = props.customFieldNames !== undefined ? props.customFieldNames.split(';').map(field => {
    return field.trim();
  }) : [];
  var areaFields = props.areaFields !== undefined ? props.areaFields : [];
  var barFields = numberFields.filter(key => !areaFields.includes(key));
  var colors = (_getCategoricalScheme = (0, _core.getCategoricalSchemeRegistry)().get(props.colorScheme)) == null ? void 0 : _getCategoricalScheme.colors;

  var numberFormatter = num => {
    var lookup = [{
      value: 1e3,
      symbol: "k"
    }, {
      value: 1e6,
      symbol: "M"
    }, {
      value: 1e9,
      symbol: "B"
    }, {
      value: 1e12,
      symbol: "T"
    }, {
      value: 1e15,
      symbol: "P"
    }, {
      value: 1e18,
      symbol: "E"
    }];
    var result = num.toFixed(2);
    lookup.forEach((item, index) => {
      if (index !== 0) {
        var preLookup = lookup[index - 1];

        if (item.value >= Math.abs(num) && Math.abs(num) > preLookup.value) {
          result = (num / preLookup.value).toFixed(2) + preLookup.symbol;
        }
      }
    });
    return result;
  };

  var roundUpToNearestDecimal = (number, exponent) => {
    var nearestDecimal = Math.pow(10, exponent);
    var newNumber = Math.abs(number) % nearestDecimal === 0 ? Math.abs(number) : Math.round(Math.abs(number) / nearestDecimal) * nearestDecimal + nearestDecimal;
    ;
    return number < 0 ? -1 * newNumber : newNumber;
  };

  var getMaxMinValueByKey = key => {
    var maxValue = 0;
    var minValue = 0;
    data.forEach(item => {
      var values = Object.keys(item).map(itemKey => {
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
  };

  var roundIndex = number => {
    var lookup = [{
      percent: 0,
      value: 0
    }, {
      percent: 0.25,
      value: 1
    }, {
      percent: 0.5,
      value: 2
    }, {
      percent: 0.75,
      value: 3
    }, {
      percent: 1,
      value: 4
    }];
    var newIndex = 0;
    lookup.slice(1).forEach((item, index) => {
      if (item.percent >= number && number > lookup[index].percent) {
        newIndex = Math.abs(item.percent - number) > Math.abs(lookup[index].percent - number) ? lookup[index].value : item.value;
      }
    });
    return newIndex;
  };

  var getNewZeroIndex = fieldRanges => {
    var index = 0;
    fieldRanges.forEach(range => {
      index += range.indexOf(0) / (range.length - 1);
    });
    return roundIndex(index / fieldRanges.length);
  };

  var generateTicks = (fieldRanges, zeroIndex) => {
    var fieldTicks = [];
    fieldRanges.forEach(value => {
      var minRange = zeroIndex === 0 ? Math.abs(Math.min(...value)) : Math.abs(Math.min(...value)) / zeroIndex;
      var maxRange = numberOfTicks - 1 - zeroIndex === 0 ? Math.abs(Math.max(...value)) : Math.abs(Math.max(...value)) / (4 - zeroIndex);
      var range = Math.max(...[minRange, maxRange]);
      var ticks = [0, 0, 0, 0, 0].map((tick, index) => {
        return range * (index - zeroIndex);
      });
      fieldTicks.push(ticks);
    });
    return fieldTicks;
  };

  var getFieldTicks = () => {
    var fieldRanges = [];
    areaFields.forEach(field => {
      if (numberFields.includes(field)) {
        var range = getMaxMinValueByKey(field);

        if (!range.includes(0)) {
          range.push(0);
        }

        fieldRanges.push(range.sort(function (a, b) {
          return a - b;
        }));
      }
    });
    return generateTicks(fieldRanges, getNewZeroIndex(fieldRanges));
  };

  var areaTicks = getFieldTicks();
  return /*#__PURE__*/_react.default.createElement(Styles, {
    ref: rootElem,
    boldText: props.boldText,
    headerFontSize: props.headerFontSize,
    height: height,
    width: width
  }, /*#__PURE__*/_react.default.createElement("h4", {
    style: {
      textAlign: props.textAlign !== undefined ? props.textAlign : 'left'
    }
  }, props.headerText), /*#__PURE__*/_react.default.createElement(_recharts.ComposedChart, {
    width: width,
    height: height,
    data: data
  }, /*#__PURE__*/_react.default.createElement(_recharts.CartesianGrid, {
    stroke: "#f5f5f5",
    strokeDasharray: "3 3"
  }), /*#__PURE__*/_react.default.createElement(_recharts.XAxis, {
    label: {
      value: props.xLabel,
      angle: 0,
      position: 'insideBottom'
    },
    dataKey: itemLabel,
    type: "category",
    angle: props.xAxisAngle !== undefined ? parseInt(props.xAxisAngle) : 0,
    hide: !props.xAxis,
    scale: "auto",
    tickLine: props.xTick !== undefined ? props.xTick : true,
    tickSize: props.xAxisTickSize !== undefined ? parseInt(props.xAxisTickSize) : 6,
    padding: {
      left: 30,
      right: 30
    },
    height: props.xAxisHeight !== undefined ? parseInt(props.xAxisHeight) : 30,
    interval: props.numberXAxis !== undefined ? props.numberXAxis : 'preserveEnd'
  }), numberFields.map((key, index) => {
    var ticks = areaFields.includes(key) && numberFields.includes(key) ? areaTicks[areaFields.indexOf(key)] : [];
    return areaFields.includes(key) && numberFields.includes(key) ? /*#__PURE__*/_react.default.createElement(_recharts.YAxis, {
      yAxisId: index,
      label: {
        value: props.yLabel,
        angle: props.areaYOrientation !== undefined && props.areaYOrientation === 'right' ? 90 : -90,
        position: props.areaYOrientation !== undefined && props.areaYOrientation === 'right' ? 'insideRight' : 'insideLeft'
      },
      dataKey: key,
      type: "number",
      hide: props.yAxis !== undefined && [_controlPanel.showBarYAxis, 'none'].includes(props.yAxis) ? true : false,
      ticks: ticks,
      stroke: colors[index],
      angle: props.yAxisAngle !== undefined ? parseInt(props.yAxisAngle) : 0,
      orientation: props.areaYOrientation !== undefined ? props.areaYOrientation : 'left',
      tickFormatter: numberFormatter
    }) : /*#__PURE__*/_react.default.createElement(_recharts.YAxis, {
      yAxisId: index,
      label: {
        value: props.yLabel,
        angle: props.barYOrientation !== undefined && props.barYOrientation === 'right' ? 90 : -90,
        position: props.barYOrientation !== undefined && props.barYOrientation === 'right' ? 'insideRight' : 'insideLeft'
      },
      dataKey: key,
      type: "number",
      hide: props.yAxis !== undefined && [_controlPanel.showAreaYAxis, 'none'].includes(props.yAxis) ? true : false,
      stroke: colors[index],
      angle: props.yAxisAngle !== undefined ? parseInt(props.yAxisAngle) : 0,
      orientation: props.barYOrientation !== undefined ? props.barYOrientation : 'left',
      tickFormatter: numberFormatter
    });
  }), /*#__PURE__*/_react.default.createElement(_recharts.Tooltip, null), props.legend !== undefined && props.legend && /*#__PURE__*/_react.default.createElement(_recharts.Legend, {
    verticalAlign: props.legendPosition !== undefined ? props.legendPosition : 'top'
  }), barFields.length > 0 && barFields.map(key => {
    var index = numberFields.indexOf(key);
    var fieldColor = colors[index];
    var fieldName = customFieldNames.length === 0 ? '' : customFieldNames[index];
    return /*#__PURE__*/_react.default.createElement(_recharts.Bar, {
      yAxisId: index,
      dataKey: key,
      name: fieldName,
      fill: fieldColor
    }, props.barLabel !== undefined && props.barLabel && /*#__PURE__*/_react.default.createElement(_recharts.LabelList, {
      dataKey: key,
      position: props.barLabelPosition !== undefined ? props.barLabelPosition : 'right',
      angle: props.barLabelAngle !== undefined ? parseInt(props.barLabelAngle) : 0,
      formatter: numberFormatter,
      style: {
        color: 'black',
        fontSize: props.barLabelFontSize !== undefined ? parseInt(props.barLabelFontSize) : 10,
        textShadow: '-1px 0px 0px white, 1px 0px 0px white, 0px -1px 0px white, 0px 1px 0px white'
      }
    }));
  }), areaFields.length > 0 && areaFields.map(key => {
    var index = numberFields.indexOf(key);
    var fieldColor = colors[index];
    var fieldName = customFieldNames.length === 0 ? '' : customFieldNames[index];
    return numberFields.includes(key) ? /*#__PURE__*/_react.default.createElement(_recharts.Area, {
      type: "monotone",
      yAxisId: index,
      dataKey: key,
      name: fieldName,
      stroke: fieldColor,
      fill: fieldColor,
      dot: {
        fill: 'white',
        stroke: fieldColor,
        strokeWidth: 2
      }
    }, props.areaLabel !== undefined && props.areaLabel && /*#__PURE__*/_react.default.createElement(_recharts.LabelList, {
      dataKey: key,
      position: props.areaLabelPosition !== undefined ? props.areaLabelPosition : 'right',
      angle: props.areaLabelAngle !== undefined ? parseInt(props.areaLabelAngle) : 0,
      formatter: numberFormatter,
      style: {
        color: 'black',
        fontSize: props.areaLabelFontSize !== undefined ? parseInt(props.areaLabelFontSize) : 10,
        textShadow: '-1px 0px 0px white, 1px 0px 0px white, 0px -1px 0px white, 0px 1px 0px white'
      }
    })) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
  })));
}