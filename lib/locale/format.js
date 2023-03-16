/**
 * @Author: Wang chunsheng  email:2192138785@qq.com
 * @Date:   2021-11-27 17:48:41
 * @Last Modified by:   Wang chunsheng  email:2192138785@qq.com
 * @Last Modified time: 2021-11-28 16:06:46
 */
const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g
/**
 *  String format template
 *  - Inspired:
 *    https://github.com/Matt-Esch/string-template/index.js
 */
export default function (Vue) {
  /**
   * template
   *
   * @param {String} string
   * @param {Array} ...args
   * @return {String}
   */

  function template(string, ...args) {
    if (args.length === 1 && typeof args[0] === 'object') {
      args = args[0]
    }

    if (!args || !args.hasOwnProperty) {
      args = {}
    }

    return string.replace(RE_NARGS, (match, prefix, i, index) => {
      let result

      if (string[index - 1] === '{' &&
        string[index + match.length] === '}') {
        return i
      } else {
        result = Object.prototype.hasOwnProperty.call(args, i) ? args[i] : null
        if (result === null || result === undefined) {
          return ''
        }

        return result
      }
    })
  }

  return template
}
