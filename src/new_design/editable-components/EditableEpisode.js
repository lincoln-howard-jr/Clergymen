import { useEffect, useState } from "react";
import { useApp } from "../../AppProvider";
import ComponentSelector from "./basic/ComponentSelector";
import Pencil from '../../img/pencil.png';
import Swap from '../../img/swap.png';
import Delete from '../../img/delete.png';
import './editable-episode.css';
import EpisodeEditor from "./EpisodeEditor";

export default function EditableEpisode (props) {
    const app = useApp ();
    const [displayEpisodes, setDisplayEpisodes] = useState ([]);
    const [selecting, setSelecting] = useState (false);
    const [editing, setEditing] = useState (false);

    useEffect (() => {
        const mode = props.col?.params?.mode || 'most recent';
        const count = props.col?.params?.count || Infinity;
        if (mode === 'most recent') setDisplayEpisodes (app.episodes.episodes.slice (0, count))
        if (mode === 'oldest') setDisplayEpisodes (app.episodes.episodes.slice (-3));
        if (mode === 'select episode') setDisplayEpisodes (app.episodes.episodes.filter (e => e.id === props?.col?.params?.episode))
    }, [props.col?.params?.mode, props.col?.params?.count, props.col?.params?.episode, app.episodes.episodes])
    return (
        <>
            <ComponentSelector open={selecting} close={() => setSelecting (false)} onSelect={props.onChange} />
            <EpisodeEditor col={props.col} open={editing} close={() => setEditing (false)} onChange={props.onChange} />
            <div className="episode-card-container">
                {
                    displayEpisodes.map (episode => (
                        <div className="editable-episode-card">
                            <img src={`https://resources.theclergymen.com/${episode.coverPhoto.url}`} />
                            <h2>{episode.title}</h2>
                            <p>{episode.shortDescription}</p>
                        </div>
                    ))
                }
                <div className="row text-center">
                    <div className="col">
                        <span onClick={() => setEditing (true)} className="action editable-pencil">
                            <img src={Pencil} alt="" />
                        </span>
                        <span className="action editable-pencil">
                            <img src={Swap} alt="" />
                        </span>
                        <span className="action editable-pencil">
                            <img src={Delete} alt="" />
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}