import React, { forwardRef } from "react";
import ReactSelect, { ActionMeta, MultiValue } from "react-select";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  value?: Option[];
  onChange: (value: MultiValue<Option>, actionMeta: ActionMeta<Option>) => void;
  options: Option[];
  disabled?: boolean;
  className?: string;
  required?: boolean;
  id?: string;
}

const Select: React.FC<SelectProps> = forwardRef<HTMLDivElement, SelectProps>(
  (
    { label, value, onChange, options, disabled, id }: SelectProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div className="z-[1]" ref={ref}>
        <label
          htmlFor={id}
          className="
            block 
            text-sm 
            font-medium 
            leading-6 
            text-gray-900
          "
        >
          {label}
        </label>
        <div className="mt-2">
          <ReactSelect
            inputId={id} // Use 'inputId' instead of 'id'
            isDisabled={disabled}
            value={value}
            onChange={onChange}
            isMulti
            options={options}
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 1 }),
            }}
            classNames={{
              control: () => "text-sm",
            }}
          />
        </div>
      </div>
    );
  }
);

export default Select;
