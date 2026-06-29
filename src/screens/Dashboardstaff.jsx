import { useState, useEffect } from 'react'

const QuickAction = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-[#c9a962]/10 rounded-xl hover:border-[#c9a962]/30 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
  >
    <span className="text-[#c9a962] group-hover:scale-110 transition-transform duration-300">{icon}</span>
    <span className="text-[#c5b7a2] text-xs font-medium text-center leading-tight">{label}</span>
  </button>
)

const DashboardStaff = ({ onNavigate }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [staffName, setStaffName] = useState('Staff Member')
  const [time, setTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        setCurrentUser(user)
        
        // Extract name from user data based on role
        let name = 'Staff Member'
        
        if (user.role === 'staff' && user.staff) {
          name = user.staff.name || 'Staff Member'
        } else if (user.role === 'manager' && user.manager) {
          name = user.manager.name || 'Manager'
        } else if (user.role === 'admin' && user.admin) {
          name = user.admin.name || 'Admin'
        } else if (user.name) {
          name = user.name
        } else if (user.email) {
          name = user.email.split('@')[0]
        }
        
        setStaffName(name)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      setStaffName('Staff Member')
    }
    setTimeout(() => setMounted(true), 50)
  }, [])

  const greeting = () => {
    const h = time.getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  // 12-hour format time
  const formatTime12 = (date) => {
    let hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12
    return { hours: hours.toString().padStart(2, '0'), minutes, seconds, ampm }
  }

  const { hours: hh, minutes: mm, seconds: ss, ampm } = formatTime12(time)

  const formattedDate = time.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  // Navigation handlers
  const handleNavigate = (path) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      window.location.href = `/staffPanel/${path}`
    }
  }

  return (
    <div className="space-y-6">

      {/* ── Hero Welcome Banner ── */}
      <div
        className={`relative overflow-hidden rounded-2xl border border-[#c9a962]/20 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ background: 'linear-gradient(135deg, #0f0b06 0%, #1a1208 40%, #0d0a05 100%)' }}
      >
        {/* Ambient grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#c9a962 1px, transparent 1px), linear-gradient(90deg, #c9a962 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Gold glow orbs */}
        <div className="absolute top-0 left-1/4 w-72 h-32 bg-[#c9a962]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-28 bg-[#9a7b4f]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-32 h-32 bg-[#c9a962]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Decorative corner lines */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[#c9a962]/30 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-[#c9a962]/30 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-[#c9a962]/30 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[#c9a962]/30 rounded-br-sm pointer-events-none" />

        <div className="relative px-6 sm:px-10 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* Left — greeting + name */}
            <div className="space-y-3">
              {/* Eyebrow */}
              <div className="flex items-center gap-2">
                <span className="w-5 h-px bg-[#c9a962]/60" />
                <span className="text-[#c9a962] text-[10px] font-bold tracking-[0.35em] uppercase">
                  {greeting()}
                </span>
                <span className="w-5 h-px bg-[#c9a962]/60" />
              </div>

              {/* Name - Large & Prominent */}
              <h2
                className="font-['Playfair_Display',serif] font-bold text-white leading-none"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 3.2rem)' }}
              >
                {staffName}
              </h2>

              {/* Role + date row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#c9a962] bg-[#c9a962]/8 border border-[#c9a962]/20 px-3 py-1 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-[#c9a962] animate-pulse" />
                  {currentUser?.role === 'staff' ? 'Staff' : currentUser?.role || 'Staff'} · Prajain's Resto Cafe
                </span>
                <span className="text-[#8b7355] text-xs">{formattedDate}</span>
              </div>
            </div>

            {/* Right — segmented digital clock (12-hour format) */}
            <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
              {/* Clock digits */}
              <div className="flex items-end gap-1">
                {/* Hours */}
                <div className="flex gap-0.5">
                  {hh.split('').map((d, i) => (
                    <span
                      key={i}
                      className="font-mono font-bold text-[#e8d5a3] tabular-nums leading-none"
                      style={{ fontSize: 'clamp(1.8rem, 4vw, 2.2rem)' }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <span
                  className="font-mono font-bold text-[#c9a962]/60 leading-none pb-0.5"
                  style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' }}
                >
                  :
                </span>
                {/* Minutes */}
                <div className="flex gap-0.5">
                  {mm.split('').map((d, i) => (
                    <span
                      key={i}
                      className="font-mono font-bold text-[#e8d5a3] tabular-nums leading-none"
                      style={{ fontSize: 'clamp(1.8rem, 4vw, 2.2rem)' }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <span
                  className="font-mono font-bold text-[#c9a962]/60 leading-none pb-0.5"
                  style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' }}
                >
                  :
                </span>
                {/* Seconds */}
                <div className="flex gap-0.5">
                  {ss.split('').map((d, i) => (
                    <span
                      key={i}
                      className="font-mono font-bold text-[#c9a962] tabular-nums leading-none"
                      style={{ fontSize: 'clamp(1.8rem, 4vw, 2.2rem)' }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
                {/* AM/PM */}
                <span className="font-mono text-sm font-semibold text-[#c9a962] self-end pb-1 ml-1">
                  {ampm}
                </span>
              </div>

              {/* Thin progress bar — seconds ticker */}
              <div className="w-full lg:w-auto lg:min-w-[220px] h-px bg-[#c9a962]/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#c9a962]/40 to-[#c9a962] rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(time.getSeconds() / 59) * 100}%` }}
                />
              </div>

              <span className="text-[#8b7355] text-[10px] tracking-widest uppercase">
                Live · Local Time
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className={`transition-all duration-700 delay-150 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="w-4 h-px bg-[#c9a962]/40" />
          <h3 className="text-[#998f82] text-[10px] font-bold tracking-[0.25em] uppercase">
            Quick Actions
          </h3>
          <span className="flex-1 h-px bg-[#c9a962]/10" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <QuickAction
            label="Add Category"
            onClick={() => handleNavigate('categories/add')}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4v16m8-8H4" />
              </svg>
            }
          />
          <QuickAction
            label="Add Subcategory"
            onClick={() => handleNavigate('subcategories/add')}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="6" height="6" rx="1" />
                <rect x="13" y="13" width="8" height="8" rx="1" />
                <path strokeLinecap="round" strokeWidth="1.8" d="M9 6h4v7" />
              </svg>
            }
          />
          <QuickAction
            label="Add Vendor"
            onClick={() => handleNavigate('vendors/add')}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            }
          />
          <QuickAction
            label="View Categories"
            onClick={() => handleNavigate('categories')}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="10" rx="1" />
                <rect width="7" height="5" x="3" y="14" rx="1" />
              </svg>
            }
          />
          <QuickAction
            label="View Vendors"
            onClick={() => handleNavigate('vendors')}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          />
          <QuickAction
            label="Purchases"
            onClick={() => handleNavigate('purchases')}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            }
          />
        </div>
      </div>


    </div>
  )
}

export default DashboardStaff