import { useEffect, useState } from "react";
import axios from "axios";

import { RecipientsType } from "../../schema";
import { columns } from "./column";
import { RecipientsDataTable } from "./data-table";

export default function RecipientTable() {
  const [recipientsData, setRecipientsData] = useState<RecipientsType[]>([]);

  useEffect(() => {
    async function fetchRecipientData() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_PUBLIC_API_URL}/api/beneficiaries/`,
          { withCredentials: true }
        );

        if (res.status !== 200) {
          throw new Error("Failed to fetch data");
        }

        setRecipientsData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchRecipientData();
  }, []);

  return <RecipientsDataTable columns={columns} data={recipientsData} />;
}
