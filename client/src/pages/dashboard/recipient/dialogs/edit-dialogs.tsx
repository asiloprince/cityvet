import { z } from "zod";
import { RecipientsType } from "../../../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import Select from "react-select";

import { DialogHeader, DialogTitle } from "../../../../components/ui/dialog";
import { inputBarangays } from "../input/barangay-input";
import axios from "axios";
import { DatePicker } from "../../../../components/date-picker/datepicker";

type EditProps = {
  recipient: RecipientsType;
};

const editSchema = z.object({
  beneficiary_id: z.number(),
  full_name: z.string().min(1, { message: "Full Name Required" }),
  birth_date: z.string(),
  mobile: z.string(),
  barangay_id: z.number().min(1).max(105),
  barangay_name: z.string(),
});

type EditSchemaType = z.infer<typeof editSchema>;

export default function EditDialog({ recipient }: EditProps) {
  const form = useForm<EditSchemaType>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      beneficiary_id: recipient.beneficiary_id,
      full_name: recipient.full_name,
      birth_date: recipient.birth_date,
      mobile: recipient.mobile,
      barangay_id: recipient.barangay_id,
      barangay_name: recipient.barangay_name,
    },
  });

  const options = inputBarangays.map((barangay) => ({
    value: barangay.value,
    label: barangay.label,
  }));

  async function onSubmit(values: EditSchemaType) {
    console.log("Form Values:", values);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_PUBLIC_API_URL}/api/beneficiaries/update/${
          recipient.beneficiary_id
        }`,
        values,
        { withCredentials: true }
      );
      if (res.status === 200) {
        console.log("Update successful!");
        alert("Update successful!");
      } else {
        console.log("Update failed with status: ", res.status);
        alert("Update failed. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred while updating: ", error);
      alert("An error occurred. Please try again.");
    }
  }

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Edit Recipient Details</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <div className="w-full">
                  <FormLabel htmlFor="birth_date">Date of Birth</FormLabel>
                  <FormControl>
                    <div className="w-full">
                      <DatePicker
                        id="birth_date"
                        onChange={field.onChange}
                        value={field.value as string | null}
                      />
                      <FormMessage />
                    </div>
                  </FormControl>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="barangay_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="barangay_id">Barangay ID</FormLabel>
                  <Select
                    inputId="barangay_id"
                    value={options.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value)}
                    options={options}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-2 w-full">
              Update Details
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
