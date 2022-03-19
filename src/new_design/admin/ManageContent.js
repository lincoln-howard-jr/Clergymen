import { useApp } from "../../AppProvider";

export default function ManageContent () {
    const app = useApp ();

    if (!app.auth.isAuthenticated || app.router.page !== 'manage-content') return null;
    return (
        <main>
            <h1>Content Management Overview</h1>
            <div className="row cols-4 text-center">
                <div className="col">
                    <button onClick={app.router.redirect ('manage-episodes')}>Episodes</button>
                </div>
                <div className="col">
                    <button onClick={app.router.redirect ('manage-characters')}>Characters</button>
                </div>
                <div className="col">
                    <button onClick={app.router.redirect ('edit-info')}>Info</button>
                </div>
                <div className="col">
                    <button onClick={app.router.redirect ('manage-messages')}>Messages</button>
                </div>
                <div className="col">
                    <button onClick={app.router.redirect ('manage-media')}>Meida</button>
                </div>
                <div className="col">
                    <button onClick={app.router.redirect ('list-pages')}>Pages</button>
                </div>
            </div>
        </main>
    )
}