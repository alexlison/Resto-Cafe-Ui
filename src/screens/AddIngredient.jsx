import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AddIngredient = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingSubcategories, setLoadingSubcategories] = useState(false)
  const [loadingBrands, setLoadingBrands] = useState(true)
  
  const [formData, setFormData] = useState({
    ingredientName: '',
    categoryId: '',
    subCategoryId: '',
    brandId: '',
    unit: '',
    costPrice: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  // Fetch categories (only active ones)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/staff/viewAllCategory`,
          { headers: { token } }
        )
        if (response.data.status === 'SUCCESS') {
          const activeCategories = response.data.data.filter(cat => cat.isActive === true)
          setCategories(activeCategories)
        }
      } catch (err) {
        setError('Failed to load categories')
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  // Fetch brands (only active ones)
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/staff/viewAllBrand`,
          { headers: { token } }
        )
        if (response.data.status === 'SUCCESS') {
          const activeBrands = response.data.data.filter(brand => brand.isActive === true)
          setBrands(activeBrands)
        }
      } catch (err) {
        setError('Failed to load brands')
      } finally {
        setLoadingBrands(false)
      }
    }
    fetchBrands()
  }, [])

  // Fetch subcategories based on selected category (only active ones)
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!formData.categoryId) {
        setSubcategories([])
        return
      }

      setLoadingSubcategories(true)
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/staff/viewAllSubCategory`,
          { headers: { token } }
        )
        if (response.data.status === 'SUCCESS') {
          // Filter subcategories by categoryId and only active ones
          const filteredSubcategories = response.data.data.filter(
            sub => sub.categoryId?._id === formData.categoryId && sub.isActive === true
          )
          setSubcategories(filteredSubcategories)
        }
      } catch (err) {
        setError('Failed to load subcategories')
      } finally {
        setLoadingSubcategories(false)
      }
    }

    fetchSubcategories()
  }, [formData.categoryId])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
    if (success) setSuccess('')
    
    // Reset subcategory when category changes
    if (name === 'categoryId') {
      setFormData(prev => ({ ...prev, subCategoryId: '' }))
    }
  }

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB')
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Validate form
  const validateForm = () => {
    if (!formData.ingredientName.trim()) {
      setError('Ingredient name is required')
      return false
    }
    if (formData.ingredientName.length < 2) {
      setError('Ingredient name must be at least 2 characters')
      return false
    }
    if (!formData.categoryId) {
      setError('Please select a category')
      return false
    }
    if (!formData.brandId) {
      setError('Please select a brand')
      return false
    }
    if (!formData.unit) {
      setError('Please select a unit')
      return false
    }
    if (!formData.costPrice || parseFloat(formData.costPrice) <= 0) {
      setError('Please enter a valid cost price')
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
      
      // Create FormData for multipart/form-data (for image upload)
      const formDataToSend = new FormData()
      formDataToSend.append('ingredientName', formData.ingredientName.trim())
      formDataToSend.append('categoryId', formData.categoryId)
      if (formData.subCategoryId) {
        formDataToSend.append('subCategoryId', formData.subCategoryId)
      }
      formDataToSend.append('brandId', formData.brandId)
      formDataToSend.append('unit', formData.unit)
      formDataToSend.append('costPrice', formData.costPrice)
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/staff/addIngredient`,
        formDataToSend,
        { 
          headers: { 
            token,
            'Content-Type': 'multipart/form-data'
          } 
        }
      )

      if (response.data.status === 'SUCCESS') {
        setSuccess('Ingredient added successfully!')
        setFormData({
          ingredientName: '',
          categoryId: '',
          subCategoryId: '',
          brandId: '',
          unit: '',
          costPrice: ''
        })
        setImageFile(null)
        setImagePreview('')
        setTimeout(() => {
          navigate('/staffPanel/ingredients')
        }, 1500)
      } else {
        setError(response.data.message || 'Failed to add ingredient')
      }
    } catch (err) {
      if (err.response) {
        const message = err.response.data?.message || 'Failed to add ingredient'
        if (err.response.status === 401) {
          setError('Session expired. Please login again.')
        } else if (err.response.status === 404) {
          setError('Category, Subcategory or Brand not found')
        } else if (err.response.status === 409) {
          setError('Ingredient already exists')
        } else {
          setError(message)
        }
      } else if (err.request) {
        setError('Unable to connect to server. Please check your network.')
      } else {
        setError('Failed to add ingredient. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Unit options
  const unitOptions = [
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'g', label: 'Gram (g)' },
    { value: 'ltr', label: 'Litre (ltr)' },
    { value: 'ml', label: 'Millilitre (ml)' },
    { value: 'pcs', label: 'Pieces (pcs)' }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate('/staffPanel/ingredients')}
          className="text-[#c5b7a2] hover:text-[#c9a962] transition-colors duration-300 p-2 rounded-lg hover:bg-white/5"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-['Playfair_Display',serif] text-[#e8d5a3] font-semibold">
            Add Ingredient
          </h2>
          <p className="text-sm text-[#998f82] mt-1">
            Add a new inventory ingredient
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white/5 border border-[#c9a962]/15 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Ingredient Name */}
          <div>
            <label className="block text-sm font-medium text-[#e6dfd5] mb-1.5">
              Ingredient Name *
            </label>
            <input
              type="text"
              name="ingredientName"
              value={formData.ingredientName}
              onChange={handleChange}
              placeholder="Enter ingredient name"
              className="w-full px-4 py-2.5 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white placeholder-[#998f82]/50 focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
              required
            />
            <p className="text-[10px] text-[#8b7355]/70 mt-1.5 tracking-wide">
              Minimum 2 characters, maximum 50 characters
            </p>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-[#e6dfd5] mb-1.5">
              Category *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
              required
            >
              <option value="" className="bg-black">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id} className="bg-black/80">
                  {category.categoryName}
                </option>
              ))}
            </select>
            {loadingCategories && (
              <p className="text-xs text-[#8b7355] mt-1">Loading categories...</p>
            )}
            {categories.length === 0 && !loadingCategories && (
              <p className="text-xs text-[#c9a962] mt-1">
                No active categories available. Please create a category first.
              </p>
            )}
          </div>

          {/* Subcategory Selection - Dynamically loaded */}
          <div>
            <label className="block text-sm font-medium text-[#e6dfd5] mb-1.5">
              Subcategory
            </label>
            <select
              name="subCategoryId"
              value={formData.subCategoryId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
            >
              <option value="" className="bg-black">None (Optional)</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id} className="bg-black/80">
                  {subcategory.subCategoryName}
                </option>
              ))}
            </select>
            {loadingSubcategories && (
              <p className="text-xs text-[#8b7355] mt-1">Loading subcategories...</p>
            )}
            {formData.categoryId && subcategories.length === 0 && !loadingSubcategories && (
              <p className="text-xs text-[#8b7355] mt-1">
                No active subcategories available for this category.
              </p>
            )}
          </div>

          {/* Brand Selection */}
          <div>
            <label className="block text-sm font-medium text-[#e6dfd5] mb-1.5">
              Brand *
            </label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
              required
            >
              <option value="" className="bg-black">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id} className="bg-black/80">
                  {brand.brandName}
                </option>
              ))}
            </select>
            {loadingBrands && (
              <p className="text-xs text-[#8b7355] mt-1">Loading brands...</p>
            )}
            {brands.length === 0 && !loadingBrands && (
              <p className="text-xs text-[#c9a962] mt-1">
                No active brands available. Please create a brand first.
              </p>
            )}
          </div>

          {/* Unit Selection */}
          <div>
            <label className="block text-sm font-medium text-[#e6dfd5] mb-1.5">
              Unit *
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
              required
            >
              <option value="" className="bg-black">Select a unit</option>
              {unitOptions.map((unit) => (
                <option key={unit.value} value={unit.value} className="bg-black/80">
                  {unit.label}
                </option>
              ))}
            </select>
          </div>

          {/* Cost Price */}
          <div>
            <label className="block text-sm font-medium text-[#e6dfd5] mb-1.5">
              Cost Price (₹) *
            </label>
            <input
              type="number"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleChange}
              placeholder="Enter cost price"
              min="0"
              step="0.01"
              className="w-full px-4 py-2.5 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white placeholder-[#998f82]/50 focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
              required
            />
            <p className="text-[10px] text-[#8b7355]/70 mt-1.5 tracking-wide">
              Must be greater than 0
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[#e6dfd5] mb-1.5">
              Ingredient Image
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white placeholder-[#998f82]/50 focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#c9a962]/20 file:text-[#c9a962] file:cursor-pointer hover:file:bg-[#c9a962]/30"
              />
              {imagePreview && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#c9a962]/30 flex-shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview('')
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <p className="text-[10px] text-[#8b7355]/70 mt-1.5 tracking-wide">
              Maximum file size: 2MB. Supported formats: JPG, PNG, GIF
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
                  Adding...
                </div>
              ) : (
                'Add Ingredient'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/staffPanel/ingredients')}
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

export default AddIngredient