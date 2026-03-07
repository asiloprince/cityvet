import { DispersalType } from '../../../../schema'
import { Button } from '../../../../../components/ui/button'
import throwImg from '../../../../../assets/images/throw-away.svg'
import AlertDialog from '../../../../../components/alert-dialog/alertDialog'
import { toast } from 'react-toastify'

type DeleteProps = {
  dispersal: DispersalType
  isOpen: boolean
  showActionToggle: (open: boolean) => void
}

export default function DeleteDialog({ dispersal, isOpen, showActionToggle }: DeleteProps) {
  const handleDelete = async () => {
    try {
      await window.context.deleteDispersal(dispersal.dispersal_id)
      toast.success('Dispersal record deleted successfully!')
      showActionToggle(false)
    } catch (err) {
      console.error(err)
      toast.error('An error occurred while deleting the dispersal record.')
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
      <div className="text-center w-72 ">
        <img src={throwImg} className="w-48 h-32 mx-auto block" alt="throw away image" />
        <h3 className="text-lg font-black text-gray-800">Are you sure absolutely sure?</h3>
        <p className="text-sm text-gray-500">
          Please note, this action can’t be undone. You’re about to delete the dispersal details of{' '}
          <b>{dispersal.current_beneficiary}</b>
        </p>
        <div className="flex justify-between mx-12 my-4">
          <Button onClick={() => showActionToggle(false)} className="text-white">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant={'destructive'}>
            Delete
          </Button>
        </div>
      </div>
    </AlertDialog>
  )
}
