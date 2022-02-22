import { useEffect, useState } from "react";
import { useApp } from "../AppProvider";

export default function SingleEpisode () {

  const {router: {page}, episodes: {episodes}, setPodcast} = useApp ();

  const [singleEpisode, setSingleEpisode] = useState (null);
  useEffect (() => {
    if (!page.startsWith ('/Clergymen/?page=episodes&id=')) return;
    let eid = new URLSearchParams (window.location.search).get ('id');
    let found = episodes.filter (episode => episode.id === eid);
    console.log (eid, found);
    setSingleEpisode (found.length ? found [0] : null);
  }, [episodes, page]);

  useEffect (() => {
    console.log ('on episode found effect', singleEpisode);
    if (singleEpisode !== null) setPodcast (singleEpisode) ();
  }, [singleEpisode]);

  if (!page.startsWith ('/Clergymen?page=episodes&id=')) return '';
  if (!singleEpisode) return '';
  return (
    <div></div>
  )

}