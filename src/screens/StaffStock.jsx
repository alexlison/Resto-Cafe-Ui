import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const StaffStock = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterBrand, setFilterBrand] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [stockData, setStockData] = useState([])
  const [summary, setSummary] = useState(null)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  // Get base URL for images
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    // Remove leading slash if present and construct full URL
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    return `${import.meta.env.VITE_API_URL.replace('/api', '')}/${cleanPath}`
  }

  // Fetch stock data
  const fetchStockData = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/staff/viewStock`,
        { headers: { token } }
      )

      console.log('Full API Response:', response.data)

      if (response.data.status === 'SUCCESS') {
        const data = response.data.data
        const stockList = data.stockData || []
        const summaryData = data.summary || null
        
        setStockData(stockList)
        setSummary(summaryData)
        
        const uniqueCategories = [...new Set(stockList.map(item => item.categoryName))].filter(Boolean)
        const uniqueBrands = [...new Set(stockList.map(item => item.brandName))].filter(Boolean)
        setCategories(uniqueCategories)
        setBrands(uniqueBrands)
        
        console.log('Stock Data:', stockList)
        console.log('Summary:', summaryData)
      } else {
        setError(response.data.message || 'Failed to fetch stock data')
      }
    } catch (err) {
      console.error('Error fetching stock:', err)
      if (err.response) {
        setError(err.response.data?.message || 'Server error')
      } else if (err.request) {
        setError('Unable to connect to server. Please check your network.')
      } else {
        setError('Error fetching stock data')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStockData()
  }, [])

  // Filter stock data
  const filteredStock = stockData.filter(item => {
    const searchMatch = 
      item.ingredientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unit?.toLowerCase().includes(searchTerm.toLowerCase())

    const categoryMatch = filterCategory ? item.categoryName === filterCategory : true
    const brandMatch = filterBrand ? item.brandName === filterBrand : true
    const statusMatch = filterStatus ? item.stockStatus === filterStatus : true

    return searchMatch && categoryMatch && brandMatch && statusMatch
  })

  // Get status styling
  const getStatusBg = (status) => {
    const colors = {
      'In Stock': 'bg-green-500/10 border-green-500/30',
      'Low Stock': 'bg-yellow-500/10 border-yellow-500/30',
      'Out of Stock': 'bg-red-500/10 border-red-500/30'
    }
    return colors[status] || 'bg-gray-500/10 border-gray-500/30'
  }

  const getStatusDot = (status) => {
    const colors = {
      'In Stock': 'bg-green-400',
      'Low Stock': 'bg-yellow-400',
      'Out of Stock': 'bg-red-400'
    }
    return colors[status] || 'bg-gray-400'
  }

  const getStatusBorder = (status) => {
    const colors = {
      'In Stock': 'rgba(52, 211, 153, 0.2)',
      'Low Stock': 'rgba(234, 179, 8, 0.2)',
      'Out of Stock': 'rgba(239, 68, 68, 0.2)'
    }
    return colors[status] || 'rgba(255, 255, 255, 0.1)'
  }

  const getStatusGradient = (status) => {
    const colors = {
      'In Stock': 'linear-gradient(to bottom, #34d399, #10b981, #059669)',
      'Low Stock': 'linear-gradient(to bottom, #eab308, #ca8a04, #854d0e)',
      'Out of Stock': 'linear-gradient(to bottom, #ef4444, #dc2626, #b91c1c)'
    }
    return colors[status] || 'linear-gradient(to bottom, #6b7280, #4b5563, #374151)'
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-['Playfair_Display',serif] text-[#e8d5a3] font-semibold">
            Stock Management
          </h2>
          <p className="text-sm text-[#998f82] mt-1">
            Monitor your ingredient inventory levels
          </p>
        </div>
        <button
          type="button"
          onClick={fetchStockData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-[#c9a962]/20 text-[#c9a962] font-bold text-sm rounded-xl hover:bg-[#c9a962]/10 transition-all duration-300 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Summary Cards - Increased Width */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6  gap-4 mb-6  ">
          <div className="bg-white/5 border border-[#c9a962]/10 rounded-xl p-5  text-center">
            <p className="text-2xl font-bold text-[#e8d5a3]">{summary.totalIngredients || 0}</p>
            <p className="text-xs text-[#998f82] mt-1">Total Items</p>
          </div>
          <div className="bg-white/5 border border-green-500/20 rounded-xl p-5 text-center">
            <p className="text-2xl font-bold text-green-400">{summary.inStock || 0}</p>
            <p className="text-xs text-[#998f82] mt-1">In Stock</p>
          </div>
          <div className="bg-white/5 border border-yellow-500/20 rounded-xl p-5 text-center">
            <p className="text-2xl font-bold text-yellow-400">{summary.lowStock || 0}</p>
            <p className="text-xs text-[#998f82] mt-1">Low Stock</p>
          </div>
          <div className="bg-white/5 border border-red-500/20 rounded-xl p-5 text-center">
            <p className="text-2xl font-bold text-red-400">{summary.outOfStock || 0}</p>
            <p className="text-xs text-[#998f82] mt-1">Out of Stock</p>
          </div>
          <div className="bg-white/5 border border-[#c9a962]/10 rounded-xl p-5 text-center col-span-2 md:col-span-1">
            <p className="text-2xl font-bold text-[#e8d5a3]">{formatCurrency(summary.totalStockValue || 0)}</p>
            <p className="text-xs text-[#998f82] mt-1">Total Stock Value</p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name, category, brand or unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white placeholder-[#998f82]/50 focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300 min-w-[150px]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat} className="bg-black">{cat}</option>
          ))}
        </select>

        <select
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300 min-w-[150px]"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand} className="bg-black">{brand}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300 min-w-[150px]"
        >
          <option value="">All Status</option>
          <option value="In Stock" className="bg-black">In Stock</option>
          <option value="Low Stock" className="bg-black">Low Stock</option>
          <option value="Out of Stock" className="bg-black">Out of Stock</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="ml-3 text-[#998f82]">Loading stock data...</span>
        </div>
      ) : filteredStock.length === 0 ? (
        <div className="text-center py-12 text-[#998f82]">
          {searchTerm || filterCategory || filterBrand || filterStatus 
            ? 'No stock items match your filters' 
            : 'No stock data available'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStock.map((item) => {
            const imageUrl = getImageUrl(item.ingredientImage)
            
            return (
              <div
                key={item._id}
                className="group relative bg-white/5 border rounded-xl p-5 transition-all duration-300 hover:bg-white/10 w-full overflow-hidden"
                style={{
                  borderColor: getStatusBorder(item.stockStatus)
                }}
              >
                {/* Left Border Accent */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all duration-300"
                  style={{
                    background: getStatusGradient(item.stockStatus),
                    opacity: 0.7,
                  }}
                ></div>

                {/* Content */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 pl-4">
                  {/* Image - Left Side */}
                  <div className="flex-shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.ingredientName}
                        className="w-16 h-16 rounded-xl object-cover border border-[#c9a962]/20"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = `
                            <div class="w-16 h-16 rounded-xl bg-white/5 border border-[#c9a962]/10 flex items-center justify-center text-2xl text-[#8b7355]">
                              🥫
                            </div>
                          `
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-white/5 border border-[#c9a962]/10 flex items-center justify-center text-2xl text-[#8b7355]">
                        🥫
                      </div>
                    )}
                  </div>

                  {/* Info - Middle */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-['Playfair_Display',serif] text-white font-semibold">
                        {item.ingredientName}
                      </h3>
                      
                      {/* Status Badge */}
                      <span className={`text-xs font-medium px-3 py-0.5 rounded-full border inline-flex items-center whitespace-nowrap ${getStatusBg(item.stockStatus)}`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0 ${getStatusDot(item.stockStatus)}`}></span>
                        {item.stockStatus}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 min-h-[24px]">
                      {/* Category */}
                      <span className="text-sm text-[#998f82] flex items-center gap-2 group-hover:text-[#c5b7a2] transition-colors duration-300">
                        <svg className="w-4 h-4 text-[#8b7355] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="7" height="7" rx="1" />
                          <rect x="14" y="3" width="7" height="7" rx="1" />
                          <rect x="3" y="14" width="7" height="7" rx="1" />
                          <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                        <span className="break-words">{item.categoryName}</span>
                      </span>

                      {/* Brand */}
                      <span className="text-sm text-[#998f82] flex items-center gap-2 group-hover:text-[#c5b7a2] transition-colors duration-300">
                        <svg className="w-4 h-4 text-[#8b7355] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M3.82 10.82a1.72 1.72 0 0 0 0 2.44l7 7a1.72 1.72 0 0 0 2.44 0l7.46-7.46A1.72 1.72 0 0 0 21 11.59V4a2 2 0 0 0-2-2h-7.59a1.72 1.72 0 0 0-1.23.51l-6.35 6.31zM16 8h.01" />
                        </svg>
                        <span className="break-words">{item.brandName}</span>
                      </span>

                      {/* Unit & Quantity */}
                      <span className="text-sm text-[#998f82] flex items-center gap-2 group-hover:text-[#c5b7a2] transition-colors duration-300">
                        <svg className="w-4 h-4 text-[#8b7355] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2v4M12 22v-4M4 12H2M22 12h-2M19.07 4.93l-2.83 2.83M6.34 17.66l-2.83 2.83M17.66 17.66l2.83 2.83M4.93 4.93l2.83 2.83" />
                          <circle cx="12" cy="12" r="4" />
                        </svg>
                        <span className="break-words">{item.totalQuantity} {item.unit}</span>
                      </span>

                      {/* Cost Price */}
                      <span className="text-sm text-[#998f82] flex items-center gap-2 group-hover:text-[#c5b7a2] transition-colors duration-300">
                        <svg className="w-4 h-4 text-[#8b7355] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        <span className="break-words">₹{item.costPrice} / {item.unit}</span>
                      </span>
                    </div>

                    {/* Timestamp */}
                    <p className="text-xs text-[#8b7355] mt-2">
                      Last Updated: {new Date(item.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Right - Total Cost */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <p className="text-sm text-[#8b7355]">Total Value</p>
                    <p className={`text-lg font-bold ${
                      item.stockStatus === 'Out of Stock' ? 'text-red-400' : 
                      item.stockStatus === 'Low Stock' ? 'text-yellow-400' : 
                      'text-green-400'
                    }`}>
                      {formatCurrency(item.totalCost)}
                    </p>
                    {item.batches && item.batches.length > 0 && (
                      <p className="text-xs text-[#8b7355]">
                        {item.batches.length} batch{item.batches.length > 1 ? 'es' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StaffStock;