import { useState } from "react";
import { useApp } from "../AppProvider";
import History from '../img/history.png';
import Plus from '../img/plus.png';

const reduceRawPages = (acc, page) => {
    if (acc.find (p => page.page === p.page)) return acc;
    return [...acc, page];
}

export default function PageList () {
    const app = useApp ();
    const [addPage, setAddPage] = useState (false);
    const [addPageTitle, setAddPageTitle] = useState ('');
    const [addPagePage, setAddPagePage] = useState ('');
    const [addPageError, setError] = useState (false);
    const viewHistoryOf = (page, param) => () => {
        app.pages.setHistory (true);
        app.router.redirect (page, param) ();
    }
    const attemptAddPage = async () => {
        if (app.pages.pages.find (p => p.page === addPagePage)) return setError ('Uh oh! That page already exists!');
        if (app.pages.reserved.find (p => p === addPagePage)) return setError (`The page '${addPagePage}' is a reserved page and is off limits!`)
        try {
            await app.pages.createPage ({
                title: addPageTitle,
                page: addPagePage,
                rows: []
            })
            reset ();
        } catch (e) {
            setError (`${e}`);
        }
    }
    const reset = () => {
        setAddPage (false);
        setAddPageTitle ('');
        setAddPagePage ('');
        setError (false);
    }
    if (app.router.page !== 'list-pages') return null;
    return (
        <main className="page-list">
            <h1>All Pages</h1>
            <div className="row text-center">
                <div className="col">
                    <span onClick={app.router.redirect ('manage-content')} className="link">back to all content</span>
                </div>
            </div>
            <div className="page-container">
                <h2>General Pages</h2>
                {
                    app.pages.rawPages.reduce (reduceRawPages, []).filter (page => !page.param && page.page !== 'footer').map (page => (
                            <p>
                                <span onClick={app.router.redirect (page.page)}>{page.title} ({page.page})</span>
                                <span className="action" onClick={viewHistoryOf (page.page)}><img src={History} /></span>
                            </p>
                    ))
                }
                {
                    !addPage &&
                    <p>
                        <span onClick={() => setAddPage (true)}>
                            <img src={Plus} />
                        </span>
                    </p>
                }
                {
                    addPage &&
                    <div className="add-page">
                        {
                            addPageError &&
                            <div>
                                {addPageError}
                            </div>
                        }
                        <div>
                            <input value={addPageTitle} onChange={e => setAddPageTitle (e.target.value)} placeholder="title" />
                        </div>
                        <div>
                            <input value={addPagePage} onChange={e => setAddPagePage (e.target.value)} placeholder="page" />
                        </div>
                        <div>
                            <button onClick={attemptAddPage}>Add Page</button>
                            <span className="vertical-divider" />
                            <button onClick={reset}>Cancel</button>
                        </div>
                    </div>
                }
                <h2>Episode Pages</h2>
                {
                    app.episodes.allEpisodes.map (episode => (
                        <p>
                            <span onClick={app.router.redirect ('single-episode', episode.id)}>
                                {episode.title} (S{episode.seasonNumber}E{episode.episodeNumber})
                            </span>
                            <span className="action" onClick={viewHistoryOf ('single-episode', episode.id)}><img src={History} /></span>
                        </p>
                    ))
                }
            </div>
        </main>
    )
}