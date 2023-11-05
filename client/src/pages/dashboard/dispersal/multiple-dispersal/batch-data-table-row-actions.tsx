import { useState } from "react";
import { Row } from "@tanstack/react-table";
import {
  Clipboard,
  Edit,
  Eye,
  MoreHorizontal,
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
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { batchDispersalSchema } from "../../../schema";
import ViewBatchDispersalDialog from "./dialogs/view-dialogs";
import BatchDispersalDeleteDialog from "./dialogs/delete-dialog";
import BatchDispersalEditDialog from "./dialogs/edit-dialog";
import FormsModal from "../../../../components/modal/FormsModal";
import BatchRedispersalForms from "./dialogs/redisperse-dialog";

interface BatchDispersalDataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function BatchDispersalDataTableRowActions<TData>({
  row,
}: BatchDispersalDataTableRowActionsProps<TData>) {
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showBatchRedispersalDialog, setShowBatchRedispersalDialog] =
    useState<boolean>(false);
  const batch = batchDispersalSchema.parse(row.original);

  const handleViewClick = () => {
    setDialogContent(<ViewBatchDispersalDialog batch={batch} />);
  };

  const handleEditClick = () => {
    setDialogContent(<BatchDispersalEditDialog batch={batch} />);
  };
  const handleBatchRedispersalClick = () => {
    setShowBatchRedispersalDialog(true);
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
              navigator.clipboard.writeText(batch.dispersal_id.toString())
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

          <DropdownMenuItem onSelect={handleBatchRedispersalClick}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Redisperse
          </DropdownMenuItem>

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
      <BatchDispersalDeleteDialog
        batch={batch}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
      />

      {showBatchRedispersalDialog && (
        <FormsModal
          isOpen={showBatchRedispersalDialog}
          setIsOpen={setShowBatchRedispersalDialog}
        >
          <BatchRedispersalForms batch={batch}/>
        </FormsModal>
      )}
    </Dialog>
  );
}
