import * as d3 from 'd3';
import { draw, transition } from './util';

class Charts3D {
  constructor(option) {
    this._option = { id: `id${Date.now()}`, type: 'pie', selector: 'body' };
    this.option = Object.assign({}, this._option, option);
    this.data = this.option.data;
    this.option.type === 'pie' && this.drawPie();
    this.option.type === 'test' && this.drawTest();
  }

  drawTest() {
    const oriData = [
      { x: 'A计划', y: 20 },
      { x: 'B计划', y: 40 },
      { x: 'C计划', y: 90 },
      { x: 'D计划', y: 80 },
      { x: 'E计划', y: 120 },
      { x: 'F计划', y: 100 },
      { x: 'G计划', y: 60 }
    ];
    const [width, height] = [750, 350];

    const svg = d3
      .select('#svg6')
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g').attr('transform', 'translate( 140, 40 )');

    // 设置饼图的半径
    const radius = (Math.min(width, height) * 0.8) / 2;

    const arc = d3
      .arc()
      .innerRadius(70)
      // .outerRadius(radius)
      .cornerRadius(10);

    // 饼图与文字相连的曲线起点
    const pointStart = d3
      .arc()
      .innerRadius(radius)
      .outerRadius(radius);
    // 饼图与文字相连的曲线终点
    const pointEnd = d3
      .arc()
      .innerRadius(radius + 20)
      .outerRadius(radius + 20);

    const drawData = d3
      .pie()
      .value(function(d) {
        return d.y;
      })
      .sort(null)
      .sortValues(null)
      .startAngle(0)
      .endAngle(Math.PI * 2)
      .padAngle(0.05)(oriData);
    console.log(drawData);

    const colorScale = d3
      .scaleOrdinal()
      .domain(d3.range(0, oriData.length))
      .range(d3.schemeSet1);
    g.append('g')
      .attr('transform', 'translate( ' + radius + ', ' + radius + ' )')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1)
      .selectAll('path')
      .data(drawData)
      .enter()
      .append('path')
      .attr('fill', function(d) {
        return colorScale(d.index);
      })
      .attr('d', function(d) {
        d.outerRadius = radius;
        return arc(d);
      })
      .on('mouseover', arcTween(radius + 20, 0))
      .on('mouseout', arcTween(radius, 150))
      .transition()
      .duration(2000)
      .attrTween('d', function(d) {
        // 初始加载时的过渡效果
        const fn = d3.interpolate(
          {
            endAngle: d.startAngle
          },
          d
        );
        return function(t) {
          return arc(fn(t));
        };
      });

    function arcTween(outerRadius, delay) {
      // 设置缓动函数,为鼠标事件使用
      return function() {
        d3.select(this)
          .transition()
          .delay(delay)
          .attrTween('d', function(d) {
            const i = d3.interpolate(d.outerRadius, outerRadius);
            return function(t) {
              d.outerRadius = i(t);
              return arc(d);
            };
          });
      };
    }

    // 文字层

    // const sum = d3.sum(oriData, d => d.y);
    // svg
    //   .append('g')
    //   .attr('transform', 'translate( ' + radius + ', ' + radius + ' )')
    //   .selectAll('text')
    //   .data(drawData)
    //   .enter()
    //   .append('text')
    //   .attr('transform', function(d) {
    //     // arc.centroid(d)将文字平移到弧的中心
    //     return (
    //       'translate(' +
    //       arc.centroid(d) +
    //       ') ' +
    //       // rotate 使文字旋转扇形夹角一半的位置(也可不旋转)
    //       'rotate(' +
    //       (-90 + ((d.startAngle + (d.endAngle - d.startAngle) / 2) * 180) / Math.PI) +
    //       ')'
    //     );
    //   })
    //   // 文字开始点在文字中间
    //   .attr('text-anchor', 'middle')
    //   // 文字垂直居中
    //   .attr('dominant-baseline', 'central')
    //   .attr('font-size', '10px')
    //   // 格式化文字显示格式
    //   .text(function(d) {
    //     return ((d.data.y / sum) * 100).toFixed(2) + '%';
    //   });
    // .attr('rotate', '30') //此设置为设置每个文字中字符的旋转，上面的旋转是以文字为一个整体的旋转

