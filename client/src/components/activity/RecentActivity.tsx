import { CgArrowsExchangeV } from 'react-icons/cg'
import {BsPersonCircle} from 'react-icons/bs'
import {LiaFilterSolid} from 'react-icons/lia'

function RecentActivity() {
  return (
    <div className='max-w-[1240px]  mx-auto mt-[0px] bg-[#f8fafc] p-4 rounded-md'>
        <div className='grid gap-2 grid-flow-row-dense sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 h-10'>
            <label className='font-bold text-2xl text-[#9ca3af] '>Beneficiary List</label>
            <button className='border-2 bg-[#fafaf9] text-[#9ca3af] rounded-md flex items-center justify-center'>Filter <LiaFilterSolid size={20}/> </button>
            <button className='border-2 bg-[#fafaf9] text-[#9ca3af] rounded-md '>Date</button>
            <button className=' text-[white]  font-bold rounded-md bg-cyan-600'>Add New <span className='font-bold text-xl'>+</span></button>
        </div>

        <div className='grid grid-cols-4 mt-8 bg-[#f1f5f9] h-12 rounded-t-lg text-[#9ca3af] font-bold'>
            <button className='flex items-center justify-center '>ID<CgArrowsExchangeV size={20}/></button>
            <button className='flex items-center justify-center'>Name<CgArrowsExchangeV size={20}/></button>
            <button className='flex items-center justify-center'>Barangay<CgArrowsExchangeV size={20}/></button>
            <button className='flex items-center justify-center'>Contact Number<CgArrowsExchangeV size={20}/></button>
        </div>

        <div className='grid grid-cols-4 place-items-start border-2 p-2 pt-4'>
            <div className='grid grid-cols-1'>
                <label className='font-bold text-[#94a3b8]'>01</label>
                <label className='text-[#9ca3af] text-sm'>CITYVET 2023_01</label>
            </div>
            <div className='flex indent-4'>
                <BsPersonCircle size={40} className='text-[#9ca3af]'/>
                <label className='font-bold text-[#94a3b8]'>Jerald D Banalan</label>
            </div>
            <div>
                <label className=' p-1 font-bold text-[white] bg-cyan-600 rounded-md'>Barangay Libjo</label>
            </div>
            <div>
                <label>09----------</label>
            </div>
        </div>

        <div className='grid grid-cols-4 place-items-start border-2 p-2 pt-4'>
            <div className='grid grid-cols-1'>
                <label className='font-bold text-[#94a3b8]'>02</label>
                <label className='text-[#9ca3af] text-sm'>CITYVET 2023_02</label>
            </div>
            <div className='flex indent-4'>
                <BsPersonCircle size={40} className='text-[#9ca3af]'/>
                <label className='font-bold text-[#94a3b8]'>Prince Gerald M Asilo</label>
            </div>
            <div>
                <label className=' p-1 font-bold text-[white] bg-cyan-600 rounded-md'>Barangay Dalig</label>
            </div>
            <div>
                <label>09----------</label>
            </div>
        </div>

        <div className='grid grid-cols-4 place-items-start border-2 p-2 pt-4'>
            <div className='grid grid-cols-1'>
                <label className='font-bold text-[#94a3b8]'>03</label>
                <label className='text-[#9ca3af] text-sm'>CITYVET 2023_03</label>
            </div>
            <div className='flex indent-4'>
                <BsPersonCircle size={40} className='text-[#9ca3af]'/>
                <label className='font-bold text-[#94a3b8]'>Maher H Calingasan</label>
            </div>
            <div>
                <label className=' p-1 font-bold text-[white] bg-cyan-600 rounded-md'>Barangay Catandala</label>
            </div>
            <div>
                <label>09----------</label>
            </div>
        </div>

        <div className='flex  justify-center text-md font-bold text-[#9ca3af]'>
            <button className='m-2 p-2 border-2 shadow-md rounded-md'>1</button>
            <button className='m-2 p-2 border-2 rounded-md'>2</button>
            <button className='m-2 p-2 border-2 rounded-md'>3</button>
        </div>
    </div>
  )
}

export default RecentActivity;
