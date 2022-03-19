import { useEffect, useState } from "react";

const reserved = [
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
  const [currentPage, setCurrentPage] = useState (undefined);
  const [editing, setEditing] = useState (false);
  const [history, setHistory] = useState (false);

  const getPages = async () => {
    if (user.isAuthenticated) {
      let req = await fetch ('https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/pages', {
        headers: user.headers.get
      });
      let raw = await req.json ();
      raw.sort ((a, b) => b.createdAt - a.createdAt);
      setRawPages (raw);
    }
    let r = await fetch ('https://d1q33inlkclwle.cloudfront.net/pages.json');
    setPages (await r.json ())
  }

  const getPageByName = (name, param) => {
    if (param) return setCurrentPage (pages.find (p => p.page === name && p.param === param))
    setCurrentPage (pages.find (p => p.page === name));
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
  }, [user.isAuthenticated])

  return {reserved, currentPage, pages, rawPages, editing, history, getPageByName, createPage, updatePage, setPageById, setEditing, setHistory};

}