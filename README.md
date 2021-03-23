# d3-radar-chart

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
    const options = {
      chart: {
        level: 5,
        fillColor: '#a6e3e9', // 网格填充色
        strokeColor: '#fff', // 网格边线
        container: this.chartRef,
        width: 300, // 非必须，不传是默认父容器的大小
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
          fileds: ['喜爱度', '好用指数', '美观指数'],
          value: [80, 50, 60],
        },
        {
          name: '华为',
          fileds: ['喜爱度', '好用指数', '美观指数'],
          value: [70, 40, 30],
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
