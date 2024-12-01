import { forwardRef, useEffect, useState } from "react";
import { formatDate } from "react-datepicker/dist/date_utils";
import { Controller, useForm } from "react-hook-form";
import { subDays, addDays, getDay, isDate } from "date-fns";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
registerLocale("es", es);

const objConf = {
  defaultDate: "",
  defaultDateValue: "",
  defaultDateType: null,  
  formatDate: "dd MM yyyy",
  formatHour: "12",
  separator: "/",
  isHourRequired: false,
  canSelectFutureDates: true,
  internalName: 'cita',
  isRequired: true,
  isEnableCurrentDay: false,
  maxHourCurrentDay: "",
  readonly: false,
  startOfWeek: "Lun",
  maxFutureDays: 15,
  daysOfWeek:
  [
    {
      "name": "Lun",
      "enabled": true
    },
    {
      "name": "Mar",
      "enabled": true
    },
    {
      "name": "Mié",
      "enabled": true
    },
    {
      "name": "Jue",
      "enabled": true
    },
    {
      "name": "Vie",
      "enabled": true
    },
    {
      "name": "Sáb",
      "enabled": false
    },
    {
      "name": "Dom",
      "enabled": false
    }
  ]
}

const CustomInput = forwardRef((props: any, ref) => {
  return <input {...props} ref={ref} />;
});


