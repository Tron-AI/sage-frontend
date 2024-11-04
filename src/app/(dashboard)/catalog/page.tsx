'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Database } from 'lucide-react'

const CatalogsPage = () => {
  const router = useRouter()
  const tableData = [
    { name: 'Strategio', company: 'Mondelez', product: 'Sales', domain: 'OK', status: 'Active' },
    { name: 'Geosales', company: 'Unilever', product: 'Inventory', domain: 'Error', status: 'Delayed' },
    { name: 'Sympathio', company: 'Allcorp', product: 'Sales', domain: 'Delayed', status: 'Pending' }
  ]

  const getStatusClass = status => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-400'
      case 'Delayed':
        return 'bg-rose-100 text-rose-800 ring-2 ring-rose-400'
      case 'Pending':
        return 'bg-amber-100 text-amber-800 ring-2 ring-amber-400'
      default:
        return 'bg-slate-100 text-slate-800 ring-2 ring-slate-400'
    }
  }

  const getDomainClass = domain => {
    switch (domain) {
      case 'OK':
        return 'text-emerald-600'
      case 'Error':
        return 'text-rose-600'
      case 'Delayed':
        return 'text-amber-600'
      default:
        return 'text-slate-600'
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 sm:p-6 lg:p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex items-center gap-3 mb-8'>
          <Database className='w-8 h-8 text-blue-600' />
          <h1 className='text-3xl font-bold text-blue-600'>Catalogs</h1>
        </div>

        <div className='mb-6'>
          <button
            onClick={() => router.push('/catalog/add-catalog')}
            className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg
                     flex items-center gap-2 transition-colors duration-200 shadow-md hover:shadow-lg'
          >
            <Plus className='w-5 h-5' />
            Add New Catalog
          </button>
        </div>

        <div className='overflow-hidden bg-white rounded-xl shadow-lg border border-blue-100'>
          <table className='min-w-full divide-y divide-blue-200'>
            <thead>
              <tr className='bg-blue-500'>
                {['Name', 'Company', 'Product', 'Domain', 'Status'].map(header => (
                  <th key={header} className='px-6 py-4 text-left text-sm font-semibold text-white tracking-wider'>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-blue-100'>
              {tableData.map((row, index) => (
                <tr key={index} className='hover:bg-blue-50 transition-colors duration-150'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='text-sm font-semibold text-blue-700'>{row.name}</span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='text-sm font-medium text-slate-600'>{row.company}</span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-sm font-medium'>
                      {row.product}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`text-sm font-semibold ${getDomainClass(row.domain)}`}>{row.domain}</span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                ${getStatusClass(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CatalogsPage
