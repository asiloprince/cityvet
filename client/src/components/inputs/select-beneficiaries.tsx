import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import Select from "./select";
import { MultiValue } from "react-select";

// Define the interfaces for Beneficiary and Option
interface Beneficiary {
  beneficiary_id: string;
  full_name: string;
}

interface Option {
  value: string;
  label: string;
}

interface SelectBeneficiaryProps {
  value: string | null;
  onChange: (value: string) => void;
  styles?: any;
}

const SelectBeneficiary = forwardRef((props: SelectBeneficiaryProps, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PUBLIC_API_URL}/api/beneficiaries`,
          {
            withCredentials: true,
          }
        );
        if (response.data) {
          setBeneficiaries(response.data);
        } else {
          console.log("Unexpected errors");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBeneficiaries();
  }, []);

  const options: Option[] = beneficiaries.map((beneficiary) => ({
    value: beneficiary.beneficiary_id,
    label: beneficiary.full_name,
  }));

  const handleChange = (value: MultiValue<Option>) => {
    let selectedValue = "";
    if (value !== null && value !== undefined) {
      selectedValue = value[0]?.value || "";
    }
    props.onChange(selectedValue as string);
  };

  const currentOption = options.find((option) => option.value === props.value);

  useImperativeHandle(ref, () => ({}));

  return (
    <Select
      id="beneficiary_id"
      className="w-full p-2 border rounded-md focus:border-cyan-500"
      disabled={isLoading}
      label=""
      options={options}
      onChange={handleChange}
      value={currentOption ? [currentOption] : undefined}
      placeholder="Search new recipients..."
    />
  );
});

export default SelectBeneficiary;
