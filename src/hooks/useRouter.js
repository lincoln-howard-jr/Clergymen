import { useState } from "react"

export default function useRouter () {
  
  const [page, setPage] = useState (window.location.pathname);
  
  const redirect = (path, data={}) => () => {
    setPage (path);
    window.history.pushState (data, path, path);
  }

  return {page, redirect}
}