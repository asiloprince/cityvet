import { useContext } from 'react'
import { SingleDispersionsFormContext, IFormContext } from './single-dispersions-context'

export function useFormState(): IFormContext {
  return useContext(SingleDispersionsFormContext)
}
