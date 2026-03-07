import {
  BatchDispersal,
  BatchDispersalChainInfo,
  BatchDispersalList,
  BatchLivestockDispersal,
  Beneficiary,
  BeneficiaryGenderCount,
  BeneficiaryInfo,
  DispersalAndRedispersalCount,
  DispersalAndRedispersalData,
  DispersalInfo,
  DispersalList,
  DispersalLivestock,
  DispersalPrediction,
  EditBeneficiary,
  EditDispersal,
  EditLivestock,
  Livestock,
  LivestockInfo,
  LivestockRedispersal,
  RedisperseLivestock,
  SelectBeneficiary,
  ToDisperseLivestocks,
  UpdateBatchDispersal,
  YearData
} from '@shared/model'

declare global {
  interface Window {
    context: {
      addNewBeneficiaryForm: (data: Beneficiary) => void
      fetchBeneficiaryList: () => Promise<BeneficiaryInfo[]>
      fetchToSelectBeneficiary: () => Promise<SelectBeneficiary[]>
      updateBeneficiary: (beneficiary_id: number, data: EditBeneficiary) => void
      deleteBeneficiary: (beneficiary_id: number) => void
      fetchBeneficiaryInfo: (beneficiary_id: number) => Promise<BeneficiaryInfo[]>

      addLivestock: (data: Livestock) => void
      fetchLivestockList: () => Promise<LivestockInfo[]>
      fetchToDisperseLivestockList: () => Promise<ToDisperseLivestocks[]>
      fetchLivestockInfo: (livestock_id: number) => Promise<LivestockInfo[]>
      updateLivestock: (livestock_id: number, data: EditLivestock) => void
      deleteLivestock: (livestock_id: number) => void

      fetchDispersalsActivity: () => Promise<RecentActivity[]>

      DisperseLivestock: (data: DispersalLivestock) => void
      DispersedLivestockList: () => Promise<DispersalList[]>
      fetchDispersalInfo: (dispersal_id: number) => Promise<DispersalInfo[]>
      updateDispersal: (dispersal_id: number, data: EditDispersal) => void
      getDispersalChain: (dispersal_id: number) => Promise<DispersalChainInfo[]>
      redisperseOffspring: (data: RedisperseLivestock) => Promise<void>
      deleteDispersal: (dispersal_id: number) => void
      redisperseStarter: (
        dispersal_id: number,
        data: RedispersalStarterPayload
      ) => Promise<{ success: boolean; message: string }>

      BatchDispersal: (data: BatchLivestockDispersal) => void
      BatchDispersedLivestockList: () => Promise<BatchDispersalList[]>
      fetchBatchDispersalInfo: (batch_id: number) => Promise<BatchDispersal[]>
      // getBatchDispersalChain: (batch_id: number) => Promise<BatchDispersalChainInfo[]>
      updateBatchDispersal: (batch_id: number, data: UpdateBatchDispersal) => void
      batchRedispersal: (data: RedisperseBatchDispersal) => void
      deleteBatchDispersal: (dispersal_id: number) => void

      fetchTotalLivestockForEachType: () => Promise<LivestockTypeCount[]>
      fetchBeneficiariesByGender: () => Promise<BeneficiaryGenderCount[]>
      fetchTotalDispersalAndRedispersal: () => Promise<DispersalAndRedispersalCount>
      handleDisperseLivestocksStackBar: () => Promise<YearData[]>
      fetchDispersalsAndRedispersal: (timePeriod: string) => Promise<DispersalAndRedispersalData[]>
      fetchDispersalsPrediction: () => Promise<DispersalPrediction[]>
    }
  }
}
