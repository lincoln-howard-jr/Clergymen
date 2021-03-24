import { useState } from "react";
import { useApp } from "../AppProvider";
import {H1, H3} from '../components/Headers'
import RotateSVG from '../img/rotate.svg'

export default function Characters () {
  
  const {auth: {user}, router: {page, redirect}, characters: {characters}} = useApp ();

  const [flipped, setFlipped] = useState ([]);

  const flip = id => e => {
    if (flipped.includes (id)) return setFlipped (fl => fl.filter (_id => _id !== id));
    setFlipped (fl => [...fl, id]);
  }

  if (page !== '/characters') return '';
  return (
    <>
      <div className="text-center">
        <H1>Characters:</H1>
        {
          user &&
          <a onClick={redirect ('/create-character')}>Add Character</a>
        }
      </div>
      <main>
        {
          characters.map (character => (
            <div className={flipped.includes (character.id) ? 'character-card actor' : "character-card"}>
              <div className="character-played-by">
                <header>
                  <H3 short={flipped.includes (character.id) ? character.actorName : character.characterName}>
                    {flipped.includes (character.id) ? character.actorName : character.characterName}
                  </H3>
                  <img className="invert" onClick={flip (character.id)} src={RotateSVG} />
                </header>
                <hr style={{margin: '25px 25%'}} />
                {
                  user &&
                  <div className="text-center">
                    <a onClick={redirect (`/edit-character/${character.id}`)}>Edit</a>
                  </div>
                }
              </div>
              <div className="character-info">
                <span>{flipped.includes (character.id) ? character.actorLongDescription : character.characterLongDescription}</span>
              </div>
              {
                (!flipped.includes (character.id) && character.characterPicture && character.characterPicture.url) &&
                (
                  <div className="character-image">
                    <img src={`https://clergymen-file-bucket-3-8-2021.s3.amazonaws.com/${character.characterPicture.url}`} />
                  </div>
                )
              }
              {
                (flipped.includes (character.id) && character.characterPicture && character.characterPicture.url) &&
                (
                  <div className="character-image">
                    <img src={`https://clergymen-file-bucket-3-8-2021.s3.amazonaws.com/${character.actorPicture.url}`} />
                  </div>
                )
              }
            </div>
          ))
        }
      </main>
    </>
  )

}