import { useEffect, useRef, useState } from "react";
import { useApp } from "../AppProvider";
import { H1 } from "../components/Headers";
import StringArrayInput from "../components/StringArrayInput";

export default function About () {
  const {router: {page}, auth: {user}, channel: {channelInfo, updateChannelInfo}, uploads: {createUpload}, useForm, freeze} = useApp ();
  const [editor, edit] = useState (false); 

  const {set, get, submit} = useForm (values => {
    updateChannelInfo (values);
    edit (false);
  });

  const imageRef = useRef ();
  const [image, setImage] = useState (null);
  useEffect (() => {
    if (channelInfo && channelInfo.image && channelInfo.image.url) setImage (`https://d1q33inlkclwle.cloudfront.net/${channelInfo?.image?.url}`);
  }, [channelInfo])

  const clickImage = () => imageRef.current.click ();

  const actuallyUploadImage = async e => {
    let unfreeze = freeze ('Uploading Photo');
    try {
      let upload = await createUpload ({
        filename: imageRef.current.files [0].name,
        contentType: e.target.files [0].type
      });
      await fetch (upload.uploadUrl, {
        method: 'put',
        headers: new Headers ({'Content-Type': imageRef.current.files [0].type}),
        body: imageRef.current.files [0]
      })
      console.log (upload);
      set ('image') (upload.id);
      setImage (`https://d1q33inlkclwle.cloudfront.net/${upload.url}`);
      unfreeze ();
    } catch (e) {
      console.log (e);
      alert ('error while uploading - please try again');
      unfreeze ();
    }
  }

  let routes = [
    '/Clergymen/?page=admin',
    '/Clergymen/?page=characters',
    '/Clergymen/?page=contact',
    '/Clergymen/?page=create-character',
    '/Clergymen/?page=create-episode',
    '/Clergymen/?page=edit-about',
    '/Clergymen/?page=episodes',
    '/Clergymen/?page=edit-episode',
    '/Clergymen/?page=edit-character'
  ]

  if (!!routes.find (r => page.startsWith (r))) return null;
  if (!channelInfo) return '';
  if (editor) return (
    <>
      <main onSubmit={e => e.preventDefault ()} className="about-container">
        <div className="about">
          <section className="about-input">
            <p>Title</p>
            <input onChange={set ('title')} defaultValue={channelInfo.title} />
          </section>
          <section className="about-input">
            <p>Author</p>
            <input onChange={set ('author')} defaultValue={channelInfo.author} />
          </section>
          <section className="about-input">
            <p>Copyright</p>
            <input onChange={set ('copyright')} defaultValue={channelInfo.copyright} />
          </section>
          <section className="about-input">
            <p>Category</p>
            <input onChange={set ('category')} defaultValue={channelInfo.category} />
          </section>
          <section className="about-input">
            <p>Subcategory</p>
            <input onChange={set ('subcategory')} defaultValue={channelInfo.subcategory} />
          </section>
          <section className="about-input">
            <p>Channel Description</p>
            <div className="string-input-array">
              <StringArrayInput onChange={set ('description')} defaultValue={channelInfo.description} />
            </div>
          </section>
          <section className="about-input">
            <p>Image</p>
            {
              !image &&
              <p onClick={clickImage}>-- Upload Photo --</p>
            }
            {
              !!image &&
              <img onClick={clickImage} src={image} />
            }
            <input ref={imageRef} onChange={actuallyUploadImage} type="file" hidden accept=".jpg, .jpeg, .png" />
          </section>
          <section className="about-input">
            <button onClick={submit}>Submit Changes</button>
          </section>
        </div>
      </main>
    </>
  )

  return (
    <>
    <main className="about-container">
      <div className="about">
        <section className="about-section">
          <H1>{channelInfo.title}</H1>
          <div className="text-center">
            {
              !!user &&
              <a onClick={() => {edit (true)}}>Edit</a>
            }
          </div>
          <div className="about-image">
            <img src={`https://d1q33inlkclwle.cloudfront.net/${channelInfo?.image?.url}`} />
          </div>
        </section>
        <section className="about-section">
          {
            Array.isArray (channelInfo.description) &&
            channelInfo.description.map (text => <p className="about-text">{text}</p>)
          }
        </section>
      </div>
    </main>
    </>
  )
}