    // 图例legend
    const legend = g
      .append('g')
      .attr('transform', 'translate( ' + radius * 2.5 + ', 0 )')
      .selectAll('g')
      .data(drawData)
      .enter()
      .append('g')
      .attr('transform', function(d, i) {
        return 'translate(0,' + i * 20 + ')';
      });

    legend
      .append('rect')
      .attr('width', 27)
      .attr('height', 18)
      .attr('fill', function(d) {
        return colorScale(d.index);
      });
    legend
      .append('text')
      .text(function(d) {
        return d.data.x;
      })
      .style('font-size', 10)
      .attr('y', '1em')
      .attr('x', '3em')
      .attr('dy', 3);

    // 曲线层
    g.append('g')
      .attr('transform', 'translate( ' + radius + ', ' + radius + ' )')
      .selectAll('path')
      .data(drawData)
      .enter()
      .append('path')
      .attr(
        'd',
        d3
          .linkHorizontal()
          .source(function(d) {
            return pointStart.centroid(d);
          })
          .target(function(d) {
            return pointEnd.centroid(d);
          })
      )
      .style('stroke', 'red')
      .style('stroke-width', 1)
      .attr('fill', 'none');

    // 饼图外面的文字
    g.append('g')
      .attr('transform', 'translate( ' + radius + ', ' + radius + ' )')
      .selectAll('path')
      .data(drawData)
      .enter()
      .append('text')
      .text(function(d) {
        return d.data.x;
      })
      .attr('x', function(d) {
        return pointEnd.centroid(d)[0];
      })
      .attr('y', function(d) {
        return pointEnd.centroid(d)[1];
      })
      .style('font-size', 10)
      .attr('text-anchor', function(d) {
        if (d.startAngle > Math.PI) {
          return 'end';
        }
      })
      .attr('dominant-baseline', function(d) {
        if (d.index === 4) {
          return 'hanging';
        }
      });

    // 测试文字
    /* svg.append('g')
      .append('text')
      .text('welcome to Beijing')
      .attr('dominant-baseline', 'hanging')
      .attr('transform', 'translate( 30, 30 ) rotate(0)')
      .style('font-style', 'italic')
      .attr('rotate', 12)
      */

    // 测试arc
    // let arc = d3.arc()
    //   .innerRadius(0)
    //   .outerRadius(100)
    //   .startAngle(0)
    //   .endAngle(Math.PI/2)
    //   .cornerRadius(10)
    // svg.append('g')
    //   .attr('transform', 'translate( 200, 200 )')
    //   .append('path')
    //   .attr('fill', 'none')
    //   .attr('stroke', 'steelblue')
    //   .attr('stroke-width', 1.5)
    //   .attr('stroke-linejoin', 'round')
    //   .attr('stroke-linecap', 'round')
    //   .attr('d', arc)

