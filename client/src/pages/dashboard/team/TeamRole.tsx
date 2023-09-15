import {BsPersonBadge} from 'react-icons/bs'
function TeamRole() {

  return (
    <div className='p-5 h-screen  '>
        <h1 className='text-xl font-bold'>User Clients</h1>
        
        <div className=''>
            <table className='overflow-auto shadow-md'>
                <thead className=' border-b-2 border-b-gray-300 text-left text-cyan-500'>
                    <tr>
                        <th className='p-3 text-md tracking-wide text-gray-500  '>ID</th>
                        <th className='p-3 text-md tracking-wide text-gray-500  '>Name</th>
                        <th className='p-3 text-md tracking-wide text-gray-500  '>Email Address</th>
                        <th className='p-3 text-md tracking-wide text-gray-500  '>Designation</th>
                        <th className='p-3 text-md tracking-wide text-gray-500  '>Contact</th>
                        <th className='p-3 text-md tracking-wide text-gray-500  '>Action</th>
                    </tr>
                </thead>
                <tbody className=''>
                    <tr className='bg-white text-xs text-gray-500 '>
                        <td className='p-10 text-cyan-600 font-bold '>202301</td>
                        <td className='p-10 flex '><span><BsPersonBadge size={20}/></span>Jerald Banalan</td>
                        <td className='p-10 '>IkawLangWalaNgIba#10@yahu.kom</td>
                        <td className='p-10 '><span className='bg-cyan-600 text-white font-bold p-1 rounded-lg'>Chief technology officer CTO</span></td>
                        <td className='p-10 '>09********</td>
                        <td className='p-10 '></td>

                    </tr>
                    <tr className='bg-gray-200 text-xs text-gray-500'>
                        <td className='p-10 text-cyan-600 font-bold'>202302</td>
                        <td className='p-10 flex '><span><BsPersonBadge size={20}/></span> Prince Gerald Asilo</td>
                        <td className='p-10 '>IkawLangWalaNgIba#25@yahu.kom</td>
                        <td className='p-10 '><span className='bg-cyan-600 text-white font-bold p-1 rounded-lg'>Chief executive officer CEO</span></td>
                        <td className='p-10 '>09********</td>
                        <td className='p-10 '></td>
                    </tr>
                    <tr className='bg-white text-xs text-gray-500'>
                        <td className='p-10 text-cyan-600 font-bold'>202303</td>
                        <td className='p-10 flex '> <span><BsPersonBadge size={20}/></span>Maher Calingasan</td>
                        <td className='p-10 '>IkawLangWalaNgIba#2@yahu.kom</td>
                        <td className='p-10'><span className='bg-cyan-600 text-white font-bold p-1 rounded-lg'>Chief financial officer CFO</span></td>
                        <td className='p-10 '>09********</td>
                        <td className='p-10 '></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  )

}

export default TeamRole;
