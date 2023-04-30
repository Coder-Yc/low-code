import { defineComponent, computed, inject, ref } from 'vue'
import { useMenuDragger } from './useMenuDragger'
import { useFocus } from './useFocus'
import { useCommand } from './useCommand'
import './editor.scss'
import EditorBlock from './editor-block'
import { useBlockDragger } from './useBlockDragger'
import { $dialog } from '../components/Dialog'
import { $Dropdown, DropdownItem } from '../components/Dropdown'
import { ElButton } from 'element-plus'
import { Menu } from '@element-plus/icons-vue'
import EditorOperator from './editor-operator'
import dataJson from '../data.json'

import { useRoute } from 'vue-router'

export default defineComponent({
  props: {
    modelValue: {
      type: Object
    },
    formData: {
      type: Object
    }
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const previewRef = ref(false)
    const editorRef = ref(true)

    const route = useRoute()
    const { formData } = props

    const data = computed({
      get() {
        return props.modelValue
      },
      set(newValue) {
        ctx.emit('update:modelValue', JSON.parse(JSON.stringify(newValue)))
      }
    })
    console.log(data)

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

    const {
      blockMouseDown,
      focusData,
      containMousedown,
      lastSelectBlock,
      clearMouseFocus
    } = useFocus(data, previewRef, (e) => {
      //获取焦点后拖拽
      mouseDown(e)
    })
    const { mouseDown, remarkLine } = useBlockDragger(
      focusData,
      lastSelectBlock,
      data
    )

    const { commands } = useCommand(data, focusData)

    const buttons = [
      { label: '撤销', icon: 'icon-back', handle: () => commands.undo() },
      { label: '重做', icon: 'icon-forward', handle: () => commands.redo() },
      {
        label: '导入',
        icon: 'icon-import',
        handle: () => {
          $dialog({
            title: '导入json使用',
            content: '',
            footer: true,
            onConfirm(text) {
              // data.value = JSON.parse(text) //这样无法保留历史记录
              commands.updateContainer(JSON.parse(text))
            }
          })
        }
      },
      {
        label: '导出',
        icon: 'icon-export',
        handle: () => {
          $dialog({
            title: '导出json使用',
            content: JSON.stringify(data.value),
            footer: false
          })
        }
      },
      {
        label: '置顶',
        icon: 'icon-place-top',
        handle: () => commands.placeTop()
      },
      {
        label: '置底',
        icon: 'icon-place-bottom',
        handle: () => commands.placeBottom()
      },
      {
        label: '删除',
        icon: 'icon-delete',
        handle: () => commands.delete()
      },
      {
        label: () => (previewRef.value ? '编辑' : '预览'),
        icon: () => (previewRef.value ? 'icon-edit' : 'icon-browse'),
        handle: () => {
          previewRef.value = !previewRef.value
          clearMouseFocus()
        }
      },
      {
        label: '关闭',
        icon: 'icon-close',
        handle: () => {
          editorRef.value = false
          clearMouseFocus()
        }
      }
    ]

    const blockContextMenu = (e, block) => {
      e.preventDefault()
      $Dropdown({
        el: e.target,
        content: () => {
          return (
            <>
              <DropdownItem
                label="删除"
                icon="icon-delete"
                onClick={() => commands.delete()}
              ></DropdownItem>
              <DropdownItem
                label="置顶"
                icon="icon-place-top"
                onClick={() => commands.placeTop()}
              ></DropdownItem>
              <DropdownItem
                label="置底"
                icon="icon-place-bottom"
                onClick={() => commands.placeBottom()}
              ></DropdownItem>
              <DropdownItem
                label="查看"
                icon="icon-browse"
                onClick={() => {
                  $dialog({
                    title: '查看节点数据',
                    content: JSON.stringify(block)
                  })
                }}
              ></DropdownItem>
              <DropdownItem
                label="导入"
                icon="icon-import"
                onClick={() => {
                  $dialog({
                    title: '导入节点数据',
                    content: '',
                    footer: true,
                    onConfirm(text) {
                      text = JSON.parse(text)
                      commands.updateBlock(text, block)
                    }
                  })
                }}
              ></DropdownItem>
            </>
          )
        }
      })
    }

    return () =>
      !editorRef.value ? (
        <div>
          <div
            class="editor-contain-canvas_content"
            style={containStyle.value}
            style="margin:0"
            ref={containRef}
            onMousedown={containMousedown}
          >
            {data.value.block.map((block, index) => (
              <EditorBlock
                class={block.focus ? 'editor-block-focus' : ''}
                class={previewRef.value ? 'editor-block-preview' : ''}
                block={block}
                formData={formData}
              ></EditorBlock>
            ))}
          </div>
          <div>
            <ElButton
              type="primary"
              onClick={() => (editorRef.value = true)}
              style="marginTop:10px"
            >
              继续编辑
            </ElButton>
          </div>
        </div>
      ) : (
        <div class="editor">
          <div class="editor-left">
            <div class="icon-left">
              <Menu class="icon" />
              <span>组件列表</span>
            </div>
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
          <div class="editor-top">
            {buttons.map((btn, idx) => {
              const icon = typeof btn.icon == 'function' ? btn.icon() : btn.icon
              const label =
                typeof btn.label == 'function' ? btn.label() : btn.label
              return (
                <div class="editor-top-button" onClick={btn.handle}>
                  <i class={icon}></i>
                  <span>{label}</span>
                </div>
              )
            })}
          </div>
          <div class="editor-right">
            <EditorOperator
              data={data.value}
              block={lastSelectBlock}
              updateBlock={commands.updateBlock}
              updateContainer={commands.updateContainer}
            ></EditorOperator>
          </div>
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
                {data.value.block.map((block, index) => (
                  <EditorBlock
                    class={block.focus ? 'editor-block-focus' : ''}
                    class={previewRef.value ? 'editor-block-preview' : ''}
                    block={block}
                    onMousedown={(e) => blockMouseDown(e, block, index)}
                    onContextmenu={(e) => blockContextMenu(e, block)}
                    formData={formData}
                  ></EditorBlock>
                ))}

                {remarkLine.x !== null && (
                  <div
                    class="line-x"
                    style={{ left: remarkLine.x + 'px' }}
                  ></div>
                )}
                {remarkLine.y !== null && (
                  <div
                    class="line-y"
                    style={{ top: remarkLine.y + 'px' }}
                  ></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
  }
})
