// schema validation
import { z } from "zod";

export const dispersalSchema = z.object({
  dispersal_id: z.number(),
  beneficiary_id: z.number(),
  dispersal_date: z.string(),
  num_of_heads: z.number(),
  status: z.enum(["Dispersed", "Redispersed", "Transferred"]),
  redispersal_date: z.string().optional().nullable(),
  current_beneficiary: z.string(),
  previous_beneficiary: z.string().optional().nullable(),
  prev_ben_id: z.string().optional().nullable(),
  recipient: z.string().optional().nullable(),
  ear_tag: z.string(),
  health: z.enum(["Excellent", "Good", "Fair", "Poor"]).optional().nullable(),
  category: z.enum([
    "Cattle",
    "CPDO Cattle",
    "Goat - Doe",
    "Goat - Buck",
    "Goat",
  ]),
  contract_details: z.string().optional(),
  age: z.string(),
  init_num_heads: z.number(),
  visits: z
    .array(
      z.object({
        visit_date: z.string(),
        remarks: z.string(),
        visit_again: z.enum(["Yes", "No"]),
      })
    )
    .optional(),
  visit_date: z.string().optional().nullable(),
  remarks: z.string().optional(),
  visit_again: z.enum(["Yes", "No", "Not set"]).optional(),
  barangay_name: z.enum([
    "Barangay 1",
    "Barangay 2",
    "Barangay 3",
    "Barangay 4",
    "Barangay 5",
    "Barangay 6",
    "Barangay 7",
    "Barangay 8",
    "Barangay 9",
    "Banaba South",
    "Barangay 11",
    "Barangay 12",
    "Barangay 13",
    "Barangay 14",
    "Barangay 15",
    "Barangay 16",
    "Barangay 17",
    "Barangay 18",
    "Barangay 19",
    "Barangay 20",
    "Barangay 21",
    "Barangay 22",
    "Barangay 23",
    "Barangay 24",
    "Alangilan",
    "Balagtas",
    "Balete",
    "Banaba Center",
    "Banaba West",
    "Banaba East",
    "Bilogo",
    "Bolbok",
    "Bucal",
    "Calicanto",
    "Catandala",
    "Concepcion",
    "Conde Itaas",
    "Conde Labac",
    "Cumba",
    "Cuta",
    "Dalig",
    "Dela Paz Proper",
    "Dela Paz Pulot Aplaya",
    "Dela Paz Pulot Itaas",
    "Dumuclay",
    "Dumantay",
    "Gulod Itaas",
    "Gulod Labac",
    "Haligue Kanluran",
    "Haligue Silangan",
    "Ilijan",
    "Kumintang Ibaba",
    "Kumintang Ilaya",
    "Libjo",
    "Liponpon Isla Verde",
    "Maapaz",
    "Mahabang Dahilig",
    "Mahabang Parang",
    "Mahacot Silangan",
    "Malalim",
    "Malibayo",
    "Malitam",
    "Maruclap",
    "Mabacong",
    "Pagkilatan",
    "Paharang Kanluran",
    "Paharang Silangan",
    "Pallocan Kanluran",
    "Pallocan Silangan",
    "Pinamucan Ibaba",
    "Pinamucan Proper",
    "Pinamucan Silangan",
    "Sampaga",
    "San Agapito Isla Verde",
    "San Agustin Kanluran",
    "San Agustin Silangan",
    "San Andres Isla Verde",
    "San Antonio Isla Verde",
    "San Isidro",
    "San Jose Sico",
    "San Miguel",
    "San Pedro",
    "Santa Clara",
    "Santa Rita Aplaya",
    "Santa Rita Karsada",
    "Santo Domingo",
    "Sto. Niño",
    "Simlong",
    "Sirang Lupa",
    "Sorosoro Ibaba",
    "Sorosoro Ilaya",
    "Sorosoro Karsada",
    "Tabangao Aplaya",
    "Tabangao Ambulong",
    "Tabangao Dao",
    "Talahib Pandayan",
    "Talahib Payapa",
    "Talumpok Kanluran",
    "Talumpok Silangan",
    "Tingga Itaas",
    "Tingga Labac",
    "Tulo",
    "Wawa",
  ]),
  notes: z.string().optional(),
});

export type DispersalType = z.infer<typeof dispersalSchema>;

export const recipientInfoSchema = z.object({
  beneficiary_id: z.number(),
  full_name: z.string(),
  birth_date: z.string(),
  gender: z.string(),
  mobile: z.string(),
  barangay_id: z.number().min(1).max(105),
  barangay_name: z.string(),
});

