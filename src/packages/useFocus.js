import { computed } from 'vue'

export function useFocus(data, callback) {
  const clearMouseFocus = () => {
    data.value.block.forEach((block) => {
      block.focus = false
    })
  }

  const blockMouseDown = (e, block) => {
    e.preventDefault()
    e.stopPropagation()
    console.log(e)
    if (e.shiftKey) {
      block.focus = !block.focus
    } else {
      if (!block.focus) {
        clearMouseFocus()
        block.focus = true
      } else {
        block.focus = false
      }
    }
    callback(e)
  }

  const containMousedown = () => {
    clearMouseFocus()
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
    containMousedown
  }
}
