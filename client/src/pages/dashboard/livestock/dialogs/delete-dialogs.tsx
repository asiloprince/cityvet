import throwImg from "../../../../assets/throw-away.svg";
import axios from "axios";
import AlertDialog from "../../../../components/alert-dialog/alertDialog";
import { Button } from "../../../../components/ui/button";
import { LivestocksType } from "../../../schema";

type DeleteProps = {
  livestock: LivestocksType;
  isOpen: boolean;
  showActionToggle: (open: boolean) => void;
};

export default function LivestockDeleteDialog({
  livestock,
  isOpen,
  showActionToggle,
}: DeleteProps) {
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_PUBLIC_API_URL}/api/livestocks/delete/${
          livestock.livestock_id
        }`,
        { withCredentials: true }
      );

      if (!res.data.success) {
        throw new Error(res.data.message || "An error occured");
      }

      showActionToggle(false);
    } catch (err) {
      console.error(err);
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
          Please note, this action can’t be undone. You can’t delete{" "}
          <b>{livestock.type}</b> <b>{livestock.ear_tag}</b> if there is a
          dispersal associated with it.
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
