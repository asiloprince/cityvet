import { z } from "zod";
import { DispersalType } from "../../pages/dashboard/dispersal/single-dispersion/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { statuses } from "../data-table/data-table-status-filter";
import { Button } from "../../components/ui/button";
import { DialogHeader, DialogTitle } from "../../components/ui/dialog";

type EditProps = {
  dispersal: DispersalType;
};

const editSchema = z.object({
  id: z.number(),
  category: z.enum(["Cattle", "CPDO Cattle", "Goat - Doe"]),
  notes: z.string(),
  contract_details: z.string(),
  init_num_heads: z.number(),
  num_of_heads: z.number(),
  age: z.string(),
  status: z.enum(["Dispersed", "Redispersed", "Archived"]),
});

type editSchemaType = z.infer<typeof editSchema>;

export default function EditDialog({ dispersal }: EditProps) {
  const form = useForm<editSchemaType>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      id: dispersal.dispersal_id,
      category: dispersal.category,
      notes: dispersal.notes,
      contract_details: dispersal.contract_details,
      init_num_heads: dispersal.init_num_heads,
      num_of_heads: dispersal.num_of_heads,
      age: dispersal.age,
      status: dispersal.status,
    },
  });

  function onSubmit(values: editSchemaType) {
    console.log(values);
  }
  return (
    <div>
      <DialogHeader>
        <DialogTitle>Edit dispersal Details</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            <FormField
              control={form.control}
              name="contract_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Details</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="init_num_heads"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Number of Heads</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="num_of_heads"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Heads</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Status to Update" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {statuses.map((status, index) => (
                          <SelectItem key={index} value={status.value}>
                            <span className="flex items-center">
                              {status.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
