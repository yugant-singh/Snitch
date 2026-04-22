import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.scss';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { _id, title, price, images } = product;

  // Extract first image URL safely
  const mainImage = images && images.length > 0 ? images[0].url : '/placeholder-image.jpg';

  const handleNavigate = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <div className={styles.card} onClick={handleNavigate}>
      <div className={styles.imageWrapper}>
        <img src={mainImage} alt={title} className={styles.image} />
        
        {/* Price Pill Overlay */}
        <div className={styles.pricePill}>
          ₹{price}
        </div>

        {/* Scan-line Hover Effect Overlay */}
        <div className={styles.scanlineOverlay}></div>
      </div>
      
      <div className={styles.meta}>
        <h3 className={styles.title}>{title}</h3>
      </div>
    </div>
  );
};

export default ProductCard;
