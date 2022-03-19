import { useEffect, useState } from "react"

export default function useUploads (freeze, auth) {

  const [channelInfo, setChannelInfo] = useState (null);
  const [err, setErr] = useState (null);

  const getChannel = async () => new Promise (async (resolve, reject) => {
    try {
      let req = await fetch ('https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/channel');
      let data = await req.json ();
      setChannelInfo (data);
      resolve (data);
    } catch (e) {
      setErr (e);
      reject (e);
    }
  });

  const updateChannelInfo = body => new Promise (async (resolve, reject) => {
    let unfreeze = freeze ();
    try {
      let req = await fetch ('https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/channel', {
        method: 'PUT',
        headers: auth.headers.post,
        body: JSON.stringify (body)
      });
      let channel = await req.json ();
      setChannelInfo (Object.assign (channelInfo, channel));
      resolve ();
    } catch (e) {
      setErr (e);
      reject (e);
    } finally {
      unfreeze ();
    }
  });

  useEffect (() => {
    getChannel ();
  }, []);

  return {channelInfo, err, updateChannelInfo}
}