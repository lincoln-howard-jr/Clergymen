const one = {
    type: 'row',
    cols: 1,
    hidden: true,
    contents: [
        {
            type: 'none'
        }
    ]
}
const two = {
    type: 'row',
    cols: 2,
    hidden: true,
    contents: [
        {
            type: 'none'
        },
        {
            type: 'none'
        }
    ]
}
const three = {
    type: 'row',
    cols: 3,
    hidden: true,
    contents: [
        {
            type: 'none'
        },
        {
            type: 'none'
        },
        {
            type: 'none'
        }
    ]
}
const four = {
    type: 'row',
    cols: 4,
    hidden: true,
    contents: [
        {
            type: 'none'
        },
        {
            type: 'none'
        },
        {
            type: 'none'
        },
        {
            type: 'none'
        }
    ]
}
export default function RowEditor (props) {
    
    const toggleHidden = () => {
        props.onChange ({
            ...props.row,
            hidden: !props.row.hidden
        })
    }

    if (!props.open) return null;
    return (
        <div onClick={e => {if (e.target.className === 'editor-backdrop') props.close ()}} className="editor-backdrop">
            <div className="editor-container">
                <div className="row text-center">
                    <div className="col">
                        Hidden <input type="checkbox" checked={props.row.hidden} onChange={toggleHidden}  />
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col">
                        Changing the size of this row removes its content
                    </div>    
                </div>
                <div className="row cols-4">
                    <button onClick={() => props.onChange (one)}>One Column</button>
                    <button onClick={() => props.onChange (two)}>Two Column</button>
                    <button onClick={() => props.onChange (three)}>Three Column</button>
                    <button onClick={() => props.onChange (four)}>Four Column</button>
                </div>
            </div>
        </div>
    )
}