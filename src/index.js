import * as d3 from 'd3';
import _ from 'lodash';
import './styles.less';

class D3RadarChart {
  static defaultProps = {
    data: {
      fieldNames: [''],
      values: [[0]],
    },
    radarWidth: 150,
  };

  constructor(options) {
    this.options = options;
    this.chart = options.chart;
    this.series = options.series;
    this.legend = options.legend;
    this.chartWidth = options.width;
  }

  init() {
    const graphWidth = this.chartWidth;
    const { container, level } = this.chart;
    const chartContainer = d3.select(container)
                             .append('g')
                             .attr('transform', `translate(${graphWidth / 2}, ${graphWidth / 2})`);
    // 设定一些方便计算的常量
    const radius = 60;
    // 指标的个数，即legend的长度
    const total = this.series[0].fileds.length;
    const level = 5;
    // 网轴的范围，类似坐标轴
    const rangeMin = 0;
    const rangeMax = 100;
    const arc = 2 * Math.PI;
    // 每项指标所在的角度
    const onePiece = arc / total;
    // 计算网轴的正多边形的坐标
    const polygons = {
      webs: [],
      webPoints: [],
    };
    for(let k = level; k > 0; k--) {
      let webs = '';
      const webPoints = [];
      var r = radius / level * k;
      for(let i = 0; i < total; i++) {
        const x = r * Math.sin(i * onePiece);
        const y = r * Math.cos(i * onePiece);
        webs += `${x},${y} `;
        webPoints.push({
          x: x,
          y: y
        });
      }
      polygons.webs.push(webs);
      polygons.webPoints.push(webPoints);
    }

    // 绘制网轴
    const webs = chartContainer.append('g').classed('webs', true);
    webs.selectAll('polygon')
        .data(polygons.webs)
        .enter()
        .append('polygon')
        .style('fill', '#a6e3e9')
        .style('stroke', 'white')
        .attr('points', function(d) {
            return d;
        });
    // 添加纵轴
    const lines = chartContainer.append('g').classed('lines', true);
    lines.selectAll('line')
         .data(polygons.webPoints[0])
         .enter()
         .append('line')
         .attr('x1', 0)
         .attr('y1', 0)
         .attr('x2', function(d) {
           return d.x;
         })
         .attr('y2', function(d) {
           return d.y;
         });

    // 计算雷达图表的坐标
    const areasData = [];
    const series = this.series;
    const legend = this.legend;
    for (let i = 0; i < series.length; i++) {
      const value = series[i].value;
      const fileds = series[i].fileds;
      let area = '';
      const points = [];
      for (let k = 0; k < total; k++) {
        const r = radius * (value[k] - rangeMin) / (rangeMax - rangeMin);
        const x = r * Math.sin(k * onePiece);
        const y = r * Math.cos(k * onePiece);
        area += `${x},${y} `;
        points.push({
          x: x,
          y: y,
          value: value[k],
          name: fileds[k],
        })
      }
      areasData.push({
        polygon: area,
        points: points,
        color: legend[i],
      });
    }

    // 添加g分组包含所有雷达图区域
    const areas = chartContainer.append('g').classed('areas', true);
    // 添加g分组用来包含一个雷达图区域下的多边形以及圆点
    areas.selectAll('g')
         .data(areasData)
         .enter()
         .append('g')
         .attr('class',function(d, i) {
           return 'area' + (i + 1);
         });
    for (let i = 0; i < areasData.length; i++) {
      // 依次循环每个雷达图区域
      const area = areas.select(`.area${i + 1}`),
      const areaData = areasData[i];
      const color =
      // 绘制雷达图区域下的多边形
      area.append('polygon')
          .attr('points', areaData.polygon)
          .attr('stroke', function(d, index) {
            return areasData.color;
          })
          .attr('fill', function(d, index) {
            return areasData.color;
          })
          .attr('r', 2)
          .style('fill-opacity', 0.7);
      // 绘制雷达图区域下的点
      const circles = area.append('g')
                          .classed('circles', true);
      circles.selectAll('circle')
        .data(areaData.points)
        .enter()
        .append('circle')
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) {
          return d.y;
        })
        .attr('r', 2)
        .attr('stroke', function(d, index) {
          return areasData.color;
        })
        .style('cursor', 'pointer')
        .on('mouseenter', function(d) { // 鼠标移到某个点上，则显示次点的名字和值
          const radarTooltip = document.createElement('div');
          radarTooltip.id = 'radar-tooltip';
          const left = `${d3.event.pageX}px`;
          const top = `${d3.event.pageY}px`;
          radarTooltip.className = 'water-radar-tooltip';
          radarTooltip.style.top = top;
          radarTooltip.style.left = left;
          radarTooltip.innerHTML = `<div>${d.name}：${d.value}</div>`;
          document.body.appendChild(radarTooltip);
        })
        .on('mouseleave', function(d) {
          document.body.removeChild(document.getElementById('radar-tooltip'));
        });
    }
  }

  update(options) {
    this.series = options.series;
    this.legend = options.legend;
    this.chartWidth = options.width;
    this.chartHeight = options.height;
    this.clear();
    this.init();
  }

  clear() {
    const { chart } = this.options;
    d3.select(chart.container).selectAll('*').remove();
  }

  destory() {
    const { chart } = this.options;
    const { container } = chart;
    d3.select(container)
      .on('mouseenter', null)
      .on('mouseleave', null);
    delete this.options;
    delete this.series;
    delete this.chartContainer;
    delete this.chart;
    delete this.chartWidth;
    delete this.chartHeight;
  }
}

export default D3RadarChart;
