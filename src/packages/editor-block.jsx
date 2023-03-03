import { defineComponent, computed, inject, onMounted, ref } from 'vue'
import EditorResize from './editorResize'
export default defineComponent({
  props: {
    block: {
      type: Object
    },
    formData: {
      type: Object
    }
  },
  setup(props) {
    const blockComponent = computed(() => ({
      top: props.block.top + 'px',
      left: props.block.left + 'px',
      zIndex: props.block.zIndex
    }))

    const blockRef = ref(null)
    onMounted(() => {
      let { offsetWidth, offsetHeight } = blockRef.value
      if (props.block.alignCenter) {
        props.block.left = props.block.left - offsetWidth / 2
        props.block.top = props.block.top - offsetHeight / 2
        props.block.alignCenter = false
      }
      props.block.width = offsetWidth
      props.block.height = offsetHeight
    })
    const config = inject('config')
    return () => {
      const component = config.componentMap[props.block.key]
      const renderComponent = component.render({
        size: props.block.hasResize
          ? { width: props.block.width, height: props.block.height }
          : {},
        props: props.block.props,
        model: Object.keys(component.model || {}).reduce((pre, modelName) => {
          let propName = props.block.model[modelName]
          pre[modelName] = {
            modelValue: props.formData[propName],
            'onUpdate:modelValue': (v) => (props.formData[propName] = v)
          }
          return pre
        }, {})
      })
      const { width, height } = component.resize || {}
      return (
        <div class="editor-block" style={blockComponent.value} ref={blockRef}>
          {renderComponent}

          {/**block 为了修改当前block宽, component 为了看是修改宽还是高*/}
          {props.block.focus && (width || height) && (
            <EditorResize
              block={props.block}
              component={component}
            ></EditorResize>
          )}
        </div>
      )
    }
  }
})
