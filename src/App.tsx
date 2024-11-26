import './App.css'
import DatePickerForm from './components/DatePickerForm/DatePickerForm';
import { FloatingDiv } from './components/FloatingDiv/FloatingDiv';

import { Form } from './components/Form/Form';
import { FormCarSales } from './components/FormCarSales/FormCarSales';
import { MyDynamicForm } from './components/MyDinamicForm/MyDinamicForm';

function App() {
  const handleFormSubmit = (data) => {
    console.log("Datos enviados:", data);
  };
  return (
    <>
      {/* <Form />      
      <FormCarSales /> 

      <div>
        <h1>Selector de Fecha Flexible</h1>

        <h2>1. Usando React Hook Form con Controller</h2>
        <DatePickerForm useFormLibrary="controller" onSubmit={handleFormSubmit} />

        <h2>2. Usando React Hook Form con register</h2>
        <DatePickerForm useFormLibrary="register" onSubmit={handleFormSubmit} />

        <h2>3. Sin usar React Hook Form</h2>
        <DatePickerForm useFormLibrary="none" onSubmit={handleFormSubmit} />
      </div> 
      <MyDynamicForm /> */}
      <FloatingDiv />
    </>
  )
}

export default App
