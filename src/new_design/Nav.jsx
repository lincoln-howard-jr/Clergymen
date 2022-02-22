import { useApp } from "../AppProvider";
import TransparentLogo from '../img/logo transparent.png';

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

  return (
    <nav>
      {
        navLinks.map (n => (
          <div className="nav-link" onClick={app.router.redirect (n.page)}>{n.text}</div>
        ))
      }
      <div className="nav-logo" onClick={app.router.redirect ('home')}><img src={TransparentLogo}/></div>
    </nav>
  )
}