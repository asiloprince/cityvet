import { useForm } from "react-hook-form";
import { useFormState } from "../../../context/form-context";
import { useState, useEffect } from "react";
import axios from "axios";
import Select from "../../../../../../components/inputs/select";

type TFormValues = {
  livestock_id: string;
};

type DisperseLivestockProps = {
  onHandleNext: () => void;
};

interface Option {
  label: string;
  value: string;
}

interface Livestock {
  livestock_id: string;
  ear_tag: string;
  category: string;
}

export function DisperseLivestock({ onHandleNext }: DisperseLivestockProps) {
  const { setFormData, formData } = useFormState();
  const { register, handleSubmit, setValue } = useForm<TFormValues>({
    defaultValues: formData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [livestocks, setLivestocks] = useState<Livestock[]>([]);
  const [selectedLivestock, setSelectedLivestock] = useState<Option[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_PUBLIC_API_URL}/api/livestocks/undispersed`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setLivestocks(response.data.data);
        setIsLoading(false);

        if (formData.livestock_id) {
          const selectedLivestock = response.data.data.find(
            (livestock: Livestock) =>
              livestock.livestock_id === formData.livestock_id
          );

          if (selectedLivestock) {
            setSelectedLivestock([
              {
                value: selectedLivestock.livestock_id,
                label: `${selectedLivestock.type} - ${selectedLivestock.ear_tag}`,
              },
            ]);
          }
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [formData.livestock_id]);

  const onHandleFormSubmit = (data: TFormValues) => {
    if (!data.livestock_id) {
      setError("Please select a livestock");
      return;
    }

    setError(null);
    setFormData((prev: Record<string, unknown>) => ({ ...prev, ...data }));
    onHandleNext();
  };

  return (
    <form
      className="flex flex-col gap-4 p-4 rounded-md "
      onSubmit={handleSubmit(onHandleFormSubmit)}
    >
      <div className="flex gap-1 flex-col">
        <label
          htmlFor="livestock_id"
          className="block text-cyan-500 font-semibold mb-4"
        >
          Livestock to recieved
        </label>
        <Select
          id="livestock_id"
          {...register("livestock_id")}
          className="w-full p-2 border rounded-md focus:border-cyan-500"
          disabled={isLoading}
          label="Livestock"
          options={livestocks.map((livestock) => ({
            value: livestock.livestock_id,
            label: `${livestock.category} - ${livestock.ear_tag}`,
          }))}
          onChange={(value) => {
            if (value[0]) {
              setSelectedLivestock([...value]);
              setValue("livestock_id", value[0].value);
            } else {
              setSelectedLivestock([]);
              setValue("livestock_id", "");
            }
          }}
          value={selectedLivestock}
        />
        {error && <p className="text-red-500">{error}</p>}
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
