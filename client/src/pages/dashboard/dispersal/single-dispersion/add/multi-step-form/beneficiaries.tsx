import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Select from "../../../../../../components/inputs/select";
import { useFormState } from "../../../context/form-context";

type TFormValues = {
  beneficiary_id: string;
};

type DispersalRecipientProps = {
  onHandleNext: () => void;
  onHandleBack: () => void;
};

interface Option {
  label: string;
  value: string;
}

interface Beneficiary {
  beneficiary_id: string;
  full_name: string;
}

export function DispersalRecipient({
  onHandleNext,
  onHandleBack,
}: DispersalRecipientProps) {
  const { register, handleSubmit, setValue } = useForm<TFormValues>();
  const { setFormData, formData } = useFormState();
  const [isLoading, setIsLoading] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Option[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_PUBLIC_API_URL}/api/beneficiaries`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data && response.data) {
          setBeneficiaries(response.data);

          const storedBeneficiaryId = formData.beneficiary_id;
          if (storedBeneficiaryId) {
            // Find the corresponding beneficiary object
            const storedBeneficiary = response.data.find(
              (beneficiary: Beneficiary) =>
                beneficiary.beneficiary_id === storedBeneficiaryId
            );
            if (storedBeneficiary) {
              setSelectedBeneficiary([
                {
                  value: storedBeneficiary.beneficiary_id,
                  label: storedBeneficiary.full_name,
                },
              ]);
              setValue("beneficiary_id", storedBeneficiary.beneficiary_id);
            }
          }
        } else {
          console.error("Unexpected api errors");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [formData.beneficiary_id, setValue]);

  const onHandleFormSubmit = (data: TFormValues) => {
    if (!data.beneficiary_id) {
      setError("Please select a beneficiary");
      return;
    }

    setError(null);
    // store data in context
    setFormData((prev: Record<string, unknown>) => ({ ...prev, ...data }));
    onHandleNext();
  };

  return (
    <div className=" p-4 rounded-md gap-4 ">
      <form onSubmit={handleSubmit(onHandleFormSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="beneficiary_id"
            className="block text-cyan-500 font-semibold mb-4"
          >
            Recipients Name
          </label>
          <Select
            id="beneficiary_id"
            {...register("beneficiary_id")}
            className="w-full p-2 border rounded-md focus:border-cyan-500"
            disabled={isLoading}
            label="Beneficiary"
            options={beneficiaries.map((beneficiary) => ({
              value: beneficiary.beneficiary_id,
              label: beneficiary.full_name,
            }))}
            onChange={(value) => {
              setSelectedBeneficiary([...value]);
              setValue("beneficiary_id", value[0].value);
            }}
            value={selectedBeneficiary}
          />
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onHandleBack}
            className="w-24 h-10 bg-cyan-500 text-white rounded-md"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-24 h-10 bg-cyan-500 text-white rounded-md"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
