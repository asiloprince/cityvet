import { app, shell, BrowserWindow, ipcMain } from 'electron'
// const { sequelize } = require('../../models');
import { join } from 'path'
import path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { createBarangaysTable } from './database/models/barangay'
import { createBeneficiariesTable } from './database/models/beneficiary'
import { getSqlite3 } from './database/sqlite'
import {
  addNewBeneficiary,
  fetchBeneficiariesList,
  fetchBeneficiaryInfo,
  handleDeleteBeneficiaries,
  handleSelectBeneficiary,
  handleUpdateBeneficiaries
} from './lib/beneficiary'
import { createLivestockTable } from './database/models/livestock'
import { createEartagsTable } from './database/models/eartag'
import {
  handleDeleteLivestockRecord,
  handleGetLivestockInfo,
  handleGetLivestockList,
  handleLivestockRegistration,
  handleToDisperseLivestockList,
  handleUpdateLivestockRecord
} from './lib/livestock'
import { createDispersalsTable } from './database/models/dispersal'
import { createSingleDispersionTable } from './database/models/single-dispersion'
import { createBatchDispersalTable } from './database/models/batch-dispersal'
import {
  getDispersalChain,
  handleDeleteDispersalRecord,
  handleGetDispersalInfo,
  handleGetDispersalList,
  handleGetDispersalsActivityRecords,
  handleLivestockDispersal,
  handleRedispersalOffspring,
  handleRedispersalStarter,
  handleUpdateDispersalData
} from './lib/dispersal'
import { createVisitsTable } from './database/models/visit'
import {
  handleBatchDispersal,
  handleBatchRedispersals,
  handleDeleteBatchDispersal,
  handleGetBatchDispersalInfo,
  handleGetBatchDispersalList,
  handleUpdateBatchDispersalData
} from './lib/batch-dispersal'
import {
  handleBeneficiariesByGender,
  handleDispersalsAndRedispersal,
  handleDispersalsPrediction,
  handleDisperseLivestocksStackBar,
  handleTotalDispersalAndRedispersal,
  handleTotalLivestockForEachType
} from './lib/kpi'
import { createRedispersalTable } from './database/models/redispersal'

// For sqlite3 initialize of Renderer process
ipcMain.handle('get-database-path', () => path.join(app.getPath('userData'), 'sqlite.db'))

