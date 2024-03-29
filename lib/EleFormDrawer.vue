<template>
  <el-drawer
    :title="title"
    :visible="visible"
    :direction="direction"
    :size="size"
    class="ele-form-drawer"
    v-bind="drawerAttrs"
    @update:visible="$emit('update:visible', $event)"
    @closed="$emit('closed')"
    @open="$emit('open')"
    @opened="$emit('opened')"
  >
    <!-- title 插槽 -->
    <template v-slot:title>
      <slot :title="title" name="title" />
    </template>
    <ele-form
      ref="ele-form"
      :form-desc="formDesc"
      :form-data="formData"
      :is-show-back-btn="isShowBackBtn"
      :is-show-cancel-btn="isShowCancelBtn"
      :visible="visible"
      v-bind="$attrs"
      @input="$emit('input', $event)"
      v-on="$listeners"
    >
      <!-- 默认插槽 -->
      <template v-slot:default>
        <slot />
      </template>

      <!-- 作用域插槽 -->
      <template
        v-for="(formItem, field) of formDesc"
        v-slot:[field]="{ formData, props }"
      >
        <slot
          :data="formData[field]"
          :desc="formItem"
          :field="field"
          :formData="formData"
          :name="field"
          :props="props"
          :disabled="formItem._disabled"
          :type="formItem._type"
          :options="formItem._options"
        >
          <component
            :is="formItem._type"
            :ref="field"
            :disabled="formItem._disabled"
            :desc="formItem"
            :form-data="formData"
            :options="formItem._options"
            :readonly="props.readonly"
            :field="field"
            :value="getValue(field)"
            @input="setValue(field, $event)"
          />
        </slot>
      </template>

      <!-- 按钮插槽 -->
      <template v-slot:form-btn="{ btns }">
        <slot :btns="btns" name="form-btn">
          <el-button
            v-for="(btn, index) of getBtns(btns)"
            :key="index"
            v-bind="btn.attrs"
            @click="btn.click"
          >{{ btn.text }}</el-button>
        </slot>
      </template>
    </ele-form>
  </el-drawer>
</template>

<script>
const cloneDeep = require('clone')

export default {
  name: 'EleFormDrawer',
  inheritAttrs: false,
  model: {
    prop: 'formData',
    event: 'input'
  },
  props: {
    // 表单数据
    formData: {
      type: Object,
      required: true
    },
    // 弹窗是否显示
    visible: {
      type: Boolean,
      default: false
    },
    // 弹框标题
    title: String,
    // 弹窗标题
    size: {
      type: String,
      default: '35%'
    },
    // 方向
    direction: {
      type: String,
      default: 'rtl'
    },
    // 弹窗其它属性
    drawerAttrs: Object,
    // 是否显示返回按钮, 这里是 false
    isShowBackBtn: {
      type: Boolean,
      default: false
    },
    // 是否显示取消按钮, 这里是 true
    isShowCancelBtn: {
      type: Boolean,
      default: true
    },
    // 表单项
    formDesc: {
      type: Object,
      required: true
    }
    // ... 其它属性同 vue-ele-form 组件
  },
  data() {
    return {
      initVal: {}
    }
  },
  watch: {
    // 当关闭时, 清空数据
    visible(val) {
      if (!val) {
        this.$emit('input', cloneDeep(this.initVal))
      } else {
        this.$nextTick(() => {
          this.$refs['ele-form'].$refs.form.clearValidate()
          this.$nextTick(() => {
            this.initVal = cloneDeep(this.formData)
          })
        })
      }
    }
  },
  methods: {
    getValue(val) {
      if (this.$refs['ele-form']) {
        return this.$refs['ele-form'].getValue(val)
      }
    },
    setValue(field, $event) {
      this.$nextTick(() => {
        this.$refs['ele-form'].setValue(field, $event)
      })
    },
    getBtns(btns) {
      return btns
        .map(item => {
          item.click.bind(this.$refs.form)
          return item
        })
        .reverse()
    }
  }
}
</script>

<style>
.ele-form-drawer .el-drawer__body {
  padding: 0 20px;
}
</style>
