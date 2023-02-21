import { onUnmounted } from 'vue'
import { events } from './events'

export function useCommand(data) {
  const state = {
    current: -1,
    queue: [], //存放所有的操作命令
    commands: {}, //制作命令和操作的映射表
    commandArray: [], //存放所有的命令
    destroyFn: []
  }
  const registry = (command) => {
    state.commandArray.push(command)
    state.commands[command.name] = () => {
      //执行对应的回调函数
      const { redo, undo } = command.execute()
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
