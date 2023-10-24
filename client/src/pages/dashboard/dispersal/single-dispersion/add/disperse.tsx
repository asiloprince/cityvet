import SideNavigator from "../../../../../components/forms-side-navigator/FormsSideNavigator";
import { useFormState } from "../../context/form-context";
import { FormProvider } from "../../context/single-dispersions-context";
import { DispersalRecipient } from "./multi-step-form/beneficiaries";
import { DispersalForm } from "./multi-step-form/dispersals";
import { DisperseLivestock } from "./multi-step-form/livestocks";

function ActiveStepFormComponent() {
  const { step, onHandleNext, onHandleBack } = useFormState();

  const handleNext = () => {
    if (step < 3) {
      onHandleNext();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      onHandleBack();
    }
  };

  switch (step) {
    case 1:
      return <DisperseLivestock onHandleNext={handleNext} />;
    case 2:
      return (
        <DispersalRecipient
          onHandleNext={handleNext}
          onHandleBack={handleBack}
        />
      );
    case 3:
      return <DispersalForm onHandleBack={handleBack} />;
    default:
      return null;
  }
}
export default function SingleDispersions() {
  return (
    <main className="flex  flex-col items-center justify-between p-16 pt-12">
      <div className="flex flex-col md:flex-row w-full max-w-8xl flex-grow gap-4">
        <FormProvider>
          <SideNavigator />
          <div className="p-6 w-full md:w-3/4 border rounded-xl bg-white flex-grow">
            <h1 className="text-center text-2xl font-semibold py-4">
              Disperse
            </h1>
            <div className="space-y-6">
              <div className="w-full md:w-auto">
                <ActiveStepFormComponent />
              </div>
            </div>
          </div>
        </FormProvider>
      </div>
    </main>
  );
}
