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

import axios from "axios";
import { DialogHeader, DialogTitle } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";

type EditProps = {
  recipient: RecipientsType;
};

const editSchema = z.object({
  beneficiary_id: z.number(),
  full_name: z.string().refine((value) => value === null || value.length >= 1, {
    message: "Full name must be a non-empty string or null.",
  }),
  birth_date: z.string(),
  mobile: z.string(),
  barangay_id: z.number().refine((value) => !isNaN(value), {
    message: "Barangay ID must be a number.",
  }),
  barangay_name: z.string(),
});

type EditSchemaType = z.infer<typeof editSchema>;

export default function LivestockEditDialog({ recipient }: EditProps) {
  const form = useForm<EditSchemaType>({
    resolver: zodResolver(editSchema),

    defaultValues: {
      beneficiary_id: recipient.beneficiary_id,
      full_name: recipient.full_name,
      birth_date: recipient.birth_date,
      mobile: recipient.mobile,
      barangay_id: Number(recipient.barangay_id),
      barangay_name: recipient.barangay_name,
    },
  });

  async function onSubmit(values: EditSchemaType) {
    console.log("Form Values:", values);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/livestocks/update/${recipient.beneficiary_id}`,
        values,
        { withCredentials: true }
      );
      if (res.status === 200) {
        console.log("Update successful!");
        alert("Update successful!");
        console.log("Recipient Data:", recipient);
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
              name="beneficiary_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beneficiary ID</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
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
                <FormItem>
                  <FormLabel>Birth Date</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
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
                  <FormLabel>Barangay ID</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="barangay_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barangay Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update Details</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
