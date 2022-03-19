import { useState } from "react"

export default function StringArrayInput ({onChange, defaultValue=[]}) {
  const [array, setArray] = useState (defaultValue)
  const set = index => e => {
    let arr = [...array];
    arr [index] = e.target.innerText;
    setArray (arr);
    onChange (arr);
  }
  const removeSection = index => () => {
    let arr = [...array];
    arr.splice (index, 1);
    setArray (arr);
    onChange (arr);
  }
  const addSection = () => {
    let arr = [...array, ''];
    setArray (arr);
    onChange (arr);
  }
  return (
    <>
      {
        array.map ((text, index) => (
          <section className="row text-center" key={`text-editor-${index}-${text}`}>
            <div className="col">
              <div contentEditable="plaintext-only" onBlur={set (index)} >{text}</div>
            </div>
            <div className="col">
              <button onClick={removeSection (index)}>Remove Section</button>  
            </div>
          </section>
        ))
      }
      <section className="row text-center">
        <div className="col">
          <button onClick={addSection}>Add Section</button>
        </div>
      </section>
    </>
  )
}