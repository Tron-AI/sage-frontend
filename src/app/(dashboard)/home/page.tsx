'use client'

import React, { useState } from 'react'
import { Calendar, AlertCircle, Clock, FileCheck, Users } from 'lucide-react'

const Dashboard = () => {
  const [selectedStat, setSelectedStat] = useState(null)
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    domain: '',
    product: '',
    user: ''
  })

  const inputClass =
    'mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200'

  const getStatusColor = status => {
    const colors = {
      Pending: 'text-yellow-600 bg-yellow-100',
      'In Progress': 'text-blue-600 bg-blue-100',
      Delayed: 'text-red-600 bg-red-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  const stats = [
    { title: 'New Submissions', count: 5, icon: FileCheck, color: 'bg-gradient-to-br from-green-400 to-green-600' },
    { title: 'Delayed Submissions', count: 20, icon: Clock, color: 'bg-gradient-to-br from-red-400 to-red-600' },
    { title: 'Total Submissions', count: 43, icon: Users, color: 'bg-gradient-to-br from-blue-400 to-blue-600' }
  ]

  const handleSearch = () => {
    console.log('Searching with params:', searchParams)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Main content */}
      <div className='p-4 sm:p-6 lg:p-8 space-y-8'>
        {/* Search bar */}
        <div className='bg-white p-6 rounded-xl shadow-lg space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
            {Object.entries({
              from: 'From',
              to: 'To',
              domain: 'Domain',
              product: 'Product',
              user: 'User'
            }).map(([key, label]) => (
              <div key={key}>
                <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>
                <div className='relative rounded-md shadow-sm'>
                  <input
                    type={['from', 'to'].includes(key) ? 'date' : 'text'}
                    className={inputClass}
                    value={searchParams[key]}
                    onChange={e => setSearchParams(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                  {['from', 'to'].includes(key) && (
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <Calendar className='h-5 w-5 text-gray-400' />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleSearch}
            className='bg-indigo-600 text-white px-6 py-2 rounded-md w-full sm:w-auto hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 transform hover:scale-105'
          >
            Search
          </button>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${
                stat.color
              } p-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 cursor-pointer ${
                selectedStat === index ? 'ring-4 ring-offset-2 ring-indigo-500' : ''
              }`}
              onClick={() => setSelectedStat(selectedStat === index ? null : index)}
            >
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-lg font-semibold text-white mb-2'>{stat.title}</h2>
                  <p className='text-3xl font-bold text-white'>{stat.count}</p>
                </div>
                <stat.icon className='h-12 w-12 text-white opacity-75' />
              </div>
            </div>
          ))}
        </div>

        {/* Tables */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {[
            {
              title: 'Last Submitted',
              headers: ['Date', 'Domain', 'User'],
              data: [
                ['01/09/2024', 'Domain1', 'User1'],
                ['02/09/2024', 'Domain2', 'User2'],
                ['03/09/2024', 'Domain3', 'User3']
              ]
            },
            {
              title: 'Alerts',
              headers: ['Alert', 'Date'],
              data: [
                ['Submission Error', '01/09/2024'],
                ['System Warning', '02/09/2024'],
                ['Server Downtime', '03/09/2024']
              ],
              icon: AlertCircle
            },
            {
              title: 'Delayed Records',
              headers: ['Date', 'Domain', 'Status'],
              data: [
                ['01/09/2024', 'Domain1', 'Pending'],
                ['02/09/2024', 'Domain2', 'In Progress'],
                ['03/09/2024', 'Domain3', 'Delayed']
              ]
            }
          ].map((table, index) => (
            <div
              key={index}
              className='bg-white p-6 rounded-xl shadow-lg overflow-hidden transform transition-all duration-200 hover:shadow-xl'
            >
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-lg font-semibold text-gray-800'>{table.title}</h2>
                {table.icon && <table.icon className='h-5 w-5 text-gray-500' />}
              </div>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      {table.headers.map((header, i) => (
                        <th
                          key={i}
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {table.data.map((row, rowIndex) => (
                      <tr key={rowIndex} className='hover:bg-gray-50 transition-colors duration-150'>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>
                            <p
                              className={`px-6  whitespace-nowrap ${
                                table.headers[cellIndex] === 'Status'
                                  ? `rounded-full ${getStatusColor(
                                      cell
                                    )} px-4 w-full p-2 text-center text-sm font-medium`
                                  : 'py-4 text-gray-900'
                              }`}
                            >
                              {cell}
                            </p>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return <Dashboard />
}
