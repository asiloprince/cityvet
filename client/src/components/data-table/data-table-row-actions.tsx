import { useState } from "react";
import { Row } from "@tanstack/react-table";
import {
  FaEllipsisH,
  FaRegCopy,
  FaRegEye,
  FaRegEdit,
  FaRegTrashAlt,
} from "react-icons/fa";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { dispersalSchema } from "../../pages/dashboard/dispersal/single-dispersion/schema";
// import DeleteDialog from "../dialogs/delete-dialog";
import ViewDialog from "../dialogs/view-dialogs";
import EditDialog from "../dialogs/edit-dialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const dispersal = dispersalSchema.parse(row.original);

  const handleViewClick = () => {
    setDialogContent(<ViewDialog dispersal={dispersal} />);
  };

  const handleEditClick = () => {
    setDialogContent(<EditDialog dispersal={dispersal} />);
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <FaEllipsisH className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(dispersal.dispersal_id.toString())
            }
          >
            <FaRegCopy />
            Copy dispersal ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DialogTrigger asChild onClick={handleViewClick}>
            <DropdownMenuItem>
              {" "}
              <FaRegEye />
              View Details
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild onClick={handleEditClick}>
            <DropdownMenuItem>
              <FaRegEdit />
              Edit Details
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <FaRegTrashAlt />
            Delete Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      {/* <DeleteDialog
        dispersal={dispersal}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
      /> */}
    </Dialog>
  );
}
