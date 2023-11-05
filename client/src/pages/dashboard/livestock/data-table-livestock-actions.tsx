import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Clipboard, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import { Button } from "../../../components/ui/button";
import LivestockViewDialog from "./dialogs/view-dialogs";
import LivestockDeleteDialog from "./dialogs/delete-dialogs";
import { livestockSchema } from "../../schema";
import LivestockEditDialog from "./dialogs/edit-dialogs";

interface LivestockDataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function LivestockDataTableRowActions<TData>({
  row,
}: LivestockDataTableRowActionsProps<TData>) {
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const livestock = livestockSchema.parse(row.original);

  const handleViewClick = () => {
    setDialogContent(<LivestockViewDialog livestock={livestock} />);
  };

  const handleEditClick = () => {
    setDialogContent(<LivestockEditDialog livestock={livestock} />);
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4 " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(livestock.livestock_id.toString())
            }
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Copy reference ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DialogTrigger asChild onClick={handleViewClick}>
            <DropdownMenuItem>
              {" "}
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild onClick={handleEditClick}>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Details
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <LivestockDeleteDialog
        livestock={livestock}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
      />
    </Dialog>
  );
}
