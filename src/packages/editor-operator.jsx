import { defineComponent, inject, reactive, watch } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElButton,
  ElInput,
  ElInputNumber,
  ElColorPicker,
  ElSelect,
  ElOption
} from 'element-plus'
export default defineComponent({
  props: {
    block: { type: Object },
    data: { type: Object },
    updateBlock: {
      type: Function
    },
    updateContainer: {
      type: Function
    }
  },
  setup(props, ctx) {
    const { block, data, updateBlock, updateContainer } = props
    const config = inject('config')
    const state = reactive({
      editorData: {}
    })
    const reset = () => {
      if (!props.block.value) {
        state.editorData = JSON.parse(JSON.stringify(data.container))
      } else {
        state.editorData = JSON.parse(JSON.stringify(block.value))
        console.log(state.editorData.props)
      }
    }
    const apply = () => {
      if (!props.block.value) {
        updateContainer({ ...data, container: state.editorData })
        console.log(data)
      } else {
        updateBlock(state.editorData, block.value)
      }
    }
    watch(() => props.block.value, reset, { immediate: true })
    return () => {
      let content = []
      if (!block.value) {
        content.push(
          <>
            <ElFormItem label="容器宽度">
              <ElInputNumber v-model={state.editorData.width}></ElInputNumber>
            </ElFormItem>
            <ElFormItem label="容器高度">
              <ElInputNumber v-model={state.editorData.height}></ElInputNumber>
            </ElFormItem>
          </>
        )
      } else {
        const component = config.componentMap[block.value.key]
        if (component && component.props) {
          content.push(
            Object.entries(component.props).map(([propName, propConfig]) => {
              return (
                <ElFormItem label={propConfig.label}>
                  {{
                    input: () => (
                      <ElInput
                        v-model={state.editorData.props[propName]}
                      ></ElInput>
                    ),
                    color: () => (
                      <ElColorPicker
                        v-model={state.editorData.props[propName]}
                      ></ElColorPicker>
                    ),
                    select: () => (
                      <ElSelect v-model={state.editorData.props[propName]}>
                        {propConfig.options.map((opt) => {
                          return (
                            <ElOption
                              label={opt.label}
                              value={opt.value}
                            ></ElOption>
                          )
                        })}
                      </ElSelect>
                    )
                  }[propConfig.type]()}
                </ElFormItem>
              )
            })
          )
        }

        if (component && component.model) {
          content.push(
            Object.entries(component.model).map(([modelName, label]) => {
              return (
                <ElFormItem label={label}>
                  <ElInput
                    v-model={state.editorData.model[modelName]}
                  ></ElInput>
                </ElFormItem>
              )
            })
          )
        }
      }
      return (
        <ElForm labelPosition="top">
          {content}
          <ElFormItem>
            <ElButton type="primary" onClick={() => apply()}>
              应用
            </ElButton>
            <ElButton onClick={reset}>重置</ElButton>
          </ElFormItem>
        </ElForm>
      )
    }
  }
})
