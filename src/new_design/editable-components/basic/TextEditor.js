import LeftAlign from '../../../img/left-align.png';
import CenterAlign from '../../../img/center-align.png';
import RightAlign from '../../../img/right-align.png';
import Link from '../../../img/link.png';
import Text from '../../../img/text.png';
import { useState } from 'react';
import {useApp} from '../../../AppProvider';

export default function TextEditor (props) {
    const app = useApp ();
    const [currIndex, setIndex] = useState (-1);
    const updateAlignment = next => () => {
        props.onChange ({
            ...props.col,
            params: {
                ...props.params,
                textAlign: next
            }
        })
    }
    const appendLink = (text) => {
        const value = [
            ...props.col.value,
            {
                text,
                link: '...'
            }
        ]
        props.onChange ({...props.col, value});
    }
    const appendText = (text) => {
        const value = [
            ...props.col.value,
            {
                text
            }
        ]
        props.onChange ({...props.col, value});
    }
    const updateText = index => e => {
        const value = [...props.col.value];
        const el = {
            text: e.target.innerText
        }
        if (e.target.classList.contains ('link')) el.link = e.target.getAttribute ('data-link');
        value.splice (index, 1);
        if (el.text.length === 0) return props.onChange ({...props.col, value});
        value.splice (index, 0, el);
        props.onChange ({...props.col, value});
    }
    const updateLink = index => {
        console.log ('update link', index);
        return e => {
            console.log ('update link event', e, e.target.value);
            const value = [...props.col.value];
            const el = {
                text: value [index].text,
                link: e.target.value
            }
            console.log (el);
            value.splice (index, 1, el);
            props.onChange ({...props.col, value});
        }
    }
    const setCurrentText = idx => () => {
        setIndex (idx);
    }
    if (!props.open) return null;
    return (
        <div onClick={e => {if (e.target.className === 'editor-backdrop') props.close ()}} className="editor-backdrop">
            <div className="editor-container">
                <div className="editor-toolbar">
                    <span onClick={updateAlignment ('left')} className={`editor-toolbar-item ${props.col.params.textAlign === 'left' && 'active'}`}>
                        <img src={LeftAlign} />
                    </span>
                    <span onClick={updateAlignment ('center')} className={`editor-toolbar-item ${props.col.params.textAlign === 'center' && 'active'}`}>
                        <img src={CenterAlign} />
                    </span>
                    <span onClick={updateAlignment ('right')} className={`editor-toolbar-item ${props.col.params.textAlign === 'right' && 'active'}`}>
                        <img src={RightAlign} />
                    </span>
                    <span className="vertical-divider" /> 
                    <span onClick={() => appendText ('text')} className={`editor-toolbar-item ${props.col.params.textAlign === 'right' && 'active'}`}>
                        <img src={Text} />
                    </span>
                    <span onClick={() => appendLink ('link')} className={`editor-toolbar-item ${props.col.params.textAlign === 'right' && 'active'}`}>
                        <img src={Link} />
                    </span>
                    <div>
                        {
                            currIndex === -1 || currIndex >= props.col.value.length || !props.col.value [currIndex].link &&
                            'No link selected'
                        }
                        {
                            currIndex !== -1 && currIndex < props.col.value.length && !!props.col.value [currIndex].link &&
                            `Link with text "${props.col.value [currIndex].text}" goes to: `
                        }
                        {
                            currIndex !== -1 && currIndex < props.col.value.length && !!props.col.value [currIndex].link &&
                            <select onChange={updateLink (currIndex)}>
                                {
                                    app.pages.pages.filter (p => p.page !== app.pages.currentPage.page).map (page => (
                                        <option selected={page.page === props.col.value [currIndex].link} value={page.page}>{page.title} ({page.page})</option>
                                    ))
                                }
                            </select>
                        }
                    </div>
                </div>
                <div onClick={e => {
                    if (e.className === 'editor-content') appendText ();
                }} className="editor-content">
                    {
                        props.col.value.map ((t, i) => (
                            <span onFocus={setCurrentText (i)} onBlur={updateText (i)} contentEditable className={`editor-content-item ${t.link ? 'link' : ''}`} data-link={t?.link}>
                                {t.text}
                            </span>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}