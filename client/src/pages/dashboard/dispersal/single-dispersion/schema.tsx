// schema validation
import { z } from "zod";

export const dispersalSchema = z.object({
  dispersal_id: z.number(),
  dispersal_date: z.string(),
  num_of_heads: z.number(),
  status: z.enum(["Dispersed", "Redispersed", "Archived"]),
  redispersal_date: z.string().optional().nullable(),
  current_beneficiary: z.string(),
  previous_beneficiary: z.string().optional().nullable(),
  recipient: z.string().optional().nullable(),
  ear_tag: z.string(),
  health: z.enum(["Excellent", "Good", "Fair", "Poor"]).optional().nullable(),
  category: z.enum(["Cattle", "CPDO Cattle", "Goat - Doe"]),
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
    "Alangilan",
    "Balagtas",
    "Balete",
    "Banaba Center",
    "Banaba West",
    "Banaba East",
    "Banaba South",
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
    "Barangay 22",
    "Barangay 23",
    "Barangay 24",
    "Dela Paz Proper",
    "Dela Paz Pulot Aplaya",
    "Dela Paz Pulot Itaas",
    "Dumantay",
    "Dumuclay",
    "Gulod Itaas",
    "Gulod Labac",
    "Haligue Kanluran",
    "Haligue Silangan",
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
    "Sta. Clara",
    "Sta. Rita Aplaya",
    "Sta. Rita Karsada",
    "Sto. Domingo",
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
