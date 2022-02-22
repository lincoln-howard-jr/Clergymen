import { useEffect, useRef, useState } from "react";
import { useApp } from "../AppProvider";
import {H1, H2, H3} from '../components/Headers'

const fmtDate = (d=new Date ()) => {
  return `${d.getFullYear ()}-${('00' + d.getMonth ()).slice (-2)}-${('00' + d.getDate ()).slice (-2)}`
}

export default function EditEpisode () {
  
  const {auth: {user}, router: {page}, uploads: {createUpload}, episodes: {episodes, updateEpisode, deleteEpisode}, useForm, freeze} = useApp ();
  
  const [singleEpisode, setSingleEpisode] = useState (null);

  const {get, set, submit, setAll} = useForm (val => updateEpisode (singleEpisode.id, val));

  useEffect (() => {
    let eid = new URLSearchParams (window.location.search).get ('id');
    let found = episodes.filter (episode => episode.id === eid);
    setSingleEpisode (found.length ? found [0] : null);
  }, [episodes, page]);

  useEffect (() => {
    if (singleEpisode) {
      setAll (singleEpisode);
      setCoverPhotoUrl (`https://d1q33inlkclwle.cloudfront.net/${singleEpisode.coverPhoto.url}`)
      setAudioSourceUrl (`https://d1q33inlkclwle.cloudfront.net/${singleEpisode.audioSource.url}`)
    }
  }, [singleEpisode]);
  
  const [coverPhotoUrl, setCoverPhotoUrl] = useState (null);
  const [audioSourceUrl, setAudioSourceUrl] = useState (null);

  const clickCoverPhoto = () => uploadCoverPhotoRef.current.click ();
  const uploadCoverPhoto = async e => {
    let unfreeze = freeze ('Uploading Photo');
    try {
      let upload = await createUpload ({
        filename: uploadCoverPhotoRef.current.files [0].name,
        contentType: e.target.files [0].type
      });
      await fetch (upload.uploadUrl, {
        method: 'put',
        headers: new Headers ({'Content-Type': uploadCoverPhotoRef.current.files [0].type}),
        body: uploadCoverPhotoRef.current.files [0]
      })
      set ('coverPhoto') (upload.id);
      setCoverPhotoUrl (`https://d1q33inlkclwle.cloudfront.net/${upload.url}`);
      unfreeze ();
    } catch (e) {
      console.log (e);
      alert ('error while uploading - please try again');
      unfreeze ();
    }
  }

  const clickAudioSource = () => uploadAudioSourceRef.current.click ();
  const uploadAudioSource = async e => {
    let unfreeze = freeze ('Uploading Podcast Audio - This May Take A Second!');
    try {
      let upload = await createUpload ({
        filename: uploadAudioSourceRef.current.files [0].name,
        contentType: e.target.files [0].type
      });
      await fetch (upload.uploadUrl, {
        method: 'put',
        headers: new Headers ({'Content-Type': uploadAudioSourceRef.current.files [0].type}),
        body: uploadAudioSourceRef.current.files [0]
      })
      set ('audioSource') (upload.id);
      setAudioSourceUrl (`https://d1q33inlkclwle.cloudfront.net/${upload.url}`);
      unfreeze ();
    } catch (e) {
      console.log (e);
      alert ('error while uploading - please try again');
      unfreeze ();
    }
  }

  const uploadCoverPhotoRef = useRef ();
  const uploadAudioSourceRef = useRef ();

  const updateHeight = e => {
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  if (!user) return '';
  if (!page.startsWith ('/Clergymen/?page=edit-episode&id=')) return '';
  if (!singleEpisode) return '';
  return (
    <main>
      <div className="text-center">
        <H1 short="Episode">Create Episode</H1>
      </div>
      <div className="form">
        <header>
          <H2>Add Episode</H2>
        </header>
        <section>
          <H3>Episode Info</H3>
          <div className="input-group">
            <label>Episode Title</label>
            <input name="title" value={get ('title')} onChange={set ('title')} />
          </div>
          <div className="input-group">
            <label>Season Number</label>
            <input name="seasonNumber" type='number' value={get ('seasonNumber')} onChange={set ('seasonNumber')} />
          </div>
          <div className="input-group">
            <label>Episode Number</label>
            <input name="episodeNumber" type='number' value={get ('episodeNumber')} onChange={set ('episodeNumber')} />
          </div>
          <div className="input-group">
            <label>Short Description</label>
            <input name="shortDescription" value={get ('shortDescription')} onChange={set ('shortDescription')} />
          </div>
          <div className="input-group">
            <label>Long Description</label>
            <textarea onFocus={updateHeight} onInput={updateHeight} name="longDescription" value={get ('longDescription')} onChange={set ('longDescription')} />
          </div>
          <div className="input-group">
            <label>Release Date (doesn't have to be final!)</label>
            <input name="releaseDate" type="date" value={fmtDate (new Date (get ('releaseDate')))} onChange={set ('releaseDate')} />
          </div>
          <div className="input-group">
            <label>Cover Photo</label>
            {
              !get ('coverPhoto') &&
              <p onClick={clickCoverPhoto}>-- Upload Photo --</p>
            }
            {
              !!get('coverPhoto') &&
              <img src={coverPhotoUrl} />
            }
            <input type="file" accept="image/png, image/jpg, image/jpeg" hidden ref={uploadCoverPhotoRef} onChange={uploadCoverPhoto} />
          </div>
          <div className="input-group">
            <label>Audio File (mp3)</label>
            {
              !audioSourceUrl &&
              <p onClick={clickAudioSource}>-- Upload Audio --</p>
            }
            {
              audioSourceUrl &&
              <audio src={audioSourceUrl} />
            }
            <input type="file" accept="audio/mp3" hidden ref={uploadAudioSourceRef} onChange={uploadAudioSource} />
          </div>
        </section>
        <div className="button-group">
          <button onClick={submit}>Edit Episode</button>
          <button onClick={() => deleteEpisode (singleEpisode.id)}>Delete Episode</button>
        </div>
      </div>
    </main>
  )

}