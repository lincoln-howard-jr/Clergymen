import { useRef, useState } from "react";
import { useApp } from "../../../AppProvider";
import Image from '../../../img/image.png'
import Pencil from '../../../img/pencil.png';
import Swap from '../../../img/swap.png';
import Delete from'../../../img/delete.png';
import ComponentSelector from "./ComponentSelector";
import './editable-image.css';
import ImageEditor from "./ImageEditor";

export default function EditableImage (props) {
  const app = useApp ();
  const [selecting, setSelecting] = useState (false);
  const [editing, setEditing] = useState (false);
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
  const getStyle = () => {
    const style = {}
    if (props.col?.params?.width && props.col?.params?.height) style.aspectRatio = 'unset';
    if (props.col?.params?.width) style.width = props.col.params.width.value + props.col.params.width.unit;
    if (props.col?.params?.height) style.height = props.col.params.height.value + props.col.params.height.unit;
    if (props.col?.params?.fit) style.objectFit = props.col.params.fit;
    return {style}
}
  return (
    <>
        <ComponentSelector open={selecting} close={() => setSelecting (false)} onSelect={props.onChange} />
        <ImageEditor open={editing} close={() => setEditing (false)} onChange={props.onChange} col={props.col} />
        <figure className={`editable-image ${props.col.params.sepia && 'sepia'}`}>
            <img {...getStyle ()} onClick={() => fileRef.current.click ()} src={props.col.value ? `https://resources.theclergymen.com/${props.col.value}` : Image} />
            <div className="toolbar">
                <span onClick={() => setEditing (true)} className="editable-pencil">
                    <img src={Pencil} />
                </span>
                <span onClick={() => setSelecting (true)} className="editable-pencil">
                    <img src={Swap} />
                </span>
                <span onClick={() => props.onChange ({type: 'none'})} className="editable-pencil">
                    <img src={Delete} />
                </span>
            </div>
            <input onChange={onChange} ref={fileRef} hidden type="file" accept="image/png, image/jpeg, image/jpg" />
        </figure>
    </>
  )
}
