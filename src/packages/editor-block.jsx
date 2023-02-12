import { defineComponent, computed, inject, onMounted, ref } from 'vue'
export default defineComponent({
  props: {
    block: {
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
    })
    const config = inject('config')
    // console.log(config)
    return () => {
      const component = config.componentMap[props.block.key]
      const renderComponent = component.render()
      return (
        <div class="editor-block" style={blockComponent.value} ref={blockRef}>
          {renderComponent}
        </div>
      )
    }
  }
})
