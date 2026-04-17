import React, { useState } from 'react'
import { useProducts } from '../hook/useProducts'
import { useNavigate } from 'react-router-dom'
import FloatingLabelInput from '../../auth/components/FloatingLabelInput'
import './CreateProduct.scss'

const MAX_IMAGES = 7

const CreateProduct = () => {
  const { handleCreateProduct } = useProducts()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    images: []
  })
  const [imagePreviews, setImagePreviews] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [fileError, setFileError] = useState('')
  const [dropSuccess, setDropSuccess] = useState(false)
  const [droppedData, setDroppedData] = useState(null)
  const navigate = useNavigate()

  const active = Boolean(
    formData.title.trim() ||
    formData.priceAmount.trim() ||
    formData.description.trim() ||
    formData.images.length
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    if (fileError) {
      setFileError('')
    }
  }

  const handleImageUpload = (files) => {
    const selectedFiles = Array.from(files)
    const currentCount = formData.images.length
    const remaining = MAX_IMAGES - currentCount

    if (currentCount >= MAX_IMAGES) {
      setFileError('MAX 7 TACTICAL GEARS ALLOWED.')
      return
    }

    const allowedFiles = selectedFiles.slice(0, remaining)

    if (selectedFiles.length > remaining) {
      setFileError(`MAX 7 TACTICAL GEARS ALLOWED. Only ${remaining} slot(s) left.`)
    } else {
      setFileError('')
    }

    if (allowedFiles.length === 0) return

    // Generate previews for all allowed files
    const previewPromises = allowedFiles.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.readAsDataURL(file)
        })
    )

    Promise.all(previewPromises).then((newPreviews) => {
      setImagePreviews((prev) => [...prev, ...newPreviews])
    })

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...allowedFiles]
    }))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      handleImageUpload(e.dataTransfer.files)
    }
  }

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    if (fileError) setFileError('')
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length) {
      handleImageUpload(e.target.files)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.description.trim() || !formData.priceAmount.trim() || formData.images.length === 0) {
      setFileError((prev) => prev || 'Please complete all fields.')
      return
    }

    if (formData.images.length > MAX_IMAGES) {
      setFileError('MAX 7 TACTICAL GEARS ALLOWED.')
      return
    }

    try {
      const savedTitle = formData.title.trim()
      await handleCreateProduct(formData)
      setFormData({
        title: '',
        description: '',
        priceAmount: '',
        images: []
      })
      setImagePreviews([])
      setFileError('')
      
      setDroppedData({
        title: savedTitle,
        price: formData.priceAmount.trim(),
        image: imagePreviews[0]
      })
      setDropSuccess(true)
    } catch (error) {
      console.error('Error creating product:', error)
      setFileError('Unable to release drop. Try again.')
    }
  }

  const isSubmitDisabled =
    !formData.title.trim() ||
    !formData.description.trim() ||
    !formData.priceAmount.trim() ||
    formData.images.length === 0 ||
    Boolean(fileError)

  return (
    <div className="rp-product">
      <div className="global-texture" />

      <div className="rp-product__left">
        <div className={`editorial-bg ${active ? 'editorial-bg--active' : ''}`}>
          {imagePreviews[0] && <img src={imagePreviews[0]} alt="Product preview" className="editorial-img" />}
        </div>

        <div className="editorial-overlay" />

        {!active && <div className="editorial-watermark">HAVOC_STUDIO</div>}

        <div className={`editorial-content ${active ? 'editorial-content--active' : ''}`}>
          <div className="brand-wordmark">
            <span className="wordmark-text">HAVOC</span>
          </div>
          <p className="brand-subheading">PREMIUM CHAOS. TAILORED FOR THE STREET..</p>
          <div className="editorial-spacer" />
          <div className="product-hero-copy">
            <span className="product-hero-title">{formData.title.trim() || 'DROP_TITLE'}</span>
            <span className="product-hero-price">${formData.priceAmount.trim() || '0.00'}</span>
          </div>
        </div>

        <div className="left-meta-bar">
          <span className="meta-item">FW � 2025</span>
          <span className="meta-dot" />
          <span className="meta-item">SELLER DROP</span>
          <span className="meta-dot" />
          <span className="meta-item">� HAVOC</span>
        </div>
      </div>

      <div className="rp-product__right">
        <div className="form-panel">
          <div className="form-header">
            <p className="form-eyebrow">NEW DROP</p>
            <h1 className="form-heading">CREATE PRODUCT</h1>
          </div>

          <form className="reg-form" onSubmit={handleSubmit} noValidate>
            <FloatingLabelInput
              id="title"
              label="DROP_TITLE"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />

            <div className="product-field">
              <label className="product-label" htmlFor="description">
                THE_MANIFESTO
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="product-textarea"
                rows="6"
                placeholder="Describe your masterpiece"
              />
            </div>

            <div className="product-field">
              <div className="upload-label-row">
                <label className="product-label">UPLOAD_ARMOR</label>
                <span className="upload-counter">{formData.images.length} / {MAX_IMAGES}</span>
              </div>

              {/* Image Grid Preview */}
              {imagePreviews.length > 0 && (
                <div className="image-grid">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="image-grid__item">
                      <img src={src} alt={`Preview ${index + 1}`} className="image-grid__img" />
                      <button
                        type="button"
                        className="image-grid__remove"
                        onClick={() => handleRemoveImage(index)}
                        aria-label="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Add more slot — only if under limit */}
                  {formData.images.length < MAX_IMAGES && (
                    <label className="image-grid__add">
                      <span className="image-grid__add-icon">+</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="upload-input-hidden"
                      />
                    </label>
                  )}
                </div>
              )}

              {/* Initial dropzone — only when no images yet */}
              {imagePreviews.length === 0 && (
                <div
                  className={`upload-dropzone ${dragActive ? 'upload-dropzone--active' : ''} ${fileError ? 'upload-dropzone--error' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="upload-dropzone__inner">
                    <span className="upload-dropzone__icon">↑</span>
                    <p className="upload-dropzone__text">Drag & drop or click to upload</p>
                    <p className="upload-dropzone__sub">Max {MAX_IMAGES} images</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="upload-input"
                  />
                </div>
              )}

              {fileError && <p className="product-error">{fileError}</p>}
            </div>

            <FloatingLabelInput
              id="price"
              label="RETAIL_PRICE"
              type="number"
              name="priceAmount"
              value={formData.priceAmount}
              onChange={handleInputChange}
            />

            <button type="submit" className={`btn-register ${isSubmitDisabled ? 'btn-register--disabled' : ''}`} disabled={isSubmitDisabled}>
              <span className="btn-register__text">RELEASE DROP</span>
            </button>
          </form>
        </div>
      </div>
      {/* Success Overlay */}
      {dropSuccess && droppedData && (
        <div className="pd-success-modal">
          <div className="pd-success-modal__noise" />
          
          <div className="pd-success-card">
            <p className="pd-success-card__watermark">AUTHENTICATED_DROP</p>
            <div className="pd-success-card__header">
              <span className="eyebrow">DROP_CONFIRMED</span>
              <div className="divider" />
            </div>
            
            <div className="pd-success-card__visual">
              <img src={droppedData.image} alt={droppedData.title} />
            </div>
            
            <div className="pd-success-card__meta">
              <h2 className="title">{droppedData.title}</h2>
              <span className="price">${droppedData.price}</span>
            </div>
            
            <div className="pd-success-card__footer">
              <p>YOUR PIECE IS NOW LIVE IN THE ARSENAL.</p>
            </div>
          </div>
          
          <div className="pd-success-modal__actions">
            <button 
              className="btn-action btn-outline" 
              onClick={() => setDropSuccess(false)}
            >
              [NEW_RELEASE]
            </button>
            <button 
              className="btn-action btn-solid" 
              onClick={() => navigate('/seller/inventory')}
            >
              [GO_TO_ARSENAL]
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default CreateProduct
