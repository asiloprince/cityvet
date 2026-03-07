import { HashRouter, Route, Routes } from 'react-router-dom'

import Layout from './page/layout'

import Dashboard from './page/dashboard/dashboard'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Beneficiaries from './page/dashboard/recipient/Beneficiaries'
import NotFoundPage from './page/NotFoundPage'
import Livestock from './page/dashboard/livestock/Livestock'
import LayoutDispersal from './page/dashboard/dispersal/Layout'
import SingleDispersions from './page/dashboard/dispersal/single-dispersion/add/disperse'
import BatchDispersals from './page/dashboard/dispersal/multiple-dispersal/add/batch-disperse'
import Calendar from './page/dashboard/calendar/Calendar'
import Statistics from './page/dashboard/statistics/Statistics'
import Prediction from './components/charts/Prediction'
import UserManual from './components/user manual/usermanual'

function App(): JSX.Element {
  return (
    <>
      <HashRouter>
        <ToastContainer />
        <Layout>
          <Routes>
            <Route index element={<Dashboard />}></Route>
            <Route path="/beneficiaries" element={<Beneficiaries />}></Route>
            <Route path="/livestocks" element={<Livestock />}></Route>
            <Route path="/dispersal" element={<LayoutDispersal />}></Route>
            <Route path="/calendar" element={<Calendar />}></Route>
            <Route path="/disperse" element={<SingleDispersions />}></Route>
            <Route path="/batch-disperse" element={<BatchDispersals />}></Route>
            <Route path="/analytics" element={<Statistics />}></Route>
            <Route path="/usermanual" element={<UserManual />}></Route>
            <Route path="/predictions" element={<Prediction />}></Route>
            <Route path="*" element={<NotFoundPage />}></Route>
          </Routes>
        </Layout>
      </HashRouter>
    </>
  )
}

export default App
