import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useProducts } from '../hook/useProducts';
import styles from './ProductDetail.module.scss';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleProductDetails } = useProducts();
  const product = useSelector((state) => state.product.selectedProduct);

  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        await handleProductDetails(productId);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setTimeout(() => setLoading(false), 700);
      }
    };
    fetch();
  }, [productId]);

  // Reset image state when product changes
  useEffect(() => {
    setActiveImg(0);
    setImgLoaded(false);
  }, [product?._id]);

  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.pulseContainer}>
          <span className={styles.pulseText}>LOADING_ASSET...</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <p className={styles.notFoundText}>ASSET_NOT_FOUND</p>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← RETURN_TO_GALLERY
        </button>
      </div>
    );
  }

  const images = product.images || [];
  const mainImageUrl = images.length > 0 ? images[activeImg]?.url : '/placeholder-image.jpg';

  return (
    <div className={styles.pageContainer}>

      {/* Ticker */}
      <div className={styles.tickerContainer}>
        <div className={styles.tickerText}>
          ASSET_LOADED // {product.title.toUpperCase()} // DROP_01_LIVE // HAVOC_TACTICAL // ASSET_LOADED // {product.title.toUpperCase()} // DROP_01_LIVE // HAVOC_TACTICAL //
        </div>
      </div>

      {/* Back */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← BACK_TO_GALLERY
        </button>
        <span className={styles.breadcrumb}>HAVOC // COLLECTION_01 // {product.title.toUpperCase()}</span>
      </div>

      {/* Main Content */}
      <div className={styles.contentGrid}>

        {/* LEFT — Image Gallery */}
        <div className={styles.galleryCol}>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className={styles.thumbStrip}>
              {images.map((img, i) => (
                <div
                  key={img._id}
                  className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ''}`}
                  onClick={() => { setActiveImg(i); setImgLoaded(false); }}
                >
                  <img src={img.url} alt={`view-${i}`} />
                </div>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className={styles.mainImageWrapper}>
            <img
              key={mainImageUrl}
              src={mainImageUrl}
              alt={product.title}
              className={`${styles.mainImage} ${imgLoaded ? styles.mainImageVisible : ''}`}
              onLoad={() => setImgLoaded(true)}
            />
            {/* Scanline overlay */}
            <div className={styles.scanlineOverlay} />
            {/* Corner markers */}
            <span className={`${styles.corner} ${styles.cornerTL}`} />
            <span className={`${styles.corner} ${styles.cornerTR}`} />
            <span className={`${styles.corner} ${styles.cornerBL}`} />
            <span className={`${styles.corner} ${styles.cornerBR}`} />
            {/* Image index */}
            <div className={styles.imageIndex}>
              {String(activeImg + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* RIGHT — Product Info */}
        <div className={styles.infoCol}>

          <div className={styles.systemTag}>SYSTEM_ID: {product._id.slice(-8).toUpperCase()}</div>

          <h1 className={styles.productTitle}>{product.title}</h1>

          <div className={styles.divider} />

          <div className={styles.priceRow}>
            <span className={styles.priceLabel}>PRICE</span>
            <span className={styles.priceValue}>
              ₹{product.price.toLocaleString('en-IN')}
              <span className={styles.currency}>{product.currency}</span>
            </span>
          </div>

          <div className={styles.divider} />

          <div className={styles.descSection}>
            <span className={styles.sectionLabel}>// DESCRIPTION</span>
            <p className={styles.description}>{product.description}</p>
          </div>

          <div className={styles.divider} />

          {/* Metadata table */}
          <div className={styles.metaTable}>
            <div className={styles.metaRow}>
              <span className={styles.metaKey}>SELLER_ID</span>
              <span className={styles.metaVal}>{product.seller.slice(-8).toUpperCase()}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaKey}>RELEASED</span>
              <span className={styles.metaVal}>
                {new Date(product.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric'
                }).toUpperCase()}
              </span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaKey}>STATUS</span>
              <span className={`${styles.metaVal} ${styles.statusActive}`}>● ACTIVE</span>
            </div>
          </div>

          <div className={styles.divider} />

          {/* CTA */}
          <div className={styles.ctaGroup}>
            <button className={styles.btnPrimary}>ADD_TO_CART</button>
            <button className={styles.btnSecondary}>Buy Now</button>
          </div>

          <div className={styles.footerTag}>HAVOC_SYSTEMS_v1.0 // ALL_RIGHTS_RESERVED</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;