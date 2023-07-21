import { CountdownCircleTimer } from 'react-countdown-circle-timer'

export const Timer= ({ numSeconds, onTimerFinish }) => {
  return (
      <CountdownCircleTimer
        isPlaying
        duration={numSeconds}
        colors={['#74b9ff']}
        onComplete={onTimerFinish}
        size={100}
      />
  )
}
