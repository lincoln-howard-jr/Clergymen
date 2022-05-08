// create a context usable across the whole application
import React, { createContext, useState } from "react";
import AudioPlayer from "./components/AudioPlayer";
import {useAuth, useCharacters, useForm, useRouter, useEpisodes, useChannelInfo, useContact} from './hooks';
import usePages from "./hooks/usePages";
import useUploads from "./hooks/useUploads";
import useIcons from "./img/useIcons";
// react context api
const AppContext = createContext ();
export const useApp = () => React.useContext (AppContext);

// the component
export default function AppProvider ({children}) {

  // podcast player
  const [podcastId, setPodcastId] = useState (null);
  const [podcastSrc, setPodcastSrc] = useState (null);
  const [podcastTitle, setPodcastTitle] = useState (null);
  const [podcastCoverPhoto, setPodcastCoverPhoto] = useState (null);
  // const [podcastUpNext, setPodcastUpNext] = useState ([]);
  const [podcastPlaying, setPodcastPlaying] = useState (true);

  const togglePlay = () => setPodcastPlaying (!podcastPlaying);
  const setPodcast = episode => e => {
    setPodcastSrc (`https://resources.theclergymen.com/${episode.audioSource.url}`)
    setPodcastCoverPhoto (`https://resources.theclergymen.com/${episode.coverPhoto.url}`);
    setPodcastTitle (episode.title);
    setPodcastId (episode.id);
  }

  // freeze/unfreeze animation
  const [frozen, setFrozen] = useState (false);
  const freeze = message => {
    setFrozen (message);
    return function unfreeze () {
      setFrozen (false);
    }
  }

  // hooks
  const router = useRouter (freeze);
  const contact = useContact (freeze);
  // called when the user is authenticated
  function onSessionActive () {
    contact.getMessages ();
  };
  // auth hook
  const icons = useIcons;
  const auth = useAuth (onSessionActive, freeze);
  const uploads = useUploads (auth, freeze);
  const characters = useCharacters (freeze, auth, uploads);
  const channel = useChannelInfo (freeze, auth);
  const episodes = useEpisodes (freeze, auth);
  const pages = usePages (router, auth, freeze);

  const value = {
    useForm,
    freeze,
    setPodcast,
    togglePlay,
    podcastPlaying,
    podcastId,
    icons,
    router,
    auth,
    channel,
    contact,
    episodes,
    uploads,
    characters,
    pages,
  }

  // just wrap the whole app component in this
  return (
    <AppContext.Provider value={value} >
      <div style={{
        display: (!frozen ? 'none' : 'grid'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ccccccaa',
        width: '100vw',
        height: '100vh',
        zIndex: 10,
        position: 'fixed',
        left: 0,
        top: 0
      }}>
        <span style={{backgroundColor: 'white', padding: 50, border: '1px solid black'}}>
          {frozen === true ? '' : <h1>{frozen}</h1>}
        </span>
      </div>
      {children}
      {
        !!podcastSrc &&
        <AudioPlayer src={podcastSrc} title={podcastTitle} photo={podcastCoverPhoto} togglePlay={togglePlay} playing={podcastPlaying} />
      }
    </AppContext.Provider>
  )
}