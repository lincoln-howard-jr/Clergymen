import { useEffect, useState } from "react"

export default function useUploads (auth, freeze) {

  const [uploads, setUploads] = useState ([]);
  const [err, setErr] = useState (null);

  const getUploads = async () => {
    try {
      const req = await fetch ('https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/uploads', {
        headers: auth.headers.get
      });
      const body = await req.json ();
      setUploads (body)
    } catch (e) {
      console.log (e);
    }
  }

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

  const uploadFile = (file, resolveValue='url', squareify=false) => new Promise (async (resolve,reject) => {
    let unfreeze = freeze ('Uploading File...');
    try {
      const req = await fetch ('https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/uploads', {
        method: 'post',
        headers: auth.headers.post,
        body: JSON.stringify ({
          filename: file.name,
          contentType: file.type,
          squareify
        })
      })
      const obj = await req.json ();
      await fetch (obj.uploadUrl, {
        method: 'put',
        headers: new Headers ({'Content-Type': file.type}),
        body: file
      })
      if (resolveValue === 'object') return resolve (obj);
      getUploads ();
      resolve (`https://d1q33inlkclwle.cloudfront.net/${obj.url}`);
    } catch (e) {
      console.log (e);
      reject (e);
    } finally {
      unfreeze ();
    }
  })

  const deleteUpload = async id => {
    let unfreeze = freeze ('removing upload');
    try {
      await fetch (`https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/uploads/${id}`, {
        method: 'delete',
        headers: auth.headers.get
      })
      await getUploads ();
    } finally {
      unfreeze ();
    }
  }

  useEffect (() => {
    if (auth.headers.get ['x-amz-id-token'] && auth.isAuthenticated) getUploads ();
  }, [auth.isAuthenticated, auth.headers.get ['x-amz-id-token']])

  return {err, uploads, uploadFile, createUpload, deleteUpload}
}