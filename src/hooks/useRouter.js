import { useEffect, useState } from "react"

export default function useRouter () {
  
  const initalPage = new URLSearchParams (window.location.search).get ('page');
  const [page, setPage] = useState (initalPage);
  
  const redirect = (page, data={}) => () => {
    setPage (page);
    window.history.pushState (data, page, `/Clergymen?page=${page}`);
  }

  return {page, redirect}
}