import {
  BatchDispersal,
  BatchDispersalChainInfo,
  BatchDispersalList,
  BatchLivestockDispersal,
  Beneficiary,
  BeneficiaryInfo,
  DispersalAndRedispersalCount,
  DispersalAndRedispersalData,
  DispersalChainInfo,
  DispersalInfo,
  DispersalList,
  DispersalLivestock,
  DispersalPrediction,
  EditBeneficiary,
  EditDispersal,
  EditLivestock,
  Livestock,
  LivestockInfo,
  LivestockTypeCount,
  RecentActivity,
  RedispersalTransferLivestock,
  RedisperseBatchDispersal,
  RedisperseLivestock,
  ToDisperseLivestocks,
  UpdateBatchDispersal,
  YearData
} from '@shared/model'
import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  // add beneficiary
  addNewBeneficiaryForm: async (data: Beneficiary): Promise<void> => {
    ipcRenderer.send('add-beneficiary', data)
  },
  //fetch beneficiary
  fetchBeneficiaryList: async (): Promise<Beneficiary[]> => {
    return ipcRenderer.invoke('get-beneficiary-list')
  },

  // fetch to disperse livestock list
  fetchToSelectBeneficiary: async (): Promise<ToDisperseLivestocks[]> => {
    return ipcRenderer.invoke('select-beneficiary')
  },
  // fetch beneficiary info
  fetchBeneficiaryInfo: async (beneficiary_id: number): Promise<BeneficiaryInfo[]> => {
    return ipcRenderer.invoke('get-beneficiary-info', beneficiary_id)
  },
  // update beneficiary
  updateBeneficiary: async (beneficiary_id: number, data: EditBeneficiary): Promise<void> => {
    ipcRenderer.invoke('update-beneficiary', beneficiary_id, data)
  },
  // delete beneficiary
  deleteBeneficiary: async (beneficiary_id: number): Promise<void> => {
    ipcRenderer.invoke('delete-beneficiary', beneficiary_id)
  },

  // add livestock
  addLivestock: async (data: Livestock): Promise<void> => {
    ipcRenderer.send('add-livestock', data)
  },

  // fetch livestock list
  fetchLivestockList: async (): Promise<Livestock[]> => {
    return ipcRenderer.invoke('get-livestock-list')
  },

  // fetch to disperse livestock list
  fetchToDisperseLivestockList: async (): Promise<ToDisperseLivestocks[]> => {
    return ipcRenderer.invoke('get-to-disperse-livestock-list')
  },

  // fetch livestock info
  fetchLivestockInfo: async (livestock_id: number): Promise<LivestockInfo[]> => {
    return ipcRenderer.invoke('get-livestock-info', livestock_id)
  },
  // update livestock
  updateLivestock: async (livestock_id: number, data: EditLivestock): Promise<void> => {
    ipcRenderer.invoke('update-livestock', livestock_id, data)
  },

  // delete livestock
  deleteLivestock: async (livestock_id: number): Promise<void> => {
    ipcRenderer.invoke('delete-livestock', livestock_id)
  },

  // dispersal activity
  fetchDispersalsActivity: async (): Promise<RecentActivity[]> => {
    return ipcRenderer.invoke('get-dispersals-activity')
  },
  // disperse livestock
  DisperseLivestock: async (data: DispersalLivestock): Promise<void> => {
    ipcRenderer.send('disperse-livestock', data)
  },
  // redisperse transfer
  redisperseStarter: async (
    dispersal_id: number,
    data: RedispersalTransferLivestock
  ): Promise<{ success: boolean; message: string }> => {
    return ipcRenderer.invoke('redispersal-transfer', { dispersal_id, data })
  },
  // redispersal offspring
  redisperseOffspring: async (data: RedisperseLivestock): Promise<void> => {
    return ipcRenderer.invoke('redisperse-offspring', data)
  },
  // fetch to disperse livestock list
  DispersedLivestockList: async (): Promise<DispersalList[]> => {
    return ipcRenderer.invoke('disperse-livestock-list')
  },
  // fetch dispersal info
  fetchDispersalInfo: async (dispersal_id: number): Promise<DispersalInfo[]> => {
    return ipcRenderer.invoke('get-dispersal-info', dispersal_id)
  },
  // update dispersal
  updateDispersal: async (dispersal_id: number, data: EditDispersal): Promise<void> => {
    ipcRenderer.invoke('update-dispersal', dispersal_id, data)
  },
  // delete dispersal
  deleteDispersal: async (dispersal_id: number): Promise<void> => {
    ipcRenderer.invoke('delete-dispersal', dispersal_id)
  },

  getDispersalChain: async (dispersal_id: number): Promise<DispersalChainInfo[]> => {
    return ipcRenderer.invoke('get-dispersal-chain', dispersal_id)
  },
  // getBatchDispersalChain: async (batch_id: number): Promise<BatchDispersalChainInfo[]> => {
  //   return ipcRenderer.invoke('get-batch-dispersal-chain', batch_id)
  // },

  // disperse livestock
  BatchDispersal: async (data: BatchLivestockDispersal): Promise<void> => {
    ipcRenderer.send('batch-disperse-livestock', data)
  },
  // fetch batch dispersal list
  BatchDispersedLivestockList: async (): Promise<BatchDispersalList[]> => {
    return ipcRenderer.invoke('batch-disperse-livestock-list')
  },
  // fetch batch dispersal info
  fetchBatchDispersalInfo: async (batch_id: number): Promise<BatchDispersal[]> => {
    return ipcRenderer.invoke('get-batch-dispersal-info', batch_id)
  },
  // update dispersal
  updateBatchDispersal: async (batch_id: number, data: UpdateBatchDispersal): Promise<void> => {
    ipcRenderer.invoke('update-batch-dispersal', batch_id, data)
  },
  // redispersal
  batchRedispersal: async (data: RedisperseBatchDispersal): Promise<void> => {
    ipcRenderer.send('batch-redisperse-livestock', data)
  },

  // delete dispersal
  deleteBatchDispersal: async (dispersal_id: number): Promise<void> => {
    ipcRenderer.invoke('delete-batch-dispersal', dispersal_id)
  },

  // kpi
  fetchTotalLivestockForEachType: async (): Promise<LivestockTypeCount[]> => {
    return ipcRenderer.invoke('get-total-livestock-for-each-type')
  },
  fetchBeneficiariesByGender: async () => {
    return ipcRenderer.invoke('get-beneficiaries-by-gender')
  },

  fetchTotalDispersalAndRedispersal: async (): Promise<DispersalAndRedispersalCount> => {
    return ipcRenderer.invoke('get-total-dispersal-and-redispersal')
  },
  handleDisperseLivestocksStackBar: async (): Promise<YearData[]> => {
    return ipcRenderer.invoke('handle-disperse-livestocks-stack-bar')
  },

  // Dispersals and Redispersal
  fetchDispersalsAndRedispersal: async (
    timePeriod: string
  ): Promise<DispersalAndRedispersalData[]> => {
    return ipcRenderer.invoke('handle-dispersals-and-redispersal', timePeriod)
  },

  fetchDispersalsPrediction: async (): Promise<DispersalPrediction[]> => {
    return ipcRenderer.invoke('handle-dispersals-prediction')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('context', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}
