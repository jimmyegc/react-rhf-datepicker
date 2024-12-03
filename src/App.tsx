import { lazy, Suspense } from 'react'
import './App.css'
import DatePickerForm from './components/DatePickerForm/DatePickerForm';
import { FloatingDiv } from './components/FloatingDiv/FloatingDiv';

import { Form } from './components/Form/Form';
import { FormCarSales } from './components/FormCarSales/FormCarSales';
import { MyComponent } from './components/MyComponent/MyComponent';
import { MyDynamicForm } from './components/MyDinamicForm/MyDinamicForm';
import { DatePickerComponent } from './pages/DatePickerComponent/DatePickerComponent.tsx';


const LazyComponent = lazy(() => import("./components/LazyLoadedComponent/LazyLoadedComponent.tsx"));


const Fallback = () => (
  <div style={{ textAlign: "center", marginTop: "50px", fontSize: "1.5rem" }}>
    Cargando contenido...
  </div>
);

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
      <MyDynamicForm />      
      
 */}
  <MyComponent />
    <FloatingDiv />
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Ejemplo de Lazy Loading en React</h1>
      <p>El componente a continuación se carga de forma diferida:</p>
      <Suspense fallback={<Fallback />}>
        <LazyComponent />
      </Suspense>
    </div>

    {/* <DatePickerComponent /> */}

    </>
  )
}

export default App
