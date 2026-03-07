import { LayoutDashboard, LogOut, Moon, Settings, SettingsIcon, Sun } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'

import { Link } from 'react-router-dom'

import { Button } from '../ui/button'
import { useTheme } from 'next-themes'
import { FaQuestionCircle } from 'react-icons/fa'

export function UserNav(): JSX.Element {
  const { theme, setTheme } = useTheme()
  // const [email, setEmail] = useState('')

  // const navigate = useNavigate()

  // const handleLogout = async (): Promise<void> => {
  //   try {
  // const response = await axios.delete(`${import.meta.env.VITE_PUBLIC_API_URL}/auth/logout`, {
  //   withCredentials: true
  // })
  // if (response.data.success) {
  //   // Handle successful logout here, e.g., redirect to login page
  //   navigate('/login')
  // }
  //     console.log('logout')
  //   } catch (error) {
  //     // Handle error here
  //     console.error(error)
  //   }
  // }

  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${import.meta.env.VITE_PUBLIC_API_URL}/accounts/user/details`,
  //         { withCredentials: true }
  //       )
  //       const userDetails = response.data.data
  //       setEmail(userDetails.email)
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }
  //   fetchUserDetails()
  // }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          {' '}
          <SettingsIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          {/* <div className="flex flex-col space-y-1">
            <p className="text-xs leading-none text-muted-foreground">Signed in as</p>
            <p className="text-sm font-medium leading-none">{email}</p>
          </div> */}
          <div className="flex items-center justify-between w-full">
            <span>Change Theme</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              area-label="Toggle Theme"
            >
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 " />
              <span className="sr-only">Toggle Theme</span>
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <Link to={'/'}>
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FaQuestionCircle className="mr-2 h-4 w-4" />
            <Link to={'/usermanual'}>
              <span>User Manual</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem> */}
        {/* <LogOut className="mr-2 h-4 w-4" />
          <span onClick={handleLogout}>Log out</span> */}
        {/* </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
