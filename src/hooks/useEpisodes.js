import { useEffect, useState } from "react";
import { headers } from "../lib/auth";

export default function useEpisodes (freeze, auth) {

  // state management
  const [episodes, setEpisodes] = useState ([]);

  const getEpisodes = () => new Promise (async (resolve, reject) => {
    try {
      let req = await fetch (`https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/episodes`);
      let data = await req.json ();
      setEpisodes (data);
      resolve (data);
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
        headers: headers.get
      });
      resolve ();
    } catch (e) {
      reject (e);
    } finally {
       unfreeze ()
     }
  });

  useEffect (() => {
    getEpisodes ();
  }, []);

  return {episodes, getEpisodes, createEpisode, deleteEpisode};

}