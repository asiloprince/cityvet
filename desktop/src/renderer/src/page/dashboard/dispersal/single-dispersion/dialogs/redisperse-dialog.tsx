import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../../../../components/ui/form'
import { Input } from '../../../../../components/ui/input'
import { Button } from '../../../../../components/ui/button'

import { DispersalType } from '../../../../schema'
import { toast } from 'react-toastify'
import SelectBeneficiary from '@renderer/components/input/select-beneficiary'
import SelectLivestock from '@renderer/components/input/select-livestock'
import { RedisperseLivestock } from '@shared/model'
import { Dialog, DialogContent, DialogTrigger } from '@renderer/components/ui/dialog'
import { Plus } from 'lucide-react'
import AddNewBeneficiaryForm from '@renderer/page/dashboard/recipient/add/add'
import { useState } from 'react'
import AddNewLivestockForm from '@renderer/page/dashboard/livestock/add/add'
import { Textarea } from '@renderer/components/ui/textarea'

type LivestockRedispersalProps = {
  dispersal: DispersalType
}

const redispersalSchema = z.object({
  beneficiary_id: z.string(),
  dispersal_date: z.string(),
  contract_details: z.string(),
  current_beneficiary: z.string(),
  redispersal_date: z.string(),
  prev_ben_id: z.number(),
  notes: z.string(),
  livestock_id: z.string(),
  init_num_heads: z.number()
})

type RedispersalSchemaType = z.infer<typeof redispersalSchema>

export default function LivestockRedispersalForm({ dispersal }: LivestockRedispersalProps) {
  const [beneficiaryDialogs, setBeneficiaryDialogs] = useState<React.ReactNode | null>(null)
  const [livestockDialogs, setLivestockDialogs] = useState<React.ReactNode | null>(null)
  const form = useForm<RedispersalSchemaType>({
    resolver: zodResolver(redispersalSchema),
    defaultValues: {
      beneficiary_id: '',
      dispersal_date: '',
      contract_details: '',
      redispersal_date: '',
      prev_ben_id: dispersal.beneficiary_id,
      current_beneficiary: dispersal.current_beneficiary,
      notes: '',
      livestock_id: '',
      init_num_heads: 1
    }
  })

  const onSubmit = async (data: RedispersalSchemaType) => {
    console.log('Form Values:', data)

    // Convert string fields to numbers
    const formattedData: RedisperseLivestock = {
      ...data,
      beneficiary_id: Number(data.beneficiary_id),
      livestock_id: Number(data.livestock_id)
    }

    try {
      // Call the redisperseOffspring function with the formatted data
      await window.context.redisperseOffspring(formattedData)

      toast.success('Dispersal to new beneficiary completed')
    } catch (error) {
      console.error(error)
      toast.error('There was an error redispersing the livestock. Please try again.')
    }
  }

  const handleAddBeneficiary = () => {
    setBeneficiaryDialogs(<AddNewBeneficiaryForm />)
  }
  const handleAddLivestock = () => {
    setLivestockDialogs(<AddNewLivestockForm />)
  }

  return (
    <div className=" dark:text-black">
      <div className="flex justify-between px-4">
        <div className="flex justify-between pr-4">
          <div className="flex flex-col ">
            <label className="block text-sm font-medium text-gray-700 my-0.5">Full Name</label>
            <div className="border border-gray-300 p-2 rounded w-44 mt-1">
              <p className="text-gray-700">{dispersal.current_beneficiary}</p>
            </div>
          </div>
          <div>
            <Dialog>
              <DialogTrigger asChild onClick={handleAddBeneficiary}>
                <Button variant="outline" className="ml-1 mt-7">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              {beneficiaryDialogs && <DialogContent>{beneficiaryDialogs}</DialogContent>}
            </Dialog>
          </div>
        </div>
        <div className="flex justify-between ">
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 my-0.5">Livestock</label>
            <div className="border border-gray-300 p-2 rounded w-44 mt-1">
              <p className="text-gray-700">{dispersal.category}</p>
            </div>
          </div>
          <div>
            <Dialog>
              <DialogTrigger asChild onClick={handleAddLivestock}>
                <Button variant="outline" className="ml-1 mt-7">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              {livestockDialogs && <DialogContent>{livestockDialogs}</DialogContent>}
            </Dialog>
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between ">
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
          </div>

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
                <FormLabel htmlFor="init_num_heads">Initial Number of Heads</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    id="init_num_heads"
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      field.onChange(isNaN(value) ? 0 : value)
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
                <FormLabel htmlFor="contract_details">Contract Details</FormLabel>
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
                  <Textarea {...field} id="notes" />
                </FormControl>
                {form.formState.errors.notes && <FormMessage />}
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" className="mt-4 bg-cyan-600 hover-bg-cyan-700 text-white">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
