import { useState } from "react"
import { headers } from "../lib/auth";

export default function useUploads () {

  const [err, setErr] = useState (null);

  const createUpload = body => new Promise (async (resolve, reject) => {
    try {
      let req = await fetch ('https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/uploads', {
        method: 'post',
        headers: headers.post,
        body: JSON.stringify (body)
      });
      let upload = await req.json ();
      resolve (upload);
    } catch (e) {
      setErr (e);
      reject (e);
    }
  });

  return {err, createUpload}
}