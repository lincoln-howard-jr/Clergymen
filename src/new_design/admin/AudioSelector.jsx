import { useApp } from "../../AppProvider";
import Upload from '../../img/upload.png'

export default function AudioSelector (props) {
    const app = useApp ();
    const select = upload => () => {
        props.select (upload);
        props.close ();
    }
    const createUpload = async e => {
        const obj = await app.uploads.uploadFile (e.target.files [0], 'object');
        select (obj) ();
    }
    if (!props.open) return null;
    return (
        <div onClick={e => {if (e.target.className === 'editor-backdrop') props.close ()}} className="editor-backdrop">
            <div className="editor-container audio-selector">
                <div className="row text-center">
                    <p>Select an image from below or upload a new one!</p>
                    <label className="toolbar">
                        <img className="image" src={Upload} />
                        <input type="file" hidden accept="audio/mpeg" onChange={createUpload} />
                    </label>
                </div>
                <div className="row cols-4">
                    {
                        app.uploads.uploads.filter (u => u.contentType.startsWith ('audio')).map (u => (
                            <div className="col audio" key={`audio-selector-${u.id}`}>
                                <p>{u.filename}</p>
                                <p>{u.timestamp}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}