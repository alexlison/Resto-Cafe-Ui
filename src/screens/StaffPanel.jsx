import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import cafeLogo from '../assets/logo.jpg'
import StaffCategories from './StaffCategories'
import AddCategory from './AddCategory'
import EditCategory from './EditCategory'
import StaffSubcategories from './StaffSubcategories'
import AddSubCategory from './AddSubCategory'
import EditSubCategory from './EditSubCategory'

// Icons as SVG components
const Icons = {
  Categories: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="10" rx="1" />
      <rect width="7" height="5" x="3" y="14" rx="1" />
    </svg>
  ),
  Subcategories: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
      <path d="M9 6h4v7" />
    </svg>
  ),
  Recipes: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M6 6h10M6 10h10" />
    </svg>
  ),
  Ingredients: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  Brands: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M3.82 10.82a1.72 1.72 0 0 0 0 2.44l7 7a1.72 1.72 0 0 0 2.44 0l7.46-7.46A1.72 1.72 0 0 0 21 11.59V4a2 2 0 0 0-2-2h-7.59a1.72 1.72 0 0 0-1.23.51l-6.35 6.31zM16 8h.01" />
    </svg>
  ),
  Vendors: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Purchases: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  Sales: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 2v4M12 22v-4M4 12H2M22 12h-2M19.07 4.93l-2.83 2.83M6.34 17.66l-2.83 2.83M17.66 17.66l2.83 2.83M4.93 4.93l2.83 2.83" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  Inventory: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  ),
  MenuIcon: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Home: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2" />
    </svg>
  ),
  Time: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
  ),
}

// Helper function to get entity type from path
const getEntityType = (path) => {
  if (path.includes('/subcategories')) return 'subcategory'
  if (path.includes('/recipes')) return 'recipe'
  if (path.includes('/ingredients')) return 'ingredient'
  if (path.includes('/brands')) return 'brand'
  if (path.includes('/vendors')) return 'vendor'
  if (path.includes('/purchases')) return 'purchase'
  if (path.includes('/categories')) return 'category'
  return null
}

// Helper function to get action from path
const getAction = (path) => {
  if (path.includes('/add')) return 'add'
  if (path.includes('/edit/')) return 'edit'
  return 'list'
}

