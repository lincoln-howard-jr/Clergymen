import { useApp } from '../../../AppProvider';
import Levels from '../../../img/levels.png'
import Link from '../../../img/link.png'

function isImage (url='') {
    return url.match(/\.(jpeg|jpg|png)$/) !== null;
}

export default function ImageEditor (props) {
    const app = useApp ();
    const updateImage = (url) => () => {
        props.onChange ({
            ...props.col,
            value: `https://d1q33inlkclwle.cloudfront.net/${url}`
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
                    <span onClick={toggleSepia} className={`editor-toolbar-item ${props.col.params.sepia && 'active'}`}>
                        <img src={Levels} />
                    </span>
                    <span onClick={toggleLink ('internal')} className={`editor-toolbar-item ${props.col.params.hasLink && 'active'}`}>
                        <img src={Link} />
                    </span>
                </div>
                {
                    props.col.params.hasLink && props.col.params.linkMode === 'internal' &&
                    <div>
                        <label>
                            Link goes to:
                            <select onChange={updateLink ('value')}>
                                <option></option>
                                {
                                    app.pages.pages.filter (p => p.page !== app.pages.currentPage.page).map (page => (
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
                            or <span onClick={toggleLink ('external', true)} className="link">click here</span> to provide an internal link.
                        </label>
                    </div>
                }
                <div className="image-editor-list">
                    {
                        app.uploads.uploads.filter (upload => isImage (upload.url)).map (upload => (
                            <div onClick={updateImage (upload.url)}>
                                <img src={`https://d1q33inlkclwle.cloudfront.net/${upload.url}`} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}