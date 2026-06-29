import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const StaffSubcategories = () => {
  const navigate = useNavigate()
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [togglingId, setTogglingId] = useState(null)

  // Fetch subcategories
  const fetchSubcategories = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/staff/viewAllSubCategory`,
        { headers: { token } }
      )
      if (response.data.status === 'SUCCESS') {
        setSubcategories(response.data.data || [])
      } else {
        setError(response.data.message || 'Failed to fetch subcategories')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching subcategories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubcategories()
  }, [])

  // Toggle subcategory status
  const handleToggleStatus = async (id) => {
    setTogglingId(id)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/staff/toggleSubCategoryStatus/${id}`,
        {},
        { headers: { token } }
      )

      if (response.data.status === 'SUCCESS') {
        setSubcategories(subcategories.map(sub => 
          sub._id === id ? { ...sub, isActive: !sub.isActive } : sub
        ))
      } else {
        setError(response.data.message || 'Failed to toggle subcategory status')
      }
    } catch (err) {
      if (err.response) {
        const message = err.response.data?.message || 'Failed to toggle status'
        if (err.response.status === 401) {
          setError('Session expired. Please login again.')
        } else if (err.response.status === 404) {
          setError('Subcategory not found')
        } else {
          setError(message)
        }
      } else if (err.request) {
        setError('Unable to connect to server. Please check your network.')
      } else {
        setError('Failed to toggle subcategory status. Please try again.')
      }
    } finally {
      setTogglingId(null)
    }
  }

  // Filter subcategories
  const filteredSubcategories = subcategories.filter(sub => 
    sub.subCategoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.categoryId?.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Navigate to Add Subcategory
  const handleAddSubcategory = () => {
    navigate('/staffPanel/subcategories/add')
  }

  // Navigate to Edit Subcategory
  const handleEditSubcategory = (id) => {
    navigate(`/staffPanel/subcategories/edit/${id}`)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-['Playfair_Display',serif] text-[#e8d5a3] font-semibold">
            Subcategories
          </h2>
          <p className="text-sm text-[#998f82] mt-1">
            Manage your menu subcategories
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddSubcategory}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#c9a962] to-[#9a7b4f] text-[#0a0805] font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-[#c9a962]/25 transition-all duration-300 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Subcategory
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search subcategories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white placeholder-[#998f82]/50 focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
        />
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
          <span className="ml-3 text-[#998f82]">Loading subcategories...</span>
        </div>
      ) : filteredSubcategories.length === 0 ? (
        <div className="text-center py-12 text-[#998f82]">
          {searchTerm ? 'No subcategories match your search' : 'No subcategories found. Create your first subcategory!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubcategories.map((subcategory) => (
            <div
              key={subcategory._id}
              className="group relative bg-white/5 border border-[#c9a962]/10 rounded-xl p-5 hover:border-[#c9a962]/30 transition-all duration-300 hover:bg-white/10"
            >
              {/* Status Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  subcategory.isActive 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {subcategory.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Subcategory Name */}
              <h3 className="text-lg font-['Playfair_Display',serif] text-white font-semibold pr-20">
                {subcategory.subCategoryName}
              </h3>

              {/* Category Name */}
              {subcategory.categoryId && (
                <p className="text-xs text-[#c9a962] mt-1">
                  Category: {subcategory.categoryId.categoryName}
                </p>
              )}

              {/* Description */}
              {subcategory.description && (
                <p className="text-sm text-[#998f82] mt-1 line-clamp-2">
                  {subcategory.description}
                </p>
              )}

              {/* Timestamp */}
              <p className="text-xs text-[#8b7355] mt-3">
                {new Date(subcategory.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[#c9a962]/10">
                {/* Toggle Status Button */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(subcategory._id)}
                  disabled={togglingId === subcategory._id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 cursor-pointer ${
                    subcategory.isActive
                      ? 'text-[#c9a962] hover:bg-[#c9a962]/10 border border-[#c9a962]/20'
                      : 'text-[#998f82] hover:bg-white/5 border border-white/10'
                  }`}
                >
                  {togglingId === subcategory._id ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="6" width="20" height="12" rx="6" />
                      <circle cx={subcategory.isActive ? "16" : "8"} cy="12" r="4" />
                    </svg>
                  )}
                  {subcategory.isActive ? 'Deactivate' : 'Activate'}
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleEditSubcategory(subcategory._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#c9a962] hover:bg-[#c9a962]/10 rounded-lg border border-[#c9a962]/20 transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StaffSubcategories