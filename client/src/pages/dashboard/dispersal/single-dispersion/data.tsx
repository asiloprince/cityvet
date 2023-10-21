import { useEffect, useState } from "react";
import axios from "axios";

import { DispersalType } from "../../../schema";
import { columns } from "./column";
import { DispersalDataTable } from "./data-table";

export default function DispersalTable() {
  const [dispersalData, setDispersalData] = useState<DispersalType[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_PUBLIC_API_URL
          }/api/dispersals/single-dispersions`,
          { withCredentials: true }
        );

        if (res.status !== 200) {
          throw new Error("Failed to fetch data");
        }

        const { data } = res.data;
        setDispersalData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return <DispersalDataTable columns={columns} data={dispersalData} />;
}
