/**
 * @Author: Wang chunsheng  email:2192138785@qq.com
 * @Date:   2022-01-10 22:58:33
 * @Last Modified by:   Wang chunsheng  email:2192138785@qq.com
 * @Last Modified time: 2022-01-21 12:58:47
 */
import { t } from '../locale'

export default {
  methods: {
    t (...args) {
      return t.apply(this, args)
    }
  }
}
