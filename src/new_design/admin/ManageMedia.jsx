import {useState} from 'react';
import { useApp } from "../../AppProvider"
import Trash from '../../img/delete.png'
import DeleteMedia from "./DeleteMedia";

export default function ManageMedia () {
    const app = useApp ();

    const [deleteUpload, setDeleteUpload] = useState (undefined);

    if (!app.auth.isAuthenticated || app.router.page !== 'manage-media') return null;
    return (
        <>
            <DeleteMedia open={!!deleteUpload} close={() => setDeleteUpload (undefined)} upload={deleteUpload} />
            <main className="media-manager">
                <h1>Media</h1>
                <div className="row text-center">
                    <div className="col">
                        <span onClick={app.router.redirect ('manage-content')} className="link">back to all content</span>
                    </div>
                </div>
                <div className="row cols-4">
                    {
                        app.uploads.uploads.filter (upload => upload.contentType.startsWith ('image')).map (upload => (
                            <div className="col">
                                <img className="image" src={`https://d1q33inlkclwle.cloudfront.net/${upload.url}`} />
                                <div className="image-toolbar">
                                    <span onClick={() => setDeleteUpload (upload)} className="action">
                                        <img src={Trash} />
                                    </span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </main>
        </>
    )
}