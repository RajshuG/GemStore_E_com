import React from 'react'

function Button({
    children,
    type = 'submit',
    className = '',
    ...props
}) {
  return (
    <>
    <button type={type} className={`${className}`} {...props}>
        {children}
    </button>
    </>
  )
}

export default Button