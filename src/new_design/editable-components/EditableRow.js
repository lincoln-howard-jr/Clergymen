import EditableImage from "./EditableImage";
import EditableText from "./EditableText";

export default function EditableRow (props) {
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
      <div draggable onDragStart={drag} onDragEnd={stop} className={`editable row cols-${props.row.cols}`} >
        {
          props.row.contents.map ((col, i) => (
            <div className={`col ${col.type}`}>
              {
                col.type === 'text' &&
                <EditableText onChange={onChange (i)} col={col} />
              }
              {
                col.type === 'image' &&
                <EditableImage onChange={onChange (i)} col={col} />
              }
              {
                col.type === 'row' &&
                <EditableRow row={col.value} onChange={onChange (i)} />
              }
            </div>
          ))
        }
      </div>
    )
  }