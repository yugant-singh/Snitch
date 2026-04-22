import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProducts } from '../hook/useProducts.js';
import ProductCard from '../components/ProductCard';
import styles from './Home.module.scss';

const Home = () => {
  const { handleAllProducts } = useProducts();
  const products = useSelector((state) => state.product.products);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await handleAllProducts();
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.pulseContainer}>
          <span className={styles.pulseText}>INITIALIZING_GALLERY...</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Ticker Tape */}
      <div className={styles.tickerContainer}>
        <div className={styles.tickerText}>
          SYSTEM_STATUS: ACTIVE // DROP_01_LIVE // HAVOC_TACTICAL // SYSTEM_STATUS: ACTIVE // DROP_01_LIVE // HAVOC_TACTICAL // SYSTEM_STATUS: ACTIVE // DROP_01_LIVE // HAVOC_TACTICAL // SYSTEM_STATUS: ACTIVE // DROP_01_LIVE // HAVOC_TACTICAL //
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.filterList}>
            <span className={styles.filterItemActive}>[ALL]</span>
            <span className={styles.filterItem}>[TOPS]</span>
            <span className={styles.filterItem}>[OUTERWEAR]</span>
            <span className={styles.filterItem}>[ACCESSORIES]</span>
          </div>
        </aside>

        {/* Main Gallery */}
        <main className={styles.galleryMain}>
          <header className={styles.header}>
            <h1 className={styles.mainTitle}>COLLECTION_01</h1>
          </header>

          {products && products.length > 0 ? (
            <div className={styles.masonryGrid}>
              {products.map((product) => (
                <div className={styles.masonryItem} key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyBox}>
                <h2 className={styles.emptyText}>VAULT_STATUS: EMPTY</h2>
                <p className={styles.emptySubText}>NO_ASSETS_DETECTED_IN_SECTOR_01</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>HAVOC_SYSTEMS_v1.0</span>
          <span>©2026_ALL_RIGHTS_RESERVED</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;