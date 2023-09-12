import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Recipients } from "../../sampledata/benefeciariesData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type viewProps = {
  recipient: Recipients;
};

export default function ViewDialog({ recipient }: viewProps) {
  const entries = Object.entries(recipient);
  return (
    <DialogHeader>
      <DialogTitle>View Recipient Details</DialogTitle>
      <DialogDescription className="py-4">
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
      </DialogDescription>
    </DialogHeader>
  );
}
