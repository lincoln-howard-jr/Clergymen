import { useEffect, useState } from "react"
import { headers } from "../lib/auth";

export default function useUploads () {

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
    try {
      let req = await fetch ('https://38uy900ohj.execute-api.us-east-1.amazonaws.com/Prod/channel', {
        method: 'PUT',
        headers: headers.post,
        body: JSON.stringify (body)
      });
      let channel = await req.json ();
      setChannelInfo (Object.assign (channelInfo, channel));
      resolve ();
    } catch (e) {
      setErr (e);
      reject (e);
    }
  });

  useEffect (() => {
    getChannel ();
  }, []);

  return {channelInfo, err, updateChannelInfo}
}