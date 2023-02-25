import { onUnmounted } from 'vue'
import { events } from './events'

export function useCommand(data, focusData) {
  const state = {
    current: -1,
    queue: [], //存放所有的操作命令
    commands: {}, //制作命令和操作的映射表
    commandArray: [], //存放所有的命令
    destroyFn: []
  }
  const registry = (command) => {
    state.commandArray.push(command)
    state.commands[command.name] = (...args) => {
      //执行对应的回调函数
      const { redo, undo } = command.execute(...args)
      redo()
      if (!command.pushQueue) return
      let { queue, current } = state
      if (queue.length > 0) {
        queue = queue.slice(0, current + 1)
        state.queue = queue
      }
      queue.push({ redo, undo })
      state.current = current + 1
    }
  }

  registry({
    name: 'redo',
    keyboard: 'cmd+y',
    execute() {
      return {
        redo() {
          let item = state.queue[state.current + 1]
          if (item) {
            item.redo && item.redo()
            state.current++
          }
        }
      }
    }
  })

  registry({
    name: 'undo',
    keyboard: 'cmd+z',
    execute() {
      return {
        redo() {
          if (state.current == -1) return
          let item = state.queue[state.current]
          if (item) {
            item.undo && item.undo()
            state.current--
          }
        }
      }
    }
  })

  registry({
    name: 'drag',
    pushQueue: true,
    init() {
      //去监听事件
      this.before = null
      const start = () => {
        this.before = JSON.parse(JSON.stringify(data.value.block))
      }
      const end = () => {
        state.commands.drag()
      }
      events.on('start', start)
      events.on('end', end)
      return () => {
        events.off('start', start)
        events.off('end', end)
      }
    },
    execute() {
      let before = this.before
      let after = data.value.block
      return {
        redo() {
          data.value = { ...data.value, block: after }
        },
        undo() {
          data.value = { ...data.value, block: before }
        }
      }
    }
  })
  //历史记录模式
  registry({
    name: 'updateContainer',
    pushQueue: 'true',
    execute(newValue) {
      let state = {
        before: data.value,
        after: newValue
      }
      return {
        redo() {
          data.value = state.after
        },
        undo() {
          data.value = state.before
        }
      }
    }
  })

  //单个block修改
  registry({
    name: 'updateBlock',
    pushQueue: 'true',
    execute(newBlock, oldBlock) {
      let state = {
        before: data.value.block,
        after: (() => {
          let blocks = [...data.value.block]
          const index = data.value.block.indexOf(oldBlock)
          if (index > -1) {
            blocks.splice(index, 1, newBlock)
          }

          return blocks
        })()
      }
      return {
        redo() {
          data.value = { ...data.value, block: state.after }
        },
        undo() {
          data.value = { ...data.value, block: state.before }
        }
      }
    }
  })

  //置顶
  registry({
    name: 'placeTop',
    pushQueue: true,
    execute() {
      //避免前后一致导致不更新数据
      let before = JSON.parse(JSON.stringify(data.value.block))
      let after = (() => {
        let { focus, unfocused } = focusData.value
        // console.log(unfocused)
        let maxZIndex = unfocused.reduce((pre, block) => {
          console.log(pre)
          return Math.max(pre, block.zIndex)
        }, 0)
        focus.forEach((block) => {
          block.zIndex = maxZIndex + 1
        })
        return data.value.block
      })()
      return {
        redo() {
          data.value = { ...data.value, block: after }
        },
        undo() {
          data.value = { ...data.value, block: before }
        }
      }
    }
  })
  //置地
  registry({
    name: 'placeBottom',
    pushQueue: true,
    execute() {
      //避免前后一致导致不更新数据
      let before = JSON.parse(JSON.stringify(data.value.block))
      let after = (() => {
        let { focus, unfocused } = focusData.value
        // console.log(unfocused)
        let minZIndex =
          unfocused.reduce((pre, block) => {
            return Math.min(pre, block.zIndex)
          }, Infinity) - 1
        if (minZIndex < 0) {
          let dur = Math.abs(minZIndex)
          minZIndex = 0
          unfocused.forEach((block) => (block.zIndex += dur))
        }
        focus.forEach((block) => (block.zIndex = minZIndex))
        return data.value.block
      })()
      return {
        redo() {
          data.value = { ...data.value, block: after }
        },
        undo() {
          data.value = { ...data.value, block: before }
        }
      }
    }
  })
  registry({
    name: 'delete',
    pushQueue: true,
    execute() {
      //避免前后一致导致不更新数据
      let before = JSON.parse(JSON.stringify(data.value.block))
      let after = focusData.value.unfocused
      return {
        redo() {
          data.value = { ...data.value, block: after }
        },
        undo() {
          data.value = { ...data.value, block: before }
        }
      }
    }
  })

  const keyboardEvent = (() => {
    const keyCodes = {
      90: 'z',
      89: 'y'
    }
    const onkeydown = (e) => {
      const { metaKey, keyCode } = e
      //   console.log('----------', e)
      let keyString = []
      if (metaKey) keyString.push('cmd')
      keyString.push(keyCodes[keyCode])
      keyString = keyString.join('+')
      //   console.log(keyCodes[keyCode])
      state.commandArray.forEach(({ keyboard, name }) => {
        if (!keyboard) return
        if (keyboard == keyString) {
          state.commands[name]()
          e.preventDefault()
        }
      })
    }
    const init = () => {
      window.addEventListener('keydown', onkeydown)
      return () => {
        window.removeEventListener('keydown', onkeydown)
      }
    }
    return init
  })()

  ;(() => {
    state.destroyFn.push(keyboardEvent())
    state.commandArray.forEach(
      (command) => command.init && state.destroyFn.push(command.init())
    )
  })()

  onUnmounted(() => {
    //清理绑定的事件
    state.destroyFn.forEach((fn) => fn && fn())
  })
  return state
}
