import d3 from 'd3';
import Pie3d from './charts/pie3d';

const options = {
  select: 'body',
  type: 'pie3d',
  idSvg: '',
  width: 0,
  height: 0
};

class Charts3D {
  constructor(userOptions) {
    this.setOptions(userOptions);
    this.draw();
  }
  setOptions(opts) {
    this.options = Object.assign({}, options, opts);
    this.options.idSvg = `svg-${Date.now()}`;
    // 获取用户模板元素的宽和高
    const domUser = d3.select(this.options.select);
    const domRect = domUser.node().getBoundingClientRect();
    this.options.width = domRect.width;
    this.options.height = domRect.height;
  }
  draw() {
    // 创建画布
    d3.select(this.options.select)
      .append('svg')
      .attr('id', this.options.idSvg)
      .attr('width', '100%')
      .attr('height', '100%');
  }
  update(data, options) {
    if (this.options.type === 'pie3d') {
      if (!this.Pie3d) {
        if (options) {
          this.setOptions(options);
        }
        this.Pie3d = new Pie3d(this.options);
      }
      this.Pie3d.draw(data);
    }
  }
  static init(userOptions) {
    return new Charts3D(userOptions || {});
  }
}

export default Charts3D;
