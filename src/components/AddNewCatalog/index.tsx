import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Upload, X, FileSpreadsheet, Building2, Database, Clock, Settings } from 'lucide-react'
import 'react-datepicker/dist/react-datepicker.css'
import CreatableSelect from 'react-select/creatable'
import axios from 'axios'
import Select from 'react-select'

const predefinedTags = [
  { value: 'sales', label: 'Sales' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'customer', label: 'Customer' },
  { value: 'product', label: 'Product' },
  { value: 'financial', label: 'Financial' }
]

const AddNewCatalog = ({ onDefineFields }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [userError, setUserError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  const [iconPreview, setIconPreview] = useState(null)
  const [deadline, setDeadline] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])
  const [formData, setFormData] = useState({
    catalogName: '',
    tags: '',
    corporate: '',
    responsibleUser: '',
    menu: '',
    product: '',
    domain: '',
    description: '',
    mandatory: 'Is Mandatory',
    frequency: 'Daily',
    apiKey: '',
    submissionEmail: '',
    authorizedEmails: '',
    sftpFolder: ''
  })

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleIconChange = e => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setIconPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setIconPreview(null)
    }
  }

  const removeIcon = () => {
    setIconPreview(null)
  }

  // const handleDefineFields = () => {
  //   onDefineFields({
  //     ...formData,
  //     icon: iconPreview,
  //     deadline: deadline
  //   })
  // }

  const handleTagChange = newValue => {
    setSelectedTags(newValue)
    setFormData(prev => ({
      ...prev,
      tags: newValue.map(tag => tag.value).join(',')
    }))
  }

  const inputClasses =
    'w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200'

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '42px',
      borderColor: state.isFocused ? '#60A5FA' : '#D1D5DB',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(96, 165, 250, 0.2)' : 'none',
      '&:hover': {
        borderColor: '#60A5FA'
      }
    }),
    multiValue: base => ({
      ...base,
      backgroundColor: '#EFF6FF',
      borderRadius: '6px',
      padding: '2px'
    }),
    multiValueLabel: base => ({
      ...base,
      color: '#2563EB',
      fontSize: '0.875rem'
    }),
    multiValueRemove: base => ({
      ...base,
      color: '#2563EB',
      ':hover': {
        backgroundColor: '#DBEAFE',
        color: '#1E40AF'
      }
    })
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      catalogName: '',
      tags: '',
      corporate: '',
      responsibleUser: '',
      menu: '',
      product: '',
      domain: '',
      description: '',
      mandatory: 'Is Mandatory',
      frequency: 'Daily',
      apiKey: '',
      submissionEmail: '',
      authorizedEmails: '',
      sftpFolder: ''
    })
    setSelectedTags([])
    setIconPreview(null)
    setDeadline(null)
    setError(null)
  }

  const handleDefineFields = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // First create the schema to get the ID
      // const productId = await handleSchemaSubmit()

      onDefineFields(true)

      // Then call the onDefineFields with the product ID
      // onDefineFields({
      //   ...formData,
      //   // productId,
      //   icon: iconPreview,
      //   deadline: deadline,
      //   tags: selectedTags
      // })
    } catch (err) {
      setError('Failed to define schema fields. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async e => {
    debugger
    e.preventDefault()
    const errors = validateForm()

    if (Object.keys(errors).length > 0) {
      setError('Please fix the form errors before submitting.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // First create the schema
      const productId = await handleSchemaSubmit()

      // Prepare catalog data
      const catalogFormData = new FormData()
      catalogFormData.append('product_id', productId)
      catalogFormData.append('catalog_name', formData.catalogName)
      catalogFormData.append('corporate', formData.corporate)
      catalogFormData.append('responsible_user', formData.responsibleUser)
      catalogFormData.append('menu', formData.menu)
      catalogFormData.append('mandatory', formData.mandatory)
      catalogFormData.append('frequency', formData.frequency)
      catalogFormData.append('deadline', deadline ? deadline.toISOString().split('T')[0] : '')
      catalogFormData.append('api_key', formData.apiKey)
      catalogFormData.append('submission_email', formData.submissionEmail)
      catalogFormData.append('authorized_emails', formData.authorizedEmails)
      catalogFormData.append('sftp_folder', formData.sftpFolder)
      catalogFormData.append('tags', JSON.stringify(selectedTags.map(tag => tag.value)))

      // Handle icon file
      if (iconPreview) {
        // Convert base64 to file
        const iconBlob = await fetch(iconPreview).then(r => r.blob())
        catalogFormData.append('icon', iconBlob, 'icon.png')
      }

      // Create catalog
      const response = await axios.post('http://127.0.0.1:8000/api/catalog/create/', catalogFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.status === 'success') {
        // router.push('/catalogs') // Redirect to catalogs list
      } else {
        throw new Error(response.data.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create catalog. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSchemaSubmit = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const schemaData = {
        schema_name: formData.product,
        domain: formData.domain,
        description: formData.description
      }
      const url = 'http://127.0.0.1:8000/api/schema/create/'

      const response = await axios.post(url, schemaData)

      return response.data.product_id
    } catch (err) {
      setError('Failed to create schema. Please try again.')
      throw err
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.catalogName.trim()) {
      errors.catalogName = 'Catalog name is required'
    }

    if (!formData.product.trim()) {
      errors.product = 'Schema name is required'
    }

    if (!formData.domain.trim()) {
      errors.domain = 'Domain is required'
    }

    if (formData.submissionEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.submissionEmail)) {
      errors.submissionEmail = 'Invalid email format'
    }

    // Validate authorized emails
    if (formData.authorizedEmails) {
      const emails = formData.authorizedEmails.split('\n')
      const invalidEmails = emails.filter(email => email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      if (invalidEmails.length > 0) {
        errors.authorizedEmails = 'Some emails are invalid'
      }
    }

    return errors
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/accounts/users/`)
      return response.data.users
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  useEffect(() => {
    const getUsers = async () => {
      setIsLoadingUsers(true)
      setUserError(null)
      try {
        const fetchedUsers = await fetchUsers()
        debugger
        const userOptions = fetchedUsers.map(user => ({
          value: user.id,
          label: `${user.username} (${user.email})`,
          user: user // Store full user object if needed
        }))
        setUsers(userOptions)
      } catch (error) {
        setUserError('Failed to load users')
        console.error('Error loading users:', error)
      } finally {
        setIsLoadingUsers(false)
      }
    }

    getUsers()
  }, [])

  const handleUserChange = selectedOption => {
    setSelectedUser(selectedOption)
    setFormData(prev => ({
      ...prev,
      responsibleUser: selectedOption ? selectedOption.value : ''
    }))
  }

  const userSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '42px',
      borderColor: state.isFocused ? '#60A5FA' : '#D1D5DB',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(96, 165, 250, 0.2)' : 'none',
      '&:hover': {
        borderColor: '#60A5FA'
      }
    }),
    option: (base, { isSelected, isFocused }) => ({
      ...base,
      backgroundColor: isSelected ? '#3B82F6' : isFocused ? '#DBEAFE' : 'transparent',
      color: isSelected ? 'white' : '#374151',
      ':active': {
        backgroundColor: '#2563EB'
      }
    })
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8'>
      <div className='max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden'>
        <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center gap-3'>
          <FileSpreadsheet className='w-8 h-8 text-white' />
          <h1 className='text-2xl font-bold text-white'>Add New Catalog</h1>
        </div>

        {/* Add error message display */}
        {error && <div className='p-4 mb-4 text-red-700 bg-red-100 rounded-lg'>{error}</div>}

        <form onSubmit={handleSubmit} className='p-6 space-y-8'>
          {/* Catalog Information */}
          <div className='space-y-6'>
            <div className='flex items-center gap-2 pb-2 border-b border-gray-200'>
              <Building2 className='w-6 h-6 text-blue-500' />
              <h2 className='text-lg font-semibold text-blue-600'>Catalog Information</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Catalog Name</label>
                <input
                  type='text'
                  name='catalogName'
                  value={formData.catalogName}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Icon</label>
                <div className='mt-1 flex items-center'>
                  {iconPreview ? (
                    <div className='relative inline-block'>
                      <img
                        src={iconPreview}
                        alt='Icon preview'
                        className='h-16 w-16 object-cover rounded-lg shadow-md'
                      />
                      <button
                        type='button'
                        onClick={removeIcon}
                        className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg'
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className='flex items-center justify-center h-16 w-16 border-2 border-blue-300 border-dashed rounded-lg bg-blue-50'>
                      <Upload className='h-8 w-8 text-blue-400' />
                    </div>
                  )}
                  <label
                    htmlFor='icon-upload'
                    className='ml-5 bg-blue-500 py-2 px-4 rounded-lg shadow-md text-white text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer'
                  >
                    Select Image
                  </label>
                  <input
                    id='icon-upload'
                    name='icon'
                    type='file'
                    className='sr-only'
                    accept='image/*'
                    onChange={handleIconChange}
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Tags</label>
                <CreatableSelect
                  isMulti
                  options={predefinedTags}
                  value={selectedTags}
                  onChange={handleTagChange}
                  styles={customStyles}
                  placeholder='Select or create tags...'
                  className='react-select-container'
                  classNamePrefix='react-select'
                  theme={theme => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: '#3B82F6',
                      primary25: '#DBEAFE',
                      primary50: '#BFDBFE'
                    }
                  })}
                />
                <p className='mt-1 text-sm text-gray-500'>
                  You can select existing tags or create new ones by typing and pressing enter
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Corporate</label>
                <input
                  type='text'
                  name='corporate'
                  value={formData.corporate}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Responsible User</label>
                <Select
                  value={selectedUser}
                  onChange={handleUserChange}
                  options={users}
                  isLoading={isLoadingUsers}
                  isDisabled={isLoadingUsers}
                  styles={userSelectStyles}
                  placeholder='Select responsible user...'
                  noOptionsMessage={() => userError || 'No users available'}
                  isClearable
                  className='react-select-container'
                  classNamePrefix='react-select'
                />
                {userError && <p className='mt-1 text-sm text-red-600'>{userError}</p>}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Menu</label>
                <input
                  type='text'
                  name='menu'
                  value={formData.menu}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Schema Information */}
          <div className='space-y-6'>
            <div className='flex items-center gap-2 pb-2 border-b border-gray-200'>
              <Database className='w-6 h-6 text-purple-500' />
              <h2 className='text-lg font-semibold text-purple-600'>Schema Information</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Schema Name</label>
                <input
                  type='text'
                  name='product'
                  value={formData.product}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Domain</label>
                <input
                  type='text'
                  name='domain'
                  value={formData.domain}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  rows='3'
                  className={inputClasses}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Submission Details */}
          <div className='space-y-6'>
            <div className='flex items-center gap-2 pb-2 border-b border-gray-200'>
              <Clock className='w-6 h-6 text-green-500' />
              <h2 className='text-lg font-semibold text-green-600'>Submission Details</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Mandatory</label>
                <select
                  name='mandatory'
                  value={formData.mandatory}
                  onChange={handleInputChange}
                  className={inputClasses}
                >
                  <option>Is Mandatory</option>
                  <option>Not Mandatory</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Frequency</label>
                <select
                  name='frequency'
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className={inputClasses}
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Deadline</label>
                <DatePicker
                  selected={deadline}
                  onChange={(date: any) => setDeadline(date)}
                  className={inputClasses}
                  placeholderText='Select deadline'
                  dateFormat='dd/MM/yyyy'
                />
              </div>
            </div>
          </div>

          {/* API & Submission Settings */}
          <div className='space-y-6'>
            <div className='flex items-center gap-2 pb-2 border-b border-gray-200'>
              <Settings className='w-6 h-6 text-orange-500' />
              <h2 className='text-lg font-semibold text-orange-600'>API & Submission Settings</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>API Key</label>
                <input
                  type='text'
                  name='apiKey'
                  value={formData.apiKey}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Submission Email</label>
                <input
                  type='email'
                  name='submissionEmail'
                  value={formData.submissionEmail}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Authorized Emails</label>
                <textarea
                  name='authorizedEmails'
                  value={formData.authorizedEmails}
                  onChange={handleInputChange}
                  rows='3'
                  className={inputClasses}
                ></textarea>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>SFTP Folder</label>
                <input
                  type='text'
                  name='sftpFolder'
                  value={formData.sftpFolder}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex justify-start space-x-4 pt-6'>
            <button
              type='button'
              onClick={handleDefineFields}
              disabled={isLoading}
              className='px-6 py-3 rounded-lg shadow-lg text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition-colors duration-200 disabled:opacity-50'
            >
              {isLoading ? 'Processing...' : 'Define Schema Fields'}
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='px-6 py-3 rounded-lg shadow-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50'
            >
              {isLoading ? 'Saving...' : 'Save Catalog'}
            </button>
            <button
              type='button'
              onClick={resetForm}
              disabled={isLoading}
              className='px-6 py-3 rounded-lg shadow-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50'
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddNewCatalog
