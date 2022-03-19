import { useEffect, useState } from "react";
import { useApp } from "../../AppProvider";
import StringArrayInput from "../../components/StringArrayInput";
import Pencil from '../../img/pencil.png';
import ImageSelector from "./ImageSelector";

export default function EditChannelInfo () {
    const app = useApp ();

    const [selectingImage, setSelectingImage] = useState (false);

    const [title, setTitle] = useState ('');
    const [author, setAuthor] = useState ('');
    const [copyright, setCopyright] = useState ('');
    const [description, setDescription] = useState (undefined);
    const [lang, setLanguage] = useState ('');
    const [link, setLink] = useState ('');
    const [podType, setType] = useState ('');
    const [category, setCategory] = useState ('');
    const [subcategory, setSubCategory] = useState ('');
    const [image, setImage] = useState (null);

    const reset = () => {
        setTitle (app.channel.channelInfo.title);
        setAuthor (app.channel.channelInfo.author);
        setCopyright (app.channel.channelInfo.copyright);
        setDescription (app.channel.channelInfo.description);
        setLanguage (app.channel.channelInfo.lang);
        setLink (app.channel.channelInfo.link);
        setType (app.channel.channelInfo.podType);
        setCategory (app.channel.channelInfo.category);
        setSubCategory (app.channel.channelInfo.subcategory);
        setImage (app.channel.channelInfo.image);
    }

    const update = () => {
        app.channel.updateChannelInfo ({
            title,
            author,
            copyright,
            description,
            lang,
            link,
            podType,
            category,
            subcategory,
            image: image.id
        })
    }

    useEffect (() => {
        if (app.channel.channelInfo) reset ();
    }, [app.channel.channelInfo])

    if (!app.auth.isAuthenticated || app.router.page !== 'edit-info') return null;
    return (
        <>
            <ImageSelector open={selectingImage} close={() => setSelectingImage (false)} select={setImage} squares />
            <main>
                <h1>Channel Info</h1>
                <div className="row text-center">
                    <div className="col">
                        <span onClick={app.router.redirect ('manage-content')} className="link">back to all content</span>
                    </div>
                </div>
                <div className="form-group">
                    <label>Title</label>
                    <input value={title} onChange={e => setTitle (e.target.value)} placeholder="title" />
                </div>
                <div className="form-group">
                    <label>Author</label>
                    <input value={author} onChange={e => setAuthor (e.target.value)} placeholder="author" />
                </div>
                <div className="form-group">
                    <label>Copyright</label>
                    <input value={copyright} onChange={e => setCopyright (e.target.value)} placeholder="copyright" />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <div>
                        {
                            description &&
                            <StringArrayInput onChange={setDescription} defaultValue={description} />
                        }
                    </div>
                </div>
                <div className="form-group">
                    <label>Language</label>
                    <input value={lang} onChange={e => setLanguage (e.target.value)} placeholder="language" />
                </div>
                <div className="form-group">
                    <label>Website Url</label>
                    <input value={link} onChange={e => setLink (e.target.value)} placeholder="website url" />
                </div>
                <div className="form-group">
                    <label>Type</label>
                    <input value={podType} onChange={e => setType (e.target.value)} placeholder="type" />
                </div>
                <div className="form-group">
                    <label>Catgeory</label>
                    <input value={category} onChange={e => setCategory (e.target.value)} placeholder="category" />
                </div>
                <div className="form-group">
                    <label>Sub Catgeory</label>
                    <input value={subcategory} onChange={e => setSubCategory (e.target.value)} placeholder="sub category" />
                </div>
                <div className="form-group">
                    <label>Podcast Image</label>
                    <div className="file-input">
                        {
                            !!image &&
                            <img className="file" src={`https://d1q33inlkclwle.cloudfront.net/${image.url}`} />
                        }
                        <label onClick={() => setSelectingImage (true)}>
                            <img src={Pencil} />
                        </label>
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col">
                        <button onClick={update}>Submit Changes</button>
                    </div>
                </div>
            </main>
        </>
    )
}