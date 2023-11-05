import { useState } from "react";
import { Row } from "@tanstack/react-table";
import {
  ArrowRight,
  Clipboard,
  Edit,
  Eye,
  MoreHorizontal,
  Package,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

import { dispersalSchema } from "../../../schema";
import DeleteDialog from "./dialogs/delete-dialog";
import ViewDialog from "./dialogs/view-dialogs";
import EditDialog from "./dialogs/edit-dialog";
import FormsModal from "../../../../components/modal/FormsModal";
import TransferLivestockForm from "./dialogs/transfer-dialog";
import LivestockRedispersalForm from "./dialogs/redisperse-dialog";

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
  const [showTransferDialog, setShowTransferDialog] = useState<boolean>(false);
  const [showRedispersalDialog, setShowRedispersalDialog] =
    useState<boolean>(false);
  const dispersal = dispersalSchema.parse(row.original);

  const handleViewClick = () => {
    setDialogContent(<ViewDialog dispersal={dispersal} />);
  };

  const handleEditClick = () => {
    setDialogContent(<EditDialog dispersal={dispersal} />);
  };

  const handleTransferClick = () => {
    setShowTransferDialog(true);
  };

  const handleRedispersalClick = () => {
    setShowRedispersalDialog(true);
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
              navigator.clipboard.writeText(dispersal.dispersal_id.toString())
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

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {" "}
              <Package className="mr-2 h-4 w-4" />
              Redispersal
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onSelect={handleTransferClick}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Transfer
              </DropdownMenuItem>
              {/* Add your Re-dispersal action here */}
              <DropdownMenuItem onSelect={handleRedispersalClick}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Re-disperse
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

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
      <DeleteDialog
        dispersal={dispersal}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
      />

      {showTransferDialog && (
        <FormsModal
          isOpen={showTransferDialog}
          setIsOpen={setShowTransferDialog}
        >
          <TransferLivestockForm dispersal={dispersal} />
        </FormsModal>
      )}

      {showRedispersalDialog && (
        <FormsModal
          isOpen={showRedispersalDialog}
          setIsOpen={setShowRedispersalDialog}
        >
          <LivestockRedispersalForm dispersal={dispersal} />
        </FormsModal>
      )}
    </Dialog>
  );
}
