<template>
  <ele-form
    ref="ele-form"
    :form-desc="formDesc"
    class="ele-form-section"
    v-bind="$attrs"
    :form-data="formData"
    @input="$emit('input', $event)"
    v-on="$listeners"
  >
    <!-- 默认插槽 -->
    <template v-slot:default>
      <slot />
    </template>
    <template v-slot:form-content="{ props, formDesc, formData, formErrorObj }">
      <slot
        :formData="formData"
        :formDesc="formDesc"
        :props="props"
        :formErrorObj="formErrorObj"
        name="form-content"
      >
        <div
          v-for="(section, index) of sections"
          :key="index"
          class="ele-form-section-content"
        >
          <slot
            :icon="section.icon"
            :title="section.title"
            name="section-header"
          >
            <div class="ele-form-section-header">
              <i
                v-if="section.icon"
                :class="section.icon"
                style="padding-right: 10px;"
              />
              <span>{{ section.title }}</span>
            </div>
          </slot>
          <div class="ele-form-section-body">
            <el-row :gutter="20">
              <template v-for="(v, field) of section.formDesc">
                <slot
                  :name="field + '-wrapper'"
                  :data="formData[field]"
                  :desc="formDesc[field]"
                  :field="field"
                  :props="props"
                  :formData="formData"
                  :disabled="formDesc[field]._disabled"
                  :type="formDesc[field]._type"
                  :options="formDesc[field]._options"
                >
                  <el-col
                    v-if="formDesc[field]._vif"
                    :key="field"
                    v-bind="formDesc[field]._colAttrs"
                    :class="{ 'ele-form-col--break': formDesc[field].break }"
                  >
                    <el-form-item
                      :error="formErrorObj ? formErrorObj[field] : null"
                      :label-width="formDesc[field].labelWidth || null"
                      :label="
                        props.isShowLabel &&
                          formDesc[field].isShowLabel !== false
                          ? formDesc[field]._label
                          : null
                      "
                      :prop="field"
                    >
                      <!-- 具名 作用域插槽(用于用户自定义显示) -->
                      <slot
                        ::data="formData[field]"
                        :desc="formDesc[field]"
                        :props="props"
                        :field="field"
                        :formData="formData"
                        :name="field"
                        :disabled="formDesc[field]._disabled"
                        :type="formDesc[field]._type"
                        :options="formDesc[field]._options"
                      >
                        <component
                          :is="formDesc[field]._type"
                          :ref="field"
                          :disabled="formDesc[field]._disabled"
                          :desc="formDesc[field]"
                          :options="formDesc[field]._options"
                          :form-data="formData"
                          :readonly="props.readonly"
                          :field="field"
                          :value="getValue(field)"
                          @input="setValue(field, $event)"
                        />
                      </slot>
                      <div
                        v-if="formDesc[field]._tip"
                        class="ele-form-tip"
                        v-html="formDesc[field]._tip"
                      />
                    </el-form-item>
                  </el-col>
                </slot>
              </template>
            </el-row>
          </div>
        </div>
      </slot>
    </template>

    <!-- 按钮区插槽 -->
    <template v-slot:form-btn="{ btns }">
      <slot :btns="getBtns(btns)" name="form-btn">
        <el-button
          v-for="(btn, index) of btns"
          :key="index"
          v-bind="btn.attrs"
          @click="btn.click"
        >{{ btn.text }}</el-button>
      </slot>
    </template>
  </ele-form>
</template>

<script>
export default {
  name: 'EleFormSection',
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
    sections: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      getDeepFormDesc: null
    }
  },
  computed: {
    formDesc() {
      return this.sections.reduce(
        (acc, cur) => Object.assign(acc, cur.formDesc),
        {}
      )
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getDeepFormDesc = this.$refs['ele-form'].getDeepFormDesc
    })
  },
  methods: {
    getValue(val) {
      if (this.$refs['ele-form']) {
        return this.$refs['ele-form'].getValue(val)
      }
    },
    setValue(field, $event) {
      if (this.$refs['ele-form']) {
        this.$refs['ele-form'].setValue(field, $event)
      }
    },
    getBtns(btns) {
      return btns.map(item => {
        item.click = item.click.bind(this.$refs['ele-form'])
        return item
      })
    }
  }
}
</script>

<style>
.ele-form-section .el-form {
  border: 1px solid #ebeef5;
  padding: 0 20px;
}
.ele-form-section-header {
  padding: 18px 0;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  margin-bottom: 15px;
}
</style>
