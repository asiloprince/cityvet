import { useEffect, useState } from "react";
import axios from "axios";

import { BatchLivestocksDispersalType } from "../../../schema";
import { columns } from "./column";
import { BatchDispersalDataTable } from "./data-table";

export default function BatchDispersalTable() {
  const [batchDispersalData, setBatchDispersalData] = useState<
    BatchLivestocksDispersalType[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_PUBLIC_API_URL
          }/api/dispersals/batch-dispersals`,
          { withCredentials: true }
        );

        if (res.status !== 200) {
          throw new Error("Failed to fetch data");
        }

        const { data } = res.data;
        setBatchDispersalData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <BatchDispersalDataTable columns={columns} data={batchDispersalData} />
  );
}
