import { midAngle } from '../../util';

export function setPieOptions(options) {
  options.rx = ((options.width / 4) * options.size) / 100;
  options.ry = (options.rx * options.angle) / 90;
  // 如果用户设置饼图角度为90时，设置厚度为0
  options.angle === 90 && (options.deep = 0);
  return options;
}

export function pieWalls(d, rx, ry, h, ir) {
  const sx = rx * Math.cos(d.startAngle);
  const sy = ry * Math.sin(d.startAngle);
  const ex = rx * Math.cos(d.endAngle);
  const ey = ry * Math.sin(d.endAngle);
  const ret = [];
  ret.push('M', ir * ex, ir * ey, 'L', ir * ex, ir * ey + h, 'L', ex, ey + h, 'L', ex, ey, 'z');
  ret.push('M', ir * sx, ir * sy, 'L', ir * sx, ir * sy + h, 'L', sx, sy + h, 'L', sx, sy, 'z');
  return ret.join(' ');
}
// 内曲面
export function pieInner(d, rx, ry, ir, h) {
  const startAngle = d.startAngle < Math.PI ? Math.PI : d.startAngle;
  const endAngle = d.endAngle < Math.PI ? Math.PI : d.endAngle;
  const sx = ir * rx * Math.cos(startAngle);
  const sy = ir * ry * Math.sin(startAngle);
  const ex = ir * rx * Math.cos(endAngle);
  const ey = ir * ry * Math.sin(endAngle);
  const ret = [];
  ret.push('M', sx, sy, 'A', ir * rx, ir * ry, '0 0 1', ex, ey, 'L', ex, h + ey, 'A', ir * rx, ir * ry, '0 0 0', sx, h + sy, 'z');
  return ret.join(' ');
}

export function pieTop(d, rx, ry, ir) {
  if (d.endAngle - d.startAngle === 0) return 'M 0 0';
  const sx = rx * Math.cos(d.startAngle);
  const sy = ry * Math.sin(d.startAngle);
  const ex = rx * Math.cos(d.endAngle);
  const ey = ry * Math.sin(d.endAngle);
  const ret = [];
  ret.push('M', sx, sy, 'A', rx, ry, '0', d.endAngle - d.startAngle > Math.PI ? 1 : 0, '1', ex, ey, 'L', ir * ex, ir * ey);
  ret.push('A', ir * rx, ir * ry, '0', d.endAngle - d.startAngle > Math.PI ? 1 : 0, '0', ir * sx, ir * sy, 'z');
  return ret.join(' ');
}

// 外曲面算法
export function pieOuter(d, rx, ry, h) {
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

export function labelPath(d, rx, ry, h) {
  const x1 = rx * Math.cos(midAngle(d));
  const y1 = ry * Math.sin(midAngle(d));
  const labelPathLength = 1 + h / rx / 2;
  const path = [];
  path.push('M', x1, y1, 'L', x1 * labelPathLength, y1 * labelPathLength);
  path.push('L', (rx + 20) * (midAngle(d) > (3 / 2) * Math.PI || midAngle(d) < Math.PI / 2 ? 1 : -1), y1 * labelPathLength);
  path.push('L', x1 * labelPathLength, y1 * labelPathLength, 'z');
  return path.join(' ');
}

export function tweenLabelTransform(d, options) {
  const { rx, ry, deep } = options;
  let scale = 1;
  if (d.endAngle - d.startAngle < (18 * Math.PI) / 180) {
    scale = 0.8;
  }

  const d2 = {};
  Object.assign(d2, d);
  return t => {
    d2.endAngle = d.startAngle + (d.endAngle - d.startAngle) * t;
    const labelPathLength = 1 + deep / rx / 2;
    return `
            translate(${(rx + 20) * (midAngle(d2) > (3 / 2) * Math.PI || midAngle(d2) < Math.PI / 2 ? 1 : -1)},
                    ${ry * Math.sin(midAngle(d2)) * labelPathLength})
            scale(${scale})`;
  };
}

export function tweenLabelText(d) {
  const d2 = {};
  Object.assign(d2, d);
  return t => {
    d2.endAngle = d.startAngle + (d.endAngle - d.startAngle) * t;
    return midAngle(d2) > (3 / 2) * Math.PI || midAngle(d2) < Math.PI / 2 ? 'start' : 'end';
  };
}

export function move(d, options) {
  const { rx, ry } = options;
  const angle = midAngle(d);
  const ex = 0.2 * rx * Math.cos(angle > Math.PI ? angle : -angle);
  const ey = 0.2 * ry * Math.sin(angle);
  return [ex, ey];
}
