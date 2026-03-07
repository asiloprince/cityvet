import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import axios from 'axios'
import Select from './select'
import { MultiValue } from 'react-select'

// Define the interfaces for Beneficiary and Option
interface Beneficiary {
  beneficiary_id: string
  full_name: string
}

interface Option {
  value: string
  label: string
}

interface SelectBeneficiaryProps {
  value: string | null
  onChange: (value: string) => void
  styles?: React.CSSProperties
}

const SelectBeneficiary = forwardRef((props: SelectBeneficiaryProps, ref) => {
  const [isLoading, setIsLoading] = useState(false)
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      setIsLoading(true)
      try {
        const data = await window.context.fetchToSelectBeneficiary()
        setBeneficiaries(data)
      } catch (err) {
        console.error('Error fetching beneficiary data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBeneficiaries()
  }, [])

  const options: Option[] = beneficiaries.map((beneficiary) => ({
    value: beneficiary.beneficiary_id,
    label: beneficiary.full_name
  }))

  const handleChange = (value: MultiValue<Option>) => {
    let selectedValue = ''
    if (value !== null && value !== undefined) {
      selectedValue = value[0]?.value || ''
    }
    props.onChange(selectedValue as string)
  }

  const currentOption = options.find((option) => option.value === props.value)

  useImperativeHandle(ref, () => ({}))

  return (
    <Select
      id="beneficiary_id"
      className="w-full p-2 border rounded-md focus:border-cyan-500 bg-white dark:border-white dark:bg-[#020817]"
      disabled={isLoading}
      label=""
      options={options}
      onChange={handleChange}
      value={currentOption ? [currentOption] : undefined}
      placeholder="Search new recipients..."
    />
  )
})

SelectBeneficiary.displayName = 'SelectLivestock'

export default SelectBeneficiary
