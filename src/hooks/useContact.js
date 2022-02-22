import { useState } from "react";
import { headers } from "../lib/auth";

export default function useContact (freeze) {

  const [messages, setMessages] = useState ([]);

  const getMessages = async () => {
    try {
      let req = await fetch ('https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/messages', {
        headers: headers.get
      });
      let messages = await req.json ();
      setMessages (messages);
    } catch (e) {
    } 
  }

  const sendMessage = async body => new Promise (async (resolve, reject) => {
    let unfreeze = freeze ('Sending your message!');
    try {
      await fetch ('https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/messages', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify (body)
      })
      resolve ();
    } catch (e) {
      reject (e);
    } finally {
      unfreeze ();
    }
  });

  return {messages, getMessages, sendMessage}

}