import { useEffect, useState } from "react";

export default function usePages (router, user, freeze) {

  const [pages, setPages] = useState ([]);
  const [currentPage, setCurrentPage] = useState (undefined);
  const [editing, setEditing] = useState (false);

  const getPages = async () => {
    let req = await fetch ('https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/pages');
    setPages (await req.json ());
  }

  const getPageByName = name => {
    setCurrentPage (pages.find (p => p.page === name));
  }

  const updatePage = updatedValue => {
    const clone = [...pages];
    const pageIndex = pages.findIndex (p => currentPage.page === p.page);
    clone.splice (pageIndex, 1, updatedValue);
    setPages (clone);
  }

  const createPage = async page => {
    let unfreeze = freeze ();
    try {
      await fetch ('https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/pages', {
        method: 'post',
        headers: user.headers.post,
        body: JSON.stringify (page)
      })
    } finally {
      unfreeze ();
    }
  }

  useEffect (() => {
    getPageByName (router.page);
  }, [router.page, pages]);

  useEffect (() => {
    getPages ();
  }, [])

  return {currentPage, pages, editing, getPageByName, createPage, updatePage, setEditing};

}