    // d3.select('button').style('color', 'red');
    // const d3Obj = d3.select('#test');
    // d3Obj.selectAll('svg').remove();
    // const width = 400;
    //
    // const height = 400;
    //
    // const svg = d3Obj
    //   .append('svg')
    //   .attr('width', width)
    //   .attr('height', height);
    //
    // const marge = { top: 0, bottom: 60, left: 0, right: 60 };
    //
    // const g = svg
    //   .append('g')
    //   .attr('id', this.option.id)
    //   .attr('transform', `translate(${marge.top},${marge.left})`);
    // const dataset = [30, 10, 43, 10, 13]; // 需要将这些数据变成饼状图的数据
    //
    // // 设置一个color的颜色比例尺，为了让不同的扇形呈现不同的颜色
    // const colorScale = d3
    //   .scaleOrdinal()
    //   .domain(d3.range(dataset.length))
    //   .range(d3.schemeCategory10);
    //
    // const pie = d3.pie();
    // const pieData = pie(dataset);
    //
    // console.log(pieData);
    //
    // // 新建一个弧形生成器
    // // const innerRadius = 0; // 内半径
    // // const outerRadius = 100; // 外半径
    // const arcGenerator = d3
    //   .arc()
    //   .innerRadius(0)
    //   .outerRadius(100);
    //
    // // 开始绘制，老规矩，先为每一个扇形及其对应的文字建立一个分组<g>
    // const gs = g
    //   .selectAll('.g')
    //   .data(pieData)
    //   .enter()
    //   .append('g')
    //   .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')'); // 位置信息
    //
    // // 绘制饼状图的各个扇形
    // gs.append('path')
    //   .attr('d', function(d) {
    //     return arcGenerator(d); // 往弧形生成器中出入数据
    //   })
    //   .attr('fill', function(d, i) {
    //     return colorScale(i); // 设置颜色
    //   });
    //
    // // 绘制饼状图上面的文字信息
    // gs.append('text')
    //   .attr('transform', function(d) {
    //     // 位置设在中心处
    //     return 'translate(' + arcGenerator.centroid(d) + ')';
    //   })
    //   .attr('text-anchor', 'middle')
    //   .attr('x', () => {
    //     return 0;
    //   })
    //   .text(function(d) {
    //     return d.data;
    //   })
    //   .transition()
    //   .delay(1000)
    //   .duration(1000)
    //   // .ease(d3.easeElasticInOut)
    //
    //   .attr('x', () => {
    //     return 10;
    //   });
  }

  changeDataTest() {
    const dataset = [6, 10, 43, 10, 13]; // 需要将这些数据变成饼状图的数据

    // 设置一个color的颜色比例尺，为了让不同的扇形呈现不同的颜色
    const colorScale = d3
      .scaleOrdinal()
      .domain(d3.range(dataset.length))
      .range(d3.schemeCategory10);

    const pie = d3.pie();
    const pieData = pie(dataset);
    console.log(pieData);

    // 新建一个弧形生成器
    // const innerRadius = 0; // 内半径
    // const outerRadius = 100; // 外半径
    const arc_generator = d3
      .arc()
      .innerRadius(1)
      .outerRadius(100);
    // transition(this.option.id, [200, 30, 10, 43, 10]);

    const gs = d3.select(`#${this.option.id}`);
    // 绘制饼状图的各个扇形
    gs.append('path').attr('fill', function(d, i) {
      return colorScale(i); // 设置颜色
    });

    // 绘制饼状图上面的文字信息
    gs.append('text')
      .attr('transform', function(d) {
        // 位置设在中心处
        return 'translate(' + arc_generator.centroid(d) + ')';
      })
      .attr('text-anchor', 'middle')
      .attr('x', () => {
        return 0;
      })
      .text(function(d) {
        return d.data;
      })
      .transition()
      .delay(1000)
      .duration(1000)
      // .ease(d3.easeElasticInOut)

      .attr('x', () => {
        return 10;
      });
  }

  changeData() {
    transition(this.option.id, this.randomData(), 130, 100, 30, 0);
  }

  randomData() {
    return this.data.map(function(d) {
      return { label: d.label, value: 1000 * Math.random(), color: d.color };
    });
  }

  drawPie() {
    const d3Obj = d3.select(this.option.selector);
    d3Obj.selectAll('svg').remove();

    const svg = d3Obj
      .append('svg')
      .attr('width', 700)
      .attr('height', 300);

    svg.append('g').attr('id', this.option.id);

    draw(this.option.id, this.randomData(), 150, 150, 130, 110, 20, 0);
    // draw(this.option.id, randomData(), 450, 150, 130, 100, 30, 0);
  }
}

export default Charts3D;
