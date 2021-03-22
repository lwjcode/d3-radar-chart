import 'antd/dist/antd.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import D3RadarChart from './src';
import './style.less';

function getColor(idx) {
  var palette = [
    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
  ];
  return palette[idx % palette.length];
}

class App extends Component {
  constructor() {
    this.chart = null;
    this.chartRef = null;
  }

  componentDidMount() {
    this.initChart();
  }

  initChart = () => {
    const options = {
      chart: {
        width: 150,
        container: this.chartRef,
      },
      legend: [
        {
          name: '苹果',
          color: 'blue',
        },
        {
          name: '华为',
          color: 'red',
        },
      ],
      series: [
        {
          name: '苹果',
          fileds: ['喜爱度', '好用指数'],
          value: [80, 50],
        },
        {
          name: '华为',
          fileds: ['喜爱度', '好用指数'],
          value: [80, 40],
        },
      ],
    };
    this.chart = new D3RadarChart(options);
  }
  render() {
    return (
      <div className="simple-radar-chart" style={{ margin: 50 }}>
        <svg ref={(r) => this.chartRef = r}></svg>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-content'));
