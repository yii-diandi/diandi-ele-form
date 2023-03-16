/**
 * @Author: Wang chunsheng  email:2192138785@qq.com
 * @Date:   2021-10-30 10:48:41
 * @Last Modified by:   Wang chunsheng  email:2192138785@qq.com
 * @Last Modified time: 2022-01-22 03:21:29
 */
// 用于上传类的组件工具mixin
import ajax from '../tools/ajax'
import { t } from '../locale'
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      // 标识: 用于注入全局的 upload 参数
      // Vue.use(EleForm, { upload: { action: '' } })
      isUploadComponent: true
    }
  },
  created () {
    // 使用动态变量覆盖初始值
    console.log('创建数据初始化',this.attrs.attachmentUrl)
  },
  methods: {
    // 上传图片
    handleImageUpload(file, callback) {
      const attrs = this.attrs
      if (!file) {
        this.$message.error(t('ele-form.upload.error'))
        return
      }
      if (attrs.fileSize) {
        const isLt = file.size / 1024 / 1024 < attrs.fileSize
        if (!isLt) {
          this.$message.error(
            t('ele-form.upload.size') + ` ${attrs.fileSize} MB!`
          )
          return
        }
      }
      const isImg = file.type.includes('image')
      if (!isImg) {
        this.$message.error(t('ele-form.upload.imageType'))
        return
      }
      if (!attrs.action) {
        this.$message.error(t('ele-form.upload.action'))
        return
      }
      ajax({
        action: attrs.action,
        file: file,
        headers:attrs.headers,
        filename: attrs.name,
        data: attrs.data,
        onProgress() {
          return false
        },
        onSuccess: response => {
          if (attrs.responseFn) {
            file.url = URL.createObjectURL(file)
            response = attrs.responseFn(response, file)
          }
          callback(response)
        },
        onError: error => {
          this.$message.error(t('ele-form.upload.error'))
          console.error(error)
        }
      })
    }
  }
}
