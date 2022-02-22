import { useEffect, useState } from "react";
import { headers } from "../lib/auth";

export default function useCharacters (freeze) {

  // state management
  const [characters, setCharacters] = useState ([]);
  const [err, setErr] = useState (null);

  // get all characters
  const getCharacters = async () => new Promise (async (resolve, reject) => {
    try {
      let req = await fetch ('https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/characters');
      let characters = await req.json ();
      setCharacters (characters);
      resolve (characters);
    } catch (e) {
      setErr (e);
      reject (e);
    } 
  })

  // mutators
  const createCharacter = async character => new Promise (async (resolve, reject) => {
    let unfreeze = freeze ();
    try {
      let req = await fetch ('https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/characters', {
        method: 'post',
        headers: headers.post,
        body: JSON.stringify (character)
      })
      let res = await req.json ();
      await getCharacters ();
      resolve (res);
    } catch (e) {
      setErr (e);
      reject (e);
    } finally {
      unfreeze ();
    }
  });

  const updateCharacter = async (id, character) => new Promise (async (resolve, reject) => {
    let unfreeze = freeze ();
    try {
      let req = await fetch (`https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/characters/${id}`, {
        method: 'PUT',
        headers: headers.post,
        body: JSON.stringify (character)
      })
      let res = await req.json ();
      await getCharacters ();
      resolve (res);
    } catch (e) {
      setErr (e);
      reject (e);
    } finally {
      unfreeze ();
    }
  });

  const deleteCharacter = async id => new Promise (async (resolve, reject) => {
    let unfreeze = freeze ();
    try {
      await fetch (`https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/characters/${id}`, {
        method: 'delete',
        headers: headers.get
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

  return {characters, err, getCharacters, createCharacter, updateCharacter, deleteCharacter};

}