function createWindow(): void {
  // Create the splash screen window
  const splash = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      sandbox: false,
      contextIsolation: true
    }
  })

  splash.loadFile(join(__dirname, '../../resources/splash.html'))
  splash.center()

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../../resources/logo.ico'),
    show: false,
    autoHideMenuBar: true,

    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    setTimeout(() => {
      splash.close()
      mainWindow.show()
    }, 3000)
  })
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Beneficiary
  ipcMain.on('add-beneficiary', async (_, data) => {
    console.log(data)
    const db = await getSqlite3()
    addNewBeneficiary(db, data)
  })

  ipcMain.handle('get-beneficiary-list', async () => {
    const db = await getSqlite3()
    return fetchBeneficiariesList(db)
  })

  ipcMain.handle('get-beneficiary-info', async (_, beneficiary_id) => {
    const db = await getSqlite3()
    return fetchBeneficiaryInfo(db, beneficiary_id)
  })
  ipcMain.handle('update-beneficiary', async (_, beneficiary_id, payload) => {
    const db = await getSqlite3()
    return handleUpdateBeneficiaries(db, beneficiary_id, payload)
  })

  ipcMain.handle('select-beneficiary', async () => {
    const db = await getSqlite3()
    return handleSelectBeneficiary(db)
  })

  ipcMain.handle('delete-beneficiary', async (_, beneficiary_id) => {
    const db = await getSqlite3()
    return handleDeleteBeneficiaries(db, beneficiary_id)
  })

  //livestock
  ipcMain.on('add-livestock', async (_, data) => {
    console.log(data)
    const db = await getSqlite3()
    handleLivestockRegistration(db, data)
  })

  ipcMain.handle('get-livestock-list', async () => {
    const db = await getSqlite3()
    return handleGetLivestockList(db)
  })

  ipcMain.handle('get-to-disperse-livestock-list', async () => {
    const db = await getSqlite3()
    return handleToDisperseLivestockList(db)
  })

  ipcMain.handle('get-livestock-info', async (_, livestock_id) => {
    const db = await getSqlite3()
    return handleGetLivestockInfo(db, livestock_id)
  })

  ipcMain.handle('update-livestock', async (_, livestock_id, payload) => {
    const db = await getSqlite3()
    return handleUpdateLivestockRecord(db, livestock_id, payload)
  })

  ipcMain.handle('delete-livestock', async (_, livestock_id) => {
    const db = await getSqlite3()
    return handleDeleteLivestockRecord(db, livestock_id)
  })

  // dispersal activity
  ipcMain.handle('get-dispersals-activity', async () => {
    const db = await getSqlite3()
    return handleGetDispersalsActivityRecords(db)
  })
  // dispersal
  ipcMain.on('disperse-livestock', async (_, data) => {
    console.log(data)
    const db = await getSqlite3()
    handleLivestockDispersal(db, data)
  })
  //dispersal list
  ipcMain.handle('disperse-livestock-list', async () => {
    const db = await getSqlite3()
    return handleGetDispersalList(db)
  })
  //  get dispersal info
  ipcMain.handle('get-dispersal-info', async (_, dispersal_id) => {
    const db = await getSqlite3()
    return handleGetDispersalInfo(db, dispersal_id)
  })
  // get dispersal chain
  ipcMain.handle('get-dispersal-chain', async (_, dispersal_id) => {
    const db = await getSqlite3()
    return getDispersalChain(db, dispersal_id)
  })
  // // get batch dispersal chain
  // ipcMain.handle('get-batch-dispersal-chain', async (_, batch_id) => {
  //   const db = await getSqlite3()
  //   return getBatchDispersalChain(db, batch_id)
  // })

  // update
  ipcMain.handle('update-dispersal', async (_, dispersal_id, payload) => {
    const db = await getSqlite3()
    return handleUpdateDispersalData(db, dispersal_id, payload)
  })

  // delete dispersal
  ipcMain.handle('delete-dispersal', async (_, dispersal_id) => {
    const db = await getSqlite3()
    return handleDeleteDispersalRecord(db, dispersal_id)
  })
  // redispersal offspring
  ipcMain.handle('redisperse-offspring', async (_, data) => {
    const db = await getSqlite3()
    return handleRedispersalOffspring(db, data)
  })
  ipcMain.handle('redispersal-transfer', async (_, { dispersal_id, data }) => {
    const db = await getSqlite3()
    return handleRedispersalStarter(db, dispersal_id, data)
  })

  //BATCH dispersal
  ipcMain.on('batch-disperse-livestock', async (_, data) => {
    console.log(data)
    const db = await getSqlite3()
    handleBatchDispersal(db, data)
  })
  // BATCH dispersal list
  ipcMain.handle('batch-disperse-livestock-list', async () => {
    const db = await getSqlite3()
    return handleGetBatchDispersalList(db)
  })
  ipcMain.handle('get-batch-dispersal-info', async (_, batch_id) => {
    const db = await getSqlite3()
    return handleGetBatchDispersalInfo(db, batch_id)
  })
  // delete batch dispersal
  ipcMain.handle('delete-batch-dispersal', async (_, dispersal_id) => {
    const db = await getSqlite3()
    return handleDeleteBatchDispersal(db, dispersal_id)
  })
  // update batch
  ipcMain.handle('update-batch-dispersal', async (_, batch_id, payload) => {
    const db = await getSqlite3()
    return handleUpdateBatchDispersalData(db, batch_id, payload)
  })
  ipcMain.on('batch-redisperse-livestock', async (_, data) => {
    const db = await getSqlite3()
    handleBatchRedispersals(db, data)
  })

  // kpi
  ipcMain.handle('get-total-livestock-for-each-type', async () => {
    const db = await getSqlite3()
    return handleTotalLivestockForEachType(db)
  })
  ipcMain.handle('get-beneficiaries-by-gender', async () => {
    const db = await getSqlite3()
    return handleBeneficiariesByGender(db)
  })

  ipcMain.handle('get-total-dispersal-and-redispersal', async () => {
    const db = await getSqlite3()
    return handleTotalDispersalAndRedispersal(db)
  })

  ipcMain.handle('handle-disperse-livestocks-stack-bar', async () => {
    const db = await getSqlite3()
    return handleDisperseLivestocksStackBar(db)
  })

  ipcMain.handle('handle-dispersals-and-redispersal', async (_, timePeriod) => {
    const db = await getSqlite3()
    return handleDispersalsAndRedispersal(db, timePeriod)
  })

  ipcMain.handle('handle-dispersals-prediction', async () => {
    const db = await getSqlite3()
    return handleDispersalsPrediction(db)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  getSqlite3().then((database) => {
    setTimeout(() => {
      console.log('main-process-message', '[sqlite3] initialize success :)')
    }, 999)

    // create barangay table
    createBarangaysTable(database).then(() => {
      console.log('Barangay Table Created')
    })

    // create benefiary table
    createBeneficiariesTable(database).then(() => {
      console.log('Beneficiary Table Created')
    })

    // create eartag table
    createEartagsTable(database).then(() => {
      console.log('Eartag Table Created')
    })

    // create livestock table
    createLivestockTable(database).then(() => {
      console.log('Livestock Table Created')
    })

    // create dispersal table
    createDispersalsTable(database).then(() => {
      console.log('Dispersal Table Created')
    })

    // create single dispersion table
    createSingleDispersionTable(database).then(() => {
      console.log('Single Dispersion Table Created')
    })

    // create single dispersion table
    createBatchDispersalTable(database).then(() => {
      console.log('Batch Dispersal Table Created')
    })
    // create visits table
    createVisitsTable(database).then(() => {
      console.log('Visit Table Created')
    })
    createRedispersalTable(database).then(() => {
      console.log('Redispersal Table Created')
    })

    // Fetch and log the dispersal chain for a specific beneficiary ID
    const dispersal_id = 1 // Replace with the actual dispersal ID you want to fetch
    getDispersalChain(database, dispersal_id)
      .then((dispersalChain) => {
        console.log('Dispersal Chain:', JSON.stringify(dispersalChain, null, 2))
      })
      .catch((error) => {
        console.error('Failed to fetch dispersal chain:', error)
      })
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
