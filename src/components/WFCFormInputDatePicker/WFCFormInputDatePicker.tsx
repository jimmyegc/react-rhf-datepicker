import "./WFCFormInputDatePicker.css";
import { forwardRef, useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
registerLocale("es", es);

import { WFCFormDatePickerModel } from "../../customComponentConfigurationForms/WFCFormDatePicker/WFCFormDatePickerModel";
import { Alert } from "react-bootstrap";
import { TRANSLATE_MODULE_UTILS } from "../../../../../config/consts";
import { usePrefixedTranslation } from "../../../../../hooks/usePrefixedTranslation";
import { Controller, useFormContext } from "react-hook-form";
import { subDays, addDays, getDay, isDate } from "date-fns";
import { positionFieldName } from "../../helpers/styleHelper";
import { WFCDatePickerCustomTime } from "./components/WFCDatePickerCustomTime/WFCDatePickerCustomTime";
import { parseDate } from "react-datepicker/dist/date_utils";
import { useCustomTime } from "./components/WFCDatePickerCustomTime/useCustomTime";
import { Input } from "./components/WFCDatePickerCustomTime/components/Input";
import { AlertMessage } from "../../customComponentConfigurationForms/WFCFormAgenda/components/AlertMessage/AlertMessage";

const CustomInput = forwardRef((props: any, ref) => {
  return <Input {...props} ref={ref} />;
});

export const WFCFormInputDatePicker = ({
  // onChangeProps,
  objConf,
}: {
  onChangeProps?: (obj: WFCFormDatePickerModel) => object;
  objConf?: WFCFormDatePickerModel;
}) => {
  // console.log("objConf", objConf);

  const { t: tUtils } = usePrefixedTranslation(TRANSLATE_MODULE_UTILS);
  // const internalColumns: { [key: string]: string } = {
  //   one: "col",
  //   two: "col-12",
  //   default: "col",
  // };

  const {
    register,
    control,
    setValue,
    setFocus,
    formState: { errors },
  } = useFormContext();

  const { position, column } = (objConf as WFCFormDatePickerModel) || {};
  const [startOfWeek, setStartOfWeek] = useState(objConf.startOfWeek);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [dateFormat, setDateFormat] = useState();
  const [hour, setHour] = useState("00:00");
  const [validationMaxHour, setValidationMaxHour] = useState("");
  const [excludeDates, setExcludeDates] = useState([]);
  const [includeDates, setIncludeDates] = useState([]);
  const [customTime, setCustomTime] = useState("");

  const { formatUTC } = useCustomTime();
  //const [highlightDates, setHighlightDates] = useState([]);

  const today = new Date();
  const tomorrow = addDays(new Date(), 1);
  const [minDate, setMinDate] = useState<Date>();

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

  const getDefaultDate = () => {
    switch (objConf.defaultDateType) {
      case "":
        return null;
      case "today":
        return new Date();
      case "custom":
        return new Date(objConf.defaultDate);
      default:
        return undefined;
    }
  };

  const isWeekday = (date) => {
    const day = getDay(date);
    return objConf.daysOfWeek.every(
      (dayConfig, index) => day !== (!dayConfig.enabled ? index : -1)
    );
  };
  const [birthday, setBirthday] = useState("");
  const [age, setAge] = useState<Date | null>();
  const [selectedAge, setSelectedDate] = useState(0);
  const [validationHourMax, setValidationHourMax] = useState("");
  const refFutureDays24 = useRef();

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date(); // Fecha actual
    const fechaNac = new Date(fechaNacimiento); // Fecha de nacimiento
    let edad = hoy.getFullYear() - fechaNac.getFullYear(); // Calcula la diferencia de años
    const mes = hoy.getMonth() - fechaNac.getMonth(); // Calcula la diferencia de meses

    // Si el mes actual es menor que el mes de nacimiento o es el mismo mes pero el día actual es menor al día de nacimiento, resta un año a la edad
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    return edad;
  };

  /*   useEffect(() => {
    handleAgeValidation(age);
  }, [age]); */

  const handleAgeValidation = (value) => {
    //console.log(value);
    const edad = calcularEdad(value);
    setSelectedDate(edad);
    const result = edad >= objConf.minAge && edad <= objConf.maxAge;
    return result;
  };

  const filterPassedTime = (time) => {
    if (objConf.isEnableCurrentDay) {
      const currentDate = new Date();
      const selectedDate = new Date(time);
      //console.log("currentDate", currentDate);
      //console.log("selectedDate", selectedDate);
      return currentDate.getTime() < selectedDate.getTime();
    } else {
      return true;
    }
  };

  const validHHMMstring = (str) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(str);

  const handleMaxTimeCurrentDay = (value) => {
    if (!validHHMMstring(value)) {
      setValidationMaxHour("Ingrese una hora válida en formato 24 hrs (HH:MM)");
      return false;
    }
    //setHour(value);
    setValidationMaxHour("");

    if (objConf.isEnableCurrentDay && objConf.maxHourCurrentDay != "") {
      const now = new Date(new Date().toDateString());
      if (startDate > now) {
        // Omitir validación porque la fecha es mayor al día de hoy
        return;
      }
      const [maxHour, maxMinutes] = objConf.maxHourCurrentDay.split(":");
      const [currentHour, currentMinutes] = value.split(":");
      //console.log("maxTime", `${maxHour}:${maxMinutes}`);
      //console.log("currenTime", `${currentHour}:${currentMinutes}`);
      if (
        currentHour < maxHour ||
        (currentHour === maxHour && currentMinutes <= maxMinutes)
      ) {
        setValidationMaxHour("");
      } else {
        setValidationMaxHour(
          `La fecha ingresada tiene que ser menor a ${maxHour}:${maxMinutes}.`
        );
      }
    }
    handleChange(startDate);
  };

  const calculateBlockDays = () => {
    //if (objConf.canBlockDays === undefined) return;
    if (objConf.canBlockDays) {
      const blockDates = [];
      if (objConf.disabledDays?.length > 0) {
        objConf.disabledDays.forEach((day) => {
          blockDates.push({
            start: new Date(day.rawDate.split("@")[0]),
            end: new Date(day.rawDate.split("@")[1]),
          });
        });
        setExcludeDates(blockDates);
      }
    }
  };

  const calculateEnabledDays = () => {
    if (objConf.canEnabledDays) {
      const enabledDates = [];
      if (objConf.enabledDays?.length > 0) {
        objConf.enabledDays.forEach((day) => {
          enabledDates.push({
            start: new Date(day.rawDate.split("@")[0]),
            end: new Date(day.rawDate.split("@")[1]),
          });
        });
        setIncludeDates(enabledDates);
      }
    }
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

  const isDatesAreTheSame = (fecha1, fecha2) => {
    return (
      fecha1.getFullYear() === fecha2.getFullYear() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getDate() === fecha2.getDate()
    );
  };

  const calculateFutureDates = (dateChange: Date) => {
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
          setValue(objConf?.internalName, d, {
            shouldDirty: true,
          });
          //console.log("menor", today);
        } else {
          setMinDate(tomorrow);
          //setValidationMaxHour(`Este campo es requerido.`);
          setValue(objConf?.internalName, null, {
            shouldDirty: true,
          });
          //console.log("mayor", tomorrow);
        }
      } else {
        setValue(objConf?.internalName, dateChange, {
          shouldDirty: true,
        });
      }
      //console.log(today);
      //console.log(dateChange);
      //console.log("---");
      return;
    }
    setMinDate(new Date());

    //return new Date();
  };

  const CustomTimeInput = ({ date, value, onChange }) => {
    const [time, setTime] = useState("");
    const validateTime24 = (value) => {
      //console.log(value);
      const maxHour = value;
      if (maxHour === "") return true;
      if (!validHHMMstring(maxHour)) {
        setValidationHourMax(
          "Ingrese una hora válida en formato 24 hrs (HH:MM)"
        );
        return false;
      }
      setValidationHourMax("");
      setTime(value);
      return true;
    };

    return (
      <>
        {objConf.formatHour === "12" ? (
          <input
            className="form-control"
            type="time"
            step={1}
            value={value}
            onChange={(e) => validateTime24(e.target.value)}
            /* onClick={(e) => e.target?.focus()} */
            style={{ width: 120 }}
          />
        ) : (
          <div>
            <input type="text" className="form-control timePicker" />
            <input
              type="time"
              id="myTime"
              value="16:32:55"
              style={{ width: 120 }}
            />
            <input
              className="form-control"
              type="text"
              placeholder={"HH:MM"}
              style={{ width: 120 }}
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
            />
            {/*  {validationHourMax != "" && (
              <div className="d-flex mt-1" style={{ marginBottom: ".2rem" }}>
                <Alert
                  variant="warning"
                  style={{ padding: ".1rem", margin: ".0rem" }}
                >
                  {validationHourMax}
                </Alert>
              </div>
            )} */}
          </div>
        )}
      </>
    );
  };

  //console.log(objConf?.internalName);
  useEffect(() => {
    const delayFn = setTimeout(() => {
      setHour(hour);
      handleMaxTimeCurrentDay(hour);
    }, 350);
    return () => clearTimeout(delayFn);
  }, [hour]);

  const getCurrentTime = (date) => {
    const horas = date.getHours().toString().padStart(2, "0");
    const minutos = date.getMinutes().toString().padStart(2, "0");
    return `${horas}:${minutos}`;
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

  const handleValidationFutureDays = () => {
    //console.log(objConf);
    if (objConf.isRequired && !isDate(startDate)) {
      return false;
    } else {
      return true;
    }
  };

  const getWfData = () => {
    const webFormData = objConf?.webFormData;

    if (!webFormData || Object.keys(webFormData)?.length === 0) {
      setValue(objConf?.internalName, "");
      return;
    }

    const data = webFormData[objConf?.internalName];
    //console.log(objConf);
    //console.log("data", data);

    if (!data || data === "") {
      setValue(objConf?.internalName, null);
      setStartDate(null);
      return;
    }

    const cleanedData = data.replace(/^"|"$/g, "");
    //console.log("cleanedData", cleanedData);
    const parsedDate = new Date(cleanedData);
    //console.log("parsedDate", parsedDate);
    if (isNaN(parsedDate.getTime())) {
      setValue(objConf?.internalName, null);
      return;
    }
    //console.log(objConf?.canSelectFutureDates);
    if (objConf?.isHourRequired) {
      const myDate = new Date(parsedDate);
      //console.log("myDate", myDate);
      setValue(objConf?.internalName, myDate);
      setStartDate(myDate);
      return;
    }

    if (objConf.isRangeOfAge) {
      setValue(
        objConf?.internalName,
        new Date(parsedDate).toISOString().slice(0, 10)
      );
      return;
    }

    if (objConf.canSelectFutureDates && objConf.isEnableCurrentDay) {
      const inputTime = getCurrentTime(parsedDate);
      setStartDate(parsedDate);
      setHour(inputTime);
      return;
    }

    setValue(objConf?.internalName, parsedDate);
    setStartDate(parsedDate);
  };

  useEffect(() => {
    getWfData();
  }, [objConf?.webFormData]);

  useEffect(() => {
    handleInitial();
    calculateBlockDays();
    calculateEnabledDays();
    calculateFutureDates(new Date());
    if (objConf.isRequired) {
      register(`${objConf?.internalName}`, {
        required: "El campo es requerido",
      });
    } else {
      register(`${objConf?.internalName}`);
    }
  }, []);

  const red = errors[objConf.internalName]?.type ? "required" : "";
  const blue = objConf.isRequired ? "required-default" : "";
  const c = red !== "" ? red : blue;

  return (
    <>
      <div className="row">
        <div
          className={`col d-flex ${
            positionFieldName[position] || positionFieldName.default
          }`}
        >
          <div
            className="d-flex align-items-center me-2"
            style={{ minWidth: "fit-content" }}
          >
            <b>{objConf.fieldName}</b>
          </div>
          <div className="w-100">
            <div className="row">
              <div
                className={`${
                  column === "two" || objConf.column === undefined
                    ? "col-12"
                    : "col-6"
                }`}
              >
                {/* Contenido */}
                {/* <pre>{JSON.stringify(objConf, null, 2)}</pre> */}
                {/* <Form.Label>{objConf.fieldName}</Form.Label> */}
                {!objConf.canBlockDays &&
                  !objConf.isRangeOfAge &&
                  !objConf.canSelectPastDates &&
                  !objConf.canSelectFutureDates &&
                  !objConf.canEnabledDays && (
                    <>
                      {/* <WFCDatePickerCustomTime
                        objConf={objConf}
                        initialDate={startDate}
                        dateFormat={dateFormat}
                        onChange={handleChange}
                        errors={errors}
                      /> */}

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
                              className={`form-control form-control-solid ${c}`}
                              selected={startDate}
                              onChange={handleChange}
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                              readOnly={objConf.readonly}
                              calendarStartDay={startOfWeek === "Lun" ? 1 : 0}
                              filterDate={isWeekday}
                              dateFormat={dateFormat}
                              timeInputLabel="Hora"
                              showTimeInput={objConf.isHourRequired}
                              timeFormat={
                                objConf.formatHour === "24"
                                  ? " HH:mm"
                                  : "h:mm aa"
                              }
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                            />
                          </>
                        )}
                      />
                    </>
                  )}
                {/* Bloqueo de días */}
                {objConf.canBlockDays && (
                  <>
                    <DatePicker
                      locale="es"
                      icon="fa fa-calendar"
                      className={`form-control form-control-solid w-250px ${c}`}
                      selected={startDate}
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      readOnly={objConf.readonly}
                      calendarStartDay={objConf.startOfWeek === "Lun" ? 1 : 0}
                      //filterDate={isWeekday}
                      dateFormat={dateFormat}
                      timeFormat={
                        objConf.formatHour == "24" ? " HH:mm" : "h:mm aa"
                      }
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      timeInputLabel="Hora"
                      showTimeInput={objConf.isHourRequired}
                      //excludeDates={excludeDates}
                      excludeDateIntervals={excludeDates}
                      /*                 highlightDates={highlightDates} */
                    />
                  </>
                )}
                {/* Rango de Edad */}
                {objConf.isRangeOfAge && (
                  <div className="w-25">
                    <label>Edad</label>

                    <input
                      type="date"
                      {...register(`${objConf?.internalName}`, {
                        valueAsDate: true,
                        required: objConf.isRequired,
                        validate: handleAgeValidation,
                      })}
                      className={`form-control form-control-solid ${c}`}
                      /*id={`${objConf?.internalName}`}
                    name={`${objConf?.internalName}`}
                    value={birthday.toString()}
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    defaultValue={getValues(`${objConf?.internalName}`)}
                    value={getValues(`${objConf?.internalName}`)}
                     value={age && age.toString()}                      
                    onChange={(e) => {
                      console.log(e.target.value);
                      setAge(new Date(e.target.value));
                    }} */
                    />
                    {errors[objConf.internalName]?.type &&
                      errors[objConf.internalName]?.type != "required" &&
                      selectedAge != undefined && (
                        <div
                          className="w-100"
                          style={{ marginBottom: ".2rem" }}
                        >
                          <Alert
                            variant="warning"
                            style={{ padding: ".1rem", margin: ".0rem" }}
                          >
                            La edad ingresada{" "}
                            {selectedAge > 0
                              ? `"${selectedAge.toString()}"`
                              : ""}
                            , debe estar entre {objConf.minAge} y{" "}
                            {objConf.maxAge}
                          </Alert>
                        </div>
                      )}
                  </div>
                )}
                {/* Fechas Pasadas */}
                {objConf.canSelectPastDates && (
                  <div>
                    <DatePicker
                      locale="es"
                      icon="fa fa-calendar"
                      className={`form-control form-control-solid w-250px ${c}`}
                      selected={startDate}
                      onChange={(date: Date) => setStartDate(date)}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      readOnly={objConf.readonly}
                      calendarStartDay={objConf.startOfWeek === "Lun" ? 1 : 0}
                      /* filterDate={isWeekday} */
                      dateFormat={dateFormat}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      minDate={
                        objConf.canSelectPastDates
                          ? subDays(new Date(), objConf.maxPastDays)
                          : null
                      }
                      maxDate={addDays(new Date(), 1)}
                    />
                  </div>
                )}
                {/* Fechas Futuras */}
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
                    ) : (
                      <>
                        <Controller
                          name={`${objConf?.internalName}`}
                          control={control}
                          defaultValue={startDate}
                          rules={{
                            required: objConf.isRequired,
                            validate: handleValidationFutureDays,
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
                                minDate={minDate}
                                maxDate={addDays(
                                  new Date(),
                                  Number(objConf.maxFutureDays)
                                )}
                                showTimeInput={objConf.isHourRequired}
                                timeInputLabel="Hora"
                                timeFormat={"HH:mm"}
                                customTimeInput={
                                  <CustomInput
                                    className="form-control"
                                    onChange={handleChange}
                                  />
                                }
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                shouldCloseOnSelect={false}
                              />
                              {validationMaxHour && (
                                <AlertMessage message={validationMaxHour} />
                              )}
                            </>
                          )}
                        />
                      </>
                    )}
                  </div>
                )}
                {/* Habilitar días */}
                {objConf.canEnabledDays && (
                  <>
                    <div>Habilitar días</div>
                    <DatePicker
                      locale="es"
                      icon="fa fa-calendar"
                      className={`form-control form-control-solid w-250px ${c}`}
                      selected={startDate}
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      readOnly={objConf.readonly}
                      calendarStartDay={objConf.startOfWeek === "Lun" ? 1 : 0}
                      dateFormat={dateFormat}
                      timeFormat={
                        objConf.formatHour == "24" ? " HH:mm" : "h:mm aa"
                      }
                      timeInputLabel="Hora"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      showTimeInput={objConf.isHourRequired}
                      includeDateIntervals={includeDates}
                    />
                  </>
                )}
                <div className="w-25">
                  {errors[objConf.internalName] &&
                    errors[objConf.internalName].type === "required" && (
                      <div style={{ marginBottom: ".2rem" }}>
                        <Alert
                          variant="warning"
                          style={{ padding: ".1rem", margin: ".0rem" }}
                        >
                          {tUtils("required-field")}
                        </Alert>
                      </div>
                    )}
                </div>
                {/* Texto de Apoyo */}
                {objConf.guideText && (
                  <div className="col-12">
                    <figcaption className="figure-caption ms-1">
                      {objConf.guideText}
                    </figcaption>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 
        <pre>{JSON.stringify(objConf, null, 2)}</pre>         
        <p>block days: {JSON.stringify(objConf.canBlockDays)}</p>
        <p>edad: {JSON.stringify(objConf.isRangeOfAge)}</p>
        <p>past days: {JSON.stringify(objConf.canSelectPastDates)} </p>
        <p>future days: {JSON.stringify(objConf.canSelectFutureDates)}</p>
        <p>enabled days: {JSON.stringify(objConf.canEnabledDays)}</p> 
      */}
    </>
  );
};
