import React, { useState, useEffect } from 'react';
import './FlowerSlideshow.css';

const FlowerSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Array of flower images - these will be the real-world pooja flowers
  const flowerImages = [
    {
      src: `${process.env.PUBLIC_URL}/images/flowers/marigold.jpg`,
      alt: 'Marigold flowers for puja',
      name: 'Marigold (Genda)',
      fallback: '🌼'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/flowers/jasmine.jpg`,
      alt: 'Jasmine flowers for puja',
      name: 'Jasmine (Chameli)',
      fallback: '🌸'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/flowers/lotus.jpg`,
      alt: 'Lotus flowers for puja',
      name: 'Lotus (Kamal)',
      fallback: '🪷'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/flowers/hibiscus.jpg`,
      alt: 'Hibiscus flowers for puja',
      name: 'Hibiscus (Gudhal)',
      fallback: '🌺'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/flowers/rose.jpg`,
      alt: 'Rose flowers for puja',
      name: 'Rose (Gulab)',
      fallback: '🌹'
    }
  ];

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % flowerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [flowerImages.length]);

  return (
    <div className="flower-slideshow">
      <div className="slideshow-container">
        {flowerImages.map((flower, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="flower-image-container">
              <img
                src={flower.src}
                alt={flower.alt}
                className="flower-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="flower-fallback" style={{ display: 'none' }}>
                <span className="fallback-emoji">{flower.fallback}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Slide indicators */}
{/*
     <div className="slide-indicators">
        {flowerImages.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
*/}
      {/* Flower names */}
      {/*
      <div className="flower-names">
        {flowerImages.map((flower, index) => (
          <div
            key={index}
            className={`flower-name ${index === currentSlide ? 'active' : ''}`}
          >
            {flower.name}
          </div>
        ))}
      </div>
      */}
    </div>
  );
};

export default FlowerSlideshow;
