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
import { DispersalType } from "../../../../schema";
import { toast } from "react-toastify";

type LivestockTransferProps = {
  dispersal: DispersalType;
};

const redispersalSchema = z.object({
  beneficiary_id: z.string(),
  dispersal_date: z.string(),
  contract_details: z.string(),
  notes: z.string(),
  num_of_heads: z.number(),
});

type RedispersalSchemaType = z.infer<typeof redispersalSchema>;

export default function TransferLivestockForm({
  dispersal,
}: LivestockTransferProps) {
  const form = useForm<RedispersalSchemaType>({
    resolver: zodResolver(redispersalSchema),
    defaultValues: {
      beneficiary_id: "",
      dispersal_date: "",
      contract_details: "",
      notes: "",
      num_of_heads: dispersal.num_of_heads,
    },
  });

  const numOfHeads = form.watch("num_of_heads");
  const onSubmit = async (data: RedispersalSchemaType) => {
    console.log("Form Values:", data);

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_PUBLIC_API_URL
        }/api/dispersals/single-dispersions/redisperse/${
          dispersal.dispersal_id
        }`,
        data,
        { withCredentials: true }
      );

      console.log(response.data);
      if (response.status === 200) {
        toast.success("Transfe to new recipient completed.");
      }
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
      toast.error("There was an error transferring the dispersal.");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
            name="contract_details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Details</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                {form.formState.errors.notes && <FormMessage />}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="num_of_heads"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Number Of Heads</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                  />
                </FormControl>
                {form.formState.errors.num_of_heads && <FormMessage />}
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white"
              disabled={numOfHeads === 0}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
