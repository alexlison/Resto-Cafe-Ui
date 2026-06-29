import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const EditCategory = ({ id: propId }) => {
  const navigate = useNavigate()
  const params = useParams()
  // Use prop if passed, otherwise use params
  const id = propId || params.id
  
  const [formData, setFormData] = useState({
    categoryName: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) {
        setError('Category ID is missing')
        setFetching(false)
        return
      }
      
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/staff/viewAllCategory`,
          { headers: { token } }
        )
        
        if (response.data.status === 'SUCCESS') {
          const category = response.data.data.find(c => c._id === id)
          if (category) {
            setFormData({
              categoryName: category.categoryName || '',
              description: category.description || ''
            })
          } else {
            setError('Category not found')
          }
        } else {
          setError('Failed to fetch category data')
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching category')
      } finally {
        setFetching(false)
      }
    }

    fetchCategory()
  }, [id])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
    if (success) setSuccess('')
  }

  // Validate form
  const validateForm = () => {
    if (!formData.categoryName.trim()) {
      setError('Category name is required')
      return false
    }
    if (formData.categoryName.length < 2) {
      setError('Category name must be at least 2 characters')
      return false
    }
    return true
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/staff/editCategory/${id}`,
        {
          categoryName: formData.categoryName.trim(),
          description: formData.description.trim()
        },
        { headers: { token } }
      )

      if (response.data.status === 'SUCCESS') {
        setSuccess('Category updated successfully!')
        setTimeout(() => {
          navigate('/staffPanel/categories')
        }, 1500)
      } else {
        setError(response.data.message || 'Failed to update category')
      }
    } catch (err) {
      if (err.response) {
        const message = err.response.data?.message || 'Failed to update category'
        if (err.response.status === 401) {
          setError('Session expired. Please login again.')
        } else if (err.response.status === 404) {
          setError('Category not found')
        } else {
          setError(message)
        }
      } else if (err.request) {
        setError('Unable to connect to server. Please check your network.')
      } else {
        setError('Failed to update category. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="ml-3 text-[#998f82]">Loading category...</span>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate('/staffPanel/categories')}
          className="text-[#c5b7a2] hover:text-[#c9a962] transition-colors duration-300 p-2 rounded-lg hover:bg-white/5"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-['Playfair_Display',serif] text-[#e8d5a3] font-semibold">
            Edit Category
          </h2>
          <p className="text-sm text-[#998f82] mt-1">
            Update category details
          </p>
          <p className="text-xs text-[#8b7355] mt-0.5">
            ID: {id}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white/5 border border-[#c9a962]/15 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-[#e6dfd5] mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              placeholder="Enter category name"
              className="w-full px-4 py-2.5 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white placeholder-[#998f82]/50 focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
              required
            />
            <p className="text-[10px] text-[#8b7355]/70 mt-1.5 tracking-wide">
              Minimum 2 characters, maximum 50 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#e6dfd5] mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description (optional)"
              rows="4"
              className="w-full px-4 py-2.5 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white placeholder-[#998f82]/50 focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300 resize-none"
            />
            <p className="text-[10px] text-[#8b7355]/70 mt-1.5 tracking-wide">
              Maximum 200 characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-[#c9a962] to-[#9a7b4f] text-[#0a0805] font-bold rounded-xl hover:shadow-lg hover:shadow-[#c9a962]/25 transition-all duration-300 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating...
                </div>
              ) : (
                'Update Category'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/staffPanel/categories')}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[#998f82] hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditCategory