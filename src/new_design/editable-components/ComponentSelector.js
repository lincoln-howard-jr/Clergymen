import TextPNG from '../../img/text.png';
import ImagePNG from '../../img/image.png';

export default function ComponentSelector (props) {
    if (!props.open) return null;
    return (
      <div className="component-selector" onClick={e => {
        if (e.target.className === 'component-selector') props.close ()
      }}>
        <div className="row cols-2">
          
          <div onClick={() => props.onSelect ({type: 'text', value: [], params: {}})} className="component">
            <img src={TextPNG} />
            <span>Text</span>
          </div>
  
          <div onClick={() => props.onSelect ({type: 'image', value: null, params: {}})} className="component">
            <img src={ImagePNG} />
            <span>Image</span>
          </div>
  
        </div>
      </div>
    )
  }