const StaffPanel = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('categories')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  
  // Dropdown states - all closed by default
  const [inventoryOpen, setInventoryOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [salesOpen, setSalesOpen] = useState(false)

  useEffect(() => {
    try {
      const user = localStorage.getItem('user')
      if (user) {
        setCurrentUser(JSON.parse(user))
      }
    } catch {
      setCurrentUser(null)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    navigate('/login', { replace: true })
  }

  // Menu sections with dropdown
  const menuSections = [
    {
      id: 'inventory',
      label: 'Inventory Management',
      icon: Icons.Inventory,
      isOpen: inventoryOpen,
      toggle: () => setInventoryOpen(!inventoryOpen),
      items: [
        { id: 'categories', label: 'Categories', icon: Icons.Categories },
        { id: 'subcategories', label: 'Subcategories', icon: Icons.Subcategories },
        { id: 'vendors', label: 'Vendors', icon: Icons.Vendors },
        { id: 'purchases', label: 'Purchases', icon: Icons.Purchases },
      ]
    },
    {
      id: 'menu',
      label: 'Menu Management',
      icon: Icons.Recipes,
      isOpen: menuOpen,
      toggle: () => setMenuOpen(!menuOpen),
      items: [
        { id: 'ingredients', label: 'Ingredients', icon: Icons.Ingredients },
        { id: 'recipes', label: 'Recipes', icon: Icons.Recipes },
        { id: 'brands', label: 'Brands', icon: Icons.Brands },
      ]
    },
    {
      id: 'sales',
      label: 'Sales Management',
      icon: Icons.Sales,
      isOpen: salesOpen,
      toggle: () => setSalesOpen(!salesOpen),
      items: [
        { id: 'salesReport', label: 'Sales Report', icon: Icons.Sales },
      ]
    }
  ]

  // Get current page label
  const getCurrentLabel = () => {
    const path = location.pathname
    const entity = getEntityType(path)
    const action = getAction(path)
    
    if (entity && action === 'add') {
      return `Add ${entity.charAt(0).toUpperCase() + entity.slice(1)}`
    }
    if (entity && action === 'edit') {
      return `Edit ${entity.charAt(0).toUpperCase() + entity.slice(1)}`
    }
    
    // Find matching tab
    for (const section of menuSections) {
      for (const item of section.items) {
        if (item.id === activeTab) {
          return item.label
        }
      }
    }
    return 'Dashboard'
  }

  // Render active component based on route
  const renderContent = () => {
    try {
      const path = location.pathname
      const entity = getEntityType(path)
      const action = getAction(path)
      
      // Handle Add routes
      if (action === 'add') {
        switch (entity) {
          case 'category':
            return <AddCategory />
          case 'subcategory':
            return <AddSubCategory />
          // case 'recipe':
          //   return <AddRecipe />
          // case 'ingredient':
          //   return <AddIngredient />
          // case 'brand':
          //   return <AddBrand />
          // case 'vendor':
          //   return <AddVendor />
          // case 'purchase':
          //   return <AddPurchase />
          default:
            return <AddCategory />
        }
      }
      
      // Handle Edit routes
      if (action === 'edit') {
        const id = path.split('/edit/')[1]
        switch (entity) {
          case 'category':
            return <EditCategory id={id} />
          case 'subcategory':
            return <EditSubCategory id={id} />
          // case 'recipe':
          //   return <EditRecipe id={id} />
          // case 'ingredient':
          //   return <EditIngredient id={id} />
          // case 'brand':
          //   return <EditBrand id={id} />
          // case 'vendor':
          //   return <EditVendor id={id} />
          // case 'purchase':
          //   return <EditPurchase id={id} />
          default:
            return <EditCategory id={id} />
        }
      }
      
      // Regular list routes
      switch (activeTab) {
        case 'categories':
          return <StaffCategories />
        case 'subcategories':
           return <StaffSubcategories />
        case 'vendors':
          return (
            <div className="text-center py-12 text-[#998f82]">
              <p className="text-lg">Vendors - Coming soon</p>
            </div>
          )
        case 'purchases':
          return (
            <div className="text-center py-12 text-[#998f82]">
              <p className="text-lg">Purchases - Coming soon</p>
            </div>
          )
        case 'ingredients':
          return (
            <div className="text-center py-12 text-[#998f82]">
              <p className="text-lg">Ingredients - Coming soon</p>
            </div>
          )
        case 'recipes':
          return (
            <div className="text-center py-12 text-[#998f82]">
              <p className="text-lg">Recipes - Coming soon</p>
            </div>
          )
        case 'brands':
          return (
            <div className="text-center py-12 text-[#998f82]">
              <p className="text-lg">Brands - Coming soon</p>
            </div>
          )
        case 'salesReport':
          return (
            <div className="text-center py-12 text-[#998f82]">
              <p className="text-lg">Sales Report - Coming soon</p>
            </div>
          )
        default:
          return <StaffCategories />
      }
    } catch (error) {
      console.error('Render error:', error)
      return (
        <div className="text-center py-12 text-red-400">
          <p className="text-lg">Error loading component</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      )
    }
  }

  return (
    <div className="h-screen bg-[#0a0805] flex font-['Inter',sans-serif] overflow-hidden">
      
      {/* ===== SIDEBAR - Fixed, Full Height with Border ===== */}
      <aside 
        className={`
          h-full bg-[#070604] border-r border-[#c9a962]/15 
          transition-all duration-300 ease-in-out flex flex-col flex-shrink-0
          ${sidebarCollapsed ? 'w-[70px]' : 'w-[260px]'}
        `}
      >
        {/* Sidebar Header - Brand like Login Page */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#c9a962]/10 shrink-0">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-[#c9a962]/10 blur-xl rounded-full"></div>
              <img 
                src={cafeLogo} 
                alt="Logo" 
                className="relative w-10 h-10 rounded-xl border border-[#c9a962]/30 object-cover shadow-lg shadow-[#c9a962]/20"
              />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-['Playfair_Display',serif] text-xl mt-2 font-bold text-white tracking-wide leading-tight">
                  Prajain's
                </span>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-[6px] font-semibold text-[#c9a962] tracking-[0.2em] uppercase bg-[#c9a962]/8 px-2 py-0.5 rounded-full border border-[#c9a962]/15 inline-block w-fit">
                    Resto Cafe
                  </span>
                  <span className="text-[6px] font-semibold text-[#c9a962] tracking-[0.2em] uppercase bg-[#c9a962]/8 px-2 py-0.5 rounded-full border border-[#c9a962]/15 inline-block w-fit">
                    Since 2023
                  </span>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:block text-[#8b7355] hover:text-[#c9a962] transition-colors duration-300"
          >
            <Icons.ChevronLeft />
          </button>
        </div>

        {/* Sidebar Navigation with Dropdowns - Scrollable */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-2">
            {menuSections.map((section) => {
              const IconComponent = section.icon
              const isOpen = section.isOpen
              
              return (
                <div key={section.id} className="space-y-0.5">
                  {/* Section Header - Click to toggle */}
                  <button
                    type="button"
                    onClick={section.toggle}
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                      transition-all duration-300
                      text-[#998f82] hover:text-[#e6dfd5] hover:bg-white/5
                      ${sidebarCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    <span className="text-[#c9a962]"><IconComponent /></span>
                    {!sidebarCollapsed && (
                      <>
                        <span className="text-xs font-medium flex-1 text-left capitalize">
                          {section.label}
                        </span>
                        <span className="text-[#8b7355]">
                          {isOpen ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
                        </span>
                      </>
                    )}
                  </button>

                  {/* Section Items - Show when expanded */}
                  {isOpen && !sidebarCollapsed && (
                    <div className="ml-6 space-y-0.5 border-l border-[#c9a962]/10 pl-2">
                      {section.items.map((item) => {
                        const ItemIcon = item.icon
                        const isActive = activeTab === item.id
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setActiveTab(item.id)
                              setMobileMenuOpen(false)
                            }}
                            className={`
                              w-full flex items-center gap-2.5 px-3 py-2 rounded-lg
                              transition-all duration-300 text-sm
                              ${isActive 
                                ? 'bg-[#c9a962]/10 text-[#e8d5a3] border border-[#c9a962]/20' 
                                : 'text-[#998f82] hover:text-[#e6dfd5] hover:bg-white/5'
                              }
                            `}
                          >
                            <span className="text-[#c9a962]"><ItemIcon /></span>
                            <span className="font-medium">{item.label}</span>
                            {isActive && (
                              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c9a962]"></span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* ===== NAVBAR - Fixed ===== */}
        <header className="sticky top-0 z-30 bg-[#0a0805]/80 backdrop-blur-xl border-b border-[#c9a962]/10 px-4 py-3 flex items-center justify-between shrink-0">
          
          {/* Left - Mobile Menu Toggle & Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#e6dfd5] hover:text-[#c9a962] transition-colors duration-300"
            >
              <Icons.MenuIcon />
            </button>
            
            <h1 className="text-lg font-['Playfair_Display',serif] text-[#e8d5a3] font-semibold">
              {getCurrentLabel()}
            </h1>
            <span className="hidden sm:inline-block text-xs text-[#8b7355] font-mono tracking-wider bg-white/5 px-3 py-1 rounded-full border border-[#c9a962]/10">
              Staff Panel
            </span>
          </div>

          {/* Right - Time & Logout */}
          <div className="flex items-center gap-4">
            {/* Time */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#8b7355]">
              <Icons.Time />
              <span>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            {/* Home Button */}
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="text-[#8b7355] hover:text-[#c9a962] transition-colors duration-300 p-1.5 rounded-lg hover:bg-white/5"
              title="Go to Home"
            >
              <Icons.Home />
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-[#f43f5e]/10 border border-[#f43f5e]/20 rounded-lg text-[#f43f5e] hover:bg-[#f43f5e]/20 transition-all duration-300 text-sm font-medium"
            >
              <Icons.Logout />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Logout - Mobile only icon */}
            <button
              type="button"
              onClick={handleLogout}
              className="md:hidden text-[#8b7355] hover:text-[#f43f5e] transition-colors duration-300 p-1.5"
            >
              <Icons.Logout />
            </button>
          </div>
        </header>

        {/* ===== CONTENT AREA - Scrollable ===== */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* ===== MOBILE OVERLAY ===== */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}

export default StaffPanel