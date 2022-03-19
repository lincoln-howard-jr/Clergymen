import { useEffect, useState } from "react";
import { useApp } from "../../AppProvider";
import ComponentSelector from "./basic/ComponentSelector";
import './editable-episode.css';

export default function EditableEpisode (props) {
    const app = useApp ();
    const [displayEpisodes, setDisplayEpisodes] = useState ([]);
    const [selecting, setSelecting] = useState (false);

    useEffect (() => {
        const mode = props.col?.params?.mode || 'most recent';
        const count = props.col?.params?.count || Infinity;
        if (mode === 'most recent') {
            setDisplayEpisodes (app.episodes.episodes.slice (0, count))
        }
    }, [props.col?.params?.mode, app.episodes.episodes])
    return (
        <>
            <ComponentSelector open={selecting} close={() => setSelecting (false)} onSelect={props.onChange} />
            <div className="episode-card-container">
                {
                    displayEpisodes.map (episode => (
                        <div className="editable-episode-card">
                            <img src={`https://d1q33inlkclwle.cloudfront.net/${episode.coverPhoto.url}`} />
                            <h2>{episode.title}</h2>
                            <p>{episode.shortDescription}</p>
                        </div>
                    ))
                }
            </div>
        </>
    )
}