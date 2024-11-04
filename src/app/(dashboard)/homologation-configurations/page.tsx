'use client'
import React, { useState } from 'react'

const InputField = ({ label, placeholder, value, onChange }) => (
  <div className='mb-4'>
    <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>
    <input
      type='text'
      className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
)

const ConfigButton = ({ children, onClick }) => (
  <button
    className='w-full px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-2'
    onClick={onClick}
  >
    {children}
  </button>
)

const HomologationConfigurations = () => {
  const [name, setName] = useState('')
  const [corporate, setCorporate] = useState('')
  const [product, setProduct] = useState('')
  const [responsible, setResponsible] = useState('')
  const [frequency, setFrequency] = useState('Daily')

  const handleSaveConfiguration = () => {
    // Implement save logic here
    console.log('Saving configuration...')
  }

  return (
    <div className='max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Product Homologation Configuration</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <InputField label='Name' placeholder='Enter Name' value={name} onChange={setName} />
        <InputField label='Corporate' placeholder='Enter Corporate' value={corporate} onChange={setCorporate} />
        <InputField label='Product' placeholder='Enter Product' value={product} onChange={setProduct} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
        <InputField label='Responsible' placeholder='Enter Responsible' value={responsible} onChange={setResponsible} />
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Frequency</label>
          <select
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            value={frequency}
            onChange={e => setFrequency(e.target.value)}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
      </div>

      <div className='mb-6'>
        <h2 className='text-lg font-semibold mb-2'>Database Configuration</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
          <ConfigButton onClick={() => console.log('Configure Database')}>
            Configure Database (IP, User, Password)
          </ConfigButton>
          <ConfigButton onClick={() => console.log('Map Fields for Non-homologated Products')}>
            Map Fields for Non-homologated Products
          </ConfigButton>
          <ConfigButton onClick={() => console.log('Map Fields for Homologation History')}>
            Map Fields for Homologation History
          </ConfigButton>
          <ConfigButton onClick={() => console.log('Map Fields for Stock Table')}>
            Map Fields for Stock Table (Master Products)
          </ConfigButton>
        </div>
      </div>

      <div className='mb-6'>
        <h2 className='text-lg font-semibold mb-2'>SFTP Configuration</h2>
        <ConfigButton onClick={() => console.log('Configure SFTP')}>Configure SFTP (IP, User, Password)</ConfigButton>
      </div>

      <div className='mb-6'>
        <h2 className='text-lg font-semibold mb-2'>Email Configuration</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          <ConfigButton onClick={() => console.log('Configure Email')}>
            Configure Email (Receive Excel Files)
          </ConfigButton>
          <ConfigButton onClick={() => console.log('Approve Email Addresses')}>Approved Email Addresses</ConfigButton>
        </div>
      </div>

      <div className='mb-6'>
        <h2 className='text-lg font-semibold mb-2'>Alert Configuration</h2>
        <ConfigButton onClick={() => console.log('Configure Alerts')}>
          Configure Alerts (Products without Homologation)
        </ConfigButton>
      </div>

      <button
        className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        onClick={handleSaveConfiguration}
      >
        Save Configuration
      </button>
    </div>
  )
}

export default function Page() {
  return <HomologationConfigurations />
}
