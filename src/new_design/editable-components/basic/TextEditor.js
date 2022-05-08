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
    const setLinkMode = (index, mode) => () => {
        const value = [...props.col.value];
        const el = {
            text: value [index].text,
            link: mode === 'external' ? 'https://' : '...',
            linkMode: mode
        }
        value.splice (index, 1, el);
        props.onChange ({...props.col, value});
    }
    const updateLink = (index, _link, pageId=false) => {
        const value = [...props.col.value];
        let link = _link;
        let param = false;
        if (!link) {
            const page = app.pages.pages.find (p => p.id === pageId);
            link = page.page;
            if (page.param) param = page.param;
        }
        const el = {
            ...value [index],
            pageId,
            link,
            param
        }
        value.splice (index, 1, el);
        props.onChange ({...props.col, value});
    }
    const toggleIsHeading = () => {
        props.onChange ({
            ...props.col,
            params: {
                ...props.col.params,
                isHeading: !props.col.params.isHeading
            }
        })
    }
    const setCurrentText = idx => () => {
        setIndex (idx);
    }
    if (!props.open) return null;
    return (
        <div onClick={e => {if (e.target.className === 'editor-backdrop') props.close ()}} className="editor-backdrop">
            <div className="editor-container">
                <div className="editor-toolbar">
                    <span onClick={updateAlignment ('left')} className={`editor-toolbar-item ${props.col?.params?.textAlign === 'left' && 'active'}`}>
                        <img src={app.icons.leftAlign} />
                    </span>
                    <span onClick={updateAlignment ('center')} className={`editor-toolbar-item ${props.col?.params?.textAlign === 'center' && 'active'}`}>
                        <img src={app.icons.centerAlign} />
                    </span>
                    <span onClick={updateAlignment ('right')} className={`editor-toolbar-item ${props.col?.params?.textAlign === 'right' && 'active'}`}>
                        <img src={app.icons.rightAlign} />
                    </span>
                    <span className="vertical-divider" />
                    <span onClick={toggleIsHeading} className={`editor-toolbar-item ${props.col?.params?.isHeading && 'active'}`}>
                        <img src={app.icons.heading} />
                    </span>
                    <span className="vertical-divider" /> 
                    <span onClick={() => appendText ('text')} className={`editor-toolbar-item ${props.col?.params?.textAlign === 'right' && 'active'}`}>
                        <img src={app.icons.text} />
                    </span>
                    <span onClick={() => appendLink ('link')} className={`editor-toolbar-item ${props.col?.params?.textAlign === 'right' && 'active'}`}>
                        <img src={app.icons.link} />
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
                            currIndex !== -1 && currIndex < props.col.value.length && !!props.col.value [currIndex].link && props.col.value [currIndex].linkMode !== 'external' &&
                            <>
                                <select onChange={e => updateLink (currIndex, null, e.target.value)}>
                                    {
                                        app.pages.pages.filter (p => p.page !== app.pages?.currentPage?.page).map (page => (
                                            <option selected={page.id === props.col.value [currIndex].pageId} value={page.id}>{page.title} ({page.page})</option>
                                        ))
                                    }
                                </select>
                                {` or `}
                                <span onClick={setLinkMode (currIndex, 'external')} className="link">click here</span>
                                {` to set an external link!`}
                            </>
                        }
                        {
                            currIndex !== -1 && currIndex < props.col.value.length && !!props.col.value [currIndex].link && props.col.value [currIndex].linkMode === 'external' &&
                            <>
                                <span onBlur={e => updateLink (currIndex, e.target.textContent)} contentEditable="plaintext-only">{props.col.value [currIndex].link}</span>
                                {` or `}
                                <span onClick={setLinkMode (currIndex, 'internal')} className="link">click here</span>
                                {` to set an internal link!`}
                            </>
                        }
                    </div>
                </div>
                <div onClick={e => {
                    if (e.className === 'editor-content') appendText ();
                }} className="editor-content">
                    {
                        props.col?.params?.isHeading &&
                        <h1>
                            {
                                props.col.value.map ((t, i) => (
                                    <span onFocus={setCurrentText (i)} onBlur={updateText (i)} contentEditable className={`editor-content-item ${t.link ? 'link' : ''}`} data-link={t?.link}>
                                        {t.text}
                                    </span>
                                ))
                            }
                        </h1>
                    }
                    {
                        !props.col?.params?.isHeading && props.col.value.map ((t, i) => (
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