export const DatePickerComponent = () => {
  const { register, handleSubmit, watch, control, setValue, formState: { errors } } = useForm();    
  const wCita = watch(objConf.internalName);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startOfWeek, setStartOfWeek] = useState(objConf.startOfWeek);
  const [dateFormat, setDateFormat] = useState();
  const today = new Date();
  const tomorrow = addDays(new Date(), 1);
  const [minDate, setMinDate] = useState<Date>(null);
  const [validationMaxHour, setValidationMaxHour] = useState("");

  const onSubmit = data => console.log("form", data);

  const getFormatDate = () => {
    let cleanFormatDate;
    let hourFormat;
    if (objConf.formatDate) {
      cleanFormatDate = objConf.formatDate
        .replace(" ", objConf.separator)
        .replace(" ", objConf.separator);
    }
    if (objConf.formatHour) {
      hourFormat =
        objConf.isHourRequired && objConf.formatHour == "24"
          ? "HH:mm"
          : "h:mm aa";
    }
    // console.log("getFormatDate", cleanFormatDate);
    return objConf.isHourRequired
      ? cleanFormatDate + " " + hourFormat
      : cleanFormatDate;
  };

  const isWeekday = (date) => {
    const day = getDay(date);
    return objConf.daysOfWeek.every(
      (dayConfig, index) => day !== (!dayConfig.enabled ? index : -1)
    );
  };

  const handleInitial = () => {
    let initialDate = new Date();
    if (objConf.defaultDateType != "") {
      initialDate =
        objConf.defaultDateType === "today"
          ? new Date()
          : new Date(objConf.defaultDate);
      //console.log(initialDate);
      setStartDate(initialDate);
      setDateFormat(getFormatDate());
    } else {
      setDateFormat(getFormatDate());
    }
  };

  
  const handleChange = (dateChange: Date) => {
    if (dateChange) {
      // console.log("setValue " + objConf?.internalName, dateChange);
      setValue(objConf?.internalName, dateChange, {
        shouldDirty: true,
      });
      if (
        objConf.canSelectFutureDates &&
        objConf.isEnableCurrentDay &&
        objConf.maxHourCurrentDay != ""
      ) {
        //canSelectToday();
        /*const formattedDate = dateChange.toISOString().split("T")[0];
        const dateChangeHour = new Date(`${formattedDate}T${hour}:00`);
        setValue(objConf?.internalName, dateChangeHour, {
          shouldDirty: true,
        }); */
        calculateFutureDates(dateChange);
        setStartDate(dateChange);
      } else {
        setStartDate(dateChange);
      }
    }
  };

  const isDatesAreTheSame = (fecha1, fecha2) => {
    return (
      fecha1.getFullYear() === fecha2.getFullYear() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getDate() === fecha2.getDate()
    );
  };

  
  const calculateDateWithHour = (horaParam) => {
    // Obtén la fecha actual
    const fechaActual = new Date();
    // Divide la hora pasada como parámetro en horas y minutos
    const [horas, minutos] = horaParam.split(":").map(Number);
    // Ajusta la hora y minutos en la fecha actual
    fechaActual.setHours(horas);
    fechaActual.setMinutes(minutos);
    fechaActual.setSeconds(0);
    fechaActual.setMilliseconds(0);
    return fechaActual;
  };


  const calculateFutureDates = (dateChange: Date) => {
    console.log("calculateFutureDates");
    if (
      objConf.canSelectFutureDates &&
      objConf.isEnableCurrentDay &&
      objConf.maxHourCurrentDay != ""
    ) {
      if (!dateChange) return;
      if (isDatesAreTheSame(dateChange, today)) {
        const d = new Date();
        const n = d.getTime();
        const maxTodayHour = calculateDateWithHour(objConf.maxHourCurrentDay);
        //console.log(objConf.maxHourCurrentDay);
        //console.log("now", d);
        //console.log("max", maxTodayHour);
        if (n < maxTodayHour.getTime()) {
          setMinDate(today);
          setValidationMaxHour("");
          setValue(objConf?.internalName, d, { shouldDirty: true });
          //console.log("menor", today);
        } else {
          setMinDate(tomorrow);
          //setValidationMaxHour(`Este campo es requerido.`);
          setValue(objConf?.internalName, null, { shouldDirty: true });
          //console.log("mayor", tomorrow);
        }
      } else {
        setValue(objConf?.internalName, dateChange, { shouldDirty: true });
      }
      //console.log(today);
      //console.log(dateChange);
      //console.log("---");
      return;
    }
    setMinDate(new Date());

    //return new Date();
  };

  const handleValidationFutureDays = () => {
    //console.log(objConf);
    if (objConf.isRequired && !isDate(startDate)) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    const birthday =  new Date(2024, 6, 18);
    handleInitial();
    //calculateBlockDays();
    //calculateEnabledDays();
    setValue(objConf.internalName, birthday);
    setStartDate(birthday);
    calculateFutureDates(new Date());
    /* if (objConf.isRequired) {
      register(`${objConf?.internalName}`, {
        required: "El campo es requerido",
      });
    } else {
      register(`${objConf?.internalName}`);
    } */
  }, []);

  console.log("watch", wCita);

  const red = errors[objConf.internalName]?.type ? "required" : "";
  const blue = objConf.isRequired ? "required-default" : "";
  const c = red !== "" ? red : blue;



  return (<>    
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', justifyContent: 'center'}}>
     {objConf.canSelectFutureDates && (
                  <div className="w-100">
                    {/* <pre>
                      {JSON.stringify(objConf.canSelectFutureDates)} -
                      {JSON.stringify(objConf.maxFutureDays)} -
                      {JSON.stringify(objConf.isEnableCurrentDay)} -
                      {JSON.stringify(objConf.maxHourCurrentDay)} -
                      {JSON.stringify(objConf?.formatHour)}
                    </pre> */}
                    {objConf?.formatHour === "12" ? (
                      <>
                        <Controller
                          name={`${objConf?.internalName}`}
                          control={control}
                          defaultValue={startDate}
                          rules={{
                            required: objConf.isRequired,
                          }}
                          render={({
                            field: { onChange, onBlur, value, ref, name },
                          }) => (
                            <>
                              <DatePicker
                                ref={(elem) => {
                                  elem && ref(elem.input);
                                }}
                                locale="es"
                                icon="fa fa-calendar"
                                className={`form-control form-control-solid w-250px ${c}`}
                                selected={startDate}
                                onSelect={handleChange}
                                onChange={handleChange}
                                onKeyDown={(e) => {
                                  e.preventDefault();
                                }}
                                readOnly={objConf.readonly}
                                calendarStartDay={
                                  objConf.startOfWeek === "Lun" ? 1 : 0
                                }
                                filterDate={isWeekday}
                                dateFormat={dateFormat}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                minDate={minDate}
                                maxDate={addDays(
                                  new Date(),
                                  Number(objConf.maxFutureDays)
                                )}
                                showTimeInput={objConf.isHourRequired}
                                timeInputLabel="Hora"
                                shouldCloseOnSelect={false}
                              />
                            </>
                          )}
                        />
                      </>
                    ) : <span>24</span>}
                  </div>
                )}

      <button type="submit">Send</button>
    </form>
    </>)
}
