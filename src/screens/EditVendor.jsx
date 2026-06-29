import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const EditVendor = ({ id: propId }) => {
  const navigate = useNavigate()
  const params = useParams()
  const id = propId || params.id
  
  const [formData, setFormData] = useState({
    vendorName: '',
    phone: '',
    email: '',
    address: {
      city: '',
      district: '',
      state: '',
      pincode: ''
    }
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch vendor data
  useEffect(() => {
    const fetchVendor = async () => {
      if (!id) {
        setError('Vendor ID is missing')
        setFetching(false)
        return
      }

      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/staff/viewAllVendor`,
          { headers: { token } }
        )
        
        if (response.data.status === 'SUCCESS') {
          const vendor = response.data.data.find(v => v._id === id)
          if (vendor) {
            setFormData({
              vendorName: vendor.vendorName || '',
              phone: vendor.phone || '',
              email: vendor.email || '',
              address: {
                city: vendor.address?.city || '',
                district: vendor.address?.district || '',
                state: vendor.address?.state || '',
                pincode: vendor.address?.pincode || ''
              }
            })
          } else {
            setError('Vendor not found')
          }
        } else {
          setError('Failed to fetch vendor data')
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching vendor')
      } finally {
        setFetching(false)
      }
    }

    fetchVendor()
  }, [id])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    if (error) setError('')
    if (success) setSuccess('')
  }

  // Validate form
  const validateForm = () => {
    if (!formData.vendorName.trim()) {
      setError('Vendor name is required')
      return false
    }
    if (formData.vendorName.length < 2) {
      setError('Vendor name must be at least 2 characters')
      return false
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required')
      return false
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number')
      return false
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
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
      const payload = {
        vendorName: formData.vendorName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        address: {
          city: formData.address.city.trim() || undefined,
          district: formData.address.district.trim() || undefined,
          state: formData.address.state.trim() || undefined,
          pincode: formData.address.pincode.trim() || undefined
        }
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/staff/editVendor/${id}`,
        payload,
        { headers: { token } }
      )

      if (response.data.status === 'SUCCESS') {
        setSuccess('Vendor updated successfully!')
        setTimeout(() => {
          navigate('/staffPanel/vendors')
        }, 1500)
      } else {
        setError(response.data.message || 'Failed to update vendor')
      }
    } catch (err) {
      if (err.response) {
        const message = err.response.data?.message || 'Failed to update vendor'
        if (err.response.status === 401) {
          setError('Session expired. Please login again.')
        } else if (err.response.status === 404) {
          setError('Vendor not found')
        } else if (err.response.status === 409) {
          setError('Vendor with this phone or email already exists')
        } else {
          setError(message)
        }
      } else if (err.request) {
        setError('Unable to connect to server. Please check your network.')
      } else {
        setError('Failed to update vendor. Please try again.')
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
        <span className="ml-3 text-[#998f82]">Loading vendor...</span>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate('/staffPanel/vendors')}
          className="text-[#c5b7a2] hover:text-[#c9a962] transition-colors duration-300 p-2 rounded-lg hover:bg-white/5"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-['Playfair_Display',serif] text-[#e8d5a3] font-semibold">
            Edit Vendor
          </h2>
          <p className="text-sm text-[#998f82] mt-1">
            Update vendor details
          </p>
          <p className="text-xs text-[#8b7355] mt-0.5">
            ID: {id}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white/5 border border-[#c9a962]/15 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Vendor Name */}
          <div>
            <label className="block text-sm font-medium text-[#e6dfd5] mb-1.5">
              Vendor Name *
            </label>
            <input
              type="text"
              name="vendorName"
              value={formData.vendorName}
              onChange={handleChange}
              placeholder="Enter vendor name"
              className="w-full px-4 py-2.5 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white placeholder-[#998f82]/50 focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
              required
            />
            <p className="text-[10px] text-[#8b7355]/70 mt-1.5 tracking-wide">
              Minimum 2 characters, maximum 100 characters
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#e6dfd5] mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              className="w-full px-4 py-2.5 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white placeholder-[#998f82]/50 focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
              required
            />
            <p className="text-[10px] text-[#8b7355]/70 mt-1.5 tracking-wide">
              Must be a valid 10-digit number
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#e6dfd5] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address (optional)"
              className="w-full px-4 py-2.5 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white placeholder-[#998f82]/50 focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
            />
          </div>

          {/* Address Section */}
          <div className="pt-2 border-t border-[#c9a962]/10">
            <p className="text-sm font-medium text-[#e6dfd5] mb-3">Address Details</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-[#e6dfd5] mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="w-full px-4 py-2.5 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white placeholder-[#998f82]/50 focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-[#e6dfd5] mb-1.5">
                  District
                </label>
                <input
                  type="text"
                  name="address.district"
                  value={formData.address.district}
                  onChange={handleChange}
                  placeholder="Enter district"
                  className="w-full px-4 py-2.5 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white placeholder-[#998f82]/50 focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-[#e6dfd5] mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className="w-full px-4 py-2.5 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white placeholder-[#998f82]/50 focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-[#e6dfd5] mb-1.5">
                  Pincode
                </label>
                <input
                  type="text"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  className="w-full px-4 py-2.5 bg-white/5 border border-[#c9a962]/15 rounded-xl text-white placeholder-[#998f82]/50 focus:outline-none focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20 transition-all duration-300"
                />
              </div>
            </div>
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
                'Update Vendor'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/staffPanel/vendors')}
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

export default EditVendor