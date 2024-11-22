import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerForm = ({ useFormLibrary = "controller", onSubmit }) => {
  const { handleSubmit, register, control, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { date: null },
  });

  // Estado local para el caso sin React Hook Form
  const [localDate, setLocalDate] = useState(null);

  const handleDateChange = (date) => {
    if (useFormLibrary === "register") {
      setValue("date", date, { shouldValidate: true });
    } else if (useFormLibrary === "none") {
      setLocalDate(date);
    }
  };

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ date: localDate });
    }
  };

  const renderDatePicker = () => {
    if (useFormLibrary === "controller") {
      return (
        <Controller
          name="date"
          control={control}
          rules={{ required: "La fecha es obligatoria" }}
          render={({ field }) => (
            <DatePicker
              {...field}
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              placeholderText="Selecciona una fecha"
              className={errors.date ? "input-error" : ""}
            />
          )}
        />
      );
    } else if (useFormLibrary === "register") {
      return (
        <DatePicker
          {...register("date", { required: "La fecha es obligatoria" })}
          selected={watch("date")}
          onChange={handleDateChange}
          placeholderText="Selecciona una fecha"
          className={errors.date ? "input-error" : ""}
        />
      );
    } else {
      return (
        <DatePicker
          selected={localDate}
          onChange={handleDateChange}
          placeholderText="Selecciona una fecha"
          className="date-picker"
        />
      );
    }
  };

  return (
    <form onSubmit={useFormLibrary === "none" ? handleLocalSubmit : handleSubmit(onSubmit)}>
      <div>
        {renderDatePicker()}
        {useFormLibrary !== "none" && errors.date && <p className="error">{errors.date.message}</p>}
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
};

export default DatePickerForm;
