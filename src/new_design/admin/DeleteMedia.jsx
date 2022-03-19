import { useApp } from "../../AppProvider";

export default function DeleteMedia (props) {
    const app = useApp ();
    if (!props.open || !props.upload) return null;
    return (
        <div onClick={e => {if (e.target.className === 'editor-backdrop') props.close ()}} className="editor-backdrop">
            <div className="editor-container">
                <div className="row text-center">
                    <div className="col">
                        <p>
                            Are you sure you want to remove this image from your uploads? Any references to this image will need to be replaced.
                        </p>
                        <button onClick={() => app.uploads.deleteUpload (props.upload.id)}>Remove</button>
                    </div>
                    <div className="col">
                        <img className="image" src={`https://d1q33inlkclwle.cloudfront.net/${props.upload.url}`} />
                    </div>
                </div>
            </div>
        </div>
    )
}