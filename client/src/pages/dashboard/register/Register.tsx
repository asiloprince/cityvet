import { useState } from "react";
import { BiLogoGmail, BiLogoFacebookCircle } from "react-icons/bi";
import RegImg from "../.././../assets/RegisterImg.png";
import SectionContent, {
  SectionTitle,
  SectionWrapper,
} from "../../../components/section-content/sectionContent";
import ImageCard from "../../../components/image-card/imageCard";
import Manager from "../.././../assets/manager.png";
import Coordinator from "../.././../assets/coordinator.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const Register = () => {
  const steps = ["roles", "register"];
  const [currentStep, setCurrentStep] = useState("roles");
  const [payload, setPayload] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roleType: "",
    confirmPassword: "",
  });

  const handleRoleSelect = (role: number | string) => {
    const roleString = typeof role === "number" ? role.toString() : role;
    setPayload({ ...payload, roleType: roleString });
    goToNextStep();
  };

  const goToNextStep = () => {
    setCurrentStep(steps[steps.indexOf(currentStep) + 1]);
  };

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (payload.password !== payload.confirmPassword) {
      alert("Please make sure that the confirm password field is correct.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PUBLIC_API_URL}/auth/register`,
        payload,
        { withCredentials: true }
      );
      toast.success("Registration successful:", response.data);
      if (response.status === 200) {
        navigate("/roles");
      } else {
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong!");
    }

    setPayload({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roleType: "",
      confirmPassword: "",
    });
  };

  return (
    <div>
      {currentStep === "roles" ? (
        <div>
          <div className="flex items-start justify-end">
            <button onClick={() => navigate("/login")}>
              <ArrowLeft className="h-8 w-8 mt-4 mr-4 p-auto" />
            </button>
          </div>
          <SectionContent className="bg-light-background p-4">
            <SectionTitle>
              <h1 className="text-3xl font-bold p-4">Register</h1>
              <p className="p-4">Select your roles.</p>
            </SectionTitle>
            <SectionWrapper className="flex flex-col gap-4 lg:flex-row lg:gap-4 items-center justify-between">
              <ImageCard
                className="w-full lg:w-1/2 p-12 object-cover"
                imageLink={Manager}
                title="Program Manager"
                description="Manage Dispersals, Livestocks and Beneficiaries"
                onClick={() => handleRoleSelect(2)}
              />
              <ImageCard
                className="w-full lg:w-1/2 p-12 object-cover"
                imageLink={Coordinator}
                title="Coordinator"
                description="Manage Livestocks and Beneficiaries."
                onClick={() => handleRoleSelect(3)}
              />
            </SectionWrapper>
          </SectionContent>
        </div>
      ) : (
        <div className="sm:grid sm:grid-cols-2">
          <div className="sm:m-2 sm:mt-4 sm:max-w-[500px] sm:mx-auto">
            <form
              className="sm:rounded-md sm:grid sm:justify-center mt-8 sm:mt-10 text-gray-400"
              onSubmit={handleSubmit}
            >
              <div className="text-center m-12">
                <label className="m-4 sm:m-0 text-3xl font-bold sm:text-4xl sm:font-bold text-cyan-600">
                  Welcome!!
                  <br />
                </label>
                <label className="sm:m-0 text-sm">
                  Sign up for your Account
                </label>
              </div>

              <div className="sm:flex">
                <div className="grid grid-cols-1 m-2">
                  <label className="font-bold">
                    First Name <span className="text-cyan-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="Enter First Name"
                    className="p-2 border-b-2 sm:border-2 sm:rounded-lg outline-none focus:border-cyan-600"
                    onChange={(e) =>
                      setPayload({ ...payload, firstName: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 m-2">
                  <label className="font-bold">
                    Last Name <span className="text-cyan-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Enter Last Name"
                    className="p-2 border-b-2 sm:border-2 sm:rounded-lg outline-none focus:border-cyan-600"
                    onChange={(e) =>
                      setPayload({ ...payload, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 m-2">
                <label className="font-bold">
                  Email Address <span className="text-cyan-600">*</span>
                </label>
                <input
                  type="text"
                  name="email"
                  required
                  placeholder="Enter Email"
                  className="p-2 border-b-2 sm:border-2 sm:rounded-lg outline-none focus:border-cyan-600"
                  onChange={(e) =>
                    setPayload({ ...payload, email: e.target.value })
                  }
                />
              </div>

              <div className="sm:flex">
                <div className="grid grid-cols-1 m-2">
                  <label className="font-bold">
                    Create Password<span className="text-cyan-600">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Enter Password"
                    className="p-2 border-b-2 sm:border-2 sm:rounded-lg outline-none focus:border-cyan-600"
                    onChange={(e) =>
                      setPayload({ ...payload, password: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 m-2">
                  <label className="font-bold">
                    Confirm Password <span className="text-cyan-600">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="Enter Confirm Password"
                    className="p-2 border-b-2 sm:border-2 sm:rounded-lg outline-none focus:border-cyan-600"
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="text-center text-white h-10 m-2 p-2 bg-cyan-600 rounded-full">
                <button type="submit" className="font-bold">
                  Sign Up
                </button>
              </div>
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
      )}
    </div>
  );
};

export default Register;
