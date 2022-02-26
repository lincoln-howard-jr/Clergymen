import { useRef, useState } from "react";
import { useApp } from "../../AppProvider";
import Image from '../../img/image.png'
import Pencil from '../../img/pencil.png';
import Swap from '../../img/swap.png';
import ComponentSelector from "./ComponentSelector";
import './editable-image.css';

export default function EditableImage (props) {
  const app = useApp ();
  const [selecting, setSelecting] = useState (false);
  const fileRef = useRef ();
  const onChange = async () => {
    try {
      const file = fileRef.current.files [0];
      const clone = {...props.col};
      clone.value = await app.uploads.uploadFile (file);
      props.onChange (clone);
    } catch (e) {
        console.log (e);
    }
  }
  return (
    <>
        <ComponentSelector open={selecting} close={() => setSelecting (false)} onSelect={props.onChange} />
        <figure className="editable-image">
            <img onClick={() => fileRef.current.click ()} src={props.col.value || Image} />
            <div className="toolbar">
                <span onClick={() => setEditing (true)} className="editable-pencil">
                    <img src={Pencil} />
                </span>
                <span onClick={() => setSelecting (true)} className="editable-pencil">
                    <img src={Swap} />
                </span>
            </div>
            <input onChange={onChange} ref={fileRef} hidden type="file" />
        </figure>
    </>
  )
}
