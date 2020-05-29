import * as d3 from 'd3';

export const draw = (
  id,
  data,
  x /* center x */,
  y /* center y */,
  rx /* radius x */,
  ry /* radius y */,
  h /* height */,
  ir /* inner radius */
) => {
  const dataset = d3
    .pie()
    .sort(null)
    .value(function(d) {
      return d.value;
    })(data);

  const slices = d3
    .select(`#${id}`)
    .append('g')
    .attr('transform', `translate(${x},${y})`)
    .attr('class', 'slices');
  // 环形内曲面
  slices
    .selectAll('.innerSlice')
    .data(dataset)
    .enter()
    .append('path')
    .attr('class', 'innerSlice')
    .style('fill', function(d) {
      return d3.hsl(d.data.color).darker(0.7);
    })
    .attr('d', function(d) {
      return pieInner(d, rx + 0.5, ry + 0.5, h, ir);
    })
    .each(function(d) {
      this._current = d;
    });
  // 上层2d平面
  slices
    .selectAll('.topSlice')
    .data(dataset)
    .enter()
    .append('path')
    .attr('class', 'topSlice')
    .style('fill', function(d) {
      return d.data.color;
    })
    .style('stroke', function(d) {
      return d.data.color;
    })
    .attr('d', function(d) {
      return pieTop(d, rx, ry, ir);
    })
    .each(function(d) {
      this._current = d;
    });
  // 侧面曲面
  slices
    .selectAll('.outerSlice')
    .data(dataset)
    .enter()
    .append('path')
    .attr('class', 'outerSlice')
    .style('fill', function(d) {
      return d3.hsl(d.data.color).darker(0.7);
    })
    .attr('d', function(d) {
      return pieOuter(d, rx - 0.5, ry - 0.5, h);
    })
    .each(function(d) {
      this._current = d;
    });

  slices
    .selectAll('.percent')
    .data(dataset)
    .enter()
    .append('text')
    .attr('class', 'percent')
    .attr('x', function(d) {
      return 0.6 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle));
    })
    .attr('y', function(d) {
      return 0.6 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle));
    })
    .text(getPercent)
    .each(function(d) {
      this._current = d;
    });

  slices
    .selectAll('.text')
    .data(dataset)
    .enter()
    .append('text')
    .attr('class', 'text')
    .attr('x', function(d) {
      // return 0.6 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle));
    })
    .attr('y', function(d) {
      // return 0.6 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle+20));
    })
    .text(getLabel)
    .each(function(d) {
      this._current = d;
    });
  // const domText = document.querySelector('#text');
  slices.on('mousemove', function() {
    // console.log(d3.event);
    // const e = d3.event;
    // domText.style.left = e.screenX + 'px';
    // domText.style.top = e.screenY - 400 + 'px';
    // d3.select(this)
    //   .transition()
    //   .duration(1500) // 当鼠标放在矩形上时，矩形变成黄色
    //   .attr('fill', 'yellow');
  });
};
// 内曲面
function pieInner(d, rx, ry, h, ir) {
  const startAngle = d.startAngle < Math.PI ? Math.PI : d.startAngle;
  const endAngle = d.endAngle < Math.PI ? Math.PI : d.endAngle;

  const sx = ir * rx * Math.cos(startAngle);
  const sy = ir * ry * Math.sin(startAngle);
  const ex = ir * rx * Math.cos(endAngle);
  const ey = ir * ry * Math.sin(endAngle);

  const ret = [];
  ret.push(
    'M',
    sx,
    sy,
    'A',
    ir * rx,
    ir * ry,
    '0 0 1',
    ex,
    ey,
    'L',
    ex,
    h + ey,
    'A',
    ir * rx,
    ir * ry,
    '0 0 0',
    sx,
    h + sy,
    'z'
  );
  return ret.join(' ');
}
function pieTop(d, rx, ry, ir) {
  if (d.endAngle - d.startAngle === 0) return 'M 0 0';
  const sx = rx * Math.cos(d.startAngle);
  const sy = ry * Math.sin(d.startAngle);
  const ex = rx * Math.cos(d.endAngle);
  const ey = ry * Math.sin(d.endAngle);

  const ret = [];
  ret.push(
    'M',
    sx,
    sy,
    'A',
    rx,
    ry,
    '0',
    d.endAngle - d.startAngle > Math.PI ? 1 : 0,
    '1',
    ex,
    ey,
    'L',
    ir * ex,
    ir * ey
  );
  ret.push('A', ir * rx, ir * ry, '0', d.endAngle - d.startAngle > Math.PI ? 1 : 0, '0', ir * sx, ir * sy, 'z');
  return ret.join(' ');
}
// 外曲面算法
function pieOuter(d, rx, ry, h) {
  const startAngle = d.startAngle > Math.PI ? Math.PI : d.startAngle;
  const endAngle = d.endAngle > Math.PI ? Math.PI : d.endAngle;

  const sx = rx * Math.cos(startAngle);
  const sy = ry * Math.sin(startAngle);
  const ex = rx * Math.cos(endAngle);
  const ey = ry * Math.sin(endAngle);

  const ret = [];
  ret.push('M', sx, h + sy, 'A', rx, ry, '0 0 1', ex, h + ey, 'L', ex, ey, 'A', rx, ry, '0 0 0', sx, sy, 'z');
  return ret.join(' ');
}

