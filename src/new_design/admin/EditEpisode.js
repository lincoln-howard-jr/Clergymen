import { useEffect, useState } from "react";
import { useApp } from "../../AppProvider";
import Upload from '../../img/upload.png'
import AudioSelector from "./AudioSelector";
import ImageSelector from "./ImageSelector";

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
    const [selectImage, setSelectImage] = useState (false);
    const [selectAudio, setSelectAudio] = useState (false);

    const [title, setTitle] = useState ('');
    const [shortDescription, setShortDescription] = useState ('');
    const [longDescription, setLongDescription] = useState ('');
    const [episodeNumber, setEpisodeNumber] = useState (0);
    const [seasonNumber, setSeasonNumber] = useState (0);
    const [releaseDateDate, setReleaseDateDate] = useState (new Date ().getDate ());
    const [releaseDateMonth, setReleaseDateMonth] = useState (new Date ().getMonth ());
    const [releaseDateYear, setReleaseDateYear] = useState (new Date ().getFullYear ());
    const [coverPhoto, setCoverPhoto] = useState (null);
    const [audioSource, setAudioSource] = useState (null);

    const reset = () => {
        setTitle (episode?.title || '');
        setShortDescription (episode?.shortDescription || '');
        setLongDescription (episode?.longDescription || '');
        setEpisodeNumber (episode?.episodeNumber || 0);
        setSeasonNumber (episode?.seasonNumber || 0);
        setReleaseDateDate (episode?.releaseDate?.getDate () || new Date ().getDate ());
        setReleaseDateMonth (episode?.releaseDate?.getMonth () || new Date ().getMonth ());
        setReleaseDateYear (episode?.releaseDate?.getFullYear () || new Date ().getFullYear ());
        setCoverPhoto (episode?.coverPhoto);
        setAudioSource (episode?.audioSource)
    }

    const validate = () => new Promise ((resolve, reject) => {
        if (!(title instanceof String || typeof title === 'string') || title.length === 0) return reject ('Title is not valid');
        if (!(shortDescription instanceof String || typeof shortDescription === 'string') || shortDescription.length === 0) return reject ('Short description is not valid');
        if (!(longDescription instanceof String || typeof longDescription === 'string') || longDescription.length === 0) return reject ('Long description is not valid');
        if (app.episodes.episodes.find (e => e.seasonNumber === seasonNumber && e.episodeNumber === episodeNumber)) return reject ('Episode number and season number combination is not unique');
        if (!coverPhotoId || !audioSourceId) return reject ('Must provide cover photo and audio to be processed');
        resolve ();
    })

    const updateEpisode = async () => {
        try {
            await validate ();
            await app.episodes.updateEpisode (episode.id, {
                title,
                shortDescription,
                longDescription,
                episodeNumber,
                seasonNumber,
                releaseDate: new Date (releaseDateYear, releaseDateMonth, releaseDateDate),
                coverPhoto: coverPhoto.id,
                audioSource: audioSource.id
            });
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
        <>
            <ImageSelector open={selectImage} close={() => setSelectImage (false)} select={setCoverPhoto} />
            <AudioSelector open={selectAudio} close={() => setSelectAudio (false)} select={setAudioSource} />
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
                            !!coverPhoto &&
                            <img className="file" src={`https://resources.theclergymen.com/${coverPhoto.url}`} />
                        }
                        <label onClick={() => setSelectImage (true)}>
                            <img src={Upload} />
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label>Audio</label>
                    <div className="file-input">
                        {
                            !!audioSource &&
                            <audio className="file" controls src={`https://resources.theclergymen.com/${audioSource.url}`} />
                        }
                        <label onClick={() => setSelectAudio (true)}>
                            <img src={Upload} />
                        </label>
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col">
                        <button onClick={updateEpisode}>Submit</button>
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col">
                        <hr />
                        <button onClick={() => app.episodes.deleteEpisode (episode.id)}>Delete {episode.title}</button>
                    </div>
                </div>
            </main>
        </>
    )
}