import { useState } from "react";

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
export default function useNav (user) {

  const [links, setLinks] = useState (navLinks);
  
  const editLink = (linkIndex, newLink) => {
  }

  return {links};
}