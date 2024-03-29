import { useState, useRef } from "react";
import { useApp } from "../AppProvider";
import NavSVG from '../img/nav.svg';

export default function Nav () {
  const {router: {redirect, page}} = useApp ();
  const [open, setOpen] = useState (false);
  const overlayRef = useRef ();
  const close = e => {
    if (e.target === overlayRef.current) {
      setOpen (false);
    }
  }
  const rac = path => e => {
    redirect (path) ();
    setOpen (false);
  }
  return (
    <>
      <nav onClick={() => setOpen (true)} id="nav" className={open ? 'open' : ''}>
        <img src={NavSVG} />
      </nav>
      <div id="nav-overlay" ref={overlayRef} onClick={close}>
        <ul>
          <li onClick={rac ('/Clergymen/?page=about')}>About</li>
          <li onClick={rac ('/Clergymen/?page=episodes')}>Episodes</li>
          <li onClick={rac ('/Clergymen/?page=characters')}>Characters</li>
          <li onClick={rac ('/Clergymen/?page=contact')}>Contact</li>
        </ul>
      </div>
    </>
  )
}