import { useEffect, useState } from "react";

export default function useCharacters (freeze, user, uploads) {

  // state management
  const [characters, setCharacters] = useState ([]);

  // get all characters
  const getCharacters = async () => new Promise (async (resolve, reject) => {
    try {
      let req = await fetch ('https://api.theclergymen.com/characters', {
        headers: user.headers.get
      });
      let characters = await req.json ();
      setCharacters (characters)
      resolve (characters);
    } catch (e) {
      reject (e);
    } 
  })

  // mutators
  const createCharacter = async character => new Promise (async (resolve, reject) => {
    let unfreeze = freeze (`Adding ${character?.memberName}`);
    try {
      let req = await fetch ('https://api.theclergymen.com/characters', {
        method: 'post',
        headers: user.headers.post,
        body: JSON.stringify (character)
      })
      let res = await req.json ();
      await getCharacters ();
      resolve (res);
    } catch (e) {
      reject (e);
    } finally {
      unfreeze ();
    }
  });

  const updateCharacter = async (id, character) => new Promise (async (resolve, reject) => {
    let unfreeze = freeze ();
    try {
      let req = await fetch (`https://api.theclergymen.com/characters/${id}`, {
        method: 'PUT',
        headers: user.headers.post,
        body: JSON.stringify (character)
      })
      let res = await req.json ();
      await getCharacters ();
      resolve (res);
    } catch (e) {
      reject (e);
    } finally {
      unfreeze ();
    }
  });

  const deleteCharacter = async id => new Promise (async (resolve, reject) => {
    let unfreeze = freeze ();
    try {
      await fetch (`https://api.theclergymen.com/characters/${id}`, {
        method: 'delete',
        headers: user.headers.get
      })
      await getCharacters ();
      resolve ();
    } catch (e) {
      reject (e);
    } finally {
      unfreeze ();
    }
  })

  useEffect (() => {
    getCharacters ();
  }, []);

  return {characters, getCharacters, createCharacter, updateCharacter, deleteCharacter};

}