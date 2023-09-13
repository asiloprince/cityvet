import {BsPerson, BsPlusLg , BsTypeUnderline, BsPersonCircle} from 'react-icons/bs'
import {BiMessageSquareDetail} from 'react-icons/bi'
import {IoMdNotificationsOutline} from 'react-icons/io'
import {GoBold, GoItalic} from 'react-icons/go'

function Disperse() {
  return (
    <div className='max-w-[1240px] mx-auto h-screen '>
        <header className='flex justify-between items-center mt-10 '>
            <form className=' flex m-2 p-2'>
                <input type="text" placeholder='Search' className='border-b-2 w-80'/>
            </form>
            <nav className=''>
                <ul className='flex justify-end gap-16 p-4 ' >
                    <li>
                        <button className=' bg-cyan-600  p-2 rounded-lg flex font-bold text-white'><BsPlusLg size={20} className=' '/> Create</button>
                    </li>
                    <li>
                        <button className='text-center hover:text-cyan-600'><BiMessageSquareDetail size={30}/></button>
                    </li>
                    <li>
                        <button className='hover:text-cyan-600'><IoMdNotificationsOutline size={30}/></button>
                    </li>
                    <li>
                        <button className='hover:text-cyan-600'><BsPerson size={30}/></button>
                    </li>
                </ul>
            </nav>
        </header>

        <div className='grid grid-cols-3'>
            <div className='shadow-md rounded-lg m-4 grid grid-cols-1'>
                <ul className='p-4'>
                    <li className='text-center font-bold'>
                        <label>Beneficiary</label>
                    </li>

                    <li className='flex m-2 p-2 hover:bg-slate-400  hover:text-white border-b-2 rounded-md'>

                        <BsPerson size={20} className='m-5'/>
                        <div className='grid grid-cols-1 mt-4'>
                            <label>Jerald Banalan</label>
                            <label className='text-xs '>cityvet-2023-01</label>
                        </div>
                    </li>

                    <li className='flex m-2 hover:bg-slate-400 hover:text-white border-b-2 rounded-md'>

                        <BsPerson size={20} className='m-5'/>
                        <div className='grid grid-cols-1 mt-4'>
                            <label>Prince  Gerald Asilo</label>
                            <label className='text-xs'>cityvet-2023-02</label>
                        </div>
                    </li>

                    <li className='flex m-2 hover:bg-slate-400  hover:text-white border-b-2 rounded-md'>

                        <BsPerson size={20} className='m-5'/>
                        <div className='grid grid-cols-1 mt-4'>
                            <label>Maher Calingasan</label>
                            <label className='text-xs'>cityvet-2023-03</label>
                        </div>
                    </li>

                </ul>
            </div>

            <div className='col-span-2 shadow-md m-4 rounded-lg'>
                <div className=''>
                    <section className='flex justify-between border-b-2'>
                        
                        <div className='flex justify-between'>
                            <BsPersonCircle size={20} className=' m-5'/>
                            <label className='mt-4 font-bold'> Jerald Banalan</label>

                        </div>
                    </section>
                </div>
                <div className=''>
                    <form className='m-10 grid grid-cols-1'> 
                        <label className='font-bold text-xs'>Private Note </label>
                        <div className=' flex bg-gray-100 rounded-t-md mt-4 border-2'>
                            <button className='m-2'><GoBold/></button>
                            <button className='m-2'><GoItalic/></button>
                            <button className='m-2'><BsTypeUnderline/></button>
                        </div>
                        <textarea  className='h-24 border-b-2 border-l-2 border-r-2 rounded-b-md'/>
                    </form>
                </div>

                <div className='m-5 text-sm '>

                    <ul className='flex justify-between border-b-2 font-bold'> 
                        <li>Address</li>
                        <li>Contact</li>
                        <li>Livestock</li>
                    </ul>

                    <ul className='flex justify-between mt-2'> 
                        <li className='bg-green-300 p-1 rounded-md text-white font-bold'>Libjo, Batangas City</li>
                        <li className='bg-green-300 p-1 rounded-md text-white font-bold' >09*********</li>
                        <li className='bg-green-300 p-1 rounded-md text-white font-bold'>Cattle-2023-01</li>
                    </ul>
                </div>

            </div>
        </div>
    </div>
  );
}

export default Disperse;
