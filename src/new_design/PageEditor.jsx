import { useEffect, useState } from "react"
import { useApp } from "../AppProvider";
import EditableRow from "./editable-components/basic/EditableRow";
import Delete from '../img/delete.png';
import Eye from '../img/eye.png'
import EyeSlash from '../img/eye-slash.png'
import RowIcon from '../img/row.png';

const col = {
  type: 'none'
}

export default function PageEditor () {
  
  const app = useApp ();

  const [title, setTitle] = useState ('');
  const [page, setPage] = useState (app.router.page);
  const [param, setParam] = useState (app.router.param);
  const [hidden, setHidden] = useState (true);
  const [rows, setRows] = useState ([]);
  
  const [showHiddenRows, setShowHiddenRows] = useState (false);

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
    setDragging (false);
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
      param,
      hidden,
      rows
    })
  }

  const discardChanges = () => {
    setPage (app.router.page);
    setParam (app.router.param);
    setTitle (app.pages?.currentPage?.title || '');
    setHidden (!!app.pages?.currentPage?.hidden)
    setRows (app.pages?.currentPage?.rows || []);
  }

  const manageContent = () => {
    discardChanges ();
    app.router.redirect ('manage-content') ();
  }

  const listPages = () => {
    discardChanges ();
    app.router.redirect ('list-pages') ();
  }

  useEffect (() => {
    discardChanges ();
  }, [app.pages.currentPage, app.router.page]);

  if (app.pages.reserved.find (p => p === app.router.page) || app.pages.history) return null;
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
          <div className="col text-center">
            <button onClick={listPages}>List Pages</button>
          </div>
          <div className="col text-center">
            <button onClick={manageContent}>Manage Content</button>
          </div>
          <div className="col text-center">
            <button onClick={discardChanges}>Discard Changes</button>
          </div>
          <div className="col text-center">
            <button onClick={saveChanges}>Save Changes</button>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            Page (link): {page}
          </div>
        </div>
        <div className="row cols-2">
          <div className="col text-center">
            Title:
            <br/>
            <input placeholder="Title" value={title} onChange={e => {setTitle (e.target.value)}} />
          </div>
          <div className="col text-center">
            <label>Hidden <input type="checkbox" checked={hidden} onChange={e => setHidden (e.target.checked)} /></label>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            {
              showHiddenRows &&
              <>
                <span>Showing hidden rows</span>
                <span className="eyes" onClick={() => setShowHiddenRows (false)}><img className="image" src={Eye} /></span>
              </>
            }
            {
              !showHiddenRows &&
              <>
                <span>Not showing hidden rows</span>
                <span className="eyes" onClick={() => setShowHiddenRows (true)}><img className="image" src={EyeSlash} /></span>
              </>
            }
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
          rows.map ((row, i) => ({...row, i})).filter (row => showHiddenRows || !row.hidden).map (row => (
            <>
              <div className="dropable" onDragOver={e => e.preventDefault ()} onDrop={dropAt (row.i)} />
              <EditableRow index={row.i} setDragging={setDragging} row={row} onChange={onChange (row.i)} />
            </>
          ))
        }
        <div className="row text-center">
          <div className="col">
            <span className="eyes" onClick={() => setRows ([...rows, {cols: 1, contents: [col]}])}><img src={RowIcon} /></span>
          </div>
        </div>
        <div onDragOver={e => e.preventDefault ()} onDrop={deleteAt}  className="dropable trash">
          <img src={Delete} />
        </div>
      </main>
    </>
  )
  return null;
}