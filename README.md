# Charts-3d

本库基于 d3js 二次开发而成，主要解决市面上对 3d 图表欠缺问题。目前仅为 pie 图的支持，其它后续补充。

![image][1]

[1]: https://raw.githubusercontent.com/twtgmfv/charts-3d/master/example/pie3d.png
![pie3d.png](/example)

##安装

`npm install charts-3d`

##使用

添加一个具有 id 属性的 dom 元素，并为其设定 css 的宽和高

`<div id="pie"></div>`

```css
#pie {
  width: 400px;
  height: 300px;
}
```

支持 commonjs 和 umd 开发模式

一、Vue 框架

```js
import 'd3';
import Charts3d from 'charts-3d';
export default {
  data() {
    return {
      opts: {
        select: '#pie',
        title: {
          text: '销售人员统计表',
          fontSize: '18px',
          color: 'red',
          top: 40
        },
        fontSize: '12px',
        angle: 45,
        deep: 15
      },
      data: [
        {
          id: 1,
          title: '张三',
          value: 12
        },
        {
          id: 2,
          title: '李四',
          value: 12
        },
        {
          id: 3,
          title: '王五',
          value: 28
        },
        {
          id: 4,
          title: '赵六',
          value: 19
        },
        {
          id: 5,
          title: '王五',
          value: 28
        },
        {
          id: 6,
          title: '赵六',
          value: 19
        }
      ]
    };
  },
  mounted() {
    this.pie = Charts3d.init(this.opts);
    setTimeout(() => {
      this.pie.update(this.data);
    }, 100);
  },
  methods: {
    update() {
      this.data.forEach(item => {
        item.value = 1 + Math.round(Math.random() * (100 - 1));
      });
      const temp = this.data.filter(item => item.value > 20);
      this.pie.update(temp);
    }
  }
};
```

二、umd

```javascript
const data = [
  {
    id: 1,
    title: '张三',
    value: 12
  },
  {
    id: 2,
    title: '李四',
    value: 12
  },
  {
    id: 3,
    title: '王五',
    value: 28
  },
  {
    id: 4,
    title: '赵六',
    value: 19
  },
  {
    id: 5,
    title: '王五',
    value: 28
  },
  {
    id: 6,
    title: '赵六',
    value: 19
  }
];

const opt = {
  select: '#pie',
  title: {
    text: '销售人员统计表',
    fontSize: '18px',
    color: 'red',
    top: 40
  },
  fontSize: '12px',
  angle: 45,
  deep: 15
};
// const pieChart = new Charts3D(opt);
const pieChart = Charts3D.init(opt);
setTimeout(() => {
  pieChart.update(data);
}, 100);
function update() {
  data.forEach(item => {
    item.value = 1 + Math.round(Math.random() * (100 - 1));
  });
  const temp = data.filter(item => item.value > 20);
  pieChart.update(temp);
}
```

`Charts3d.init(this.opts)`

- `this.opts` - Object, 初始化饼图的参数

### 说明

`opts` 

```
{
    title: {
        text: '',
        top: 0,
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
```

<table>
    <tbody>
        <tr>
            <th>Parameter</th>
            <th>DataType</th>
            <th>IsNull</th>
            <th>Default</th>
            <th>Decryption</th>
        </tr>
        <tr>
            <td>select</td>
            <td>String</td>
            <td>No</td>
            <td>body</td>
            <td>饼图渲染目标元素</td>
        </tr>
        <tr>
            <td>title</td>
            <td>Object</td>
            <td>Yes</td>
            <td></td>
            <td>
                <p>标题</p>
                <p>text:标题文字；top:上边距；fontSize:字号；color:标题颜色</p>
            </td>
        </tr>
        <tr>
            <td>deep</td>
            <td>Number</td>
            <td>Yes</td>
            <td>20</td>
            <td>饼图厚度(min:0)</td>
        </tr>
        <tr>
            <td>angle</td>
            <td>Number</td>
            <td>Yes</td>
            <td>45</td>
            <td>饼图倾斜角度(min:0,max:90)当90时成为正常的平面饼图</td>
        </tr>
        <tr>
            <td>ir</td>
            <td>Number</td>
            <td>Yes</td>
            <td>0.3</td>
            <td>饼图中间空心半径(min:0,max:1)</td>
        </tr>
        <tr>
            <td>fontSize</td>
            <td>String</td>
            <td>Yes</td>
            <td></td>
            <td>字号</td>
        </tr>
        <tr>
            <td>colors</td>
            <td>Object</td>
            <td>Yes</td>
            <td>d3默认色</td>
            <td>饼块和标注等颜色（pies:饼块的颜色）</td>
        </tr>
        <tr>
            <td>animationDuration</td>
            <td>Number</td>
            <td>Yes</td>
            <td>700</td>
            <td>动画时长(毫秒)</td>
        </tr>     
        <tr>
            <td>labelText</td>
            <td>Function</td>
            <td>Yes</td>
            <td>func</td>
            <td>标注文字，允许用户自定义</td>
        </tr>         
    </tbody>
</table>

### Update

更新饼图数据

`pie.update(data, [opts])`

## License

MIT License 2020 © 8013685@qq.com
