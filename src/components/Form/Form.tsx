import { useForm } from "react-hook-form";
import { RHFDatePickerField } from "./RHFDatePickerField/RHFDatePickerField";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useRef, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FormControl, FormHelperText } from "@mui/material";

export const Form = () => {
  const {
    control,
    handleSubmit,    
    formState: { errors },    
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };
  
  const [checked, setChecked] = useState(true);
  const checkboxRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    setTimeout(() => {
        checkboxRef.current?.focus()
    }, 1500);
  },[])
  
  console.log(errors);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>   
      <FormControl sx={{ m:3 }} error component="fieldset" variant="standard">
        <FormControlLabel    
          label="Jimmy"    
          control={(
            <Checkbox
              inputRef={checkboxRef}
              checked={checked}            
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          )}
        />
        <FormHelperText>You can display an error</FormHelperText>
      </FormControl>  
   
      

      <Checkbox
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      <RHFDatePickerField 
        control={control}
        name="startDate"
        placeholder="Start Date"
      />
      <br />
      <RHFDatePickerField 
        control={control}
        name="endDate"
        placeholder="End Date"
      />
      <br />
      <button type="submit">Submit</button>
      
    </form>
  );
};

