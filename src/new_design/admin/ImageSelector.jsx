import { useApp } from "../../AppProvider";
import Upload from '../../img/upload.png'

export default function ImageSelector (props) {
    const app = useApp ();
    const select = upload => () => {
        props.select (upload);
        props.close ();
    }
    const createUpload = async e => {
        const obj = await app.uploads.uploadFile (e.target.files [0], 'object', props.squares);
        select (obj) ();
    }
    if (!props.open) return null;
    return (
        <div onClick={e => {if (e.target.className === 'editor-backdrop') props.close ()}} className="editor-backdrop">
            <div className="editor-container image-selector">
                <div className="row text-center">
                    <p>Select an image from below or upload a new one!</p>
                    <label className="toolbar">
                        <img className="image" src={Upload} />
                        <input type="file" hidden accept="image/png, image/jpeg, image/jpg" onChange={createUpload} />
                    </label>
                </div>
                <div className="row cols-4">
                    {
                        app.uploads.uploads.filter (u => u.contentType.startsWith ('image')).filter (u => !props.squares || u.squareify).map (u => (
                            <div className="col" key={`image-selector-${u.id}`}>
                                <img onClick={select (u)} className="image" src={`https://d1q33inlkclwle.cloudfront.net/${u.url}`} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}