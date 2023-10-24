import { useForm } from "react-hook-form";
import { useFormState } from "../../../context/form-context";
import { useState } from "react";
import axios from "axios";

type TFormValues = {
  dispersal_date: string;
  contract_details: string;
  notes: string;
  initialNumberOfHeads: number;
};

type DispersalFormProps = {
  onHandleBack: () => void;
};

export function DispersalForm({ onHandleBack }: DispersalFormProps) {
  const [isCreated, setCreated] = useState(false);
  const { setFormData, formData } = useFormState();
  const { register, handleSubmit } = useForm<TFormValues>({
    defaultValues: formData,
  });

  const onHandleFormSubmit = async (data: TFormValues) => {
    setFormData((prev: Record<string, unknown>) => ({ ...prev, ...data }));
    setCreated(true);
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_PUBLIC_API_URL
        }/api/dispersals/single-dispersions/disperse`,
        data,
        { withCredentials: true }
      );

      console.log(response.data);
    } catch (error) {
      console.error("Failed to submit data:", error);
    }
  };

  return isCreated ? (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <p className="text-green-500 font-bold text-xl mb-4">
        Account created successfully
      </p>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(formData, null, 2)}
      </pre>
    </div>
  ) : (
    <form onSubmit={handleSubmit(onHandleFormSubmit)}>
      <div className="flex flex-col space-y-2">
        <label
          htmlFor="dispersal_date"
          className="text-sm font-medium text-gray-600"
        >
          Dispersal Date
        </label>
        <input
          autoFocus
          id="dispersal_date"
          {...register("dispersal_date")}
          type="date"
          required={true}
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label
          htmlFor="contract_details"
          className="text-sm font-medium text-gray-600"
        >
          Contract Details
        </label>
        <input
          id="contract_details"
          {...register("contract_details")}
          type="text"
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="notes" className="text-sm font-medium text-gray-600">
          Notes
        </label>
        <input
          id="notes"
          {...register("notes")}
          type="text"
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label
          htmlFor="initialNumberOfHeads"
          className="text-sm font-medium text-gray-600"
        >
          Initial Number of Heads
        </label>
        <input
          id="initialNumberOfHeads"
          {...register("initialNumberOfHeads")}
          type="number"
          required={true}
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-4 mt-4">
        <button
          type="button"
          onClick={onHandleBack}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          Create
        </button>
      </div>
    </form>
  );
}
