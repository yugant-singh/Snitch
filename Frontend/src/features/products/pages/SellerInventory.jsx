import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../hook/useProducts'
import './SellerInventory.scss'

const SellerInventory = () => {
  const { handleSellerProducts } = useProducts()
  const sellerProducts = useSelector((state) => state.product.sellerProducts)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await handleSellerProducts()
      } catch (error) {
        console.error('Error fetching seller products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [handleSellerProducts])

  return (
    <div className="the-arsenal">
      <div className="global-texture" />
      
      <div className="the-arsenal__header">
        <div className="header-left">
          <h1 className="title">THE ARSENAL</h1>
          <p className="sub-heading">ACTIVE TACTICAL GEAR</p>
        </div>
        
        <button 
          className="btn-new-drop"
          onClick={() => navigate('/create-product')}
        >
          NEW DROP
        </button>
      </div>

      <div className="the-arsenal__grid">
        {loading ? (
          <div className="the-arsenal__empty">
            <p>SYNCHRONIZING ARSENAL...</p>
          </div>
        ) : sellerProducts && sellerProducts.length > 0 ? (
          sellerProducts.map((product) => (
            <div key={product._id} className="arsenal-card">
              <div className="arsenal-card__img-container">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0].url || product.images[0]} 
                    alt={product.title} 
                    className="arsenal-card__img" 
                  />
                ) : (
                  <div className="arsenal-card__no-img">NO VISUAL DATA</div>
                )}
                
                {/* Hover Overlay */}
                <div className="arsenal-card__overlay">
                  <div className="overlay-actions">
                    <button className="btn-action">[EDIT_UNIT]</button>
                    <button className="btn-action">[ARCHIVE_ITEM]</button>
                  </div>
                </div>
              </div>
              
              <div className="arsenal-card__metadata">
                <span className="product-title">{product.title}</span>
                <span className="product-price">${product.price || product.priceAmount}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="the-arsenal__empty">
            <p>THE ARSENAL IS EMPTY. DEPLOY YOUR FIRST DROP.</p>
            <button 
              className="btn-deploy"
              onClick={() => navigate('/create-product')}
            >
              DEPLOY FIRST DROP
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerInventory
