import { useApp } from "../../AppProvider"
import Plus from '../../img/plus.png'

function CharacterCard (props) {
    const app = useApp ();
    return (
        <div className="row text-center character-card" onClick={app.router.redirect ('edit-character', props.character.id)}>
            <div className="col">
                <span className="character-name">{props.character.memberName}</span>
            </div>
            <div className="row">
                <div className="col">
                    <span>{props.character.memberTitle}</span>
                </div>
            </div>
        </div>
    )
}

export default function ManageCharacters () {
    const app = useApp ();
    if (!app.auth.isAuthenticated || app.router.page !== 'manage-characters') return null;
    return (
        <main className="content-manager">
            <h1>Manage Character</h1>
            <div className="row text-center">
                <div className="col">
                    <span onClick={app.router.redirect ('manage-content')} className="link">back to all content</span>
                </div>
            </div>
            <div className="create" onClick={app.router.redirect ('create-character')}>
                <img src={Plus} />
            </div>
            <div className="row text-center">
                <div className="col">
                    <h2>Characters</h2>
                </div>
            </div>
            {
                app.characters.characters.filter (c => c.memberRole === 'character').map (character => (
                    <CharacterCard character={character} />
                ))
            }
            <div className="row text-center">
                <div className="col">
                    <h2>Actors</h2>
                </div>
            </div>
            {
                app.characters.characters.filter (c => c.memberRole === 'actor').map (character => (
                    <CharacterCard character={character} />
                ))
            }
            <div className="row text-center">
                <div className="col">
                    <h2>Team Members</h2>
                </div>
            </div>
            {
                app.characters.characters.filter (c => c.memberRole === 'team-member').map (character => (
                    <CharacterCard character={character} />
                ))
            }
        </main>
    )
}