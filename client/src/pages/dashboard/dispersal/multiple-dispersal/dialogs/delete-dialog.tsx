import { Button } from "../../../../../components/ui/button";
import throwImg from "../../../../../assets/throw-away.svg";
import AlertDialog from "../../../../../components/alert-dialog/alertDialog";
import axios from "axios";
import { BatchLivestocksDispersalType } from "../../../../schema";
import { toast } from "react-toastify";

type DeleteProps = {
  batch: BatchLivestocksDispersalType;
  isOpen: boolean;
  showActionToggle: (open: boolean) => void;
};

export default function BatchDispersalDeleteDialog({
  batch,
  isOpen,
  showActionToggle,
}: DeleteProps) {
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${
          import.meta.env.VITE_PUBLIC_API_URL
        }/api/dispersals/batch-dispersals/delete/${batch.dispersal_id}`,
        { withCredentials: true }
      );

      if (!res.data.success) {
        throw new Error(res.data.message || "An error occured");
      }
      toast.success("Deleted successfully");
      showActionToggle(false);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting the beneficiary.");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
      <div className="text-center w-72 ">
        <img
          src={throwImg}
          className="w-48 h-32 mx-auto block"
          alt="throw away image"
        />
        <h3 className="text-lg font-black text-gray-800">
          Are you sure absolutely sure?
        </h3>
        <p className="text-sm text-gray-500">
          Please note, this action can’t be undone. You’re about to delete the
          dispersal details of <b>{batch.current_beneficiary}</b>
        </p>
        <div className="flex justify-between mx-12 my-4">
          <Button
            onClick={() => showActionToggle(false)}
            className="text-white"
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} variant={"destructive"}>
            Delete
          </Button>
        </div>
      </div>
    </AlertDialog>
  );
}
