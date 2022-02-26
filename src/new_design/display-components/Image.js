import './image.css';
export default function Image (props) {
    return (
        <img className={`image ${props.col?.params?.filter}`} src={props.col.value} />
    )
}