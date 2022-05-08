import { useState } from "react"

export default function useRouter () {
  
  const initalPage = new URLSearchParams (window.location.search).get ('page');
  const [page, setPage] = useState (initalPage || 'home');
  const [param, setParam] = useState (null)
  
  const redirect = (page, param=null, paramName='id', data={}) => () => {
    if (page.startsWith ('http')) return window.location.replace (page);
    setPage (page);
    setParam (param);
    window.history.pushState (data, page, `/?page=${page}${param ? `&${paramName}=${param}` : ''}`);
  }

  return {page, param, redirect}
}