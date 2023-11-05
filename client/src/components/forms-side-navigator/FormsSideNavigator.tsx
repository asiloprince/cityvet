import { useFormState } from "../../pages/dashboard/dispersal/context/form-context";
import { Icons } from "../icons";

const SideNavigator = () => {
  const { step } = useFormState();

  const steps = [
    {
      icon: Icons.livestockInfo,
      title: "Livestock Info",
      message: "Let's begin with the livestock information.",
    },
    {
      icon: Icons.recipientInfo,
      title: "Recipient Info",
      message: "Provide us with the recipient's information.",
    },
    {
      icon: Icons.dispersalInfo,
      title: "Dispersal Info",
      message: "Give us the details of the dispersal.",
    },
  ];

  return (
    <div className="w-full md:w-1/4 bg-gray-100 p-4 rounded-md">
      <div className="mb-4 text-2xl font-semibold text-cyan-700 py-2 px-4 font-poppin">
        {steps[step - 1].message}
      </div>
      <ul className="flex justify-between md:block md:space-y-2 space-x-2 lg:space-y-8 md:space-x-0 relative">
        <div
          style={{ width: `calc(100% - 2rem)` }}
          className={`absolute h-0.5 bg-gray-300 bottom-5 left-8 w-full md:hidden z-0`}
        />

        <div
          style={{
            width: `calc(${((step - 1) / (steps.length - 1)) * 100}% - 3rem)`,
          }}
          className={`absolute h-0.5 bg-cyan-500 mt-8 left-8 bottom-5 transition-all duration-500 ease-in-out z-[-1]${
            step > 1 ? "w-full" : "w-0"
          } md:hidden `}
        />

        {steps.map((s, index) => (
          <li
            key={index}
            className={`py-2 px-4 rounded-full md:rounded cursor-pointer z-10 ${
              index + 1 <= step
                ? "bg-cyan-500 text-white icon-white"
                : "bg-gray-200 text-cyan-600 icon-cyan"
            }`}
          >
            <div className="flex items-center space-x-2">
              <s.icon size={24} />
              <span className="hidden md:inline font-semibold">
                : {s.title}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideNavigator;
