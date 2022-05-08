import { useState } from "react";
import { useApp } from "../../AppProvider"
import ImageSelector from "./ImageSelector";
import Pencil from '../../img/pencil.png';

export default function CreateCharacter () {
    const app = useApp ();

    const [selectingImage, setSelectingImage] = useState (false);

    const [memberRole, setRole] = useState (''); // role < character | actor | team-member >
    const [memberName, setName] = useState ('');
    const [memberTitle, setTitle] = useState ('');
    const [memberShortDescription, setShort] = useState ('');
    const [memberLongDescription, setLong] = useState ('');
    const [memberImage, setImage] = useState (null);
    const [memberHidden, setHidden] = useState (false);

    const submit = () => {
        app.characters.createCharacter ({
            memberRole,
            memberName,
            memberTitle,
            memberShortDescription,
            memberLongDescription,
            memberImage: memberImage.id,
            memberHidden
        })
    }

    if (!app.auth.isAuthenticated || app.router.page !== 'create-character') return null;
    return (
        <>
            <ImageSelector open={selectingImage} close={() => setSelectingImage (false)} select={setImage} />
            <main>
                <h1>Create Character</h1>
                <div className="row text-center">
                    <div className="col">
                        <span onClick={app.router.redirect ('manage-characters')} className="link">back to all characters</span>
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col">
                        <label>Hidden <input type="checkbox" checked={memberHidden} onChange={() => setHidden (!memberHidden)} /></label>
                    </div>
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select value={memberRole} onChange={e => setRole (e.target.value)}>
                        {
                            memberRole === '' &&
                            <option value=""></option>
                        }
                        <option value="character">Character</option>
                        <option value="actor">Actor</option>
                        <option value="team-member">Team Member</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Name</label>
                    <span contentEditable="plaintext-only" onBlur={e => setName (e.target.innerText)}>{memberName}</span>
                </div>
                <div className="form-group">
                    <label>Title</label>
                    <span contentEditable="plaintext-only" onBlur={e => setTitle (e.target.innerText)}>{memberTitle}</span>
                </div>
                <div className="form-group">
                    <label>Short Description</label>
                    <span contentEditable="plaintext-only" onBlur={e => setShort (e.target.innerText)}>{memberShortDescription}</span>
                </div>
                <div className="form-group">
                    <label>Long Description</label>
                    <span contentEditable="plaintext-only" onBlur={e => setLong (e.target.innerText)}>{memberLongDescription}</span>
                </div>
                <div className="form-group">
                    <label>Photo</label>
                    <div className="file-input">
                        {
                            !!memberImage?.url &&
                            <img className="file" src={`https://resources.theclergymen.com/${memberImage.url}`} />
                        }
                        <label onClick={() => setSelectingImage (true)}>
                            <img src={Pencil} />
                        </label>
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col">
                        <button onClick={submit}>Submit</button>
                    </div>
                </div>
            </main>
        </>
    )
}