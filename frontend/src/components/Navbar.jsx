import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBasket, loadLocalBasket } from '../redux/basket/basketActions'
import { ShoppingCart, User, Heart, Search} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from "@/components/ui/input"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth()
  const dispatch = useDispatch()
  const basketItems = useSelector((state) => state.basket.items)
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (user) {
      dispatch(fetchBasket(user.id)).catch(err => console.error("Failed to load basket:", err))
    } else {
      // Load local basket for guest users
      dispatch(loadLocalBasket())
    }
  }, [user, dispatch])

  const cartCount = basketItems.length

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { name: 'Shop', path: '/' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center h-16">
          {/* Logo Section */}
          <Button onClick={() => navigate("/")} variant="outline" size="icon" aria-label="Submit">
            Kuik
            </Button>

          <div className='relative flex items-center'>
            <Search className="absolute  left-120 text-slate-500 hover:cursor-pointer" 
            onClick={() => navigate(`/product/${document.querySelector('input').value}`)} />
            <Input type="email" placeholder="Search for an item" className='w-lg'
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${e.target.value}`)} />
          </div>      
            {/* if user is signed in - do this, otherwise have different dashboard */}
          <div className="hidden md:flex items-center space-x-8">

            <div className="h- w-px bg-slate-200" />

            <div className="flex items-center gap-5">
              <Link to="/cart" className="relative group p-2">
                <ShoppingCart className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-indigo-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
             {/* if user is logged in show user navbar, if user is not logged in use guest navbar*/}
              {user ? (
                <div className="flex items-center gap-3">
                  {/* Access liked items*/}
                  <div className="flex items-center gap-3">
                    <Button onClick={() => logout()} variant="outline" className="">
                        <Heart />
                      </Button>
               
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                              <User />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                          <DropdownMenuLabel>My Account</DropdownMenuLabel>
                          <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => navigate("/profile")}>
                              Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate("/orders")}>
                              Orders
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            logout()
                            navigate("/")
                          }}>
                            Log out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                    <Button onClick={() => {
                      logout()
                      navigate("/")
                    }} variant="outline" className="">
                      Log out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {/* Auth Actions */}
                  <div className="flex items-center gap-3">
                    <Link 
                      to="/login" 
                      className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                    >
                      Sign in
                    </Link>
                    
                    <Link 
                      to="/register" 
                      className="inline-flex items-center justify-center bg-slate-900 px-5 py-2.5 rounded-full text-sm font-bold text-white hover:bg-slate-800 active:scale-95 transition-all shadow-sm hover:shadow-md"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}