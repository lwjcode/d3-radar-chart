import * as d3 from 'd3';
import _ from 'lodash';
import './style.less';

class D3RadarChart {
  constructor(options) {
    this.options = options;
    this.chart = options.chart;
    this.series = options.series;
    this.legend = options.legend;
    this.chartWidth = options.width;
    this.initChartBody();
    this.init();
  }

  initChartBody() {
    const { container, width } = this.chart;
    const chartWidth = width || container.parentNode.offsetWidth;

    const chartContainer = d3.select(container)
                             .attr('width', chartWidth)
                             .attr('height', chartWidth)
                             .append('g')
                             .attr('transform', `translate(${chartWidth / 2}, ${chartWidth / 2})`);
    this.chartContainer = chartContainer;
  }

  init() {
    const { level, fillColor, strokeColor } = this.chart;
    const radius = 100; // 雷达图半径
    const total = this.series[0].fileds.length;
    const rangeMin = 0;
    const rangeMax = 100;
    const arc = 2 * Math.PI;
    const onePiece = arc / total; // 每项指标所在的角度
    const polygons = {
      webs: [],
      webPoints: [],
    };
    for (let k = level; k > 0; k--) {
      let webs = '';
      const webPoints = [];
      var r = radius / level * k;
      for (let i = 0; i < total; i++) {
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

    const webs = this.chartContainer.append('g').classed('webs', true);
    webs.selectAll('polygon')
        .data(polygons.webs)
        .enter()
        .append('polygon')
        .style('fill', fillColor)
        .style('stroke', strokeColor)
        .attr('points', function(d) {
          return d;
        });
    const lines = this.chartContainer.append('g').classed('lines', true);
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
         })
         .attr('stroke', strokeColor)
         .attr('stroke-dasharray', '4px');

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
        const r = radius * ((value[k] + 2) - rangeMin) / (rangeMax - rangeMin);
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
        color: legend[i].color,
      });
    }

    const areas = this.chartContainer.append('g').classed('areas', true);
    areas.selectAll('g')
         .data(areasData)
         .enter()
         .append('g')
         .attr('class',function(d, i) {
           return 'area' + (i + 1);
         })
         .append('polygon')
         .attr('points', (d) => d.polygon)
         .attr('stroke', function(d, index) {
           return d.color;
         })
         .attr('fill', function(d, index) {
           return d.color;
         })
         .attr('r', 2)
         .style('fill-opacity', 0.7)
         .append('polygon')
         .attr('points', (d) => d.polygon)
         .attr('stroke', function(d, index) {
           return d.color;
         })
         .attr('fill', function(d, index) {
           return d.color;
         })
         .attr('r', 2)
         .style('fill-opacity', 0.7);
    for (let i = 0; i < areasData.length; i++) {
      const areaData = areasData[i];
      const area = areas.select(`.area${i + 1}`);
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
               return areaData.color;
             })
             .style('cursor', 'pointer')
             .on('mouseenter', function(d) {
               const radarTooltip = document.createElement('div');
               radarTooltip.id = 'radar-tooltip';
               const left = `${d3.event.pageX}px`;
               const top = `${d3.event.pageY}px`;
               radarTooltip.className = 'radar-tooltip';
               radarTooltip.style.top = top;
               radarTooltip.style.left = left;
               radarTooltip.innerHTML = `<div>${d.name}：${d.value}</div>`;
               document.body.appendChild(radarTooltip);
             })
             .on('mouseleave', function() {
               const tooltipElem = document.getElementById('radar-tooltip');
               if (tooltipElem) {
                 document.body.removeChild(tooltipElem);
               }
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
