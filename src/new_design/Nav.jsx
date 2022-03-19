import { useEffect, useState } from "react";
import { useApp } from "../AppProvider";
import TransparentLogo from '../img/logo transparent.png';
import Bars from '../img/nav.svg';

const navLinks = [
  {
    text: 'About',
    page: 'about'
  },
  {
    text: 'Characters',
    page: 'characters'
  },
  {
    text: 'Episodes',
    page: 'episodes'
  },
  {
    text: 'Contact',
    page: 'contact'
  }
]

export default function Nav () {
  const app = useApp ();

  const [open, setOpen] = useState (false);
  const openMobileNav = () => {
    setOpen (true);
  }
  const rac = (route) => () => {
    setOpen (false);
    app.router.redirect (route) ();
  }

  const closeOnClick = e => {
    if (!e.target.className.startsWith ('nav')) setOpen (false);
  }

  useEffect (() => {
    if (open) window.addEventListener ('click', closeOnClick)
    if (!open) window.removeEventListener ('click', closeOnClick)
  }, [open])

  return (
    <nav className={'nav ' + (open ? 'mobile-open' : 'mobile')}>
      {
        navLinks.map (n => (
          <div className="nav-link" onClick={rac (n.page)}>{n.text}</div>
        ))
      }
      <div className="nav-logo" onClick={rac ('home')}><img src={TransparentLogo}/></div>
      <span className="nav-mobile-opener" onClick={openMobileNav}>
        <img className="nav-bars" src={Bars} />
      </span>
    </nav>
  )
}