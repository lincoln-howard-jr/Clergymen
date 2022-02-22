import { useEffect, useRef, useState } from "react"
import { useApp } from "../AppProvider";
import TextPNG from '../img/text.png'
import ImagePNG from '../img/image.png'

const col = {
  type: 'text',
  value: 'Hi! I am a text component',
  params: {
  }
}

function ComponentSelector (props) {
  if (!props.open) return null;
  return (
    <div className="component-selector" onClick={e => {
      console.log (e.target.className)
      if (e.target.className === 'component-selector') props.close ()
    }}>
      <div className="row cols-2">
        
        <div onClick={() => props.onSelect ({type: 'text', value: 'Hi! I am a text component!'})} className="component">
          <img src={TextPNG} />
          <span>Text</span>
        </div>

        <div onClick={() => props.onSelect ({type: 'image', value: null})} className="component">
          <img src={ImagePNG} />
          <span>Image</span>
        </div>

      </div>
    </div>
  )
}

function EditableImage (props) {
  const app = useApp ();
  const fileRef = useRef ();
  const onChange = async () => {
    try {
      const file = fileRef.current.files [0];
      const clone = {...props.col};
      clone.value = await app.uploads.uploadFile (file);
      props.onChange (clone);
    } catch (e) {

    }
  }
  return (
    <>
      <img onClick={() => fileRef.current.click ()} src={props.col.value || ImagePNG} />
      <input onChange={onChange} ref={fileRef} hidden type="file" />
    </>
  )
}

function EditableText (props) {
  return (
    <>
      <p contentEditable onBlur={e => props.onChange ({
        ...props.col,
        value: e.target.innerText
      })}>{props.col.value}</p>
    </>
  )
}

function EditableRow (props) {
  const [selecting, setSelecting] = useState (false);
  const [selectIndex, setSelectIndex] = useState (-1);
  const onChange = columnIndex => updatedValue => {
    console.log (`change column ${columnIndex} to: `, updatedValue)
    const contents = [...props.row.contents];
    contents.splice (columnIndex, 1, updatedValue);
    const clone = {
      ...props.row,
      contents
    }
    props.onChange (clone);
  }
  return (
    <div className={`row cols-${props.row.cols}`}>
      <ComponentSelector onSelect={component => {
        onChange (selectIndex) (component);
        setSelectIndex (-1);
        setSelecting (false);
      }} open={selecting} close={() => setSelecting (false)} />
      {
        props.row.contents.map ((col, i) => (
          <div onDoubleClick={() => {
            setSelecting (true);
            setSelectIndex (i);
          }} className={col.type}>
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

export default function PageEditor () {
  
  const app = useApp ();

  const [title, setTitle] = useState ('');
  const [page, setPage] = useState (app.router.page);
  const [rows, setRows] = useState ([]);
  
  const onChange = rowIndex => updatedValue => {
    const clone = [...rows];
    clone.splice (rowIndex, 1, updatedValue);
    setRows (clone);
  }

  const [hasChanged, setHasChanged] = useState (false);

  const saveChanges = () => {
    if (!app.pages.currentPage) {
      app.pages.createPage ({
        title,
        page,
        rows
      })
    }
    app.pages.updatePage ({
      title,
      page,
      rows
    })
    setHasChanged (false);
  }

  const discardChanges = () => {
    setTitle (app.pages.currentPage.title);
    setPage (app.pages.currentPage.page);
    setRows (app.pages.currentPage.rows);
    setHasChanged (false);
  }

  useEffect (() => {
    if (!app.pages.currentPage) return;
    discardChanges ();
  }, [app.pages.currentPage]);

  if (!app.pages.editing && app.auth.isAuthenticated) return (
    <div className="edit-banner">
      <p onClick={() => app.pages.setEditing (true)}>Edit This Page</p>
    </div>
  )
  if (app.pages.editing && app.auth.isAuthenticated) return (
    <>
      <div className="edit-banner">
        <p onClick={() => app.pages.setEditing (false)}>Back To Site</p>
      </div>
      <main>
        <div className="row cols-4 toolbar">
          <button>List Pages</button>
          <button>Undo</button>
          <button onClick={discardChanges}>Discard Changes</button>
          <button onClick={saveChanges}>Save Changes</button>
        </div>
        <h1>
          <input placeholder="Title" value={title} onChange={e => {setTitle (e.target.value); setHasChanged (true)}} />
        </h1>
        <div className="row cols-2">
          <div className="text-center">
            Unique Page Name:
            <br/>
            <input placeholder="Page Name" value={page} onChange={e => {setPage (e.target.value); setHasChanged (true)}} />
          </div>
        </div>
        <div className="row text-center">
          <div>
            Add a row with...
          </div>
          <div className="row cols-4">
            <span>
              <button onClick={() => setRows ([...rows, {cols: 1, contents: [col]}])}>One Columm</button>
            </span>
            <span>
              <button onClick={() => setRows ([...rows, {cols: 2, contents: [col, col]}])}>Two Columm</button>
            </span>
            <span>
              <button onClick={() => setRows ([...rows, {cols: 3, contents: [col, col, col]}])}>Three Columm</button>
            </span>
            <span>
              <button onClick={() => setRows ([...rows, {cols: 4, contents: [col, col, col, col]}])}>Four Columm</button>
            </span>
          </div>
        </div>
        {
          rows.map ((row, i) => <EditableRow row={row} onChange={onChange (i)} />)
        }
      </main>
    </>
  )
  return null;
}