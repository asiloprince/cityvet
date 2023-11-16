import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
import SelectLivestock from "../../../../../components/inputs/select-livestock";
import { DispersalType } from "../../../../schema";
import { toast } from "react-toastify";

type LivestockRedispersalProps = {
  dispersal: DispersalType;
};

const redispersalSchema = z.object({
  beneficiary_id: z.string(),
  dispersal_date: z.string(),
  contract_details: z.string(),
  current_beneficiary: z.string(),
  redispersal_date: z.string(),
  prev_ben_id: z.number(),
  notes: z.string(),
  livestock_id: z.string(),
  init_num_heads: z.number(),
});

type RedispersalSchemaType = z.infer<typeof redispersalSchema>;

export default function LivestockRedispersalForm({
  dispersal,
}: LivestockRedispersalProps) {
  const form = useForm<RedispersalSchemaType>({
    resolver: zodResolver(redispersalSchema),
    defaultValues: {
      beneficiary_id: "",
      dispersal_date: "",
      contract_details: "",
      redispersal_date: "",
      prev_ben_id: dispersal.beneficiary_id,
      current_beneficiary: dispersal.current_beneficiary,
      notes: "",
      livestock_id: "",
      init_num_heads: 1,
    },
  });

  const onSubmit = async (data: RedispersalSchemaType) => {
    console.log("Form Values:", data);

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_PUBLIC_API_URL
        }/api/dispersals/single-dispersions/redisperse`,
        data,
        { withCredentials: true }
      );

      if (response.data.success) {
        (response.data.message);
        toast.success("Dispersal to new beneficiary Completed")
      } else {
        toast.error("Dispersal was not created. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("There was an error Redispersing the livestock. Please try again.");
    }
  };

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
                      type="text"
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
                <p className="text-gray-700">{dispersal.current_beneficiary}</p>
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
            name="livestock_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="livestock_id">Livestock</FormLabel>
                <FormControl>
                  <SelectLivestock
                    value={String(field.value)}
                    onChange={(value) => field.onChange(String(value))}
                  />
                </FormControl>
                {form.formState.errors.livestock_id && <FormMessage />}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="init_num_heads"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="init_num_heads">
                  Initial Number of Heads
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    id="init_num_heads"
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
          <FormField
            control={form.control}
            name="dispersal_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="dispersal_date">Dispersal Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" id="dispersal_date" />
                </FormControl>
                {form.formState.errors.dispersal_date && <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contract_details"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="contract_details">
                  Contract Details
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" id="contract_details" />
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
                <FormLabel htmlFor="notes">Notes</FormLabel>
                <FormControl>
                  <Input {...field} type="text" id="notes" />
                </FormControl>
                {form.formState.errors.notes && <FormMessage />}
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="mt-4 bg-cyan-600 hover-bg-cyan-700 text-white"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
