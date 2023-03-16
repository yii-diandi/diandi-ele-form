<template>
  <el-tabs v-model="currentGroupId" v-bind="attrs" v-on="tabOn">
    <template v-for="item of computedGroups">
      <el-tab-pane
        v-if="getVif(item)"
        :key="item.groupId"
        :label="item.groupLabel"
        :name="item.groupId"
      >
        <ele-form
          v-if="item.groupId === currentGroupId"
          ref="ele-form"
          v-bind="item.form"
          v-on="item.on"
        >
          <template
            v-for="(formItem, key, index) of item.form.formDesc"
            v-slot:[key]="{ desc, props, field, formData }"
          >
            <slot
              :data="formData[field]"
              :desc="desc"
              :props="props"
              :field="field"
              :formData="formData"
              :name="item.groupId + '-' + field"
              :disabled="desc._disabled"
              :type="desc._type"
              :options="desc._options"
            >
              <component
                :is="desc._type"
                :ref="field"
                :key="index"
                :disabled="desc._disabled"
                :desc="desc"
                :options="desc._options"
                :form-data="formData"
                :readonly="props.readonly"
                :field="field"
                :value="getValue(field)"
                :_disabled="desc._disabled"
                @input="setValue(field, $event)"
              />
            </slot>
          </template>

          <!-- 按钮插槽 -->
          <template v-slot:form-btn="{ btns }">
            <slot :btns="btns" :name="item.groupId + '-form-btn'" />
          </template>
        </ele-form>
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
import { isDef } from './tools/utils'

export default {
  name: 'EleFormGroup',
  inheritAttrs: false,
  props: {
    // 自定义tab属性， 具体参考：https://element.eleme.cn/#/zh-CN/component/tabs#tabs-attributes
    tabAttrs: Object,
    // tab的事件, 具体参考：https://element.eleme.cn/#/zh-CN/component/tabs#tabs-events
    tabOn: Object,
    // 分组
    groups: {
      type: Array,
      required: true
    },
    // 默认激活的tab
    activeGroupId: [String, Number]
  },
  data() {
    return {
      getDeepFormDesc: null,
      currentGroupId: ''
    }
  },
  computed: {
    // 所有组的表单值
    allFormData() {
      return this.computedGroups.reduce(
        (acc, group) => Object.assign(acc, group.form.formData),
        {}
      )
    },
    // tabs的属性
    attrs() {
      return Object.assign({}, { type: 'border-card' }, this.tabAttrs)
    },
    // 修改form属性
    computedGroups() {
      return this.groups.map(item => {
        item.form = Object.assign({}, this.$attrs, item.form)
        item.on = Object.assign({}, this.$listeners, item.on)
        return item
      })
    }
  },
  mounted() {
    // 获取默认激活的分组
    if (isDef(this.activeGroupId)) {
      this.currentGroupId = this.activeGroupId
    } else {
      // 使用groups中的第一个
      if (this.groups.length) {
        this.currentGroupId = this.groups[0].groupId
      }
    }
  },
  methods: {
    getValue(val, index) {
      if (this.$refs['ele-form'] && this.$refs['ele-form'][0]) {
        return this.$refs['ele-form'][0].getValue(val)
      }
    },
    setValue(field, $event) {
      this.$refs['ele-form'][0].setValue(field, $event)
    },
    getVif(group) {
      if (typeof group.vif === 'function') {
        return group.vif(this.allFormData)
      } else if (typeof group.vif === 'boolean') {
        return group.vif
      } else {
        return true
      }
    }
  }
}
</script>