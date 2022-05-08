import {useApp} from '../../AppProvider';
export default function EpisodeEditor (props) {

    const app = useApp ();

    const setMode = mode => () => {
        props.onChange ({
            ...props.col,
            params: {
                ...props.col.params,
                mode
            }
        })
    }

    const setCount = e => {
        props.onChange ({
            ...props.col,
            params: {
                ...props.col.params,
                count: parseInt (e.target.value)
            }
        })
    }

    const setEpisode = e => {
        props.onChange ({
            ...props.col,
            params: {
                ...props.col.params,
                episode: e.target.value
            }
        })
    }

    if (!props.open) return null;
    return (
        <div onClick={e => {if (e.target.className === 'editor-backdrop') props.close ()}} className="editor-backdrop">
            <div className="editor-container">
                <div className="editor-toolbar">
                    <div>
                        Mode:
                        <br />
                        <label onClick={setMode ('most recent')}>
                            <input type="radio" checked={props.col?.params?.mode === 'most recent'}  /> Recent
                        </label>
                        <br />
                        <label onClick={setMode ('select episode')}>
                            <input type="radio" checked={props.col?.params?.mode === 'select episode'} /> Select Episodes
                        </label>
                        <br />
                        <label onClick={setMode ('oldest')}>
                            <input type="radio" checked={props.col?.params?.mode === 'oldest'} /> Oldest
                        </label>
                    </div>
                    {
                        (props.col?.params?.mode === 'most recent' || props.col?.params?.mode === 'oldest') &&
                        <div>
                            <label>
                                Count <input type="number" min="1" max="10" value={props?.col?.params?.count || 3} onChange={setCount} />
                            </label>
                        </div>
                    }
                    {
                        props?.col?.params?.mode === 'select episode' &&
                        <div>
                            <label>
                                Episode <select onChange={setEpisode}>
                                    <option value="" selected={!props?.col?.params?.episode || props?.col?.params?.episode === ''}></option>
                                    {
                                        app.episodes.episodes.map (episode => (
                                            <option selected={props?.col?.params?.episode === episode.id} value={episode.id}>{episode.title}</option>
                                        ))
                                    }
                                </select>
                            </label>
                        </div>
                    }
                </div>
            </div>
        </div>
    ) 
}