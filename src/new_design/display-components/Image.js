import { useApp } from '../../AppProvider';
import './image.css';
export default function Image (props) {
    const app = useApp ();
    const getStyle = () => {
        const style = {}
        if (props.col?.params?.width && props.col?.params?.height) style.aspectRatio = 'unset';
        if (props.col?.params?.width) style.width = props.col.params.width.value + props.col.params.width.unit;
        if (props.col?.params?.height) style.height = props.col.params.height.value + props.col.params.height.unit;
        if (props.col?.param?.fit) style.objectFit = props.col.params.fit;
        return {style}
    }
    if (!props.col?.params?.hasLink) return (
        <img {...getStyle ()} className={`image ${props.col?.params?.sepia && 'sepia'}`} src={`https://resources.theclergymen.com/${props.col.value}${props.squareify ? '.png' : ''}`} />
    )
    if (props.col?.params?.hasLink && props.col?.params?.linkMode === 'internal') return (
        <span className="link" onClick={app.router.redirect (props.col?.params?.link)}>
            <img {...getStyle ()} className={`image ${props.col?.params?.sepia && 'sepia'}`} src={`https://resources.theclergymen.com/${props.col.value}${props.squareify ? '.png' : ''}`} />
        </span>
    )
    if (props.col?.params?.hasLink && props.col?.params?.linkMode === 'external') return (
        <a href={props.col?.params?.link}>
            <img {...getStyle ()} className={`image ${props.col?.params?.sepia && 'sepia'}`} src={`https://resources.theclergymen.com/${props.col.value}${props.squareify ? '.png' : ''}`} />
        </a>
    )
    return null;
}