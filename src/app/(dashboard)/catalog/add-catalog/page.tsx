'use client'

import React, { useState } from 'react'
import AddNewCatalog from '@components/AddNewCatalog'
import ProductCatalogFields from '@components/ProductCatalogFields'

const CatalogManagement = () => {
  const [showFieldsPopup, setShowFieldsPopup] = useState(false)

  const handleDefineFields = (data: any) => {
    setShowFieldsPopup(true)
  }

  const handleCloseFieldsPopup = () => {
    setShowFieldsPopup(false)
  }

  return (
    <div className='relative'>
      <AddNewCatalog onDefineFields={handleDefineFields} />
      {showFieldsPopup && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto'>
            <ProductCatalogFields onClose={handleCloseFieldsPopup} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CatalogManagement
