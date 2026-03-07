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
import { Dialog, DialogContent, DialogTrigger } from '@renderer/components/ui/dialog'
import { Plus } from 'lucide-react'
import AddNewBeneficiaryForm from '@renderer/page/dashboard/recipient/add/add'
import { useState } from 'react'

type LivestockTransferProps = {
  dispersal: DispersalType
}

const redispersalSchema = z.object({
  beneficiary_id: z.string(),
  dispersal_date: z.string(),
  contract_details: z.string(),
  notes: z.string(),
  num_of_heads: z.number()
})

type RedispersalSchemaType = z.infer<typeof redispersalSchema>

export default function TransferLivestockForm({ dispersal }: LivestockTransferProps) {
  const [beneficiaryDialogs, setBeneficiaryDialogs] = useState<React.ReactNode | null>(null)
  const form = useForm<RedispersalSchemaType>({
    resolver: zodResolver(redispersalSchema),
    defaultValues: {
      beneficiary_id: '',
      dispersal_date: '',
      contract_details: '',
      notes: '',
      num_of_heads: dispersal.num_of_heads
    }
  })
  const handleAddBeneficiary = () => {
    setBeneficiaryDialogs(<AddNewBeneficiaryForm />)
  }

  const numOfHeads = form.watch('num_of_heads')
  const onSubmit = async (data: RedispersalSchemaType) => {
    console.log('Form Values:', data)

    try {
      const response = await window.context.redisperseStarter(dispersal.dispersal_id, data)

      console.log(response)
      if (response.success) {
        toast.success('Transfer to new recipient completed.')
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('There has been a problem with your operation:', error)
      toast.error('There was an error transferring the dispersal.')
    }
  }

  return (
    <div className="bg-white dark:bg-[#020817] dark:text-white">
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
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-6">
          <div className="w-full border-t border-gray-300"></div>
          <span className="text-gray-600 px-2">Transfer Livestock</span>
          <div className="w-full border-t border-gray-300"></div>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between">
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
                    <div className="pt-2 pr-6">
                      <Input {...field} type="date" />
                    </div>
                  </FormControl>
                  {form.formState.errors.dispersal_date && <FormMessage />}
                </FormItem>
              )}
            />
          </div>
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
                      const value = parseInt(e.target.value)
                      field.onChange(isNaN(value) ? 0 : value)
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
  )
}
