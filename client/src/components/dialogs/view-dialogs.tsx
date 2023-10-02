import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DispersalType } from "../../pages/dashboard/dispersal/single-dispersion/schema";

type viewProps = {
  dispersal: DispersalType;
};

export default function ViewDialog({ dispersal }: viewProps) {
  const entries = Object.entries(dispersal);
  return (
    <DialogHeader>
      <DialogTitle>View Dispersal Details</DialogTitle>
      <DialogDescription className="py-4">
        <div className="max-h-96 overflow-y-auto">
          <Table className="border-2">
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map(([key, value], index) => (
                <TableRow key={index}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogDescription>
    </DialogHeader>
  );
}