export type RecipientsType = z.infer<typeof recipientInfoSchema>;

// livestocks
export const livestockSchema = z.object({
  livestock_id: z.number(),
  type: z.string(),
  category: z.string(),
  // breed: z.string(),
  age: z.string(),
  health: z.enum(["Excellent", "Good", "Fair", "Poor", "Not set"]).optional(),
  isAlive: z.enum(["Alive", "Deceased", "Unknown"]),
  ear_tag: z.string(),
});

export type LivestocksType = z.infer<typeof livestockSchema>;

//batch dispersal

export const batchDispersalSchema = z.object({
  batch_id: z.number(),
  beneficiary_id: z.number(),
  dispersal_id: z.number(),
  livestock_received: z.string(),
  init_num_heads: z.number(),
  age: z.string(),
  num_of_heads: z.number(),
  dispersal_date: z.string(),
  status: z.enum(["Dispersed", "Redispersed", "Transferred"]),
  contract_details: z.string().optional(),
  notes: z.string().optional(),
  visit_date: z.string(),
  remarks: z.string(),
  prev_ben_id: z.string().optional().nullable(),
  visit_again: z.enum(["Yes", "No", "Not set"]),
  current_beneficiary: z.string(),
  category: z
    .union([
      z.literal("Cattle"),
      z.literal("CPDO Cattle"),
      z.literal("Goat - Doe"),
      z.literal("Goat - Buck"),
      z.literal("Goat"),
    ])
    .nullable()
    .optional(),

  barangay_name: z.enum([
    "Barangay 1",
    "Barangay 2",
    "Barangay 3",
    "Barangay 4",
    "Barangay 5",
    "Barangay 6",
    "Barangay 7",
    "Barangay 8",
    "Barangay 9",
    "Banaba South",
    "Barangay 11",
    "Barangay 12",
    "Barangay 13",
    "Barangay 14",
    "Barangay 15",
    "Barangay 16",
    "Barangay 17",
    "Barangay 18",
    "Barangay 19",
    "Barangay 20",
    "Barangay 21",
    "Barangay 22",
    "Barangay 23",
    "Barangay 24",
    "Alangilan",
    "Balagtas",
    "Balete",
    "Banaba Center",
    "Banaba West",
    "Banaba East",
    "Bilogo",
    "Bolbok",
    "Bucal",
    "Calicanto",
    "Catandala",
    "Concepcion",
    "Conde Itaas",
    "Conde Labac",
    "Cumba",
    "Cuta",
    "Dalig",
    "Dela Paz Proper",
    "Dela Paz Pulot Aplaya",
    "Dela Paz Pulot Itaas",
    "Dumuclay",
    "Dumantay",
    "Gulod Itaas",
    "Gulod Labac",
    "Haligue Kanluran",
    "Haligue Silangan",
    "Ilijan",
    "Kumintang Ibaba",
    "Kumintang Ilaya",
    "Libjo",
    "Liponpon Isla Verde",
    "Maapaz",
    "Mahabang Dahilig",
    "Mahabang Parang",
    "Mahacot Silangan",
    "Mahacot Silangan",
    "Malalim",
    "Malibayo",
    "Malitam",
    "Maruclap",
    "Mabacong",
    "Pagkilatan",
    "Paharang Kanluran",
    "Paharang Silangan",
    "Pallocan Kanluran",
    "Pallocan Silangan",
    "Pinamucan Ibaba",
    "Pinamucan Proper",
    "Pinamucan Silangan",
    "Sampaga",
    "San Agapito Isla Verde",
    "San Agustin Kanluran",
    "San Agustin Silangan",
    "San Andres Isla Verde",
    "San Antonio Isla Verde",
    "San Isidro",
    "San Jose Sico",
    "San Miguel",
    "San Pedro",
    "Santa Clara",
    "Santa Rita Aplaya",
    "Santa Rita Karsada",
    "Santo Domingo",
    "Sto. Niño",
    "Simlong",
    "Sirang Lupa",
    "Sorosoro Ibaba",
    "Sorosoro Ilaya",
    "Sorosoro Karsada",
    "Tabangao Aplaya",
    "Tabangao Ambulong",
    "Tabangao Dao",
    "Talahib Pandayan",
    "Talahib Payapa",
    "Talumpok Kanluran",
    "Talumpok Silangan",
    "Tingga Itaas",
    "Tingga Labac",
    "Tulo",
    "Wawa",
  ]),
});

export type BatchLivestocksDispersalType = z.infer<typeof batchDispersalSchema>;
