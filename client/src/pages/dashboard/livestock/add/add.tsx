import { useState } from "react";
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
} from "../../../../components/ui/form";

import axios from "axios";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { DialogHeader } from "../../../../components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Select from "react-select";
import { toast } from "react-toastify";

const livestockSchema = z.object({
  type: z.string().min(1, { message: "Type Required" }),
  category: z.string().min(1, { message: "Category Required" }),
  // breed: z.string().min(1, { message: "Breed Required" }),
  age: z.string().min(1, { message: "Age Required" }),
  ear_tag: z.string().min(1, { message: "Ear Tag Required" }),
  health: z.literal("Not set").optional(),
});

type LivestocksType = z.infer<typeof livestockSchema>;

interface Option {
  label: string;
  value: string;
}

function generateEarTag() {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const randomKey = Array(3)
    .fill("")
    .map(() => Math.random().toString(36).substring(2, 3))
    .join("")
    .toUpperCase();
  return `${currentYear}-${randomKey}`;
}

const livestockTypesOptions: Option[] = [
  { value: "Cattle", label: "Catle" },
  { value: "Goat", label: "Goat" },
];

const livestockCategoryOptions: Option[] = [
  { value: "Cattle", label: "Cattle" },
  { value: "CPDO Cattle", label: "CPDO Cattle" },
  { value: "Goat", label: "Goat" },
  { value: "Goat - Doe", label: "Goat - Doe" },
  { value: "Goat - Buck", label: "Goat - Buck" },
];

export default function AddNewLivestockForm() {
  const [filteredCategoryOptions, setFilteredCategoryOptions] = useState<
    Option[]
  >(livestockCategoryOptions);

  const form = useForm<LivestocksType>({
    resolver: zodResolver(livestockSchema),
    defaultValues: {
      type: "",
      category: "",
      // breed: "",
      age: "",
      ear_tag: generateEarTag(),
      health: "Not set",
    },
  });

  const onSubmit = async (data: LivestocksType) => {
    console.log("Form Values:", data);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_PUBLIC_API_URL}/api/livestocks/add`,
        data,
        { withCredentials: true }
      );
      console.log(res.data);
      toast.success("Livestock added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while adding the livestock.");
    }
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="mb-2">Add New Livestock</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="ear_tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ear Tag</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                {form.formState.errors.ear_tag && (
                  <FormMessage>
                    {form.formState.errors.ear_tag.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select
                    inputId="type"
                    value={livestockTypesOptions.find(
                      (option: Option) => option.value === field.value
                    )}
                    onChange={(option: Option | null) => {
                      field.onChange(option?.value);
                      const type = option?.value;
                      if (type === "Cattle") {
                        setFilteredCategoryOptions(
                          livestockCategoryOptions.filter((option: Option) =>
                            option.value.includes("Cattle")
                          )
                        );
                      } else if (type === "Goat") {
                        setFilteredCategoryOptions(
                          livestockCategoryOptions.filter((option: Option) =>
                            option.value.includes("Goat")
                          )
                        );
                      } else {
                        setFilteredCategoryOptions(livestockCategoryOptions);
                      }
                    }}
                    options={livestockTypesOptions as any}
                  />
                </FormControl>
                {form.formState.errors.type && <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    inputId="category"
                    value={filteredCategoryOptions.find(
                      (option: Option) => option.value === field.value
                    )}
                    onChange={(option: Option | null) =>
                      field.onChange(option?.value)
                    }
                    options={filteredCategoryOptions as any}
                  />
                </FormControl>
                {form.formState.errors.category && <FormMessage />}
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                {form.formState.errors.breed && (
                  <FormMessage>
                    {form.formState.errors.breed.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                {form.formState.errors.age && (
                  <FormMessage>{form.formState.errors.age.message}</FormMessage>
                )}
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
