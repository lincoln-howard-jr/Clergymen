export default function RowEditor (props) {
    
    const toggleHidden = () => {
        props.onChange ({
            ...props.row,
            hidden: !props.row.hidden
        })
    }

    const toggleBreakout = () => {
        props.onChange ({
            ...props.row,
            breakout: !props.row.breakout
        })
    }
    
    const setRowCount = cols => () => {
        if (cols === props.row.cols) return;
        if (cols < props.row.cols) {
            const contents = props.row.contents.slice (0, cols);
            props.onChange ({
                ...props.row,
                cols,
                contents
            })
        }
        if (cols > props.row.cols) {
            const arr = new Array (cols - props.row.cols).fill (1).map (() => ({type: 'none'}));
            const contents = [...props.row.contents, ...arr];
            props.onChange ({
                ...props.row,
                cols,
                contents
            })
        }
    }

    if (!props.open) return null;
    return (
        <div onClick={e => {if (e.target.className === 'editor-backdrop') props.close ()}} className="editor-backdrop">
            <div className="editor-container">
                <div className="row text-center">
                    <div className="col">
                        Hidden <input type="checkbox" checked={props.row.hidden} onChange={toggleHidden}  />
                    </div>
                    <div className="col">
                        Breakout <input type="checkbox" checked={props.row.breakout} onChange={toggleBreakout}  />
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col">
                        Changing the size of this row removes its content
                    </div>    
                </div>
                <div className="row cols-4">
                    <button onClick={setRowCount (1)}>One Column</button>
                    <button onClick={setRowCount (2)}>Two Column</button>
                    <button onClick={setRowCount (3)}>Three Column</button>
                    <button onClick={setRowCount (4)}>Four Column</button>
                </div>
                <div>
                    <hr/>
                </div>
                <div className="row text-center">
                    <button onClick={() => {props.onChange (null); props.close ()}}>Delete Row</button>
                </div>
            </div>
        </div>
    )
}