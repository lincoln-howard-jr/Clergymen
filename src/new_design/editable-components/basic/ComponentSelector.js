import RowPNG from '../../../img/row.png';
import TextPNG from '../../../img/text.png';
import ImagePNG from '../../../img/image.png';
import EpisodePNG from '../../../img/episode.png';

export default function ComponentSelector (props) {
    if (!props.open) return null;
    return (
      <div className="component-selector" onClick={e => {
        if (e.target.className === 'component-selector') props.close ()
      }}>
        <div className="row cols-2">
          
          <div onClick={() => props.onSelect ({type: 'row', cols: 3, contents: [{type: 'none'}, {type: 'none'}, {type: 'none'}]})} className="component">
            <img src={RowPNG} />
            <span>Row</span>
          </div>

          <div onClick={() => props.onSelect ({type: 'text', value: [], params: {}})} className="component">
            <img src={TextPNG} />
            <span>Text</span>
          </div>
  
          <div onClick={() => props.onSelect ({type: 'image', value: null, params: {}})} className="component">
            <img src={ImagePNG} />
            <span>Image</span>
          </div>
          
          <div onClick={() => props.onSelect ({type: 'episode', value: null, params: {mode: 'most recent', count: 3}})} className="component">
            <img src={EpisodePNG} />
            <span>Episode</span>
          </div>
  
        </div>
      </div>
    )
  }