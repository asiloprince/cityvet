import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Select from 'react-select'
import { inputBarangays } from '../input/barangay-input'
import { toast } from 'react-toastify'
import { DialogHeader, DialogTitle } from '@renderer/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Button } from '@renderer/components/ui/button'

const addSchema = z.object({
  full_name: z.string().min(1, { message: 'Full Name Required' }),
  birth_date: z.string(),
  gender: z.string(),
  mobile: z.string(),
  barangay_id: z.number().min(1).max(105)
})

type AddSchemaType = z.infer<typeof addSchema>

interface Option {
  label: string
  value: string
}

export default function AddNewBeneficiaryForm(): JSX.Element {
  const form = useForm<AddSchemaType>({
    resolver: zodResolver(addSchema),
    defaultValues: {
      full_name: '',
      birth_date: '',
      mobile: '',
      gender: '',
      barangay_id: 0
    }
  })

  const genderOptions: Option[] = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ]

  const options = inputBarangays.map((barangay) => ({
    value: barangay.value,
    label: barangay.label
  }))

  const onSubmit = async (data: AddSchemaType): Promise<void> => {
    console.log('Form Values:', data)
    try {
      await window.context.addNewBeneficiaryForm(data)
      toast.success('Beneficiary added successfully!')
      form.reset()
    } catch (err) {
      console.log(err)
      toast.error('An error occurred while adding the beneficiary.')
    }
  }

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="mb-2">Add New Beneficiary</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                {form.formState.errors.full_name && <FormMessage />}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                {form.formState.errors.birth_date && <FormMessage />}
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
                  <Input {...field} />
                </FormControl>
                {form.formState.errors.mobile && <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="gender">Gender</FormLabel>
                <FormControl>
                  <Select
                    inputId="gender"
                    value={genderOptions.find((option) => option.value === field.value)}
                    onChange={(option) => field.onChange(option?.value)}
                    options={genderOptions}
                  />
                </FormControl>
                {form.formState.errors.gender && <FormMessage />}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="barangay_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="barangay_id">Barangay</FormLabel>
                <FormControl>
                  <Select
                    inputId="barangay_id"
                    value={options.find((option) => option.value === field.value)}
                    onChange={(option) => field.onChange(option?.value)}
                    options={options}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
