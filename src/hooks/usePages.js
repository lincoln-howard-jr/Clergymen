import { useEffect, useState } from "react";

const reserved = [
  'nav',
  'admin',
  'list-pages',
  'manage-episodes',
  'create-episode',
  'edit-episode',
  'manage-characters',
  'create-character',
  'edit-character',
  'edit-info',
  'manage-content',
  'manage-media'
]

export default function usePages (router, user, freeze) {

  const [rawPages, setRawPages] = useState ([])
  const [pages, setPages] = useState ([]);
  const [footer, setFooter] = useState (undefined);
  const [nav, setNav] = useState (undefined);
  const [currentPage, setCurrentPage] = useState (undefined);
  const [editing, setEditing] = useState (false);
  const [history, setHistory] = useState (false);

  const getPages = async () => {
    try {
      let r = await fetch ('https://resources.theclergymen.com/pages.json');
      setPages (await r.json ())
      if (user.isAuthenticated) {
        let req = await fetch ('https://api.theclergymen.com/pages', {
          headers: user.headers.get
        });
        let raw = await req.json ();
        raw.sort ((a, b) => b.createdAt - a.createdAt);
        setRawPages (raw);
      }
    } finally {
    }
  }

  const getFooter = () => {
    if (!user.isAuthenticated) return setFooter (pages.find (p => p.page === 'footer'));
    setFooter (rawPages.find (p => p.page === 'footer'));
  }

  const getPageByName = (name, param) => {
    if (!user.isAuthenticated && param) return setCurrentPage (pages.find (p => p.page === name && p.param === param))
    if (!user.isAuthenticated) return setCurrentPage (pages.find (p => p.page === name));
    let matches = rawPages.filter (p => p.page === name);
    if (param) matches = matches.filter (p => p.param === param);
    setCurrentPage (matches [0])
  }

  const updatePage = updatedValue => {
    const clone = [...pages];
    const pageIndex = pages.findIndex (p => currentPage.page === p.page);
    clone.splice (pageIndex, 1, updatedValue);
    setPages (clone);
  }

  const createPage = async page => new Promise (async (resolve, reject) => {
    let unfreeze = freeze ('Uploading page information...');
    try {
      await fetch ('https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/pages', {
        method: 'post',
        headers: user.headers.post,
        body: JSON.stringify (page)
      })
      getPages ();
      resolve ();
    } catch (e) {
      reject (e);
    } finally {
      unfreeze ();
    }
  })

  const setPageById = id => () => {
    setCurrentPage (rawPages.find (p => p.id === id));
    setHistory (false);
    setEditing (true)
  }

  useEffect (() => {
    getPageByName (router.page, router.param);
  }, [router.page, router.param, pages]);

  useEffect (() => {
    getPages ();
  }, [user.headers.get ['x-amz-id-token']]);

  useEffect (() => {
    getFooter ();
  }, [pages, rawPages])

  return {reserved, currentPage, pages, rawPages, editing, footer, history, getPageByName, createPage, updatePage, setPageById, setEditing, setHistory, getFooter};

}