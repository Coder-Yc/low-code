import React, { useEffect, useState, useCallback } from 'react'
import { View, Text } from 'react-native'

const getCountdown = (endDate) => {
  const FormatEndTime = endDate.replace(/\-/g, '/')
  const endtime = new Date(FormatEndTime).getTime()
  const nowtime = new Date().getTime()
  const lefttime = endtime - nowtime,
    lefth = Math.floor(lefttime / (1000 * 60 * 60)),
    leftm = Math.floor((lefttime / (1000 * 60)) % 60),
    lefts = Math.floor((lefttime / 1000) % 60)

  return {
    h: lefth >= 10 ? lefth.toString() : '0' + lefth,
    m: leftm >= 10 ? leftm.toString() : '0' + leftm,
    s: lefts >= 10 ? lefts.toString() : '0' + lefts
  }
}

function CountDown(props) {
  let timer = null
  const [time, setTime] = useState({
    h: '00',
    m: '00',
    s: '00'
  })

  const runCountDown = useCallback(() => {
    const { h, m, s } = getCountdown(props.endTime)

    if (h == '00' && m == '00' && s == '00') {
      clearInterval(timer)
    }

    setTime({ h, m, s })
  }, [time])

  useEffect(() => {
    timer = setInterval(() => {
      runCountDown()
    }, 1000)
  }, [])

  const { h, m, s } = time

  return (
    <View style={{ paddingTop: 50 }}>
      <Text>剩余时间:{`${h}:${m}:${s}`}</Text>
    </View>
  )
}
class demo extends QView {
  render() {
    return <CountDown endTime="2022-12-12 16:23:00" />
  }
}
