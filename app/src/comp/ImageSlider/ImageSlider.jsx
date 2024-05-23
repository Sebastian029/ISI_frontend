import { useState, useEffect } from "react";
import styles from "./ImageSlider.module.css";

const images = [
  "https://upload.wikimedia.org/wikipedia/commons/1/15/Travel_%288274728646%29.jpg",
  "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg",
  "https://thelifestyletravelers.com/wp-content/uploads/2024/03/the-bahamas-beach.png",
  "https://images.pexels.com/photos/2033343/pexels-photo-2033343.jpeg",
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.slider}>
      <div
        className={styles.slideContainer}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index}`}
            className={styles.slideImage}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
