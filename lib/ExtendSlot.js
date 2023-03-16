/**
 * @Author: Wang chunsheng  email:2192138785@qq.com
 * @Date:   2021-11-27 17:48:41
 * @Last Modified by:   Wang chunsheng  email:2192138785@qq.com
 * @Last Modified time: 2021-11-27 19:47:50
 */
// 用于处理插槽
export default {
  name: "ExtendSlot",
  functional: true,
  props: {
    render: Function,
    data: Object
  },
  render: (h, ctx) => {
    return ctx.props.render(h, ctx.props.data);
  }
};
