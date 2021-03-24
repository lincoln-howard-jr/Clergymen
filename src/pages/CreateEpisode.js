import { useRef, useState } from "react";
import { useApp } from "../AppProvider";
import {H1, H2, H3} from '../components/Headers'

export default function CreateEpisode () {

  const {router: {page}, auth: {user}, episodes: {createEpisode}, uploads: {createUpload}, useForm, freeze} = useApp ();
  const {get, set, submit} = useForm (values => {
    let body = Object.assign (values, {
      episodeNumber: parseInt (values.episodeNumber),
      seasonNumber: parseInt (values.seasonNumber)
    })
    createEpisode (body);
  });
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
      setCoverPhotoUrl (`https://clergymen-file-bucket-3-8-2021.s3.amazonaws.com/${upload.url}`);
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
      setAudioSourceUrl (`https://clergymen-file-bucket-3-8-2021.s3.amazonaws.com/${upload.url}`);
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
  if (page !== '/create-episode') return '';
  
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
            <input name="releaseDate" type="date" value={get ('releaseDate')} onChange={set ('releaseDate')} />
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
              !get ('audioSource') &&
              <p onClick={clickAudioSource}>-- Upload Audio --</p>
            }
            {
              !!get('audioSource') &&
              <audio src={audioSourceUrl} />
            }
            <input type="file" accept="audio/mp3" hidden ref={uploadAudioSourceRef} onChange={uploadAudioSource} />
          </div>
        </section>
        <button onClick={submit}>Add Character</button>
      </div>
    </main>
  )

}