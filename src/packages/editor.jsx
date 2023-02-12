import { defineComponent, computed, inject, ref } from 'vue'
import { useMenuDragger } from './useMenuDragger'
import { useFocus } from './useFocus'
import './editor.scss'
import EditorBlock from './editor-block'
import { useBlockDragger } from './useBlockDragger'
export default defineComponent({
  props: {
    modelValue: {
      type: Object
    }
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const data = computed({
      get() {
        return props.modelValue
      },
      set(newValue) {
        ctx.emit('update:modelValue', JSON.parse(JSON.stringify(newValue)))
      }
    })
    // console.log(data.value)

    const containStyle = computed(() => ({
      width: data.value.container.width + 'px',
      height: data.value.container.height + 'px'
    }))
    const config = inject('config')

    const containRef = ref(null)
    /**
     * 1. 实现菜单的拖拽
     */
    let { dragstart, dragend } = useMenuDragger(containRef, data)

    /**
     * 2. 实现获取焦点
     */

    const { blockMouseDown, focusData, containMousedown } = useFocus(
      data,
      (e) => {
        //获取焦点后拖拽
        mouseDown(e)
      }
    )
    const { mouseDown } = useBlockDragger(focusData)

    return () => (
      <div class="editor">
        <div class="editor-left">
          {config.componentList.map((component) => (
            <div
              class="editor-left-item"
              draggable
              onDragstart={(e) => dragstart(e, component)}
              onDragend={dragend}
            >
              <span>{component.label}</span>
              <div>{component.preview()}</div>
            </div>
          ))}
        </div>
        <div class="editor-top">菜单栏</div>
        <div class="editor-right">属性控制栏</div>
        <div class="editor-contain">
          {/* 产生滚动条 */}
          <div class="editor-contain-canvas">
            {/* 产生内容 */}
            <div
              class="editor-contain-canvas_content"
              style={containStyle.value}
              ref={containRef}
              onMousedown={containMousedown}
            >
              {data.value.block.map((block) => (
                <EditorBlock
                  class={block.focus ? 'editor-block-focus' : ''}
                  block={block}
                  onMousedown={(e) => blockMouseDown(e, block)}
                ></EditorBlock>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
})
