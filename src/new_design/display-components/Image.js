import { useApp } from '../../AppProvider';
import './image.css';
export default function Image (props) {
    const app = useApp ();
    if (!props.col?.params?.hasLink) return (
        <img className={`image ${props.col?.params?.sepia && 'sepia'}`} src={`${props.col.value}${props.squareify ? '.png' : ''}`} />
    )
    if (props.col?.params?.hasLink && props.col?.params?.linkMode === 'internal') return (
        <span className="link" onClick={app.router.redirect (props.col?.params?.link)}>
            <img className={`image ${props.col?.params?.sepia && 'sepia'}`} src={`${props.col.value}${props.squareify ? '.png' : ''}`} />
        </span>
    )
    if (props.col?.params?.hasLink && props.col?.params?.linkMode === 'external') return (
        <a href={props.col?.params?.link}>
            <img className={`image ${props.col?.params?.sepia && 'sepia'}`} src={`${props.col.value}${props.squareify ? '.png' : ''}`} />
        </a>
    )
    return null;
}