import { useApp } from "../../AppProvider"
import Pencil from '../../img/pencil.png'
import Plus from '../../img/plus.png'
import Forward from '../../img/forward.png'

const isReleased = date => {
    return new Date () > new Date (date);
}

const formatDate = date => {
    let d = new Date (date);
    return `${d.getMonth () + 1}/${d.getDate ()}/${d.getFullYear ()}`
}

export default function EpisodeManager () {
    const app = useApp ();
    if (!app.auth.isAuthenticated || app.router.page !== 'manage-episodes') return null;
    return (
        <main className="content-manager">
            <h1>Manage Episodes</h1>
            <div className="row text-center">
                <div className="col">
                    <span onClick={app.router.redirect ('manage-content')} className="link">back to all content</span>
                </div>
            </div>
            <div className="create" onClick={app.router.redirect ('create-episode')}>
                <img src={Plus} />
            </div>
            {
                app.episodes.allEpisodes.map (episode => (
                    <div className="episode">
                        <h2 className="title">{episode.title}</h2>
                        <span className="episode-number">
                            S{episode.seasonNumber}-E{episode.episodeNumber}
                        </span>
                        <img className="image" src={`https://d1q33inlkclwle.cloudfront.net/${episode.coverPhoto?.url}`} />
                        <p className="description">
                            {episode.shortDescription}
                        </p>
                        <span className="release">{formatDate (episode.releaseDate)}</span>
                        <div className="actions">
                            <span onClick={app.router.redirect ('edit-episode', episode.id)}>
                                <img src={Pencil} />
                            </span>
                            <span onClick={app.router.redirect ('single-episode', episode.id)}>
                                <img src={Forward} />
                            </span>
                        </div>
                    </div>
                ))
            }
        </main>
    )
}