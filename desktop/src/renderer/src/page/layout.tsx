import { ThemeProvider } from '@/utils/theme-provider'
import React from 'react'
import { cn } from '@/lib/utils'
import SideBar from '@renderer/components/sidebar/SideBar'
import Topbar from '@renderer/components/topbar/Topbar'

// import Navbar from "@/components/Navbar";

interface LayoutProps {
  children: React.ReactNode
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={cn('min-h-screen')}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="grid lg:grid-cols-2 md:grid-cols-2">
          <div className="lg:col-span-1">
            <SideBar />
          </div>
          <div className="mb-2 lg:col-span-6 md:col-span-3 lg:ml-52 md:ml-56 md:h-2/3 ">
            <Topbar />
            {children}
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}

export default Layout
