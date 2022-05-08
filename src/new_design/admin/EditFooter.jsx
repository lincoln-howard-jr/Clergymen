import { useState } from "react";
import { useApp } from "../../AppProvider";
import EditableRow from "../editable-components/basic/EditableRow";
import Delete from '../../img/delete.png';
import Eye from '../../img/eye.png'
import EyeSlash from '../../img/eye-slash.png'
import RowIcon from '../../img/row.png';

const col = {
    type: 'none'
  }
  
export default function EditFooter () {
    const app = useApp ();

    const [rows, setRows] = useState ([]);
    const [hidden, setHidden] = useState (true);
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
            page: 'footer',
            hidden,
            rows
        })
    }

    const discardChanges = () => {
        setHidden (!!app.pages?.footer?.hidden)
        setRows (app.pages?.footer?.rows || []);
    }

    const backToManageContent = () => {
        discardChanges ();
        app.router.redirect ('manage-content') ();
    }

    if (!app.auth.isAuthenticated || app.router.page !== 'footer') return null;
    return (
        <main className={`page-editor ${dragging !== -1 ? 'dragging' : 'not-dragging'}`}>
            <h1>Edit Footer</h1>
            <div className="row text-center">
                <div className="col">
                    <span onClick={backToManageContent} className="link">back to all content</span>
                </div>
                <div className="col">
                    <label>Hidden <input type="checkbox" checked={hidden} onChange={e => setHidden (e.target.checked)} /></label>
                </div>
                <div className="col">
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
                <div className="col">
                    <button onClick={saveChanges}>Save Changes</button>
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
    )
}