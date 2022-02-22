// create a context usable across the whole application
import React, { createContext, useState } from "react";
import AudioPlayer from "./components/AudioPlayer";
import {H1} from './components/Headers';
import {useAuth, useCharacters, useForm, useRouter, useEpisodes, useChannelInfo, useContact} from './hooks';
import usePages from "./hooks/usePages";
import useUploads from "./hooks/useUploads";
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
  const [podcastUpNext, setPodcastUpNext] = useState ([]);
  const [podcastPlaying, setPodcastPlaying] = useState (true);

  const togglePlay = () => setPodcastPlaying (!podcastPlaying);
  const setPodcast = episode => e => {
    setPodcastSrc (`https://d1q33inlkclwle.cloudfront.net/${episode.audioSource.url}`)
    setPodcastCoverPhoto (`https://d1q33inlkclwle.cloudfront.net/${episode.coverPhoto.url}`);
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
  const characters = useCharacters (freeze);
  const router = useRouter (freeze);
  const pages = usePages (router);
  const channel = useChannelInfo (freeze);
  const contact = useContact (freeze);
  // called when the user is authenticated
  function onSessionActive () {
    contact.getMessages ();
  };
  // auth hook
  const auth = useAuth (onSessionActive, freeze);
  const uploads = useUploads (auth, freeze);
  const episodes = useEpisodes (freeze, auth);

  // just wrap the whole app component in this
  return (
    <AppContext.Provider value={{pages, router, auth, characters, uploads, episodes, channel, contact, podcastId, podcastPlaying, togglePlay, setPodcast, freeze, useForm}} >
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
          {frozen === true ? '' : <H1>{frozen}</H1>}
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