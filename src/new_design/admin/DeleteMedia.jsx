import { useApp } from "../../AppProvider";

export default function DeleteMedia (props) {
    const app = useApp ();
    const deleteUpload = () => {
        app.uploads.deleteUpload (props?.upload?.id);
        props?.close ();
    }
    if (!props.open || !props.upload) return null;
    if (props?.upload?.contentType?.startsWith ('image')) return (
        <div onClick={e => {if (e.target.className === 'editor-backdrop') props.close ()}} className="editor-backdrop">
            <div className="editor-container">
                <div className="row text-center">
                    <div className="col">
                        <p>
                            Are you sure you want to remove this image from your uploads? Any references to this image will need to be replaced.
                        </p>
                        <button onClick={deleteUpload}>Remove</button>
                    </div>
                    <div className="col">
                        <img className="image" src={`https://resources.theclergymen.com/${props?.upload?.url}`} />
                    </div>
                </div>
            </div>
        </div>
    )
    if (props?.upload?.contentType?.startsWith ('audio')) return (
        <div onClick={e => {if (e.target.className === 'editor-backdrop') props.close ()}} className="editor-backdrop">
            <div className="editor-container">
                <div className="row text-center">
                    <div className="col">
                        <p>
                            Are you sure you want to remove {props?.upload?.upload?.filename} from your uploads? Any references to this audio will need to be replaced.
                        </p>
                        <button onClick={deleteUpload}>Remove</button>
                    </div>
                    <div className="col">
                        <audio src={`https://resources.theclergymen.com/${props?.upload?.url}`} controls />
                    </div>
                </div>
            </div>
        </div>
    )
    return null;
}