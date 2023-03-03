import { ElButton, ElTag } from 'element-plus'
import { computed, defineComponent } from 'vue'
import { $tableDialog } from '../components/tableDialog'
export default defineComponent({
  props: {
    propConfig: { type: Object },
    modelValue: { type: Array }
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const data = computed({
      get() {
        return props.modelValue || []
      },
      set(newValue) {
        ctx.emit('update:modelValue', JSON.parse(JSON.stringify(newValue)))
      }
    })
    const add = () => {
      $tableDialog({
        config: props.propConfig,
        data: data.value,
        onConfirm(newValue) {
          console.log(newValue)
          data.value = newValue
        }
      })
    }
    return () => {
      return (
        <div>
          {(!data.value || data.value.length == 0) && (
            <ElButton type="primary" onClick={add}>
              添加
            </ElButton>
          )}

          {(data.value || []).map((item, index) => (
            <ElTag>{item[props.propConfig.table.key]}</ElTag>
          ))}
        </div>
      )
    }
  }
})
