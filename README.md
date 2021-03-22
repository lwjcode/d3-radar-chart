# d3-line-chart

d3封装的雷达图


## 使用

```jsx
import React from 'react';
import D3RadarChart from 'd3-radar-chart';

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.chart = null;
  }

  componentDidMount() {
    const colors = [
      '#4fa72a',
      '#e64d30',
      '#224bde',
      '#079de4',
      '#c19801',
      '#d10ab0',
      '#627080',
      '#7900d6',
      '#659e67',
      '#029faf',
      '#ab5656',
      '#5c799c',
    ];
    // chart、series为必选参数，其他非必选
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

  expand = () => {
    this.chart.update({
      height: 600,
    });
  }

  render() {
    return (
      <div>
        <svg ref={(r) => this.chartRef = r}></svg>
        <button onClick={this.expand}>放大</button>
      </div>
    )
  }
}

export default D3Chart;

```
## API

| 名称 | 功能 | 参数 | 说明 |
| :------| :------ | :------ | :------ |
| update | 更新图表 | options | - |
| destory | 销毁图表 | 无 | - |
