import * as d3 from 'd3';
/**
 * 计算平均角度
 * @param d
 * @returns {*}
 */
export function midAngle(d) {
  return d.oldEndAngle ? d.oldSartAngle + (d.oldEndAngle - d.oldSartAngle) / 2 : d.startAngle + (d.endAngle - d.startAngle) / 2;
}

export function getColor(index, options) {
  // return d3.hsl(d3.schemeCategory10[index]);
  if (options && options.colors && options.colors.pies.length) {
    return options.colors.pies[index];
  }
  return d3.schemeCategory10[index];
}
