import { useState } from "react"

export default function StringArrayInput ({onChange, defaultValue=[]}) {
  const [array, setArray] = useState (defaultValue)
  const set = index => e => {
    let arr = [...array];
    arr [index] = e.target.value;
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
  const updateHeight = e => {
    e.target.style.height = `${e.target.scrollHeight}px`;
  }
  return (
    <>
      {
        array.map ((text, index) => (
          <section>
            <textarea defaultValue={text} onChange={set (index)} onFocus={updateHeight} />
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