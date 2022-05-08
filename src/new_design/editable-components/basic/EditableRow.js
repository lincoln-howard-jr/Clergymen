import EditableEpisode from "../EditableEpisode";
import EditableImage from "./EditableImage";
import EditableText from "./EditableText";
import None from "./None";
import Rows from '../../../img/row.png';
import RowEditor from "./RowEditor";
import { useState } from "react";

export default function EditableRow (props) {
  const [editing, setEditing] = useState (!props.row.cols);
  const onChange = columnIndex => updatedValue => {
    const contents = [...props.row.contents];
    contents.splice (columnIndex, 1, updatedValue);
    const clone = {
      ...props.row,
      contents
    }
    props.onChange (clone);
  }
  const drag = () => {
    props.setDragging (props.index);
  }
  const stop = () => {
    props.setDragging (-1);
  }
    return (
      <>
        <RowEditor open={editing} close={() => setEditing (false)} onChange={props.onChange} row={props.row} />
        <div draggable onDragStart={drag} onDragEnd={stop} className={`editable row cols-${props.row.cols}${props.row.breakout ? ' breakout' : ''}`} >
          {
            props.row.contents.map ((col, i) => (
              <div className={`col ${col.type}`}>
                {
                  col.type === 'none' &&
                  <None onChange={onChange (i)} />
                }
                {
                  col.type === 'text' &&
                  <EditableText onChange={onChange (i)} col={col} />
                }
                {
                  col.type === 'image' &&
                  <EditableImage onChange={onChange (i)} col={col} />
                }
                {
                  col.type === 'episode' &&
                  <EditableEpisode onChange={onChange (i)} col={col} />
                }
                {
                  col.type === 'row' &&
                  <EditableRow row={col} onChange={onChange (i)} />
                }
              </div>
            ))
          }
        </div>
        <div className="editable-row-toolbar">
          <span onClick={() => setEditing (true)}>
            <img src={Rows} />
          </span>
        </div>
      </>
    )
  }