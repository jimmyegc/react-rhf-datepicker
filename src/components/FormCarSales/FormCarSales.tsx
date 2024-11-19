import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Checkbox, FormControl, FormControlLabel, FormHelperText } from '@mui/material'

interface CarSaleFormProps {

}

export const FormCarSales = (props: CarSaleFormProps) => {
  const { control, formState: { errors  }, handleSubmit } = useForm({
    defaultValues: {
      agreeToTerms: false
    }
  })

  const onSubmit = data => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="agreeToTerms"
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field }) => (
          <FormControl sx={{ m:3 }} error component="fieldset" variant="standard">
            <FormControlLabel    
              label="Jimmy"    
              control={(
                <Checkbox
                  inputRef={field.ref}
                  checked={field.value}            
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              )}
            />
            { errors?.agreeToTerms ? <FormHelperText>{errors?.agreeToTerms.message}</FormHelperText> : null }
            
          </FormControl> 
        )}
      />
      <button type='submit'>Save</button>
    </form>
  )
}
