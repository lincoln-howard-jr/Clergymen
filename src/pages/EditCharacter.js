import { useEffect, useRef, useState } from "react";
import { useApp } from "../AppProvider";
import {H1, H2, H3} from '../components/Headers'

export default function EditCharacter () {
  
  const {auth: {user}, router: {page}, characters: {characters, updateCharacter}, uploads: {createUpload}, useForm, freeze} = useApp ();
  
  const [character, setCharacter] = useState (null);
  const getCharacter = () => {
    let cid = page.split ('/') [2];
    let match = characters.filter (c => c.id === cid);
    let _character = match.length ? match [0] : null;
    setCharacter (_character);
  }
  useEffect (() => {
    getCharacter ();
  }, [characters, page])
  const {set, submit} = useForm (val => updateCharacter (character.id, val));
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
      setCharacter (char => Object.assign (char, {characterPicture: {url: `https://clergymen-file-bucket-3-8-2021.s3.amazonaws.com/${upload.url}`}}))
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
      setCharacter (char => Object.assign (char, {actorPicture: {url: `https://clergymen-file-bucket-3-8-2021.s3.amazonaws.com/${upload.url}`}}))
      unfreeze ();
    } catch (e) {
      console.log (e);
      alert ('error while uploading - please try again');
      unfreeze ();
    }
  }

  if (!user) return '';
  if (!page.startsWith ('/edit-character/')) return '';
  if (!character) return '';
  return (
    <main>
      <div className="text-center">
        <H1 short='Edit'>Edit {character.characterName}</H1>
      </div>
      <div className="form">
        <header>
          <H2>Add Character</H2>
        </header>
        <section>
          <H3>Character Info</H3>
          <div className="input-group">
            <label>Character Name</label>
            <input name="characterName" defaultValue={character.characterName} onChange={set ('characterName')} />
          </div>
          <div className="input-group">
            <label>Character Short Description</label>
            <input name="characterShortDescription" defaultValue={character.characterShortDescription} onChange={set ('characterShortDescription')} />
          </div>
          <div className="input-group">
            <label>Character Long Description</label>
            <textarea name="characterLongDescription" defaultValue={character.characterLongDescription} onChange={set ('characterLongDescription')} />
          </div>
          <div className="input-group">
            <label>Character Picture</label>
            {
              !character.characterPicture &&
              <p onClick={clickCharacterPicture}>-- Upload Photo --</p>
            }
            {
              !!character.characterPicture &&
              <div className="circle-image-container">
                <img onClick={clickCharacterPicture} src={`https://clergymen-file-bucket-3-8-2021.s3.amazonaws.com/${character.characterPicture.url}`} />
              </div>
            }
            <input type="file" accept="image/png, image/jpg, image/jpeg" hidden ref={characterPictureRef} onChange={actuallyUploadCharacterPicture} />
          </div>
        </section>
        <section>
          <H3>Actor Info</H3>
          <div className="input-group">
            <label>Actor Name</label>
            <input name="actorName" defaultValue={character.actorName} onChange={set('actorName')} />
          </div>
          <div className="input-group">
            <label>Actor Short Description</label>
            <input name="actorShortDescription" defaultValue={character.actorShortDescription} onChange={set ('actorShortDescription')} />
          </div>
          <div className="input-group">
            <label>Actor Long Description</label>
            <textarea name="actorLongDescription" defaultValue={character.actorLongDescription} onChange={set ('actorLongDescription')} />
          </div>
          <div className="input-group">
            <label>Actor Picture</label>
            {
              !character.actorPicture &&
              <p onClick={clickActorPicture}>-- Upload Photo --</p>
            }
            {
              !!character.actorPicture &&
              <div className="circle-image-container">
                <img onClick={clickActorPicture} src={`https://clergymen-file-bucket-3-8-2021.s3.amazonaws.com/${character.actorPicture.url}`} />
              </div>
            }
            <input type="file" accept="image/png, image/jpg, image/jpeg" hidden ref={actorPictureRef} onChange={actuallyUploadActorPicture} />
          </div>
        </section>
        <button onClick={submit}>Submit Changes</button>
      </div>
    </main>
  )

}