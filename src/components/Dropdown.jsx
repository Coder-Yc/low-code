import { ElDialog, ElInput, ElButton } from 'element-plus'
import {
  createVNode,
  render,
  defineComponent,
  reactive,
  computed,
  onMounted,
  ref,
  onBeforeUnmount,
  provide,
  inject
} from 'vue'

export const DropdownItem = defineComponent({
  props: {
    label: String,
    icon: String
  },
  setup(props) {
    const { label, icon } = props
    const hide = inject('hide')

    return () => (
      <div class="dropdown-item" onClick={hide}>
        <i class={icon}></i>
        <span>{label}</span>
      </div>
    )
  }
})

const DialogComponent = defineComponent({
  props: {
    options: {
      type: Object
    }
  },
  setup(props, ctx) {
    const state = reactive({
      isShow: false,
      options: props.options,
      top: 0,
      left: 0
    })
    ctx.expose({
      showDropdown(options) {
        state.options = options
        state.isShow = true
        let { top, left, height } = options.el.getBoundingClientRect()
        state.top = top + height
        state.left = left
      }
    })
    provide('hide', () => (state.isShow = false))
    const classes = computed(() => [
      'dropdown',
      {
        'dropdown-isShow': state.isShow
      }
    ])
    const styles = computed(() => ({
      top: state.top + 'px',
      left: state.left + 'px'
    }))

    const el = ref(null)

    const onMousedownDocument = (e) => {
      if (!el.value.contains(e.target)) {
        state.isShow = false
      }
    }
    onMounted(() => {
      document.body.addEventListener('mousedown', onMousedownDocument, true)
    })
    onBeforeUnmount(() => {
      document.body.removeEventListener('mouse')
    })

    return () => {
      return (
        <div class={classes.value} style={styles.value} ref={el}>
          {state.options.content()}
        </div>
      )
    }
  }
})
let vm
export function $Dropdown(options) {
  if (!vm) {
    let el = document.createElement('div')
    vm = createVNode(DialogComponent, { options }) //创建虚拟节点
    document.body.appendChild((render(vm, el), el))
  }
  const { showDropdown } = vm.component.exposed //如果原本有el那就直接显示
  showDropdown(options)
}
