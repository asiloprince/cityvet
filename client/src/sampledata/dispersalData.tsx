export const dispersal = [
  {
    refId: 2023,
    earTag: "23-01B",
    status: "Redispersed",
    Name: "Michael Pagcaliwagan",
    livestock_type: "Cattle",
    dispersalDate: "2023-09-20",
    quantity: 5,
  },
  {
    refId: 2123,
    earTag: "23-02B",
    status: "Redispersed",
    Name: "Michael Pagcaliwagan",
    livestock_type: "Goats",
    dispersalDate: "2023-09-15",
    quantity: 3,
  },
  {
    refId: 2223,
    earTag: "23-03B",
    status: "Dispersed",
    Name: "Romel Abrinica",
    livestock_type: "Swine",
    dispersalDate: "2023-09-18",
    quantity: 2,
  },
  {
    refId: 2323,
    earTag: "23-04B",
    status: "Dispersed",
    Name: "Gregorio Suayan",
    livestock_type: "Swine",
    dispersalDate: "2023-09-19",
    quantity: 1,
  },
  {
    refId: 2423,
    earTag: "23-05B",
    status: "Dispersed",
    Name: "Sergio Matala",
    livestock_type: "Cattle",
    dispersalDate: "2023-09-22",
    quantity: 4,
  },
];
export type Dispersal = (typeof dispersal)[number];
