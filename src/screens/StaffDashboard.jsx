import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StaffPanel from './StaffPanel'

const StaffDashboard = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in and is staff
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (!token || !user) {
      navigate('/login', { replace: true })
      return
    }

    try {
      const userData = JSON.parse(user)
      if (userData.role !== 'staff') {
        navigate('/dashboard', { replace: true })
      }
    } catch {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  return <StaffPanel />
}

export default StaffDashboard