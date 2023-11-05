import { useState, useEffect } from "react";
import { DialogHeader, DialogTitle } from "../../../../../components/ui/dialog";
import { DispersalType } from "../../../../schema";
import axios from "axios";

type viewProps = {
  dispersal: DispersalType;
};

export default function ViewDialog({ dispersal }: viewProps) {
  const [dispersalDetails, setDispersalDetails] =
    useState<DispersalType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_PUBLIC_API_URL
          }/api/dispersals/single-dispersions/${dispersal.dispersal_id}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setDispersalDetails(res.data.dispersal);
        } else {
          throw new Error(res.data.message || "An error occured");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchData();
  }, [dispersal.dispersal_id]);

  if (!dispersalDetails) {
    return <div>Loading...</div>;
  }

  const entries = Object.entries(dispersalDetails).filter(
    ([key]) => key !== "notes"
  );
  const notes = dispersalDetails.notes || "";
  return (
    <DialogHeader>
      <DialogTitle>View Dispersal Details</DialogTitle>
      <div className="py-4 text-sm text-slate-500 dark:text-slate-400">
        <div className="max-h-96 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            <div className="bg-muted flex">
              <div className="w-1/2 px-4 py-4 font-bold border-t border-l border-gray-200">
                Name
              </div>
              <div className="w-1/2 px-4 py-4 font-bold border-t border-r border-gray-200">
                Details
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
                          <strong>Visit Date:</strong> {item.visit_date}
                          <br />
                          <strong>Remarks:</strong> {item.remarks}
                          <br />
                          <strong>Visit Again:</strong> {item.visit_again}
                        </div>
                      ))
                    : value}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h2 className="font-bold text-lg">Notes</h2>
            <textarea
              id="notes"
              name="notes"
              readOnly
              className="w-full h-20 p-2 border rounded-md mt-2"
              value={notes}
            />
          </div>
        </div>
      </div>
    </DialogHeader>
  );
}
