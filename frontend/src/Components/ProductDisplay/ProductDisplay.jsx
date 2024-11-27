import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import './ProductDisplay.css'
import { Link } from 'react-router-dom'

function ProductDisplay(
    {title,
    content,
    buttonText,
    price,
    handleSubmit,
    imageSrc = '',
    quantity,
    linkroute='',
    classname = ''
  }

) {
  return (
    <Card className={`product-card ${classname}`}>
      {imageSrc && <Card.Img variant='top' src={imageSrc} className='product-image' />}
        <Card.Body>
            <Link to={linkroute} style={{textDecoration:'none'}}>
            <Card.Title className='product-title'>{title}</Card.Title>
            <Card.Text className='product-content'>
                {content}<br/>
                <span className='product-price'>₹{price}<br/></span>
                {quantity ? <span className='product-quantity'>Quantity: {quantity}</span> : null}
            </Card.Text>
            </Link>
            {buttonText && (
              <Button onClick={handleSubmit} className='add-to-cart-button'>
            {buttonText}
          </Button>
        )}
        </Card.Body>
    </Card>
  )
}

export default ProductDisplay