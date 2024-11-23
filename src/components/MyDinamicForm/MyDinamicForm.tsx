import { useFieldArray, useForm } from 'react-hook-form';
export const MyDynamicForm = () => {
  const { control, handleSubmit, register } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`items.${index}.value`)} />
          <button type="button" onClick={() => remove(index)}>Eliminar</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ value: '' })}>Añadir</button>
      <button type="submit">Enviar</button>
    </form>
  );
};
