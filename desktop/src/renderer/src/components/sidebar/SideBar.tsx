import { useState } from 'react'
import { Link } from 'react-router-dom'
import taskImg from '../../assets/images/task.png'
import links from './link'

function SideBar(): JSX.Element {
  return (
    <div>
      <div className="fixed top-0 z-50 transition-all h-full col-span-1 p-8 border-r lg:min-h-screen dark:bg-[#020817] bg-white">
        <div className="text-center pb-4">
          <h1 className="font-poppin font-bold text-2xl uppercase tracking-[4px] dark:text-white">
            Cityvet
          </h1>
        </div>
        <div className="flex flex-col justify-between h-[550px]">
          {/* navigation sidebar */}
          <nav>
            <ul>
              {links.map((link) => {
                return (
                  <div key={link.id}>
                    <p className="text-xs text-gray-500 pt-4 dark:text-white">{link.title}</p>
                    {link.listLinks.map((listLink) => {
                      return (
                        <li key={listLink.id}>
                          <Link
                            to={listLink.url}
                            className="flex items-center gap-4 hover:bg-cyan-600 p-2 hover:text-white text-sm text-gray-700 font-semibold rounded-lg transition-colors ml-1 dark:text-white"
                          >
                            {listLink.icon}
                            {listLink.title}
                          </Link>
                        </li>
                      )
                    })}
                  </div>
                )
              })}
            </ul>
          </nav>

          {/* logout */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex flex-col gap-2">
              <img src={taskImg} alt="Image" className="w-32 h-28 mx-auto block" />

              <div className="bg-purple-50 p-2 flex flex-col gap-2 rounded-2xl dark:bg-gray-700">
                <h3 className="text-base text-center font-poppin dark:text-white"> Optimize </h3>
                <p className="text-gray-500 text-center dark:text-white"></p>
                <button className="bg-cyan-600 text-white text-sm p-2 rounded-lg">
                  Your Operations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBar
