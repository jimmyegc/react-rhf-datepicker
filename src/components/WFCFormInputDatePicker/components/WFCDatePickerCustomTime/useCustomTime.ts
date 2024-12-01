export const useCustomTime = () => {
  
  const actualizarHora = (fechaOriginal, nuevaHora) => {
    // Descomponemos la nueva hora en horas y minutos
    const [horas, minutos] = nuevaHora.split(":").map(Number);

    // Crear una nueva instancia de la fecha original para no modificarla directamente
    const fechaActualizada = new Date(fechaOriginal);

    // Actualizamos las horas y los minutos
    fechaActualizada.setHours(horas);
    fechaActualizada.setMinutes(minutos);
    fechaActualizada.setSeconds(0); // Opcional: Reiniciar los segundos a 0 si lo deseas

    return fechaActualizada;
  };

  const convertirAHoraUTC = (fechaLocal) => {
    // Obtenemos las horas, minutos y segundos en formato UTC
    const horasUTC = fechaLocal.getUTCHours();
    const minutosUTC = fechaLocal.getUTCMinutes();
    const segundosUTC = fechaLocal.getUTCSeconds();

    // Formateamos la hora UTC en "HH:MM:SS"
    const horaUTC = `${horasUTC.toString().padStart(2, "0")}:${minutosUTC
      .toString()
      .padStart(2, "0")}:${segundosUTC.toString().padStart(2, "0")}`;

    return horaUTC;
  };

  const validateTime24Hours = (str: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(str);

  const formatUTC = (dateInt, addOffset = false) => {
    const date =
      !dateInt || dateInt.length < 1 ? new Date() : new Date(dateInt);
    if (typeof dateInt === "string") {
      return date;
    } else {
      const offset = addOffset
        ? date.getTimezoneOffset()
        : -date.getTimezoneOffset();
      const offsetDate = new Date();
      offsetDate.setTime(date.getTime() + offset * 60000);
      return offsetDate;
    }
  };
  

  const isValidDate = (date) => {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
  }
  
  return {
    formatUTC,
    isValidDate,
    validateTime24Hours,
  }
}