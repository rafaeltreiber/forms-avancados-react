import { useState } from 'react';
import './styles/global.css';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createUserFormSchema = z.object({
  name: z.string()
    .nonempty('O nome é obrigatório')
    .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toLocaleUpperCase().concat(word.substring(1));
      }).join(' ');
    })
  ,
  email: z.string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail inváido')
    .refine(email => {
      return email.endsWith('@rocketseat.com.br');
    }, 'O e-mail precisa ser da Rocketseat')
  ,
  password: z.string()
    .min(6, 'A senha precisa de no mínimo 6 caracteres'),
  techs: z.array(z.object({
    title: z.string().nonempty('O título é obrigatório'),
    knowledge: z.number().min(1).max(100)

  }))
});

type createUserFormData = z.infer<typeof createUserFormSchema>;

function App() {
  const [output, setOutput] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<createUserFormData>({
    resolver: zodResolver(createUserFormSchema)
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs'

  });

  function createUser(data: any) {
    setOutput(JSON.stringify(data, null, 2));

  }

  return (
    <main className='h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center'>
      <form
        onSubmit={handleSubmit(createUser)}
        className='flex flex-col gap-4 w-full max-w-xs'
      >
        <div className='flex flex-col gap-1'>
          <label htmlFor='name'>Nome</label>
          <input
            type="text"
            className='border border-zinc-800 shadow-small rounded h-10 px-3 bg-zinc-900 text-white'
            {...register('name')}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='email'>E-mail</label>
          <input
            type="email"
            className='border border-zinc-800 shadow-small rounded h-10 px-3 bg-zinc-900 text-white'
            {...register('email')}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='password'>Senha</label>
          <input
            type="password"
            className='border border-zinc-800 shadow-small rounded h-10 px-3 bg-zinc-900 text-white'
            {...register('password')}
          />
          {errors.password && <span>{errors.password.message}</span>}

        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor=''>
            Tecnologias

            <button onClick={addNewTech}>Adicionar</button>
          </label>

          {fields.map((field, index) => {
            return (
              <div key={field.id}>
                <input
                  type="text"
                  className='border border-zinc-800 shadow-small rounded h-10 px-3 bg-zinc-900 text-white'
                  {...register(`techs.${index}.title`)}
                />
                <input
                  type="number"
                  className='border border-zinc-800 shadow-small rounded h-10 px-3 bg-zinc-900 text-white'
                  {...register(`techs.${index}.knowledge`)}
                />
              </div>

            );
          })}
        </div>

        <button
          type='submit'
          className='bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600'
        >
          Salvar
        </button>

      </form>

      <pre>{output}</pre>

    </main>
  );
}

export default App;
