import { useState } from "react";
import './editable-text.css';
import ComponentSelector from "./ComponentSelector";
import TextEditor from "./TextEditor";
import Pencil from '../../img/pencil.png';
import Swap from '../../img/swap.png';
import Delete from '../../img/delete.png';

export default function EditableText (props) {
    const [editing, setEditing] = useState (false);
    const [selecting, setSelecting] = useState (false);
    return (
      <div className={`editable-text ${editing ? 'editing' : 'not-editing'}`} >
        <ComponentSelector open={selecting} close={() => setSelecting (false)} onSelect={props.onChange} />
        <TextEditor col={props.col} open={editing} close={() => setEditing (false)} onChange={props.onChange} />
        <p className={`${props?.col?.params?.textAlign ? ('align-' + props.col.params.textAlign) : ''}`}>
            <span onClick={() => setEditing (true)} className="editable-pencil">
                <img src={Pencil} />
            </span>
            <span onClick={() => setSelecting (true)} className="editable-pencil">
                <img src={Swap} />
            </span>
            <span onClick={() => props.onChange ({type: 'none'})} className="editable-pencil">
                <img src={Delete} />
            </span>
            {
                props.col.value.map (t => (
                    <span className={`text-editor-content-item ${t.link ? 'link' : ''}`}>
                        {t.text}
                    </span>
                ))
            }
        </p>
      </div>
    )
  }