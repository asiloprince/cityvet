import xlsx, { IJsonSheet } from "json-as-xlsx";
import { recipient } from "../sampledata/benefeciariesData";

export function downloadToExcel() {
  const columns: IJsonSheet[] = [
    {
      sheet: "Beneficiaries",
      columns: [
        { label: "Benefeciary Id", value: "ID" },
        { label: "Barangay", value: "Barangay" },
        { label: "Name", value: "Name" },
        { label: "Contact Number", value: "ContactNumber" },
        {
          label: "Birth Date",
          value: "Birthdate",
        },
      ],
      content: recipient,
    },
  ];

  const settings = {
    fileName: "Benefeciaries Excel",
  };
  xlsx(columns, settings);
}
