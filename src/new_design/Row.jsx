import Episode from "./display-components/Episode";
import Image from "./display-components/Image";
import Text from "./display-components/Text";

export default function Row (props) {
  if (props.row.hidden) return null;
  return (
    <div className={`row cols-${props.row.cols}${props.row.breakout ? ' breakout' : ''}`}>
      {
        props.row.contents.map (col => (
          <div className={col.type}>
            {col.type === 'text' && <Text col={col} /> }
            {col.type === 'image' && <Image col={col} />}
            {col.type === 'row' && <Row row={col} />}
            {col.type === 'episode' && <Episode col={col} />}
          </div>
        ))
      }
    </div>
  )
}