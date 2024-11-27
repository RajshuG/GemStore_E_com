import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ProductSlider({ images = [] }) {
    const settings = {
        dots: true,
        lazyLoad: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 2,
        autoplay: true,
        autoplaySpeed: 2000,
        prevArrow: null,
        nextArrow: null,
      };

    return (
        <div className='slider-container'>
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index}>
                        <img src={image} alt='Product Image' style={{width:'1300px', height:'500px'}}/>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default ProductSlider;
