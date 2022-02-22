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
          <section>
            <div contentEditable onBlur={set (index)} >{text}</div>
            <button onClick={removeSection (index)}>Remove Section</button>
          </section>
        ))
      }
      <section>
        <button onClick={addSection}>Add Section</button>
      </section>
    </>
  )
}