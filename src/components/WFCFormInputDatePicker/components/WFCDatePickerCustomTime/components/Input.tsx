import React, { forwardRef, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useDebounce } from "../useDebounce";
import { useCustomTime } from "../useCustomTime";

interface InputProps {
  className: string;
  value: string;
  onChange: (value: string) => void;
  onClick: () => void;
}
export const Input: React.FC<InputProps> = (
  { className, value, onClick, onChange },
  ref
) => {
  const { validateTime24Hours } = useCustomTime();
  const [time, setTime] = useState(value);
  const [validateTime, setValidateTime] = useState("");
  const debouncedSearch = useDebounce(time);

  useEffect(() => {
    const save = async () => {
      validate(debouncedSearch);
    };
    save();
  }, [debouncedSearch]);

  const validate = (hour) => {
    if (!hour) return;
    // console.log("validation", hour);
    if (validateTime24Hours(hour)) {
      setTime(hour);
      //const fechaActualizada = actualizarHora(date, hour)
      //console.log("fechaActualizada", fechaActualizada)
      //const horaUTC = convertirAHoraUTC(fechaActualizada);
      //console.log("Hora en formato UTC:", horaUTC);
      //setStartDate(fechaActualizada)
      //console.log("updated", hour);
      onChange(hour);
      setValidateTime("");
    } else {
      setValidateTime("Hora inválida");
    }
    //setTime(e.target.value)
    //e.target?.focus()
  };

  return (
    <div>
      <input
        className={className}
        type="text"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        onClick={onClick}
        style={{ width: 100 }}
      />
      {validateTime && (
        <>
          <Alert variant="danger" style={{ padding: ".1rem" }}>
            {validateTime}
          </Alert>
        </>
      )}
    </div>
  );
};

//export default forwardRef(Input);
