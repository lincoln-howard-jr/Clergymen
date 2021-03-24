import { useEffect, useState } from "react";
import { headers } from "../lib/auth";

export default function useEpisodes () {

  // state management
  const [episodes, setEpisodes] = useState ([]);
  const [err, setErr] = useState (null);

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
    try {
      let req = await fetch (`https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/episodes`, {
        method: 'post',
        headers: headers.post,
        body: JSON.stringify (body)
      });
      let data = await req.json ();
      resolve (data);
    } catch (e) {
      reject (e);
    }
  });

  useEffect (() => {
    getEpisodes ();
  }, []);

  return {episodes, err, getEpisodes, createEpisode};

}