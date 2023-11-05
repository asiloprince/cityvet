import { useForm } from "react-hook-form";
import { useFormState } from "../../../context/form-context";
import { useState } from "react";
import Select from "../../../../../../components/inputs/select";

type TFormValues = {
  livestock_received: string;
  init_num_heads: number;
  age: string;
};

type DisperseLivestockProps = {
  onHandleNext: () => void;
};

interface Option {
  label: string;
  value: string;
}

export function DisperseLivestock({ onHandleNext }: DisperseLivestockProps) {
  const { setFormData, formData } = useFormState();
  const { register, handleSubmit, setValue } = useForm<TFormValues>({
    defaultValues: formData,
  });

  const [selectedLivestock, setSelectedLivestock] = useState<Option | null>(
    formData.livestock_received
      ? {
          label: formData.livestock_received.toString(),
          value: formData.livestock_received.toString(),
        }
      : null
  );

  const [error, setError] = useState<string | null>(null);

  // Static data for livestock options
  const livestockOptions: Option[] = [
    { value: "Free Range Chickens", label: "Free Range Chickens" },
    { value: "Broiler Chickens", label: "Broiler Chickens" },
    { value: "Swine", label: "Swine" },
  ];

  const onHandleFormSubmit = (data: TFormValues) => {
    if (!data.livestock_received) {
      setError("Please select a livestock");
      return;
    }

    setError(null);
    setFormData((prev: Record<string, unknown>) => ({ ...prev, ...data }));
    onHandleNext();
  };

  return (
    <form
      className="flex flex-col gap-4 bg-cyan-100 p-4 rounded-md shadow-md"
      onSubmit={handleSubmit(onHandleFormSubmit)}
    >
      <div className="flex gap-1 flex-col">
        <label
          htmlFor="livestock_received"
          className="block text-cyan-500 font-semibold"
        >
          Livestock
        </label>
        <Select
          id="livestock_received"
          {...register("livestock_received")}
          className="w-full p-2 border rounded-md focus:border-cyan-500"
          label="Livestock"
          options={livestockOptions}
          onChange={(value) => {
            setSelectedLivestock(value[0] ?? null);
            setValue("livestock_received", value[0]?.value ?? null);
          }}
          value={selectedLivestock ? [selectedLivestock] : []}
        />
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="initialNumberOfHeads"
            className="text-sm font-medium text-gray-600"
          >
            Initial Number of Heads
          </label>
          <input
            id="initialNumberOfHeads"
            {...register("init_num_heads")}
            type="number"
            required={true}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="notes" className="text-sm font-medium text-gray-600">
            Age
          </label>
          <input
            id="notes"
            {...register("age")}
            type="text"
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="h-11 px-6 inline-block bg-cyan-500 font-semibold text-white rounded-md"
        >
          Next
        </button>
      </div>
    </form>
  );
}
