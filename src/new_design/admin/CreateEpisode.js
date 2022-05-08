import { useEffect, useState } from "react";
import { useApp } from "../../AppProvider";
import Upload from '../../img/upload.png';
import Pencil from '../../img/pencil.png';
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

export default function CreateEpisode () {
    const app = useApp ();

    const [selectingImage, setSelectingImage] = useState (false);

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

    const uploadAudio = async e => {
        const obj = await app.uploads.uploadFile (e.target.files [0], 'object')
        setAudioSourceId (obj.id);
        setAudioSourceUrl (obj.url);
    }

    const reset = () => {
        setTitle ('');
        setShortDescription ('');
        setLongDescription ('');
        setEpisodeNumber (0);
        setSeasonNumber (0);
        setReleaseDateDate (new Date ().getDate ());
        setReleaseDateMonth (new Date ().getMonth ());
        setReleaseDateYear (new Date ().getFullYear ())
        setCoverPhotoId (null);
        setCoverPhotoUrl (null);
        setAudioSourceId (null);
        setAudioSourceUrl (null);
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
            const coverPhoto = coverPhotoUrl;
            await validate ();
            let episode = await app.episodes.createEpisode ({
                title,
                shortDescription,
                longDescription,
                episodeNumber,
                seasonNumber,
                releaseDate: new Date (releaseDateYear, releaseDateMonth, releaseDateDate),
                coverPhoto: coverPhotoId,
                audioSource: audioSourceId
            });
            reset ();
            await app.pages.createPage ({
                title: episode.title,
                page: 'single-episode',
                param: episode.id,
                rows: [
                    {
                        cols: 1,
                        contents: [
                            {
                                type: 'image',
                                params: {
                                    sepia: true
                                },
                                value: `${coverPhoto}`
                            }
                        ]
                    },
                    {
                        cols: 1,
                        contents: [
                            {
                                type: 'text',
                                params: {
                                    textAlign: 'left'
                                },
                                value: [
                                    {
                                        text: episode.longDescription
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
            app.pages.setEditing (true);
            app.router.redirect ('single-episode', episode.id) ();
        } catch (e) {
            alert (`${e}`);
        }
    }

    useEffect (() => {
        if (!app.episodes.allEpisodes.length) return; 
        setEpisodeNumber (app.episodes.allEpisodes [0].episodeNumber + 1);
        setSeasonNumber (app.episodes.allEpisodes [0].seasonNumber);
    }, [app.episodes.allEpisodes]);

    if (!app.auth.isAuthenticated || app.router.page !== 'create-episode') return null;
    return (
        <>
            <ImageSelector open={selectingImage} close={() => setSelectingImage (false)} select={u => {setCoverPhotoId (u.id); setCoverPhotoUrl (u.url)}} squares />
            <main>
                <h1>Create Episode</h1>
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
                            <img className="file" src={`https://resources.theclergymen.com/${coverPhotoUrl}`} />
                        }
                        <label onClick={() => setSelectingImage (true)}>
                            <img src={Pencil} />
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label>Audio</label>
                    <div className="file-input">
                        {
                            !!audioSourceUrl &&
                            <audio className="file" controls src={`https://resources.theclergymen.com/${audioSourceUrl}`} />
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
            </main>
        </>
    )
}