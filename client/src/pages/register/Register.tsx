import { FcGoogle } from 'react-icons/fc';
import { BiLogoGmail, BiLogoFacebookCircle } from 'react-icons/bi';
import RegImg from '../../assets/RegisterImg.jpg';
function Register() {
  return (
    <div className="sm:grid sm:grid-cols-2">
    <div className="sm:m-2 sm:mt-4 sm:max-w-[500px] sm:mx-auto">
      <form className="sm:rounded-md sm:grid sm:justify-center mt-8 sm:mt-10 text-gray-400">
        <div className="text-center m-12">
          <label className="m-4 sm:m-0 text-3xl font-bold sm:text-4xl sm:font-bold text-cyan-600">Welcome!!<br/></label>
          <label className="sm:m-0 text-sm">Sign up for your Account</label>
        </div>

        <div className="sm:flex">
          <div className="grid grid-cols-1 m-2">
            <label className="font-bold">First Name <span className="text-cyan-600">*</span></label>
            <input type="text" required placeholder="Enter First Name" className="p-2 border-b-2 sm:border-2 sm:rounded-lg outline-none focus:border-cyan-600" />
          </div>

          <div className="grid grid-cols-1 m-2">
            <label className="font-bold">Last Name <span className="text-cyan-600">*</span></label>
            <input type="text" required placeholder="Enter Last Name" className="p-2 border-b-2 sm:border-2 sm:rounded-lg outline-none focus:border-cyan-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 m-2">
          <label className="font-bold">Email Address <span className="text-cyan-600">*</span></label>
          <input type="text" required placeholder="Enter Email" className="p-2 border-b-2 sm:border-2 sm:rounded-lg outline-none focus:border-cyan-600" />
        </div>

        <div className="sm:flex">
          <div className="grid grid-cols-1 m-2">
            <label className="font-bold">Create Password<span className="text-cyan-600">*</span></label>
            <input type="password" required placeholder="Enter Password" className="p-2 border-b-2 sm:border-2 sm:rounded-lg outline-none focus:border-cyan-600" />
          </div>

          <div className="grid grid-cols-1 m-2">
            <label className="font-bold">Confirm Password  <span className="text-cyan-600">*</span></label>
            <input type="password" required placeholder="Enter Confirm Password" className="p-2 border-b-2 sm:border-2 sm:rounded-lg outline-none focus:border-cyan-600" />
          </div>
        </div>

        <div className="text-center text-white h-10 m-2 p-2 bg-cyan-600 rounded-full">
          <button type="submit" className="font-bold">Sign Up</button>
        </div>

        {/*<hr className="mx-14 bg-black dark:bg-gray-700" />

        <div className="text-center">
          <label>Sign In With</label>
        </div>

        <div className="flex place-content-center m-4 p-2 border-2 rounded-full">
          <button className="flex"><FcGoogle size={25} />Google</button>
</div>*/}
      </form>
    </div>

    <div className="hidden sm:contents">
      <div className="h-screen text-center text-[#42406F] text-xs font-bold">
        <img src={RegImg} className="mt-20" alt="Registration" />
        <label>@ Livestock Dispersal Program / Team Roles</label>
        <div className="flex justify-center m-2">
          <BiLogoFacebookCircle size={30} className="m-2" />
          <BiLogoGmail size={30} className="m-2" />
        </div>
      </div>
    </div>
  </div>
  )
}

export default Register;
