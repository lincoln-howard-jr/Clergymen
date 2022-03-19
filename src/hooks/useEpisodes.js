import { useEffect, useState } from "react";

const sort = (a, b) => new Date (b.releaseDate) - new Date (a.releaseDate);

export default function useEpisodes (freeze, auth) {

  // state management
  const [allEpisodes, setAllEpisodes] = useState ([]);
  const [episodes, setEpisodes] = useState ([]);

  const getEpisodes = () => new Promise (async (resolve, reject) => {
    try {
      let req = await fetch ('https://d1q33inlkclwle.cloudfront.net/episodes.json')
      let data = await req.json ();
      data = data.map (e => ({...e, releaseDate: new Date (e.releaseDate)}))
      setEpisodes (data);
      if (!auth.isAuthenticated) return resolve (data);
      let allEpisodesReq = await fetch (`https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/episodes`, {
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
      let req = await fetch (`https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/episodes`, {
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

  const deleteEpisode = id => new Promise (async (resolve, reject) => {
    let unfreeze = freeze ();
    try {
      await fetch (`https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/episodes/${id}`, {
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

  return {episodes, allEpisodes, getEpisodes, createEpisode, deleteEpisode};

}