import { useState, useEffect } from "react";

import { RecipientsType } from "../../../schema";
import axios from "axios";
import { DialogHeader } from "../../../../components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

type viewProps = {
  recipient: RecipientsType;
};

export default function RecipientViewDialog({ recipient }: viewProps) {
  const [recipientDetails, setRecipientDetails] =
    useState<RecipientsType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_PUBLIC_API_URL}/api/beneficiaries/details/${
            recipient.beneficiary_id
          }`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setRecipientDetails(res.data.data);
          console.log(res.data);
        } else {
          throw new Error(res.data.message || "An error occured");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchData();
  }, [recipient.beneficiary_id]);

  if (!recipientDetails) {
    return <div>Loading...</div>;
  }

  const entries = Object.entries(recipientDetails);
  return (
    <DialogHeader>
      <DialogTitle>View recipient Details</DialogTitle>
      <div className="py-4 text-sm text-slate-500 dark:text-slate-400">
        <div className="max-h-96 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            <div className="bg-muted flex">
              <div className="w-1/2 px-4 py-4 font-bold border-t border-l border-gray-200">
                Key
              </div>
              <div className="w-1/2 px-4 py-4 font-bold border-t border-r border-gray-200">
                Value
              </div>
            </div>
            {entries.map(([key, value], index) => (
              <div key={index} className="flex hover:bg-gray-100">
                <div className="w-1/2 px-4 py-4 border-b border-l border-gray-200">
                  {key}
                </div>
                <div className="w-1/2 px-4 py-4 border-b border-r border-gray-200">
                  {Array.isArray(value)
                    ? value.map((item, i) => (
                        <div key={i}>
                          <strong>{key}:</strong> {item}
                          <br />
                        </div>
                      ))
                    : value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DialogHeader>
  );
}
