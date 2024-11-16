import { useForm } from "react-hook-form";
import { RHFDatePickerField } from "./RHFDatePickerField/RHFDatePickerField";

export const Form = () => {
  const {
    control,
    handleSubmit,    
    formState: { errors },    
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };

  console.log(errors);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>            
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

