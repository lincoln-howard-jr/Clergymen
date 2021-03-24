import { useEffect, useRef, useState } from "react"

const ts = seconds => `${Math.floor (seconds / 60)}:${('00' + Math.floor (seconds % 60)).slice (-2)}`;

export default function ({src, playing, title, togglePlay, photo}) {
  const [width, setWidth] = useState ('0%');
  const [currTime, setCurrTime] = useState (0);
  const [duration, setDuration] = useState (0);
  const audioRef = useRef ();
  const onProgress = e => {
    setWidth (`${80 * (audioRef.current.currentTime / audioRef.current.duration)}%`);
    setCurrTime (audioRef.current.currentTime);
    setDuration (audioRef.current.duration);
  }
  useEffect (() => {
    if (playing) audioRef.current.play ();
    else audioRef.current.pause ();
  }, [playing]);
  return (
    <footer id="audio-player" onClick={togglePlay}>
      <section className="audio-player-container">
        <section className="audio-player-time">
          {
            ts (currTime)
          } / {
            ts (duration)
          }
        </section>
        <section className="audio-player-title">{title}</section>
        <section className="audio-player-image">
          <img src={photo} />
        </section>
        <section style={{width}} className="progress" />
      </section>
      <audio onTimeUpdate={onProgress} ref={audioRef} src={src} autoPlay />
    </footer>
  )
}