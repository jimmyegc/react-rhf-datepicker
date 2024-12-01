import { forwardRef, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Input } from "./components/Input";
import { FieldErrors } from "react-hook-form";
import { useCustomTime } from "./useCustomTime";

interface WFCDatePickerCustomTime {
  objConf: any;
  initialDate: Date;
  dateFormat: string;
  onChange: CallableFunction;
  errors?: FieldErrors;
}

const CustomInput = forwardRef((props: any, ref) => {
  return <Input {...props} ref={ref} />;
});

export const WFCDatePickerCustomTime = ({
  objConf,
  initialDate,
  dateFormat,
  onChange,
  errors,
}: WFCDatePickerCustomTime) => {
  const { formatHour } = objConf;
  const [myDate, setMyDate] = useState(null);
  const { isValidDate, formatUTC } = useCustomTime();

  //console.log("WFCDatePickerCustomTime", initialDate);

  //console.log(isValidDate("18/10/2024, 2:00:00 p.m."));

  //const myDate = initialDate.toISOString().substring(0, 10);
  /*
  const cleanedData = initialDate && initialDate.replace(/^"|"$/g, "");  
  console.log("cleanedData", cleanedData);
  console.log("utcDate", utcDate); */

  //const cleanedData = initialDate.toString().replace(/^"|"$/g, "");

  //console.log(cleanedData);
  //console.log(typeof cleanedData);

  const [startDate, setStartDate] = useState<Date | null>();

  const red = errors[objConf.internalName]?.type ? "required" : "";
  const blue = objConf.isRequired ? "required-default" : "";
  const c = red !== "" ? red : blue;

  const handleChange = (e) => {
    //console.log("handleChange", e);
    setStartDate(e);
    onChange(e);
  };

  useEffect(() => {
    if (initialDate) {
      //const cleanedData = initialDate.toString().replace(/^"|"$/g, "");
      const myDate = formatUTC(initialDate);
      const utcDate = new Date(myDate);
      //setMyDate(cleanedData);
      setStartDate(initialDate);
    }
  }, [initialDate]);

  /*   useEffect(() => {
    if (initialDate) {
      console.log("initialDate", initialDate);
      console.log(isValidDate(new Date(initialDate)));
      //setStartDate(new Date(initialDate));
    }
  }, [initialDate]); */

  return (
    <>
      {JSON.stringify(initialDate)}
      <br />
      {formatHour === "12" ? (
        <DatePicker
          className={`form-control form-control-solid ${c}`}
          locale="es"
          dateFormat={dateFormat}
          selected={startDate}
          showTimeInput
          timeInputLabel="Hora"
          timeFormat={"h:mm aa"}
          onChange={handleChange}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
      ) : (
        <DatePicker
          className={`form-control form-control-solid ${c}`}
          locale="es"
          dateFormat={dateFormat}
          selected={startDate}
          showTimeInput
          timeInputLabel="Hora"
          customTimeInput={
            <CustomInput className="form-control" onChange={handleChange} />
          }
          timeFormat={"HH:mm"}
          onChange={handleChange}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
      )}
    </>
  );
};
