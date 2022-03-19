import { useState, useEffect } from "react";
import { useApp } from "../AppProvider";

export default function PageHistory () {
    const app = useApp ();

    const [history, setHistory] = useState ([]);
    useEffect (() => {
        setHistory (app.pages.rawPages.filter (p => (p.page === app.router.page && (p.param ? p.param === app.router.param : true))))
    }, [app.router.page, app.router.param, app.pages.rawPages])

    if (!app.pages.history || !app.auth.isAuthenticated) return null;
    return (
        <main>
            <h1>Page History</h1>
            <div className="row text-center">
                <div className="col">
                    <span onClick={() => {app.pages.setHistory (false); app.router.redirect ('list-pages') ()}} className="link">back to page list</span>
                </div>
            </div>
            <div className="row text-center">
                <div className="col">
                    <h2>{app.pages.currentPage?.title}</h2>
                </div>
            </div>
            {
                history.map (p => (
                    <div className="row cols-3">
                        <div className="col">{p.createdBy}</div>
                        <div className="col">
                            {new Date (p.createdAt).toDateString ()}
                        </div>
                        <div className="col">
                            <span onClick={app.pages.setPageById (p.id)} className="link">
                                View This Version
                            </span>
                        </div>
                    </div>
                ))
            }
        </main>
    )
}