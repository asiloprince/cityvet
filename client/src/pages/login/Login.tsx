import {FcGoogle} from 'react-icons/fc'
function Login() {
  return (
    
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 md:h-screen lg:h-screen'>
      <div className=' bg-cyan-600 '>
            <section className='text-white text-center grid grid-cols-1'>
                <label className='text-1xl md:text-5xl lg:text-5xl font-bold mt-8 sm:mt-8 md:mt-56'>Hi, Welcome !</label>
                <label className='text-xs md:text-md lg:text-lg text-[#e5e7eb] font-bold mt-4'>To keep connected with us please<br></br>login your personal info.</label>
                <button type='submit' className='invisible sm:visible md:visible lg:visible xl:visible m-16 mt-2 sm:mt-8 md:mt-52 md:m-[100px] h-8 md:h-12 lg:-12 rounded-full border-2 font-bold hover:bg-white hover:text-cyan-600'>SIGN UP</button>
            </section>
        </div>
        <div className='col-span-2 max-w-[600px] mx-auto'>

        <form className=' grid sm:grid-cols-1 p-4 sm:justify-center text-[#9ca3af] ' >
                <label className='text-center text-3xl text-cyan-600 font-bold'>Sign in</label>

                <div className='mt-8 grid md:grid-cols-1 text-center items-center border-b-2 '>
                  <button className='indent-5 mt-4 flex justify-center m-4 border-2 p-1 sm:p-4 md:p-4 lg:p-4 xl:p-4 rounded-full font-bold text-[black] text-lg'>
                  <FcGoogle size={25}/>
                  Sign in with Google
                  </button>

                  <div className='bg-white max-w-[500px] p-1 mx-auto mb-[-15px] '> 
                    <p className='text-center'>or Sign in with email</p>
                  </div>
                </div>          

                <label className='text-sm sm:text-xl md:text-xl lg:text-xl xl:text-xl mt-8 '>Email or Username<span className='text-[#0ea5e9]'> *</span></label>
                <input type="text" placeholder="Enter Username" required id='email'  className='p-2 sm:p-2 md:p-2 lg:p-2 xl:p-4  border-b-2 sm:border-2 md:border-2 lg:border-2 xl:border-2 sm:rounded-lg md:rounded-lg lg:rounded-lg xl:rounded-lg'></input>
                
                <label className='text-sm sm:text-xl md:text-xl lg:text-xl xl:text-xl mt-4'>Password<span className='text-[#0ea5e9]'> *</span></label>
                <input type='password' placeholder='Enter Password' required id='password'  className='p-2 sm:p-2 md:p-2 lg:p-2 xl:p-4  border-b-2 sm:border-2 md:border-2 lg:border-2 xl:border-2 sm:rounded-lg md:rounded-lg lg:rounded-lg xl:rounded-lg'></input>

                <div className='mt-2 flex'>
                  <input type='checkbox' />
                  <label className='indent-2 sm:indent-4   md:indent-4   lg:indent-4   xlindent-4  : font-bold'>Remember Me</label>
                  <a href='' className='indent-14 sm:indent-48  md:indent-48   lg:indent-48   xl:indent-48 text-cyan-600 font-bold'>Forgot Password?</a>
                </div>
                
                <button type='submit'  className='items-center h-8 sm:h-12 md:h-12 lg:h-12 xl:h-12 mt-8 font-bold text-[white] rounded-full bg-cyan-600 '>Login</button>
                <label className='text-center text-sm sm:text-lg md:text-lg lg:text-lg xl:text-lg mt-4'>By continuing, you agree to the <a href='' className='underline underline-offset-1'>Terms of use</a> and <a href='' className='underline underline-offset-1'>Privacy Policy.</a></label>
              </form>

        </div>
    </div>

  )
}

export default Login;
