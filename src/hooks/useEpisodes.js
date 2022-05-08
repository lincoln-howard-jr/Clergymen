import { useEffect, useState } from "react";

const sort = (a, b) => new Date (b.releaseDate) - new Date (a.releaseDate);

export default function useEpisodes (freeze, auth) {

  // state management
  const [allEpisodes, setAllEpisodes] = useState ([]);
  const [episodes, setEpisodes] = useState ([]);

  const getEpisodes = () => new Promise (async (resolve, reject) => {
    try {
      let req = await fetch ('https://resources.theclergymen.com/episodes.json')
      let data = await req.json ();
      data = data.map (e => ({...e, releaseDate: new Date (e.releaseDate)}))
      setEpisodes (data);
      if (!auth.isAuthenticated) return resolve (data);
      let allEpisodesReq = await fetch (`https://api.theclergymen.com/episodes`, {
        headers: auth.headers.get
      });
      let allEpisodesData = await allEpisodesReq.json ();
      allEpisodesData = allEpisodesData.map (e => ({...e, releaseDate: new Date (e.releaseDate)}))
      allEpisodesData.sort (sort);
      setAllEpisodes (allEpisodesData)
      resolve (allEpisodes);
    } catch (e) {
      reject (e);
    }
  })
  
  const createEpisode = body => new Promise (async (resolve, reject) => {
    let unfreeze = freeze ();
    try {
      let req = await fetch (`https://api.theclergymen.com/episodes`, {
        method: 'post',
        headers: auth.headers.post,
        body: JSON.stringify (body)
      });
      let data = await req.json ();
      getEpisodes ();
      resolve (data);
    } catch (e) {
      reject (e);
    } finally {
      unfreeze ();
    }
  });

  const updateEpisodes = (id, body) => new Promise (async (resolve, reject) => {
    let unfreeze = freeze ('updating episode');
    try {
      await fetch (`https://api.theclergymen.com/episodes/${id}`, {
        method: 'put',
        headers: auth.headers.post,
        body: JSON.stringify (body)
      });
      await getEpisodes ();
      resolve ();
    } catch (e) {
      reject (e);
    } finally {
      unfreeze ();
    }
  });

  const deleteEpisode = id => new Promise (async (resolve, reject) => {
    let unfreeze = freeze ();
    try {
      await fetch (`https://api.theclergymen.com/episodes/${id}`, {
        method: 'delete',
        headers: auth.headers.get
      });
      getEpisodes ();
      resolve ();
    } catch (e) {
      reject (e);
    } finally {
       unfreeze ()
     }
  });

  useEffect (() => {
    getEpisodes ();
  }, [auth.isAuthenticated]);

  return {episodes, allEpisodes, getEpisodes, createEpisode, updateEpisodes, deleteEpisode};

}