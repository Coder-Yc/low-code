import { reactive } from 'vue'
import { events } from './events'
export function useBlockDragger(focusData, lastSelectBlock, data) {
  let dragState = {
    startX: 0,
    startY: 0,
    dragging: false
  }
  let remarkLine = reactive({
    x: null,
    y: null
  })
  //移动中
  const mousemove = (e) => {
    let { clientX: moveX, clientY: moveY } = e

    if (!dragState.dragging) {
      dragState.dragging = true
      events.emit('start')
    }
    //计算当前元素最新的left和right值
    //鼠标移动后-鼠标移动前+left
    let left = moveX - dragState.startX + dragState.startLeft
    let top = moveY - dragState.startY + dragState.startTop

    //计算横线
    let y = null
    let x = null
    for (let i = 0; i < dragState.lines.y.length; i++) {
      const { top: t, showTop: s } = dragState.lines.y[i]
      if (Math.abs(t - top) < 5) {
        y = s
        moveY = dragState.startY - dragState.startTop + t

        break
      }
    }

    for (let i = 0; i < dragState.lines.x.length; i++) {
      const { left: l, showLeft: s } = dragState.lines.x[i]
      if (Math.abs(l - left) < 5) {
        x = s
        moveX = dragState.startX - dragState.startLeft + l

        break
      }
    }

    remarkLine.x = x
    remarkLine.y = y

    let durX = moveX - dragState.startX
    let durY = moveY - dragState.startY
    focusData.value.focus.forEach((block, index) => {
      block.top = dragState.startPos[index].top + durY
      block.left = dragState.startPos[index].left + durX
    })
  }
  //移动后
  const mouseup = () => {
    document.removeEventListener('mousemove', mousemove)
    document.removeEventListener('mouseup', mouseup)
    remarkLine.x = null
    remarkLine.y = null
    if (dragState.dragging) {
      events.emit('end')
    }
  }

  const mouseDown = (e) => {
    const { width: BWidth, height: BHeight } = lastSelectBlock.value

    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      dragging: false,
      startLeft: lastSelectBlock.value.left, //开始拖拽前的left和right值
      startTop: lastSelectBlock.value.top,
      startPos: focusData.value.focus.map(({ top, left }) => ({ top, left })),
      lines: (() => {
        const { unfocused } = focusData.value //获取到没有选中的元素来做基准线
        let lines = { x: [], y: [] } //用来装未选中元素的十条线
        ;[
          ...unfocused,
          {
            top: 0,
            left: 0,
            width: data.value.container.width,
            height: data.value.container.height
          }
        ].forEach((block) => {
          const {
            left: ALeft,
            top: ATop,
            width: AWidth,
            height: AHeight
          } = block

          lines.y.push({ showTop: ATop, top: ATop })
          lines.y.push({ showTop: ATop, top: ATop - BHeight })
          lines.y.push({
            showTop: ATop + AHeight / 2,
            top: ATop + AHeight / 2 - BHeight / 2
          })
          lines.y.push({ showTop: ATop + AHeight, top: ATop + AHeight })
          lines.y.push({
            showTop: ATop + AHeight,
            top: ATop + AHeight - BHeight
          })

          lines.x.push({ showLeft: ALeft, left: ALeft })
          lines.x.push({ showLeft: ALeft + AWidth, left: ALeft + AWidth })
          lines.x.push({
            showLeft: ALeft + AWidth / 2,
            left: ALeft + AWidth / 2 - BWidth / 2
          })
          lines.x.push({
            showLeft: ALeft + AWidth,
            left: ALeft + AWidth - BWidth
          })
          lines.x.push({
            showLeft: ALeft + AWidth,
            left: ALeft + AWidth - BWidth
          })
        })
        console.log(lines)
        return lines
      })()
    }
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
  }
  return { mouseDown, remarkLine }
}
