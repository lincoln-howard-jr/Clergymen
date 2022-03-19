import { useState } from 'react'
import Plus from '../../../img/plus.png'
import ComponentSelector from './ComponentSelector'
import './none.css'
export default function None (props) {
    const [selecting, setSelecting] = useState (false);
    return (
        <>
            <ComponentSelector open={selecting} close={() => setSelecting (false)} onSelect={props.onChange} />
            <div className="none-component" onClick={() => setSelecting (true)}>
                <img src={Plus} />
            </div>
        </>
    )
}