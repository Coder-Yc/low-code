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
            jsonData: []
        })
        const method = {
            show(options) {
                state.options = options
                state.isShow = true
                state.jsonData = options.data
            }
        }
        ctx.expose(method)

        const cancel = () => { state.isShow = false }

        const handleRestorePage = (a) => {
            const { $index } = a
            const { json_block, json_container } = state.jsonData[$index]
            const block = JSON.parse(json_block)
            const container = JSON.parse(json_container)
            const newData = { block, container }
            state.options.onConfirm(newData)
            state.isShow = false
        }
        return () => {
            return (
                <ElDialog v-model={state.isShow}>
                    {{
                        default: () => (
                            <div>
                                <ElTable data={state.jsonData} stripe rowKey='id'>
                                    <ElTableColumn type="index"></ElTableColumn>
                                    <ElTableColumn label="时间" prop="created_at">
                                    </ElTableColumn>
                                    <ElTableColumn label="用户" prop="username">
                                    </ElTableColumn>
                                    <ElTableColumn label="操作">
                                        {{
                                            default: (a) => (
                                                <ElButton type="primary" prop="id" onClick={() => handleRestorePage(a)}>恢复页面</ElButton>
                                            )
                                        }}
                                    </ElTableColumn>
                                </ElTable>
                            </div>
                        ),
                        footer: () => (
                            <div>
                                <ElButton onClick={cancel}>取消</ElButton>
                            </div>
                        )
                    }}
                </ElDialog>
            )
        }
    }
})

let vm
export const $tableDialogData = (options) => {
    if (!vm) {
        const el = document.createElement('div')
        vm = createVNode(TableEditor, { options })
        let r = render(vm, el)
        document.body.appendChild(el)
    }
    const { show } = vm.component.exposed
    show(options)
}
