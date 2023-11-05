import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import RecipientTable from "./data";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../../components/ui/dialog";
import AddNewBeneficiaryForm from "./add/add";

function Beneficiaries() {
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(
    null
  );

  const handleAddClick = () => {
    setDialogContent(<AddNewBeneficiaryForm />);
  };
  return (
    <div className="max-w-7xl m-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between">
        <div className="flex justify-between mr-4">
          <h1 className="text-2xl font-bold mb-4 ">Beneficiaries</h1>
        </div>
        <div className="flex justify-between m-2">
          <Dialog>
            <DialogTrigger asChild onClick={handleAddClick}>
              <Button className="font-poppin text-white text-sm bg-cyan-600 hover:bg-cyan-700 py-2 px-2 rounded mb-4">
                Add new
              </Button>
            </DialogTrigger>
            {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
          </Dialog>
        </div>
      </div>
      <div>
        <RecipientTable />
      </div>
    </div>
  );
}

export default Beneficiaries;
