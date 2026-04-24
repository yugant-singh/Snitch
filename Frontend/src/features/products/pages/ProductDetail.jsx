import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useProducts } from '../hook/useProducts';
import styles from './ProductDetail.module.scss';

// ── Helper: Mongoose Map → plain object ──────────────────────────
function attrsToObj(attributes) {
  if (!attributes) return {};
  if (attributes instanceof Map) return Object.fromEntries(attributes);
  // Mongoose returns Map-like object with entries() — handle both
  if (typeof attributes.entries === 'function') return Object.fromEntries(attributes.entries());
  return attributes;
}

// ── VariantSelector: Amazon-style grouped attribute pickers ──────
const VariantSelector = ({ variants, selectedVariantId, onSelect }) => {
  const selectedVariant = variants.find(v => v._id === selectedVariantId);
  const selectedAttrs = attrsToObj(selectedVariant?.attributes || {});

  // Collect all unique attribute keys across all variants
  const allKeys = [...new Set(
    variants.flatMap(v => Object.keys(attrsToObj(v.attributes || {})))
  )];

  // If no attributes at all — try to fall back to a generic variant picker if they exist
  if (allKeys.length === 0) {
    return (
      <div className={styles.variantSection}>
        <div className={styles.attrLabelRow}>
          <span className={styles.sectionLabel}>SELECT_VARIANT //</span>
        </div>
        <div className={styles.variantGrid}>
          {variants.map((v, i) => (
            <button
              key={v._id}
              className={`${styles.variantBtn} ${selectedVariantId === v._id ? styles.variantBtnActive : ''}`}
              onClick={() => onSelect(v._id)}
            >
              V_{String(i + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Handle attribute key selection — pick best matching variant
  const handleAttrSelect = (key, value) => {
    // Try to find a variant that matches ALL currently selected attrs + this new one
    const newAttrs = { ...selectedAttrs, [key]: value };
    const match = variants.find(v => {
      const obj = attrsToObj(v.attributes || {});
      return Object.entries(newAttrs).every(([k, val]) => obj[k] === val);
    });
    if (match) {
      onSelect(match._id);
    } else {
      // Partial match — find variant with at least this key=value
      const partial = variants.find(v => {
        const obj = attrsToObj(v.attributes || {});
        return obj[key] === value;
      });
      if (partial) onSelect(partial._id);
    }
  };

  // Get unique values for each attribute key
  const getValuesForKey = (key) => {
    const vals = variants.map(v => attrsToObj(v.attributes || {})[key]).filter(Boolean);
    return [...new Set(vals)];
  };

  // Check if a value is available (has stock > 0) for a given key
  const isAvailable = (key, value) => {
    return variants.some(v => {
      const obj = attrsToObj(v.attributes || {});
      return obj[key] === value && (v.stock === undefined || v.stock > 0);
    });
  };

  const isColorKey = (key) => key.toLowerCase().includes('color') || key.toLowerCase().includes('colour');

  return (
    <div className={styles.variantSection}>
      {allKeys.map(key => {
        const values = getValuesForKey(key);
        const selectedVal = selectedAttrs[key];
        const isColor = isColorKey(key);

        return (
          <div key={key} className={styles.attrGroup}>
            <div className={styles.attrLabelRow}>
              <span className={styles.sectionLabel}>SELECT_{key.toUpperCase()} //</span>
              {selectedVal && (
                <span className={styles.attrSelectedVal}>{selectedVal.toUpperCase()}</span>
              )}
            </div>

            <div className={styles.variantGrid}>
              {values.map(val => {
                const isSelected = selectedVal === val;
                const available = isAvailable(key, val);

                if (isColor) {
                  return (
                    <button
                      key={val}
                      title={val}
                      disabled={!available}
                      onClick={() => handleAttrSelect(key, val)}
                      className={`${styles.colorSwatch} ${isSelected ? styles.colorSwatchActive : ''} ${!available ? styles.swatchUnavailable : ''}`}
                      style={{ '--swatch-color': val }}
                    />
                  );
                }

                return (
                  <button
                    key={val}
                    disabled={!available}
                    onClick={() => handleAttrSelect(key, val)}
                    className={`${styles.variantBtn} ${isSelected ? styles.variantBtnActive : ''} ${!available ? styles.variantBtnUnavailable : ''}`}
                  >
                    {val.toUpperCase()}
                    {!available && <span className={styles.outOfStock}> // OUT</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────
const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleProductDetails } = useProducts();
  const product = useSelector((state) => state.product.selectedProduct);

  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(null);

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

  useEffect(() => {
    setActiveImg(0);
    setImgLoaded(false);
    if (product?.varient?.length > 0) {
      setSelectedVariantId(product.varient[0]._id);
    } else {
      setSelectedVariantId(null);
    }
  }, [product?._id]);

  useEffect(() => {
    setActiveImg(0);
    setImgLoaded(false);
  }, [selectedVariantId]);

  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.pulseContainer}>
          <span className={styles.pulseText}>INITIALIZING_SYSTEM...</span>
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

  const selectedVariant = product.varient?.find(v => v._id === selectedVariantId) || null;
  const images = (selectedVariant?.images?.length > 0) ? selectedVariant.images : (product.images || []);
  const displayPrice = selectedVariant?.price || product.price || 0;
  const displayStock = selectedVariant?.stock !== undefined ? selectedVariant.stock : product.stock;
  const mainImageUrl = images.length > 0 ? images[activeImg]?.url : '/placeholder-image.jpg';

  return (
    <div className={styles.pageContainer}>

      {/* Ticker */}
      <div className={styles.tickerContainer}>
        <div className={styles.tickerText}>
          ASSET_LOADED // {product.title.toUpperCase()} // DROP_01_LIVE // HAVOC_TACTICAL // ASSET_LOADED // {product.title.toUpperCase()} // DROP_01_LIVE // HAVOC_TACTICAL //
        </div>
      </div>

      {/* Top Bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>← BACK_TO_GALLERY</button>
        <span className={styles.breadcrumb}>HAVOC // COLLECTION_01 // {product.title.toUpperCase()}</span>
      </div>

      {/* Main Content */}
      <div className={styles.contentGrid}>

        {/* LEFT — Image Gallery */}
        <div className={styles.galleryCol}>
          {images.length > 1 && (
            <div className={styles.thumbStrip}>
              {images.map((img, i) => (
                <div
                  key={img._id || i}
                  className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ''}`}
                  onClick={() => { setActiveImg(i); setImgLoaded(false); }}
                >
                  <img src={img.url} alt={`view-${i}`} />
                </div>
              ))}
            </div>
          )}

          <div className={styles.mainImageWrapper}>
            <img
              key={mainImageUrl}
              src={mainImageUrl}
              alt={product.title}
              className={`${styles.mainImage} ${imgLoaded ? styles.mainImageVisible : ''}`}
              onLoad={() => setImgLoaded(true)}
            />
            <div className={styles.scanlineOverlay} />
            <span className={`${styles.corner} ${styles.cornerTL}`} />
            <span className={`${styles.corner} ${styles.cornerTR}`} />
            <span className={`${styles.corner} ${styles.cornerBL}`} />
            <span className={`${styles.corner} ${styles.cornerBR}`} />
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
              ₹{displayPrice.toLocaleString('en-IN')}
              <span className={styles.currency}>{selectedVariant?.currency || product.currency}</span>
            </span>
          </div>

          <div className={styles.divider} />

          {/* Amazon-style Variant Selector */}
          {product.varient && product.varient.length > 0 && (
            <>
              <VariantSelector
                variants={product.varient}
                selectedVariantId={selectedVariantId}
                onSelect={setSelectedVariantId}
              />
              <div className={styles.divider} />
            </>
          )}

          <div className={styles.descSection}>
            <span className={styles.sectionLabel}>// DESCRIPTION</span>
            <p className={styles.description}>{product.description}</p>
          </div>

          <div className={styles.divider} />

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
            <div className={styles.metaRow}>
              <span className={styles.metaKey}>STOCK_LEVEL</span>
              <span className={`${styles.metaVal} ${displayStock === 0 ? styles.stockOut : displayStock < 5 ? styles.stockLow : ''}`}>
                {displayStock !== undefined ? `${displayStock} UNITS` : 'UNKNOWN'}
              </span>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.ctaGroup}>
            <button
              className={styles.btnPrimary}
              disabled={displayStock === 0}
            >
              {displayStock === 0 ? 'OUT_OF_STOCK' : 'ADD_TO_CART'}
            </button>
            <button
              className={styles.btnSecondary}
              disabled={displayStock === 0}
            >
              BUY_NOW
            </button>
          </div>

          <div className={styles.footerTag}>HAVOC_SYSTEMS_v1.0 // ALL_RIGHTS_RESERVED</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
