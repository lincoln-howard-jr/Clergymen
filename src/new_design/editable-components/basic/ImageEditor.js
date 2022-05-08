import { useState } from 'react';
import { useApp } from '../../../AppProvider';
import Resize from '../../../img/resize.png'
import Levels from '../../../img/levels.png'
import Link from '../../../img/link.png'

function isImage (url='') {
    return url.match(/\.(jpeg|jpg|png)$/) !== null;
}

function unique (acc, page) {
    if (acc.find (p => p.page === page.page)) return [...acc];
    return [...acc, page];
}

export default function ImageEditor (props) {
    const app = useApp ();
    const [resizing, setResizing] = useState (false);
    const initWidth = () => {
        props.onChange ({
            ...props.col,
            params: {
                ...props.col.params,
                width: {
                    value: 67,
                    unit: '%'
                }
            }
        })
    }
    const initHeight = () => {
        props.onChange ({
            ...props.col,
            params: {
                ...props.col.params,
                height: {
                    value: 10,
                    unit: 'rem'
                }
            }
        })
    }
    const updateWidthUnit = e => {
        props.onChange ({
            ...props.col,
            params: {
                ...props.col.params,
                width: {
                    ...props.col.params.width,
                    unit: e.target.value
                }
            }
        })
    }
    const updateWidthValue = e => {
        props.onChange ({
            ...props.col,
            params: {
                ...props.col.params,
                width: {
                    ...props.col.params.width,
                    value: e.target.value
                }
            }
        })
    }
    const updateHeightUnit = e => {
        props.onChange ({
            ...props.col,
            params: {
                ...props.col.params,
                height: {
                    ...props.col.params.height,
                    unit: e.target.value
                }
            }
        })
    }
    const updateHeightValue = e => {
        props.onChange ({
            ...props.col,
            params: {
                ...props.col.params,
                height: {
                    ...props.col.params.height,
                    value: e.target.value
                }
            }
        })
    }
    const updateImage = (url) => () => {
        props.onChange ({
            ...props.col,
            value: url
        })
    }
    const toggleSepia = () => {
        props.onChange ({
            ...props.col,
            params: {
                ...props.col.params,
                sepia: !props.col.params.sepia
            }
        })
    }
    const toggleLink = (linkMode='internal', hasLink=null) => () => {
        props.onChange ({
            ...props.col,
            params: {
                ...props.col.params,
                hasLink: hasLink !== null ? hasLink : !props.col.params.hasLink,
                linkMode
            }
        })
    }
    const updateLink = (prop='value') => e => {
        props.onChange ({
            ...props.col,
            params: {
                ...props.col.params,
                link: e.target [prop]
            }
        })
    }
    if (!props.open) return null;
    return (
        <div onClick={e => {if (e.target.className === 'editor-backdrop') props.close ()}} className="editor-backdrop">
            <div className="editor-container">
                <div className="editor-toolbar">
                    <span onClick={() => setResizing (!resizing)} className={`editor-toolbar-item ${resizing && 'active'}`}>
                        <img src={Resize} />
                    </span>
                    <span onClick={toggleSepia} className={`editor-toolbar-item ${props.col.params.sepia && 'active'}`}>
                        <img src={Levels} />
                    </span>
                    <span onClick={toggleLink ('internal')} className={`editor-toolbar-item ${props.col.params.hasLink && 'active'}`}>
                        <img src={Link} />
                    </span>
                </div>
                {
                    resizing &&
                    <div className="editor-resizing">
                        {
                            !props.col?.params?.width &&
                            <span onClick={initWidth} className="add-resize-btn">Set Width</span>
                        }
                        {
                            !props.col?.params?.height &&
                            <span onClick={initHeight} className="add-resize-btn">Set Height</span>
                        }
                        <br />
                        {
                            props.col?.params?.width &&
                            <>
                                <label>
                                    Width: <input type="number" value={props.col?.params?.width?.value} onChange={updateWidthValue} /> <select onChange={updateWidthUnit}>
                                        <option selected={!props.col?.params?.height?.unit}></option>
                                        <option selected={props.col?.params?.width?.unit === '%'} value="%">%</option>
                                        <option selected={props.col?.params?.width?.unit === 'px'} value="px">px</option>
                                        <option selected={props.col?.params?.width?.unit === 'rem'} value="rem">rem</option>
                                    </select>
                                </label>
                                <br />
                            </>
                        }
                        {
                            props.col?.params?.height &&
                            <>
                                <label>
                                    Height: <input type="number" value={props.col?.params?.height?.value} onChange={updateHeightValue} /> <select onChange={updateHeightUnit}>
                                        <option selected={!props.col?.params?.height?.unit}></option>
                                        <option selected={props.col?.params?.height?.unit === '%'} value="%">%</option>
                                        <option selected={props.col?.params?.height?.unit === 'px'} value="px">px</option>
                                        <option selected={props.col?.params?.height?.unit === 'rem'} value="rem">rem</option>
                                    </select>
                                </label>
                                <br />
                            </>
                        }
                    </div>
                }
                {
                    props.col.params.hasLink && props.col.params.linkMode === 'internal' &&
                    <div>
                        <label>
                            Link goes to:
                            <select onChange={updateLink ('value')}>
                                <option></option>
                                {
                                    app.pages.rawPages.filter (p => p.page !== app.pages?.currentPage?.page).reduce (unique, []). map (page => (
                                        <option selected={page.page === props.col.params.link} value={page.page}>{page.title} ({page.page})</option>
                                    ))
                                }
                            </select>
                            or <span onClick={toggleLink ('external', true)} className="link">click here</span> to provide an external link.
                        </label>
                    </div>
                }
                {
                    props.col.params.hasLink && props.col.params.linkMode === 'external' &&
                    <div>
                        <label>
                            Link goes to:
                            <span contentEditable="plaintext-only" onBlur={updateLink ('innerText')}>{props.col.param?.link}</span>
                            or <span onClick={toggleLink ('internal', true)} className="link">click here</span> to provide an internal link.
                        </label>
                    </div>
                }
                <div className="image-editor-list">
                    {
                        app.uploads.uploads.filter (upload => isImage (upload.url)).map (upload => (
                            <div onClick={updateImage (upload.url)}>
                                <img src={`https://resources.theclergymen.com/${upload.url}`} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}