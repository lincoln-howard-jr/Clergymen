import { useEffect, useState } from "react";
import { useApp } from "../../AppProvider"
import './episode.css'

export default function Episode (props) {
    const app = useApp ();
    const [displayEpisodes, setEpisodes] = useState ([]);

    const episodeOnClick = episode => () => {
        app.setPodcast (episode) ();
        app.router.redirect ('single-episode', episode.id) ();
    }

    useEffect (() => {
        const mode = props.col?.params?.mode || 'most recent';
        const count = props.col?.params?.count || 3;
        if (mode === 'most recent') {
            setEpisodes (app.episodes.episodes.slice (0, count))
        }
    }, [props.col?.params?.mode, app.episodes.episodes])
    return (
        <div>
            {
                displayEpisodes.map (episode => (
                    <div onClick={episodeOnClick (episode)} className="episode-card">
                        <img src={`https://resources.theclergymen.com/${episode.coverPhoto.url}`} />
                        <h2>{episode.title}</h2>
                        <p>{episode.shortDescription}</p>
                    </div>
                ))
            }
        </div>
    )
}