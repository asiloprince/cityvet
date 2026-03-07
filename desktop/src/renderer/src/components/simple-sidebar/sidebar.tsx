import { Link } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { ThemeProvider } from '@/utils/theme-provider'
import Logo from '../../assets/images/testronix-logo.png'
import LightLogo from '../../assets/images/white-testronix-logo.png'
import {
  BarChartBig,
  File,
  InspectionPanel,
  LayoutDashboard,
  LayoutGrid,
  ReceiptText,
  ShoppingCart
} from 'lucide-react'
import ProfileSheet from '../profile/profile_sheet'

export const sideNav = [
  {
    id: 1,
    link: '/',
    label: 'Dashboard',
    icons: <LayoutDashboard className="h-4 w-4 mr-2" />
  },
  {
    id: 2,
    link: '/beneficiary',
    label: 'Beneficiary',
    icons: <ShoppingCart className="h-4 w-4 mr-2" />
  },
  {
    id: 3,
    link: '/livestocks',
    label: 'Livestock',
    icons: <ReceiptText className="h-4 w-4 mr-2" />
  },
  {
    id: 4,
    link: '/dispersal',
    label: 'Dispersal',
    icons: <ShoppingCart className="h-4 w-4 mr-2" />
  },
  {
    id: 5,
    link: '/calendar',
    label: 'Calendar',
    icons: <InspectionPanel className="h-4 w-4 mr-2" />
  },

  {
    id: 6,
    link: '/analytics',
    label: 'Analytics',
    icons: <BarChartBig className="h-4 w-4 mr-2" />
  }
]

function Sidebar() {
  const { theme, setTheme } = useTheme()
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="visible  border-r h-screen fixed">
          <Link to="/dashboard" className=" ml-4">
            <div className="text-center pb-4">
              <h1 className="font-poppin font-bold text-2xl uppercase tracking-[4px]">Cityvet</h1>
            </div>
          </Link>
          <nav className="w-48">
            {sideNav.map((links) => (
              <Link
                to={links.link}
                key={links.id}
                className="flex m-1 p-2  mx-4 hover:bg-accent rounded-lg focus:bg-[#82ca9d] focus:text-white focus:font-semibold text-xs"
              >
                <span className="flex flex-row">
                  {links.icons} {links.label}
                </span>
              </Link>
            ))}
            <ProfileSheet />
          </nav>
        </div>
      </ThemeProvider>
    </>
  )
}
export default Sidebar
