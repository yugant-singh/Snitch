import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useProducts } from '../hook/useProducts';
import styles from './SellerProductDetails.module.scss';

const SellerProductDetails = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const { handleProductDetails, handleAddVarient, handleEditVarient, handleDeleteVarient } = useProducts();
    const { selectedProduct } = useSelector(state => state.product);

    const [variants, setVariants] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [stock, setStock] = useState('');
    const [price, setPrice] = useState('');
    const [variantImages, setVariantImages] = useState([]);
    const [variantImagePreviews, setVariantImagePreviews] = useState([]);
    const [editingVariantId, setEditingVariantId] = useState(null);

    // Dynamic attributes — array of { key, value }
    const [attributes, setAttributes] = useState([{ key: '', value: '' }]);

    const [toastMessage, setToastMessage] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (productId) handleProductDetails(productId);
    }, [productId]);

    useEffect(() => {
        if (selectedProduct?.varient) setVariants(selectedProduct.varient);
    }, [selectedProduct]);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // ── Attribute helpers ────────────────────────────────────────
    const addAttributeRow = () => setAttributes(prev => [...prev, { key: '', value: '' }]);

    const removeAttributeRow = (index) => setAttributes(prev => prev.filter((_, i) => i !== index));

    const updateAttribute = (index, field, val) =>
        setAttributes(prev => prev.map((attr, i) => i === index ? { ...attr, [field]: val } : attr));

    // ── Image helpers ────────────────────────────────────────────
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setVariantImages(prev => [...prev, ...files]);
        setVariantImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const removeImage = (index) => {
        setVariantImages(prev => prev.filter((_, i) => i !== index));
        setVariantImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    // ── Reset / Open / Close ─────────────────────────────────────
    const resetForm = () => {
        setStock('');
        setPrice('');
        setVariantImages([]);
        setVariantImagePreviews([]);
        setAttributes([{ key: '', value: '' }]);
        setEditingVariantId(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const openAddModal = () => { resetForm(); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); resetForm(); };

    // ── Build FormData for backend ───────────────────────────────
    const buildFormData = () => {
        const fd = new FormData();
        fd.append('stock', stock);
        fd.append('price', price);
        // Send as attributes[color]=red, attributes[size]=XL etc.
        attributes.forEach(({ key, value }) => {
            if (key.trim()) fd.append(`attributes[${key.trim().toLowerCase()}]`, value.trim());
        });
        variantImages.forEach(file => fd.append('images', file));
        return fd;
    };

    // ── Submit ───────────────────────────────────────────────────
    const onDeployVariant = async () => {
        if (!stock || isNaN(stock)) return showToast('STOCK_REQUIRED');
        if (!price || isNaN(price)) return showToast('PRICE_REQUIRED');

        const attrsMap = {};
        attributes.forEach(({ key, value }) => {
            if (key.trim()) attrsMap[key.trim().toLowerCase()] = value.trim();
        });

        if (editingVariantId) {
            const previous = [...variants];
            setVariants(prev => prev.map(v =>
                v._id === editingVariantId
                    ? { ...v, stock: Number(stock), price: Number(price), attributes: attrsMap }
                    : v
            ));
            try {
                await handleEditVarient(productId, editingVariantId, buildFormData());
                showToast('UNIT_UPDATED');
                closeModal();
            } catch {
                setVariants(previous);
                showToast('UPDATE_FAILED');
            }
        } else {
            const tempId = Date.now().toString();
            setVariants(prev => [...prev, {
                _id: tempId,
                stock: Number(stock),
                price: Number(price),
                attributes: attrsMap,
                images: variantImagePreviews.map(url => ({ url })),
            }]);
            try {
                await handleAddVarient(productId, buildFormData());
                showToast('UNIT_DEPLOYED');
                closeModal();
                handleProductDetails(productId); // refresh to get real DB ids
            } catch {
                setVariants(prev => prev.filter(v => v._id !== tempId));
                showToast('DEPLOYMENT_FAILED');
            }
        }
    };

    const onEditVariant = (variant) => {
        setEditingVariantId(variant._id);
        setStock(variant.stock ?? '');
        setPrice(variant.price ?? '');

        // Handle both Map (from Mongoose) and plain object
        const attrObj = variant.attributes instanceof Map
            ? Object.fromEntries(variant.attributes)
            : (variant.attributes || {});
        const entries = Object.entries(attrObj);
        setAttributes(entries.length ? entries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);

        setVariantImagePreviews(variant.images?.map(img => img.url) || []);
        setVariantImages([]);
        setIsModalOpen(true);
    };

    const onTerminateVariant = async (variantId) => {
        const previous = [...variants];
        setVariants(prev => prev.filter(v => v._id !== variantId));
        showToast('UNIT_TERMINATED');
        try {
            await handleDeleteVarient(productId, variantId);
        } catch {
            setVariants(previous);
            showToast('TERMINATION_FAILED');
        }
    };

    const getAttrLabel = (variant) => {
        if (!variant.attributes) return 'DEFAULT';
        const obj = variant.attributes instanceof Map
            ? Object.fromEntries(variant.attributes)
            : variant.attributes;
        const entries = Object.entries(obj).filter(([, v]) => v);
        return entries.length
            ? entries.map(([k, v]) => `${k.toUpperCase()}: ${v.toUpperCase()}`).join(' / ')
            : 'DEFAULT';
    };

    return (
        <div className={styles.container}>
            {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

            <nav className={styles.navHeader}>
                <button className={styles.backBtn} onClick={() => navigate('/seller/dashboard')}>← BACK_TO_GALLERY</button>
                <div className={styles.breadcrumb}>HAVOC // COLLECTION_01 // {selectedProduct?.title?.toUpperCase() || 'PRODUCT'}</div>
            </nav>

            <div className={styles.productDisplay}>
                <div className={styles.imageColumn}>
                    <div className={styles.mainImageWrapper}>
                        <div className={styles.cornerTopLeft}></div>
                        <div className={styles.cornerTopRight}></div>
                        <div className={styles.cornerBottomLeft}></div>
                        <div className={styles.cornerBottomRight}></div>
                        {selectedProduct?.images?.[0]?.url ? (
                            <img src={selectedProduct.images[0].url} alt="product" className={styles.thumbnail} />
                        ) : (
                            <div className={styles.thumbnailPlaceholder}>[ NO_VISUAL_ASSET ]</div>
                        )}
                    </div>
                </div>

                <div className={styles.detailsColumn}>
                    <div className={styles.systemId}>SYSTEM_ID : {selectedProduct?._id?.slice(-8).toUpperCase() || 'UNKNOWN'}</div>
                    <h1 className={styles.productTitle}>{selectedProduct?.title?.toUpperCase() || 'UNKNOWN'}</h1>

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
                            <span className={styles.statusActive}>● ACTIVE</span>
                        </div>
                    </div>

                    <div className={styles.actionButtons}>
                        <button className={styles.addVariantBtn} onClick={openAddModal}>[+ ADD_NEW_VARIANT]</button>
                    </div>
                    <div className={styles.footerNote}>HAVOC_SYSTEMS_v1.0 // ALL_RIGHTS_RESERVED</div>
                </div>
            </div>

            {/* Variants Grid */}
            <section className={styles.inventorySection}>
                <header className={styles.inventoryHeader}><h2>[ VARIANT_INVENTORY ]</h2></header>
                <div className={styles.variantsGrid}>
                    {variants.map(variant => (
                        <div key={variant._id} className={styles.variantCard}>
                            <div className={styles.cardImageWrapper}>
                                {variant.images?.[0]?.url
                                    ? <img src={variant.images[0].url} alt="variant" className={styles.cardImg} />
                                    : <div className={styles.cardNoImg}>[ NO_VISUAL ]</div>
                                }
                                <div className={styles.cardSizeBadge}>{getAttrLabel(variant)}</div>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.cardMeta}>
                                    <div className={styles.metaStat}>
                                        <span className={styles.metaLabel}>STOCK</span>
                                        <span className={styles.metaValue}>{variant.stock ?? 0} QTY</span>
                                    </div>
                                    <div className={styles.metaStat}>
                                        <span className={styles.metaLabel}>PRICE</span>
                                        <span className={styles.metaValue}>₹{variant.price}</span>
                                    </div>
                                </div>
                                {variant.stock < 5 && <div className={styles.cardLowStock}>⚠ LOW_STOCK_WARNING</div>}
                                <div className={styles.cardActions}>
                                    <button className={styles.cardBtnEdit} onClick={() => onEditVariant(variant)}>[ EDIT ]</button>
                                    <button className={styles.cardBtnDelete} onClick={() => onTerminateVariant(variant._id)}>[ TERMINATE ]</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {variants.length === 0 && <div className={styles.emptyState}>NO_VARIANTS_FOUND. DEPLOY_YOUR_FIRST_UNIT.</div>}
                </div>
            </section>

            {/* Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <header className={styles.modalHeader}>
                            <h3>{editingVariantId ? '[ UPDATE_VARIANT ]' : '[ ADD_NEW_VARIANT ]'}</h3>
                            <button className={styles.closeModalBtn} onClick={closeModal}>✕</button>
                        </header>

                        <div className={styles.modalBody}>

                            {/* Dynamic Attributes */}
                            <div className={styles.modalFieldFull}>
                                <label>ATTRIBUTES // KEY-VALUE PAIRS</label>
                                <div className={styles.attributeRows}>
                                    {attributes.map((attr, i) => (
                                        <div key={i} className={styles.attributeRow}>
                                            <input
                                                className={styles.modalInput}
                                                placeholder="KEY (e.g. color)"
                                                value={attr.key}
                                                onChange={e => updateAttribute(i, 'key', e.target.value)}
                                            />
                                            <input
                                                className={styles.modalInput}
                                                placeholder="VALUE (e.g. red)"
                                                value={attr.value}
                                                onChange={e => updateAttribute(i, 'value', e.target.value)}
                                            />
                                            {attributes.length > 1 && (
                                                <button className={styles.attrRemoveBtn} onClick={() => removeAttributeRow(i)}>✕</button>
                                            )}
                                        </div>
                                    ))}
                                    <button className={styles.attrAddBtn} onClick={addAttributeRow}>+ ADD_ATTRIBUTE</button>
                                </div>
                            </div>

                            {/* Stock + Price */}
                            <div className={styles.modalRow}>
                                <div className={styles.modalField}>
                                    <label>QTY // UNIT_COUNT</label>
                                    <input type="number" placeholder="0" value={stock} onChange={e => setStock(e.target.value)} className={styles.modalInput} />
                                </div>
                                <div className={styles.modalField}>
                                    <label>PRICE // BASE_VALUE (₹)</label>
                                    <input type="number" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} className={styles.modalInput} />
                                </div>
                            </div>

                            {/* Multi Image Upload */}
                            <div className={styles.modalFieldFull}>
                                <label>VISUALS // UPLOAD (MULTIPLE)</label>
                                <div className={styles.modalUploadZone} onClick={() => fileInputRef.current?.click()}>
                                    {variantImagePreviews.length > 0 ? (
                                        <div className={styles.imagePreviewGrid}>
                                            {variantImagePreviews.map((src, i) => (
                                                <div key={i} className={styles.imagePreviewItem}>
                                                    <img src={src} alt={`preview-${i}`} className={styles.modalImage} />
                                                    <button className={styles.modalRemoveImage} onClick={e => { e.stopPropagation(); removeImage(i); }}>✕</button>
                                                </div>
                                            ))}
                                            <div className={styles.uploadAddMore}>+ ADD_MORE</div>
                                        </div>
                                    ) : (
                                        <div className={styles.uploadPlaceholder}>
                                            <span className={styles.uploadIcon}>+</span>
                                            <span className={styles.uploadText}>CLICK_TO_SELECT_VISUALS</span>
                                        </div>
                                    )}
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.modalCancelBtn} onClick={closeModal}>[ CANCEL ]</button>
                            <button className={styles.modalDeployBtn} onClick={onDeployVariant}>
                                {editingVariantId ? '[ UPDATE_UNIT ]' : '[ DEPLOY_UNIT ]'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerProductDetails;
