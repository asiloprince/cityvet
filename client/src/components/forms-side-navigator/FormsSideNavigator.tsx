import { useFormState } from "../../pages/dashboard/dispersal/context/form-context";

const SideNavigator = () => {
  const { step } = useFormState();

  const steps = [
    { number: 1, title: "Livestock Info" },
    { number: 2, title: "Recipient Info" },
    { number: 3, title: "Dispersal Info" },
  ];

  return (
    <div className="w-full md:w-1/4 bg-gray-100 p-4">
      <div className="mb-4 text-2xl font-semibold text-cyan-700">
        Step Navigator
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

        {steps.map((s) => (
          <li
            key={s.number}
            className={`py-2 px-4 rounded-full md:rounded cursor-pointer z-10 ${
              s.number <= step ? "bg-cyan-500 text-white" : "bg-gray-200"
            }`}
          >
            <span className="md:hidden">{s.number}</span>
            <span className="hidden md:inline">
              Step {s.number}: {s.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideNavigator;
