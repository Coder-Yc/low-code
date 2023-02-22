import { ElDialog, ElInput, ElButton } from 'element-plus'
import { createVNode, render, defineComponent, reactive } from 'vue'
const DialogComponent = defineComponent({
  props: {
    options: {
      type: Object
    }
  },
  setup(props, ctx) {
    const state = reactive({
      isShow: false,
      options: props.options
    })
    ctx.expose({
      showDialog(options) {
        state.options = options
        state.isShow = true
      }
    })
    const onCancel = () => {
      state.isShow = false
    }
    const onConfirm = (content) => {
      state.options.onConfirm(content)
      state.isShow = false
    }
    return () => {
      return (
        <ElDialog v-model={state.isShow} title={state.options.title}>
          {{
            default: () => (
              <ElInput
                type="textarea"
                v-model={state.options.content}
                rows={10}
              ></ElInput>
            ),
            footer: () =>
              state.options.footer && (
                <div>
                  <ElButton onClick={() => onCancel()}>取消</ElButton>
                  <ElButton
                    type="primary"
                    onClick={() => onConfirm(state.options.content)}
                  >
                    确定
                  </ElButton>
                </div>
              )
          }}
        </ElDialog>
      )
    }
  }
})
let vm
export function $dialog(options) {
  if (!vm) {
    let el = document.createElement('div')
    vm = createVNode(DialogComponent, { options }) //创建虚拟节点
    document.body.appendChild((render(vm, el), el))
  }
  const { showDialog } = vm.component.exposed //如果原本有el那就直接显示
  showDialog(options)
}
