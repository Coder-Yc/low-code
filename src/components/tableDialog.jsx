import {
  ElButton,
  ElDialog,
  ElInput,
  ElTable,
  ElTableColumn
} from 'element-plus'
import { createVNode, defineComponent, reactive, render } from 'vue'

const TableEditor = defineComponent({
  props: {
    options: { type: Object }
  },
  setup(props, ctx) {
    const state = reactive({
      options: props.options,
      isShow: false,
      tableDate: []
    })
    const method = {
      show(options) {
        state.options = options
        state.isShow = true
        state.tableDate = options.data
      }
    }
    ctx.expose(method)
    const add = () => {
      state.tableDate.push({})
    }
    const cancel = () => {}
    const confirm = () => {
      state.options.onConfirm(state.tableDate)
      state.isShow = false
    }
    return () => {
      return (
        <ElDialog v-model={state.isShow}>
          {{
            default: () => (
              <div>
                <div>
                  <ElButton onClick={add}>添加</ElButton>
                  <ElButton>重置</ElButton>
                </div>
                <ElTable data={state.tableDate}>
                  <ElTableColumn type="index"></ElTableColumn>
                  {state.options.config.table.options.map((item, index) => {
                    return (
                      <ElTableColumn label={item.label}>
                        {{
                          default: ({ row }) => (
                            <ElInput v-model={row[item.field]}></ElInput>
                          )
                        }}
                      </ElTableColumn>
                    )
                  })}
                  <ElTableColumn label="操作">
                    <ElButton type="danger">删除</ElButton>
                  </ElTableColumn>
                </ElTable>
              </div>
            ),
            footer: () => (
              <div>
                <ElButton onClick={cancel}>取消</ElButton>
                <ElButton onClick={confirm}>确定</ElButton>
              </div>
            )
          }}
        </ElDialog>
      )
    }
  }
})

let vm
export const $tableDialog = (options) => {
  if (!vm) {
    const el = document.createElement('div')
    vm = createVNode(TableEditor, { options })
    let r = render(vm, el)
    document.body.appendChild(el)
  }
  const { show } = vm.component.exposed
  show(options)
}
