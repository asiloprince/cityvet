function Register() {
  return (
    <div className=' max-w-[600px] mx-auto mt-[100px] sm:mt-[120px] md:mt-[120px] lg:mt-[120px]'>
        <div className=' sm:border-2 md:border-2 lg:border-2 xl:border-2 rounded-lg'>
            <section className='m-[50px] '>
                <form className='grid md:grid-cols-1 text-[#9ca3af] '>
                    <label className=' text-center text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-black '>Create your account</label>
                    <label className='text-center mt-4 text-xs sm:text-xl md:text-xl lg:text-xl xl:text-xl'>Enter the field below to get started</label>

                    <label className='mt-16 mb-2 text-sm sm:text-xl md:text-xl lg:text-xl xl:text-xl'>Full name<span className='text-[#0ea5e9]'> *</span></label>
                    <input type='text' placeholder='Enter name' className='p-2 sm:p-4 md:p-4 lg:p-4 xl:p-4 border-b-2 sm:border-2 md:border-2 lg:border-2 xl:border-2 sm:rounded-lg md:rounded-lg lg:rounded-lg xl:rounded-lg'></input>

                    <label className='mt-6 mb-2 text-sm sm:text-xl md:text-xl lg:text-xl xl:text-xl'>Email address<span className='text-[#0ea5e9]'> *</span></label>
                    <input type='email' placeholder='Enter email' className='p-2 sm:p-4 md:p-4 lg:p-4 xl:p-4 border-b-2 sm:border-2 md:border-2 lg:border-2 xl:border-2 sm:rounded-lg md:rounded-lg lg:rounded-lg xl:rounded-lg'></input>

                    <label className='mt-6 mb-2 text-sm sm:text-xl md:text-xl lg:text-xl xl:text-xl'>Password <span className='text-[#0ea5e9]'> *</span></label>
                    <input type='password' placeholder='Create a password' className='p-2 sm:p-4 md:p-4 lg:p-4 xl:p-4 border-b-2 sm:border-2 md:border-2 lg:border-2 xl:border-2 sm:rounded-lg md:rounded-lg lg:rounded-lg xl:rounded-lg'></input>

                    <button type='submit' className=' h-10 sm:h-12 md:h-12 lg:h-12 xl:h-12 mt-8 font-bold text-[white] rounded-full bg-[#0ea5e9]'>Create account</button>
                    <label className='mt-4 text-center'>Already have an account? <span className='text-[#0ea5e9] font-bold'><a href=''> Log in </a></span></label>
                </form>
            </section>
        </div>
    </div>
  )
}

export default Register;
