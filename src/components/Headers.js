export function H1 ({children, short}) {
  return (
    <>
      <h1>
        {children}
      </h1>
      <h1 className="short">
        {short ? short : children}
      </h1>
    </>
  )
}

export function H2 ({children, short}) {
  return (
    <>
      <h2>
        {children}
      </h2>
      <h2 className="short">
        {short ? short : children}
      </h2>
    </>
  )
}

export function H3 ({children, short}) {
  return (
    <>
      <h3>
        {children}
      </h3>
      <h3 className="short">
        {short ? short : children}
      </h3>
    </>
  )
}

export function H4 ({children, short}) {
  return (
    <>
      <h4>
        {children}
      </h4>
      <h4 className="short">
        {short ? short : children}
      </h4>
    </>
  )
}

export function H5 ({children, short}) {
  return (
    <>
      <h5>
        {children}
      </h5>
      <h5 className="short">
        {short ? short : children}
      </h5>
    </>
  )
}

export function H6 ({children, short}) {
  return (
    <>
      <h6>
        {children}
      </h6>
      <h6 className="short">
        {short ? short : children}
      </h6>
    </>
  )
}