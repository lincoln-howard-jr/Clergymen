import { useEffect, useRef, useState } from "react"
import PauseSVG from '../img/pause.svg'
import PlaySVG from '../img/play.svg'

const ts = seconds => `${Math.floor (seconds / 60)}:${('00' + Math.floor (seconds % 60)).slice (-2)}`;

export default function AudioPlayer ({src, playing, title, togglePlay, photo}) {
  const [width, setWidth] = useState ('0%');
  const [currTime, setCurrTime] = useState (0);
  const [duration, setDuration] = useState (0);
  const [smallPlayerOpen, setSmallPlayerOpen] = useState (false);
  const audioRef = useRef ();
  const onProgress = e => {
    setWidth (`${100 * (audioRef.current.currentTime / audioRef.current.duration)}%`);
    setCurrTime (audioRef.current.currentTime);
    setDuration (audioRef.current.duration);
  }
  useEffect (() => {
    if (playing) audioRef.current.play ();
    else audioRef.current.pause ();
  }, [playing]);
  return (
    <footer id="audio-player" className={smallPlayerOpen ? 'open' : ''}>
      <section className="audio-player-container-small">
        <span onClick={() => setSmallPlayerOpen (!smallPlayerOpen)} className="audio-player-small-image">
          <img alt="" src={photo} />
        </span>
        <section className="audio-player-small-time">
          <span>
            {
              ts (currTime)
            }/{
              ts (duration)
            }
          </span>
          <span onClick={togglePlay} className="small-toggle-play">
            <img alt="" src={playing ? PauseSVG : PlaySVG} />
          </span>
        </section>
      </section>
      <section className="audio-player-container">
        <section className="audio-player-time">
          {
            ts (currTime)
          } / {
            ts (duration)
          }
        </section>
        <section className="audio-player-title">{title}</section>
        <section onClick={togglePlay} className="audio-player-image">
          <img alt="" src={photo} />
          <img alt="" src={playing ? PauseSVG : PlaySVG} />
        </section>
        <section style={{width}} className="progress" />
      </section>
      <audio onTimeUpdate={onProgress} ref={audioRef} src={src} autoPlay />
    </footer>
  )
}