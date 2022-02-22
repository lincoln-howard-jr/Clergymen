import { useState } from "react"

export default function useUploads (auth, freeze) {

  const [err, setErr] = useState (null);

  const createUpload = body => new Promise (async (resolve, reject) => {
    try {
      let req = await fetch ('https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/uploads', {
        method: 'post',
        headers: auth.headers.post,
        body: JSON.stringify (body)
      });
      let upload = await req.json ();
      resolve (upload);
    } catch (e) {
      setErr (e);
      reject (e);
    }
  });

  const uploadFile = file => new Promise (async (resolve,reject) => {
    let unfreeze = freeze ('Uploading File...');
    try {
      const req = await fetch ('https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/uploads', {
        method: 'post',
        headers: auth.headers.post,
        body: JSON.stringify ({
          filename: file.name,
          contentType: file.type
        })
      })
      const obj = await req.json ();
      await fetch (obj.uploadUrl, {
        method: 'put',
        headers: new Headers ({'Content-Type': file.type}),
        body: file
      })
      resolve (`https://d1q33inlkclwle.cloudfront.net/${obj.url}`);
    } catch (e) {
      console.log (e);
      reject (e);
    } finally {
      unfreeze ();
    }
  })

  return {err, uploadFile, createUpload}
}