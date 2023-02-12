export function useMenuDragger(containRef, data) {
  let currentComponent = null
  const dragenter = (e) => {
    e.dataTransfer.dropEffect = 'move'
  }
  const dragleave = (e) => {
    e.dataTransfer.dropEffect = 'none'
  }
  const dragover = (e) => {
    e.preventDefault()
  }
  const drop = (e) => {
    // console.log('------------')
    let blocks = data.value.block
    data.value = {
      ...data.value,
      block: [
        ...blocks,
        {
          top: e.offsetY,
          left: e.offsetX,
          zIndex: 1,
          key: currentComponent.key,
          alignCenter: true
        }
      ]
    }
    currentComponent = null
  }

  const dragstart = (e, component) => {
    containRef.value.addEventListener('dragenter', dragenter)
    containRef.value.addEventListener('dragleave', dragleave)
    containRef.value.addEventListener('dragover', dragover)
    containRef.value.addEventListener('drop', drop)
    currentComponent = component
  }

  const dragend = (e) => {
    containRef.value.removeEventListener('dragenter', dragenter)
    containRef.value.removeEventListener('dragleave', dragleave)
    containRef.value.removeEventListener('dragover', dragover)
    containRef.value.removeEventListener('drop', drop)
  }
  return {
    dragstart,
    dragend
  }
}
