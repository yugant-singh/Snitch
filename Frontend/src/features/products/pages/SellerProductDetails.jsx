import React, { useState, useEffect, useRef } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useProducts } from '../hook/useProducts';
import styles from './SellerProductDetails.module.scss';

const SellerProductDetails = () => {
  const navigate  = useNavigate()
    const { productId } = useParams();
    const { handleProductDetails, handleAddVarient, handleEditVarient, handleDeleteVarient } = useProducts();
    const { selectedProduct } = useSelector(state => state.product);

    const [variants, setVariants] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [size, setSize] = useState('S');
    const [stock, setStock] = useState('');
    const [price, setPrice] = useState('');
    const [variantImage, setVariantImage] = useState(null);
    const [variantImagePreview, setVariantImagePreview] = useState(null);
    const [editingVariantId, setEditingVariantId] = useState(null);

    // Toast state
    const [toastMessage, setToastMessage] = useState('');

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (productId) {
            handleProductDetails(productId);
        }
    }, [productId]);

    useEffect(() => {
        if (selectedProduct?.varient) {
            setVariants(selectedProduct.varient);
        }
    }, [selectedProduct]);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const resetForm = () => {
        setSize('S');
        setStock('');
        setPrice('');
        setVariantImage(null);
        setVariantImagePreview(null);
        setEditingVariantId(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const openAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setVariantImage(file);
        setVariantImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setVariantImage(null);
        setVariantImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const onDeployVariant = async () => {
        if (!stock || isNaN(stock)) return;
        if (!price || isNaN(price)) return;

        const formData = {
            size,
            stock: Number(stock),
            color: '#ffffff', // default color if required by backend
            price: Number(price),
            images: variantImage ? [variantImage] : [],
        };

        if (editingVariantId) {
            const previousVariants = [...variants];
            setVariants(variants.map(v =>
                v._id === editingVariantId
                    ? {
                        ...v,
                        stock: Number(stock),
                        price: Number(price),
                        attributes: { ...v.attributes, size },
                        ...(variantImagePreview && { images: [{ url: variantImagePreview }] })
                    }
                    : v
            ));
            try {
                await handleEditVarient(productId, editingVariantId, formData);
                showToast('UNIT_UPDATED');
                closeModal();
            } catch (error) {
                setVariants(previousVariants);
                showToast('UPDATE_FAILED');
            }
        } else {
            const tempId = Date.now().toString();
            const optimisticVariant = {
                _id: tempId,
                stock: Number(stock),
                price: Number(price),
                attributes: { size },
                images: variantImagePreview ? [{ url: variantImagePreview }] : [],
            };
            setVariants(prev => [...prev, optimisticVariant]);
            try {
                await handleAddVarient(productId, formData);
                showToast('UNIT_DEPLOYED');
                closeModal();
            } catch (error) {
                setVariants(prev => prev.filter(v => v._id !== tempId));
                showToast('DEPLOYMENT_FAILED');
            }
        }
    };

    const onEditVariant = (variant) => {
        setEditingVariantId(variant._id);
        setSize(variant.attributes?.size || 'S');
        setStock(variant.stock || '');
        setPrice(variant.price || '');
        const existingImg = variant.images?.[0]?.url || null;
        setVariantImagePreview(existingImg);
        setVariantImage(null);
        setIsModalOpen(true);
    };

    const onTerminateVariant = async (variantId) => {
        const previousVariants = [...variants];
        setVariants(prev => prev.filter(v => v._id !== variantId));
        showToast('UNIT_TERMINATED');
        try {
            await handleDeleteVarient(productId, variantId);
        } catch (error) {
            setVariants(previousVariants);
            showToast('TERMINATION_FAILED');
        }
    };

    return (
        <div className={styles.container}>
            {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

            {/* Nav Header */}
            <nav className={styles.navHeader}>
                <button className={styles.backBtn} onClick={()=>{
                  navigate('/seller/dashboard')
                }}>+ BACK_TO_GALLERY</button>
                <div className={styles.breadcrumb}>HAVOC // COLLECTION_01 // {selectedProduct?.name?.toUpperCase() || 'PRODUCT'}</div>
            </nav>

            {/* Main Product Section */}
            <div className={styles.productDisplay}>
                <div className={styles.imageColumn}>
                    <div className={styles.mainImageWrapper}>
                        <div className={styles.cornerTopLeft}></div>
                        <div className={styles.cornerTopRight}></div>
                        <div className={styles.cornerBottomLeft}></div>
                        <div className={styles.cornerBottomRight}></div>
                        {selectedProduct?.images?.[0]?.url ? (
                            <img src={selectedProduct.images[0].url} alt="Product Thumbnail" className={styles.thumbnail} />
                        ) : (
                            <div className={styles.thumbnailPlaceholder}>[ NO_VISUAL ]</div>
                        )}
                    </div>
                </div>

                <div className={styles.detailsColumn}>
                    <div className={styles.systemId}>SYSTEM_ID : {selectedProduct?._id?.slice(-8).toUpperCase() || 'UNKNOWN'}</div>
                    <h1 className={styles.productTitle}>{selectedProduct?.name?.toUpperCase() || 'UNKNOWN'}</h1>

                    <div className={styles.priceRow}>
                        <span className={styles.label}>PRICE</span>
                        <span className={styles.priceValue}>₹{selectedProduct?.price?.toLocaleString() || '0'} <span className={styles.currency}>INR</span></span>
                    </div>

                    <div className={styles.descriptionSection}>
                        <div className={styles.label}>// DESCRIPTION</div>
                        <p className={styles.descriptionText}>{selectedProduct?.description || 'NO_DESCRIPTION_PROVIDED.'}</p>
                    </div>

                    <div className={styles.metaData}>
                        <div className={styles.metaRow}>
                            <span className={styles.label}>SELLER_ID</span>
                            <span className={styles.metaValue}>{selectedProduct?.seller?.slice(-8).toUpperCase() || 'UNKNOWN'}</span>
                        </div>
                        <div className={styles.metaRow}>
                            <span className={styles.label}>RELEASED</span>
                            <span className={styles.metaValue}>{new Date(selectedProduct?.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                        </div>
                        <div className={styles.metaRow}>
                            <span className={styles.label}>STATUS</span>
                            <span className={styles.statusActive}>• ACTIVE</span>
                        </div>
                    </div>

                    <div className={styles.actionButtons}>
                        <button className={styles.addVariantBtn} onClick={openAddModal}>
                            [+ ADD_NEW_VARIANT]
                        </button>
                    </div>
                    
                    <div className={styles.footerNote}>HAVOC_SYSTEMS_v1.0 // ALL_RIGHTS_RESERVED</div>
                </div>
            </div>

            {/* Variants Grid */}
            <section className={styles.inventorySection}>
                <header className={styles.inventoryHeader}>
                    <h2>[ VARIANT_INVENTORY ]</h2>
                </header>

                <div className={styles.variantsGrid}>
                    {variants.map(variant => {
                        const variantSize = variant.attributes?.size || 'N/A';
                        const variantStock = variant.stock || 0;
                        const variantPrice = variant.price || 0;
                        const variantImg = variant.images?.[0]?.url || null;
                        const isLowStock = variantStock < 5;

                        return (
                            <div key={variant._id} className={styles.variantCard}>
                                <div className={styles.cardImageWrapper}>
                                    {variantImg ? (
                                        <img src={variantImg} alt={variantSize} className={styles.cardImg} />
                                    ) : (
                                        <div className={styles.cardNoImg}>[ NO_VISUAL ]</div>
                                    )}
                                    <div className={styles.cardSizeBadge}>{variantSize}</div>
                                </div>

                                <div className={styles.cardBody}>
                                    <div className={styles.cardMeta}>
                                        <div className={styles.metaStat}>
                                            <span className={styles.metaLabel}>STOCK</span>
                                            <span className={styles.metaValue}>{variantStock} QTY</span>
                                        </div>
                                        <div className={styles.metaStat}>
                                            <span className={styles.metaLabel}>PRICE</span>
                                            <span className={styles.metaValue}>₹{variantPrice}</span>
                                        </div>
                                    </div>
                                    {isLowStock && <div className={styles.cardLowStock}>⚠️ LOW_STOCK_WARNING</div>}

                                    <div className={styles.cardActions}>
                                        <button className={styles.cardBtnEdit} onClick={() => onEditVariant(variant)}>
                                            [ EDIT ]
                                        </button>
                                        <button className={styles.cardBtnDelete} onClick={() => onTerminateVariant(variant._id)}>
                                            [ TERMINATE ]
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {variants.length === 0 && (
                        <div className={styles.emptyState}>
                            NO_VARIANTS_FOUND. DEPLOY_YOUR_FIRST_UNIT.
                        </div>
                    )}
                </div>
            </section>

            {/* Configuration Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <header className={styles.modalHeader}>
                            <h3>{editingVariantId ? '[ UPDATE_VARIANT ]' : '[ ADD_NEW_VARIANT ]'}</h3>
                            <button className={styles.closeModalBtn} onClick={closeModal}>✕</button>
                        </header>

                        <div className={styles.modalBody}>
                            {/* Image Uploader */}
                            <div className={styles.modalFieldFull}>
                                <label>VISUAL // UPLOAD</label>
                                <div className={styles.modalUploadZone} onClick={() => fileInputRef.current?.click()}>
                                    {variantImagePreview ? (
                                        <div className={styles.modalImageWrapper}>
                                            <img src={variantImagePreview} alt="preview" className={styles.modalImage} />
                                            <button className={styles.modalRemoveImage} onClick={(e) => { e.stopPropagation(); removeImage(); }}>✕</button>
                                        </div>
                                    ) : (
                                        <div className={styles.uploadPlaceholder}>
                                            <span className={styles.uploadIcon}>+</span>
                                            <span className={styles.uploadText}>CLICK_TO_SELECT_VISUAL</span>
                                        </div>
                                    )}
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                            </div>

                            <div className={styles.modalRow}>
                                {/* Size Dropdown */}
                                <div className={styles.modalField}>
                                    <label>SIZE // SELECT</label>
                                    <div className={styles.selectWrapper}>
                                        <select value={size} onChange={e => setSize(e.target.value)} className={styles.modalInput}>
                                            <option value="XS">XS</option>
                                            <option value="S">S</option>
                                            <option value="M">M</option>
                                            <option value="L">L</option>
                                            <option value="XL">XL</option>
                                            <option value="XXL">XXL</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Quantity Number */}
                                <div className={styles.modalField}>
                                    <label>QTY // UNIT_COUNT</label>
                                    <input type="number" placeholder="0" value={stock} onChange={e => setStock(e.target.value)} className={styles.modalInput} />
                                </div>
                            </div>

                            {/* Price Adjustment */}
                            <div className={styles.modalFieldFull}>
                                <label>PRICE // BASE_VALUE (₹)</label>
                                <input type="number" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} className={styles.modalInput} />
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.modalCancelBtn} onClick={closeModal}>[ CANCEL ]</button>
                            <button className={styles.modalDeployBtn} onClick={onDeployVariant}>{editingVariantId ? '[ UPDATE_UNIT ]' : '[ DEPLOY_UNIT ]'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerProductDetails;
