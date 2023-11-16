import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../components/ui/form";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import SelectBeneficiary from "../../../../../components/inputs/select-beneficiaries";
import { BatchLivestocksDispersalType } from "../../../../schema";
import { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";

type BatchRedispersalProps = {
  batch: BatchLivestocksDispersalType;
};

interface Option {
  label: string;
  value: string;
}

const redispersalSchema = z.object({
  beneficiary_id: z.string(),
  dispersal_date: z.string(),
  contract_details: z.string().optional(),
  redispersal_date: z.string().optional(),
  prev_ben_id: z.number(),
  notes: z.string().optional(),
  livestock_received: z.string(),
  age: z.string(),
  init_num_heads: z.number(),
});

type RedispersalSchemaType = z.infer<typeof redispersalSchema>;

export default function BatchRedispersalForms({
  batch,
}: BatchRedispersalProps) {
  const form = useForm<RedispersalSchemaType>({
    resolver: zodResolver(redispersalSchema),
    defaultValues: {
      beneficiary_id: "",
      dispersal_date: "",
      contract_details: "",
      redispersal_date: "",
      prev_ben_id: batch.beneficiary_id,
      notes: "",
      age: "",
      livestock_received: "",
      init_num_heads: 0,
    },
  });

  const onSubmit = async (data: RedispersalSchemaType) => {
    console.log("Form Values:", data);

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_PUBLIC_API_URL
        }/api/dispersals/batch-dispersals/redisperse`,
        data,
        { withCredentials: true }
      );

      if (response.data.success) {
        alert(response.data.message);
        toast.success("Redispersal Success");
      } else {
        toast.error("Dispersal was not created. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "There was an error Redispersing the livestock. Please try again."
      );
    }
  };

  const [selectedLivestock, setSelectedLivestock] = useState<Option | null>(
    form.getValues().livestock_received
      ? {
          label: form.getValues().livestock_received.toString(),
          value: form.getValues().livestock_received.toString(),
        }
      : null
  );

  // Static data for livestock options
  const livestockOptions: Option[] = [
    { value: "Free Range Chickens", label: "Free Range Chickens" },
    { value: "Broiler Chickens", label: "Broiler Chickens" },
    { value: "Swine", label: "Swine" },
  ];

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between ">
            <FormField
              control={form.control}
              name="prev_ben_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="prev_ben_id">Beneficiary ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      id="prev_ben_id"
                      readOnly
                      className="w-12"
                    />
                  </FormControl>
                  {form.formState.errors.prev_ben_id && <FormMessage />}
                </FormItem>
              )}
            />
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 my-0.5">
                Full Name
              </label>
              <div className="border border-gray-300 p-2 rounded w-72 mt-1">
                <p className="text-gray-700">{batch.current_beneficiary}</p>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-6">
              <div className="w-full border-t border-gray-300"></div>
              <span className="text-gray-600 px-2">Redisperse</span>
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="beneficiary_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="beneficiary_id">New Recipients</FormLabel>
                <FormControl>
                  <SelectBeneficiary
                    value={String(field.value)}
                    onChange={(value) => field.onChange(String(value))}
                  />
                </FormControl>
                {form.formState.errors.beneficiary_id && <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="livestock_received"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="livestock_received">
                  Livestock Received
                </FormLabel>
                <FormControl>
                  <Select
                    value={selectedLivestock}
                    onChange={(selectedOption) => {
                      setSelectedLivestock(selectedOption);
                      field.onChange(
                        selectedOption ? selectedOption.value : ""
                      );
                    }}
                    options={livestockOptions}
                  />
                </FormControl>
                {form.formState.errors.livestock_received && <FormMessage />}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dispersal_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dispersal Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                {form.formState.errors.dispersal_date && <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                {form.formState.errors.age && <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contract_details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Details</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                {form.formState.errors.contract_details && <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                {form.formState.errors.notes && <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="init_num_heads"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Number Of Heads</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                  />
                </FormControl>
                {form.formState.errors.init_num_heads && <FormMessage />}
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
