import {FcGoogle} from 'react-icons/fc'
function Login() {
  return (
    
    <div className=' sm:max-w-[600px] md:max-w-[600px] lg:max-w-[600px] xl:max-w-[600px]  mx-auto '>
        
      <div className= "mt-[50px] sm:mt-[100px] md:mt-[100px] lg:mt-[100px] xl:mt-[100px] sm:border-2 md:border-2 lg:border-2 xl:border-2 rounded-lg " >

            <div className=' sm:m-[50px] md:m-[50px] lg:m-[50px] xl:m-[50px] text-[#9ca3af]'>

              <form className=' grid sm:grid-cols-1 p-4 sm:justify-center ' >
                <label className='text-center text-3xl text-[black] font-bold'>Sign in</label>

                <div className='mt-8 grid md:grid-cols-1 text-center items-center border-b-2 '>
                  <button className='indent-5 mt-4 flex justify-center m-4 border-2 p-2 sm:p-4 md:p-4 lg:p-4 xl:p-4 rounded-full font-bold text-[black] text-lg'>
                  <FcGoogle size={30}/>
                  Sign in with Google
                  </button>

                  <div className='bg-white max-w-[500px] p-1 mx-auto mb-[-15px] '> 
                    <p className='text-center'>or Sign in with email</p>
                  </div>
                </div>          

                <label className='text-sm sm:text-xl md:text-xl lg:text-xl xl:text-xl mt-8 '>Email or Username<span className='text-[#0ea5e9]'> *</span></label>
                <input type="text" placeholder="Enter Username" required id='email'  className='p-2 sm:p-4 md:p-4 lg:p-4 xl:p-4  border-b-2 sm:border-2 md:border-2 lg:border-2 xl:border-2 sm:rounded-lg md:rounded-lg lg:rounded-lg xl:rounded-lg'></input>
                
                <label className='text-sm sm:text-xl md:text-xl lg:text-xl xl:text-xl mt-4'>Password<span className='text-[#0ea5e9]'> *</span></label>
                <input type='password' placeholder='Enter Password' required id='password'  className='p-2 sm:p-4 md:p-4 lg:p-4 xl:p-4  border-b-2 sm:border-2 md:border-2 lg:border-2 xl:border-2 sm:rounded-lg md:rounded-lg lg:rounded-lg xl:rounded-lg' ></input>

                <div className='mt-2 flex'>
                  <input type='checkbox' />
                  <label className='indent-2 sm:indent-4   md:indent-4   lg:indent-4   xlindent-4  : font-bold'>Remember Me</label>
                  <a href='' className='indent-14 sm:indent-48  md:indent-48   lg:indent-48   xl:indent-48 text-[#0ea5e9] font-bold'>Forgot Password?</a>
                </div>
                
                <button type='submit'  className='items-center h-8 sm:h-12 md:h-12 lg:h-12 xl:h-12 mt-8 font-bold text-[white] rounded-full bg-[#0ea5e9] ' >Login</button>
                <label className='text-center text-sm sm:text-lg md:text-lg lg:text-lg xl:text-lg mt-4'>By continuing, you agree to the <a href='' className='underline underline-offset-1'>Terms of use</a> and <a href='' className='underline underline-offset-1'>Privacy Policy.</a></label>
                <label className='indent-2 text-sm sm:text-lg md:text-lg lg:text-lg xl:text-lg mt-4'> Not Register yet? <span className='text-[#0ea5e9] font-bold'><a href=''>Create Account</a></span></label>
                
              </form>

            </div>
      </div>
    </div>

  )
}

export default Login;
