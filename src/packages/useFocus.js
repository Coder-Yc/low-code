import { computed, ref } from 'vue'

export function useFocus(data, callback) {
  const clearMouseFocus = () => {
    data.value.block.forEach((block) => {
      block.focus = false
    })
  }

  const selectIndex = ref(-1)

  //最后选择的块
  const lastSelectBlock = computed(() => data.value.block[selectIndex.value])

  const blockMouseDown = (e, block, index) => {
    e.preventDefault()
    e.stopPropagation()
    // console.log(e)
    if (e.shiftKey) {
      if (focusData.value.focus.length <= 1) {
        block.focus = true
      } else {
        block.focus = !block.focus
      }
    } else {
      if (!block.focus) {
        clearMouseFocus()
        block.focus = true
      }
    }
    selectIndex.value = index
    console.log(selectIndex.value)
    callback(e)
  }

  const containMousedown = () => {
    clearMouseFocus()
    selectIndex.value = -1
  }

  const focusData = computed(() => {
    let focus = []
    let unfocused = []
    data.value.block.forEach((block) => {
      ;(block.focus ? focus : unfocused).push(block)
    })
    return { focus, unfocused }
  })
  return {
    blockMouseDown,
    focusData,
    containMousedown,
    lastSelectBlock
  }
}
