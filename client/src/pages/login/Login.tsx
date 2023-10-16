import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { FcGoogle } from "react-icons/fc";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (evt: React.FormEvent) => {
    evt.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PUBLIC_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (!response.data.success) {
        return alert(response.data.message);
      }

      return navigate("/auth");
    } catch (error) {
      return alert("An error occured while signing you in.");
    }
  };
  return (
    <div className="grid grid-cols-1 sm:h-screen md:grid-cols-3 lg:grid-cols-3 md:h-screen lg:h-screen">
      <div className=" bg-cyan-600 h-44 lg:h-auto  ">
        <section className="text-white text-center grid grid-cols-1">
          <h1 className="text-1xl md:text-3xl lg:text-2xl font-bold mt-8 sm:mt-4 md:mt-56 font-poppin">
            Hi, Welcome !
          </h1>
          <p className="text-xs md:text-sm lg:text-base text-[#e5e7eb]  mt-4 font-poppin">
            To keep connected with us please<br></br>login your personal info.
          </p>
          <div className="mt-4 sm:mt-4 md:mt-8 lg:mt-12 flex justify-center">
            <Button
              variant={"outline"}
              className="border bg-cyan-600 w-48 center font-poppin"
            >
              SIGN UP
            </Button>
          </div>
        </section>
      </div>
      <div className="col-span-2 max-w-[600px] mx-auto">
        <form className=" grid sm:grid-cols-1 p-4 sm:justify-center text-[#9ca3af] ">
          <h1 className="text-center text-2xl text-cyan-600 font-bold mt-12 font-poppin">
            Sign in
          </h1>

          <div className="mt-8 grid md:grid-cols-1 text-center items-center border-b-2 ">
            {/* <button className="indent-5 mt-4 flex justify-center m-4 border-2 p-1 sm:p-4 md:p-4 lg:p-4 xl:p-4 rounded-full font-bold text-[black] text-lg">
              <FcGoogle size={25} />
              Sign in with Google
            </button> */}

            <div className="bg-white max-w-[500px] p-1 mx-auto mb-[-15px] ">
              <p className="text-center text-sm">or Sign in with email</p>
            </div>
          </div>

          <label
            htmlFor="email"
            className="text-sm sm:text-sm md:text-base lg:text-base xl:text-base mt-8 "
          >
            Email<span className="text-[#0ea5e9]"> *</span>
          </label>
          <input
            type="text"
            placeholder="Email Address"
            required
            id="email"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
            className="p-2 border-2 rounded-lg text-sm"
            autoComplete="email"
          ></input>

          <label
            htmlFor="password"
            className="text-sm sm:text-sm md:text-base lg:text-base xl:text-base mt-4"
          >
            Password<span className="text-[#0ea5e9]"> *</span>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            required
            id="password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
            className="p-2 border-2 rounded-lg text-sm"
            autoComplete="current-password"
          ></input>

          <div className="mt-2 flex">
            <input id="rememberMe" type="checkbox" />
            <label
              htmlFor="rememberMe"
              className="indent-2 sm:indent-4   md:indent-4   lg:indent-4   xlindent-4  : font-semibold text-sm"
            >
              Remember Me
            </label>
            <a
              href=""
              className="indent-14 sm:indent-48  md:indent-48   lg:indent-48   xl:indent-48 text-cyan-600 font-semibold text-sm"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="button"
            className="items-center h-8  mt-8 text-[white] rounded-full bg-cyan-600 font-poppin"
            onClick={handleLogin}
          >
            Login
          </button>
          <p className="text-center text-xs  mt-4">
            By continuing, you agree to the{" "}
            <a href="" className="underline underline-offset-1">
              Terms of use
            </a>{" "}
            and{" "}
            <a href="" className="underline underline-offset-1">
              Privacy Policy.
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
