import { useRef, useState } from "react";
import { useApp } from "../AppProvider";
import {H1, H2, H3} from '../components/Headers'

export default function CreateCharacter () {
  
  const {auth: {user}, router: {page, redirect}, characters: {createCharacter}, uploads: {createUpload}, useForm, freeze} = useApp ();

  const {set, get, status, submit} = useForm (createCharacter);
  const [characterPic, setCharacterPic] = useState (false);
  const [actorPic, setActorPic] = useState (false);
  const characterPictureRef = useRef ();
  const actorPictureRef = useRef ();

  const clickCharacterPicture = async () => {
    characterPictureRef.current.click ();
  }

  const clickActorPicture = async () => {
    actorPictureRef.current.click ();
  }

  const actuallyUploadCharacterPicture = async e => {
    let unfreeze = freeze ('Uploading Photo');
    try {
      let upload = await createUpload ({
        filename: characterPictureRef.current.files [0].name,
        contentType: e.target.files [0].type
      });
      await fetch (upload.uploadUrl, {
        method: 'put',
        headers: new Headers ({'Content-Type': characterPictureRef.current.files [0].type}),
        body: characterPictureRef.current.files [0]
      })
      console.log (upload);
      set ('characterPicture') (upload.id);
      setCharacterPic (`https://d1q33inlkclwle.cloudfront.net/${upload.url}`);
      unfreeze ();
    } catch (e) {
      console.log (e);
      alert ('error while uploading - please try again');
      unfreeze ();
    }
  }
    
  const actuallyUploadActorPicture = async e => {
    let unfreeze = freeze ('Uploading Photo');
    try {
      let upload = await createUpload ({
        filename: actorPictureRef.current.files [0].name,
        contentType: e.target.files [0].type
      });
      console.log (upload);
      await fetch (upload.uploadUrl, {
        method: 'put',
        headers: new Headers ({'Content-Type': actorPictureRef.current.files [0].type}),
        body: actorPictureRef.current.files [0]
      })
      set ('actorPicture') (upload.id);
      setActorPic (`https://d1q33inlkclwle.cloudfront.net/${upload.url}`);
      unfreeze ();
    } catch (e) {
      console.log (e);
      alert ('error while uploading - please try again');
      unfreeze ();
    }
  }
  const updateHeight = e => {
    e.target.style.height = `${e.target.scrollHeight}px`;
  }
  if (!user) return '';
  if (!page.startsWith ('/Clergymen/?page=create-character')) return '';

  return (
    <main>
      <div className="text-center">
        <H1 short="Character">Create Character</H1>
      </div>
      <div className="form">
        <header>
          <H2>Add Character</H2>
        </header>
        <section>
          <H3>Character Info</H3>
          <div className="input-group">
            <label>Character Name</label>
            <input name="characterName" value={get ('characterName')} onChange={set ('characterName')} />
          </div>
          <div className="input-group">
            <label>Character Short Description</label>
            <input name="characterShortDescription" value={get ('characterShortDescription')} onChange={set ('characterShortDescription')} />
          </div>
          <div className="input-group">
            <label>Character Long Description</label>
            <textarea onFocus={updateHeight} onInput={updateHeight} name="characterLongDescription" value={get ('characterLongDescription')} onChange={set ('characterLongDescription')} />
          </div>
          <div className="input-group">
            <label>Character Picture</label>
            {
              !characterPic &&
              <p onClick={clickCharacterPicture}>-- Upload Photo --</p>
            }
            {
              !!characterPic &&
              <img src={characterPic} />
            }
            <input type="file" accept="image/png, image/jpg, image/jpeg" hidden ref={characterPictureRef} onChange={actuallyUploadCharacterPicture} />
          </div>
        </section>
        <section>
          <H3>Actor Info</H3>
          <div className="input-group">
            <label>Actor Name</label>
            <input name="actorName" value={get ('actorName')} onChange={set('actorName')} />
          </div>
          <div className="input-group">
            <label>Actor Short Description</label>
            <input name="actorShortDescription" value={get ('actorShortDescription')} onChange={set ('actorShortDescription')} />
          </div>
          <div className="input-group">
            <label>Actor Long Description</label>
            <textarea onFocus={updateHeight} onInput={updateHeight} name="actorLongDescription" value={get ('actorLongDescription')} onChange={set ('actorLongDescription')} />
          </div>
          <div className="input-group">
            <label>Actor Picture</label>
            {
              !actorPic &&
              <p onClick={clickActorPicture}>-- Upload Photo --</p>
            }
            {
              !!actorPic &&
              <img src={actorPic} />
            }
            <input type="file" accept="image/png, image/jpg, image/jpeg" hidden ref={actorPictureRef} onChange={actuallyUploadActorPicture} />
          </div>
        </section>
        <button onClick={submit}>Add Character</button>
      </div>
    </main>
  )

}