function getPercent(d) {
  return d.endAngle - d.startAngle > 0.2
    ? `${Math.round((1000 * (d.endAngle - d.startAngle)) / (Math.PI * 2)) / 10}%`
    : '';
}
function getLabel(d, i) {
  return d.data.label + i;
}

export const transition = (id, data, rx, ry, h, ir) => {
  class arcTweenInner {
    constructor(a) {
      const i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return pieInner(i(t), rx + 0.5, ry + 0.5, h, ir);
      };
    }
  }
  class arcTweenTop {
    constructor(a) {
      const i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return pieTop(i(t), rx, ry, ir);
      };
    }
  }
  class arcTweenOuter {
    constructor(a) {
      const i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return pieOuter(i(t), rx - 0.5, ry - 0.5, h);
      };
    }
  }
  class textTweenX {
    constructor(a) {
      const i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return 0.6 * rx * Math.cos(0.5 * (i(t).startAngle + i(t).endAngle));
      };
    }
  }
  class textTweenY {
    constructor(a) {
      const i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return 0.6 * rx * Math.sin(0.5 * (i(t).startAngle + i(t).endAngle));
      };
    }
  }

  class textTweenY2 {
    constructor(a) {
      const i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return 1.1 * rx * Math.sin(0.5 * (i(t).startAngle + i(t).endAngle));
      };
    }
  }

  const _data = d3
    .pie()
    .sort(null)
    .value(function(d) {
      return d.value;
    })(data);

  d3.select(`#${id}`)
    .selectAll('.innerSlice')
    .data(_data)
    .transition()
    .duration(750)
    .attrTween('d', arcTweenInner);

  d3.select(`#${id}`)
    .selectAll('.topSlice')
    .data(_data)
    .transition()
    .duration(750)
    .attrTween('d', arcTweenTop);

  d3.select(`#${id}`)
    .selectAll('.outerSlice')
    .data(_data)
    .transition()
    .duration(750)
    .attrTween('d', arcTweenOuter);

  d3.select(`#${id}`)
    .selectAll('.percent')
    .data(_data)
    .transition()
    .duration(750)
    .attrTween('x', textTweenX)
    .attrTween('y', textTweenY)
    .text(getPercent);

  d3.select(`#${id}`)
    .selectAll('.text')
    .data(_data)
    .transition()
    .duration(750)
    .attrTween('x', textTweenX)
    .attrTween('y', textTweenY2)
    .text(getLabel);
};
