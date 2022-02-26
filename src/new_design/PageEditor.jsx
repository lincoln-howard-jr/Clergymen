import { useEffect, useState } from "react"
import { useApp } from "../AppProvider";
import EditableRow from "./editable-components/EditableRow";
import Delete from '../img/delete.png';

const col = {
  type: 'text',
  value: [
    {
      text: 'Hi! I am a text component',
    },
    {
      text: 'Go home...',
      link: 'home'
    }
  ],
  params: {
    textAlign: 'left'
  }
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

  const [dragging, setDragging] = useState (-1);
  const dropAt = index => () => {
    let clone = [...rows];
    let [r] = clone.splice (dragging, 1);
    clone.splice (index, 0, r);
    setRows (clone);
  }
  const deleteAt = () => {
    let clone = [...rows];
    clone.splice (dragging, 1);
    setRows (clone);
  }

  const saveChanges = () => {
    app.pages.createPage ({
      title,
      page,
      rows
    })
  }

  const discardChanges = () => {
    setPage (app.router.page);
    setTitle (app.pages?.currentPage?.title || '');
    setRows (app.pages?.currentPage?.rows || []);
  }

  useEffect (() => {
    discardChanges ();
  }, [app.pages.currentPage, app.router.page]);

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
      <main className={`page-editor ${dragging !== -1 ? 'dragging' : 'not-dragging'}`}>
        <div className="row cols-4 toolbar">
          <button>List Pages</button>
          <button>Undo</button>
          <button onClick={discardChanges}>Discard Changes</button>
          <button onClick={saveChanges}>Save Changes</button>
        </div>
        <div className="row cols-2">
          <div className="text-center">
            Page (link):
            <br/>
            <input placeholder="Page Name" value={page} onChange={e => {setPage (e.target.value)}} />
          </div>
          <div className="text-center">
            Title:
            <br/>
            <input placeholder="Title" value={title} onChange={e => {setTitle (e.target.value)}} />
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
          rows.map ((row, i) => (
            <>
              <div className="dropable" onDragOver={e => e.preventDefault ()} onDrop={dropAt (i)} />
              <EditableRow index={i} setDragging={setDragging} row={row} onChange={onChange (i)} />
            </>
          ))
        }
        <div onDragOver={e => e.preventDefault ()} onDrop={deleteAt}  className="dropable trash">
          <img src={Delete} />
        </div>
      </main>
    </>
  )
  return null;
}