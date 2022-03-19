import { useEffect, useState } from "react";
import { useApp } from "../../AppProvider";
import Upload from '../../img/upload.png'

const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
]

export default function EditEpisode () {
    const app = useApp ();

    const [episode, setEpisode] = useState (undefined);
    
    const [title, setTitle] = useState ('');
    const [shortDescription, setShortDescription] = useState ('');
    const [longDescription, setLongDescription] = useState ('');
    const [episodeNumber, setEpisodeNumber] = useState (0);
    const [seasonNumber, setSeasonNumber] = useState (0);
    const [releaseDateDate, setReleaseDateDate] = useState (new Date ().getDate ());
    const [releaseDateMonth, setReleaseDateMonth] = useState (new Date ().getMonth ());
    const [releaseDateYear, setReleaseDateYear] = useState (new Date ().getFullYear ());
    const [coverPhotoId, setCoverPhotoId] = useState (null);
    const [coverPhotoUrl, setCoverPhotoUrl] = useState (null);
    const [audioSourceId, setAudioSourceId] = useState (null);
    const [audioSourceUrl, setAudioSourceUrl] = useState (null);

    const uploadPhoto = async e => {
        const obj = await app.uploads.uploadFile (e.target.files [0], 'object', true)
        setCoverPhotoId (obj.id);
        setCoverPhotoUrl (obj.url);
    }

    const uploadAudio = async e => {
        const obj = await app.uploads.uploadFile (e.target.files [0], 'object')
        setAudioSourceId (obj.id);
        setAudioSourceUrl (obj.url);
    }

    const reset = () => {
        setTitle (episode?.title || '');
        setShortDescription (episode?.shortDescription || '');
        setLongDescription (episode?.longDescription || '');
        setEpisodeNumber (episode?.episodeNumber || 0);
        setSeasonNumber (episode?.seasonNumber || 0);
        setReleaseDateDate (episode?.releaseDate?.getDate () || new Date ().getDate ());
        setReleaseDateMonth (episode?.releaseDate?.getMonth () || new Date ().getMonth ());
        setReleaseDateYear (episode?.releaseDate?.getFullYear () || new Date ().getFullYear ());
        setCoverPhotoId (episode?.coverPhoto?.id);
        setCoverPhotoUrl (episode?.coverPhoto?.url);
        setAudioSourceId (episode?.audioSource?.id);
        setAudioSourceUrl (episode?.audioSource?.url)
    }

    const validate = () => new Promise ((resolve, reject) => {
        if (!(title instanceof String || typeof title === 'string') || title.length === 0) return reject ('Title is not valid');
        if (!(shortDescription instanceof String || typeof shortDescription === 'string') || shortDescription.length === 0) return reject ('Short description is not valid');
        if (!(longDescription instanceof String || typeof longDescription === 'string') || longDescription.length === 0) return reject ('Long description is not valid');
        if (app.episodes.episodes.find (e => e.seasonNumber === seasonNumber && e.episodeNumber === episodeNumber)) return reject ('Episode number and season number combination is not unique');
        if (!coverPhotoId || !audioSourceId) return reject ('Must provide cover photo and audio to be processed');
        resolve ();
    })

    const createEpisode = async () => {
        try {
            await validate ();
            await app.episodes.createEpisode ({
                title,
                shortDescription,
                longDescription,
                episodeNumber,
                seasonNumber,
                releaseDate: new Date (releaseDateYear, releaseDateMonth, releaseDateDate),
                coverPhoto: coverPhotoId,
                audioSource: audioSourceId
            });
            await app.episodes.deleteEpisode (episode.id);
            reset ();
        } catch (e) {
            alert (`${e}`);
        }
    }

    useEffect (() => {
        if (app.router.page !== 'edit-episode' || !app.router.param) setEpisode (undefined)
        else setEpisode (app.episodes.allEpisodes.find (e => app.router.param === e.id))
    }, [app.router.param, app.episodes.episodes])

    useEffect (() => {
        reset ();
    }, [episode])

    useEffect (() => {
        if (!app.episodes.episodes.length) return; 
        setEpisodeNumber (app.episodes.episodes [0].episodeNumber + 1);
        setSeasonNumber (app.episodes.episodes [0].seasonNumber);
    }, [app.episodes.episodes]);

    if (!app.auth.isAuthenticated || episode === undefined ) return null;
    return (
        <main>
            <h1>Edit Episode</h1>
            <div className="row text-center">
                <div className="col">
                    <span onClick={app.router.redirect ('manage-episodes')} className="link">back to all episodes</span>
                </div>
            </div>
            <div className="text-center">
                <h2>{episode.title}</h2>
            </div>
            <div className="row text-center">
                <div className="col">
                    <span onClick={app.router.redirect ('manage-episodes')} className="link">back to all epsiodes</span>
                </div>
            </div>
            <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={e => setTitle (e.target.value)} />
            </div>
            <div className="form-group">
                <label>Season Number</label>
                <input type="number" value={seasonNumber} onChange={e => setSeasonNumber (parseInt (e.target.value))} />
            </div>
            <div className="form-group">
                <label>Episode Number</label>
                <input type="number" value={episodeNumber} onChange={e => setEpisodeNumber (parseInt (e.target.value))} />
            </div>
            <div className="form-group">
                <label>Short Description</label>
                <span contentEditable="plaintext-only" onBlur={e => setShortDescription (e.target.innerText)}>{shortDescription}</span>
            </div>
            <div className="form-group">
                <label>Long Description</label>
                <span contentEditable="plaintext-only" onBlur={e => setLongDescription (e.target.innerText)}>{longDescription}</span>
            </div>
            <div className="form-group">
                <label>Release Date</label>
                <div className="date-input">
                    <select value={releaseDateMonth} onChange={e => setReleaseDateMonth (e.target.value)}>
                        {
                            months.map ((month, i) => (
                                <option value={i}>{month}</option>
                            ))
                        }
                    </select>
                    /
                    <input type="number" value={releaseDateDate} onChange={e => setReleaseDateDate (parseInt (e.target.value))} />
                    /
                    <input type="number" value={releaseDateYear} onChange={e => setReleaseDateYear (parseInt (e.target.value))} />
                </div>
            </div>
            <div className="form-group">
                <label>Cover Photo</label>
                <div className="file-input">
                    {
                        !!coverPhotoUrl &&
                        <img className="file" src={`https://d1q33inlkclwle.cloudfront.net/${coverPhotoUrl}`} />
                    }
                    <label>
                        <img src={Upload} />
                        <input onChange={uploadPhoto} hidden type="file" accept="image/png, image/jpeg, image/jpg" />
                    </label>
                </div>
            </div>
            <div className="form-group">
                <label>Audio</label>
                <div className="file-input">
                    {
                        !!audioSourceUrl &&
                        <audio className="file" controls src={`https://d1q33inlkclwle.cloudfront.net/${audioSourceUrl}`} />
                    }
                    <label>
                        <img src={Upload} />
                        <input onChange={uploadAudio} hidden type="file" accept="audio/mp3" />
                    </label>
                </div>
            </div>
            <div className="row text-center">
                <div className="col">
                    <button onClick={createEpisode}>Submit</button>
                </div>
            </div>
            <div className="row text-center">
                <div className="col">
                    <hr />
                    <button onClick={() => app.episodes.deleteEpisode (episode.id)}>Delete {episode.title}</button>
                </div>
            </div>
        </main>
    )
}