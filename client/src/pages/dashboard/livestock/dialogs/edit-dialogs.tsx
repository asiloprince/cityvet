import { z } from "zod";
import { LivestocksType } from "../../../schema";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { isAliveStatus, livestockHealthStatuses } from "../livestock-status";

type EditProps = {
  livestock: LivestocksType;
};

const editSchema = z.object({
  livestock_id: z.number(),
  type: z.string(),
  category: z.string(),
  breed: z.string(),
  age: z.string(),
  health: z.enum(["Excellent", "Good", "Fair", "Poor", "Not set"]).optional(),
  isAlive: z.enum(["Alive", "Deceased", "Unknown"]),
});

type EditSchemaType = z.infer<typeof editSchema>;

export default function LivestockEditDialog({ livestock }: EditProps) {
  const form = useForm<EditSchemaType>({
    resolver: zodResolver(editSchema),

    defaultValues: {
      livestock_id: livestock.livestock_id,
      type: livestock.type,
      category: livestock.category,
      breed: livestock.breed,
      age: livestock.age,
      health: livestock.health,
      isAlive: livestock.isAlive,
    },
  });

  async function onSubmit(values: EditSchemaType) {
    console.log("Form Values:", values);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_PUBLIC_API_URL}/api/livestocks/update/${
          livestock.livestock_id
        }`,
        values,
        { withCredentials: true }
      );
      if (res.status === 200) {
        console.log("Update successful!");
        alert("Update successful!");
        console.log("livestock Data:", livestock);
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
        <DialogTitle>Edit Livestock Details</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Livestock Recieved</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="health"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Health</FormLabel>
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
                        {livestockHealthStatuses.map((status, index) => (
                          <SelectItem key={index} value={status.value}>
                            <span className="flex items-center">
                              <status.icon className="mr-2 h-5 w-5 text-muted-foreground" />
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
            <FormField
              control={form.control}
              name="isAlive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Alive</FormLabel>
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
                        {isAliveStatus.map((status, index) => (
                          <SelectItem key={index} value={status.value}>
                            <span className="flex items-center">
                              <status.icon className="mr-2 h-5 w-5 text-muted-foreground" />
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
            <Button type="submit">Update Details</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
