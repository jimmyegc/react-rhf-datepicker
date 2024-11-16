import { useEffect, useRef } from "react";
import { Control, Controller } from "react-hook-form"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './style.css'

interface RHFDatePickerFieldProps {
  control: Control<any>;
  name: string;
  placeholder?: string;
}

export const RHFDatePickerField = (props: RHFDatePickerFieldProps ) => {  
  return (
    <Controller
        name={props.name}
        control={props.control}
        defaultValue={null}
        rules={{
          required: "This field is required",
        }}
        render={({ field, fieldState }) => {
          const datePickerRef = useRef<DatePicker>(null);            
          useEffect(() => {
            if (fieldState.error && datePickerRef.current) {
              datePickerRef.current.setFocus(); 
            }
          }, [fieldState.error]);          
          return (
            <div>
              <DatePicker
                selected={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholderText={props.placeholder || "Select a date"}
                ref={datePickerRef}
                className={fieldState.error ? "error" : ""}
              />
              <br />
              {fieldState.error && <span>{fieldState.error.message}</span>}
            </div>
          )
        }
      }
      />
  )
}
