import { defineComponent, inject } from 'vue'
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
    data: { type: Object }
  },
  setup(props, ctx) {
    const { block, data } = props
    const config = inject('config')
    return () => {
      let content = []
      if (!block.value) {
        content.push(
          <>
            <ElFormItem label="容器宽度">
              <ElInputNumber></ElInputNumber>
            </ElFormItem>
            <ElFormItem label="容器高度">
              <ElInputNumber></ElInputNumber>
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
                    input: () => <ElInput></ElInput>,
                    color: () => <ElColorPicker></ElColorPicker>,
                    select: () => (
                      <ElSelect>
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
      }
      return (
        <ElForm labelPosition="top">
          {content}
          <ElFormItem>
            <ElButton type="primary">应用</ElButton>
            <ElButton>重置</ElButton>
          </ElFormItem>
        </ElForm>
      )
    }
  }
})
