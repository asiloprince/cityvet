function Register() {
  return (
    <div className=' grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 md:h-screen lg:h-screen'>
        <div className=' bg-cyan-600 '>
            <section className='text-white text-center grid grid-cols-1'>
                <label className='text-1xl md:text-5xl lg:text-5xl font-bold mt-8 sm:mt-8 md:mt-56'>Welcome Back!</label>
                <label className='text-xs md:text-md lg:text-lg text-[#e5e7eb] font-bold mt-4'>To keep connected with us please<br></br>login your personal info.</label>
                <button type='submit' className='invisible sm:visible md:visible lg:visible xl:visible m-24 mt-8 sm:mt-8 md:mt-52 md:m-[100px] h-8 md:h-12 lg:-12 rounded-full border-2 font-bold hover:bg-white hover:text-cyan-600'>SIGN IN</button>
            </section>
        </div>

        <div className='col-span-2 max-w-[600px] mx-auto'>
                <form className='grid md:grid-cols-1 text-[#9ca3af] mt-4 md:mt-20'>
                    <label className=' text-center text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-6xl font-bold text-cyan-600 '>Create Account</label>
                    <label className='text-center mt-4 text-xs sm:text-xl md:text-xl lg:text-xl xl:text-xl'>Enter the field below to get started</label>

                    <label className='mt-4 mb-2 text-sm sm:text-sm md:text-md lg:text-lg xl:text-xl'>Full name<span className='text-[#0ea5e9]'> *</span></label>
                    <input type='text' placeholder='Enter name' className='p-2 sm:p-4 md:p-2 lg:p-2 xl:p-2 border-b-2 sm:border-2 md:border-2 lg:border-2 xl:border-2 sm:rounded-lg md:rounded-lg lg:rounded-lg xl:rounded-lg'></input>

                    <label className='mt-2 mb-2 text-sm sm:text-sm md:text-md lg:text-lg xl:text-xl'>Email address<span className='text-[#0ea5e9]'> *</span></label>
                    <input type='email' placeholder='Enter email' className='p-2 sm:p-4 md:p-2 lg:p-2 xl:p-2 border-b-2 sm:border-2 md:border-2 lg:border-2 xl:border-2 sm:rounded-lg md:rounded-lg lg:rounded-lg xl:rounded-lg'></input>

                    <label className='mt-2 mb-2 text-sm sm:text-sm md:text-md lg:text-lg xl:text-xl'>Password <span className='text-[#0ea5e9]'> *</span></label>
                    <input type='password' placeholder='Create a password' className='p-2 sm:p-2 md:p-2 lg:p-2 xl:p-2 border-b-2 sm:border-2 md:border-2 lg:border-2 xl:border-2 sm:rounded-lg md:rounded-lg lg:rounded-lg xl:rounded-lg'></input>

                    <button type='submit' className=' h-10 sm:h-12 md:h-12 lg:h-12 xl:h-12 mt-8 font-bold text-[white] rounded-full bg-cyan-600'>Create account</button>
                    
                </form>
        </div>
    </div>
  )
}

export default Register;
