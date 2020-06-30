import d3 from 'd3';
import { getColor, midAngle } from '../../util';
import { setPieOptions, pieInner, pieTop, pieOuter, labelPath, tweenLabelTransform, tweenLabelText, pieWalls } from './components';

class Pie3d {
  constructor(options) {
    this.opts = {
      title: {
        text: '',
        top: 0,
        left: 0,
        fontSize: '14px',
        color: 'red'
      }, // 标题
      deep: 20, // （最小值：0）以px为单位的饼厚度
      angle: 45, // 最小值：0，最大值：90）图表的角度，以度为单位，当90成为正常的平面饼图
      ir: 0.3, // （最小值：0，最大值：1）内空心占饼比例
      size: 100, // 相对于用户元素的大小 %
      fontSize: '12px', // 字号(px)
      colors: {
        pies: ['#d3fe14', '#c9080a', '#fec7f8', '#0b7b3e', '#0bf0e9', '#c203c8', '#fd9b39', '#888593'],
        label: ''
      },
      animationDuration: 700, // 动画时长
      // onSliceSelect: null,
      labelText: d => {
        return `${d.data.title}(${Math.round(((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100)}%)`;
      }
    };
    this.options = setPieOptions(Object.assign({}, this.opts, options));
  }
  draw(data) {
    const { idSvg, width, height, rx, ry, ir, deep, animationDuration } = this.options;

    d3.select(`#${idSvg} #main`).remove();

    const dataPie = d3.pie().value(d => d.value)(data);

    const main = d3
      .select(`#${idSvg}`)
      .append('g')
      .attr('id', 'main')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const { top, fontSize, color } = this.options.title;
    if (this.options.title) {
      main
        .append('text')
        .text(this.options.title.text)
        .attr('transform', `translate(${0}, ${-(height / 2 - 20 - Number(top.toString().replace('px', '')))})`)
        .attr('text-anchor', 'middle')
        .attr('font-size', fontSize)
        .attr('fill', color);
    }

    main
      .append('g')
      .selectAll('.walls')
      .data(dataPie, d => d.data.id)
      .join('path')
      .attr('class', 'walls')
      .attr('fill', (d, i) => getColor(i, this.options))
      .transition()
      .duration(animationDuration)
      .attrTween('d', d => {
        const s2 = {};
        Object.assign(s2, d);
        return t => {
          s2.endAngle = d.startAngle + (d.endAngle - d.startAngle) * t;
          return pieWalls(s2, rx, ry, deep, ir);
        };
      });

    main
      .append('g')
      .selectAll('.pieInner')
      .data(dataPie, d => d.data.id)
      .join('path')
      .attr('class', 'pieInner')
      .attr('fill', (d, i) => d3.hsl(getColor(i, this.options)).darker(0.8))
      .transition()
      .duration(animationDuration)
      .attrTween('d', d => {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function(t) {
          d.endAngle = i(t);
          return pieInner(d, rx, ry, ir, deep);
        };
      });

    main
      .append('g')
      .selectAll('.pieTop')
      .data(dataPie, d => d.data.id)
      .join('path')
      .attr('class', 'pieTop')
      .style('cursor', 'pointer')
      .transition()
      .duration(animationDuration)
      .attrTween('d', d => {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function(t) {
          d.endAngle = i(t);
          return pieTop(d, rx, ry, ir);
        };
      })
      .attr('fill', (d, i) => getColor(i, this.options))
      .on('end', function(d, i) {
        const curr = d3.select(this);
        curr.isMoved = false;
        curr.on('click', function() {
          // curr.isMoved = !curr.isMoved;
          // let pos = move(d, { rx, ry });
          // if (curr.isMoved) {
          //   pos = [0, 0];
          // }
          // curr
          //   .transition()
          //   .duration(500)
          //   .attr('transform', `translate(${pos})`);
        });
        curr.on('mouseover', () => {
          d3.select(`.tips-${i}`)
            .style('opacity', '1')
            .style('cursor', 'pointer');
        });
        curr.on('mouseout', () => {
          d3.select(`.tips-${i}`).style('opacity', '0');
        });
      });

    main
      .append('g')
      .selectAll('.pieOuter')
      .data(dataPie, d => d.data.id)
      .join('path')
      .attr('class', 'pieOuter')
      .transition()
      .duration(animationDuration)
      .attrTween('d', d => {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function(t) {
          d.endAngle = i(t);
          return pieOuter(d, rx, ry, deep);
        };
      })
      .attr('fill', (d, i) => d3.hsl(getColor(i, this.options)).darker(0.6));

    main
      .append('g')
      .selectAll('.label-line')
      .data(dataPie, d => d.data.id)
      .join('path')
      .attr('class', 'label-line')
      .style('stroke', (d, i) => d3.hsl(getColor(i, this.options)).darker(0.2))
      .transition()
      .duration(animationDuration)
      .attrTween('d', d => {
        const d2 = {};
        Object.assign(d2, d);
        return t => {
          d2.endAngle = d.startAngle + (d.endAngle - d.startAngle) * t;
          return labelPath(d2, rx, ry, deep);
        };
      });

    main
      .append('g')
      .selectAll('.label')
      .data(dataPie, d => d.data.id)
      .join('text')
      .attr('class', 'label')
      .text(this.options.labelText)
      .attr('fill', this.options.colors.label)
      .attr('font-size', this.options.fontSize || '1em')
      .transition()
      .duration(animationDuration)
      .attrTween('transform', d => {
        return tweenLabelTransform(d, this.options);
      })
      .styleTween('text-anchor', d => {
        return tweenLabelText(d);
      });

    main
      .append('g')
      .selectAll('.tips')
      .data(dataPie, d => d.data.id)
      .join('text')
      .attr('class', (d, i) => `tips tips-${i}`)
      .text(d => d.value)
      .attr('dominant-baseline', 'middle')
      .attr('text-anchor', 'middle')
      .attr('x', d => ((rx + rx * ir) / 2) * Math.cos(midAngle(d)))
      .attr('y', d => ((ry + ry * ir) / 2) * Math.sin(midAngle(d)))
      .style('font-size', '.8em')
      .style('opacity', '0')
      .on('mouseover', function() {
        d3.select(this).style('opacity', '1');
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', '0');
      });
  }
}
export default Pie3d;
