import React from 'react'

function Input({
  label,
  type = 'text',
  className = '',
  placeholder = '',
  ...props

}) {
  return (
    <>
      {label && <label>
        {label}
      </label>
      }
      <input type={type} className={`${className}`} placeholder={placeholder} {...props} />
    </>
  )
}

export default Input