import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPerson, getPerson, updatePerson } from '../services/personService';
import { getAddressByCep } from '../services/addressService';

const initialState = {
  name: '',
  cpf: '',
  birthDate: '',
  nameMother: '',
  nameFather: '',
  addresses: [],
  contacts: [],
  dependents: [],
};

export default function PersonFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState<any>(initialState);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      getPerson(Number(id)).then((data) => {
        setPerson(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerson({ ...person, [e.target.name]: e.target.value });
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value;
    setPerson({ ...person, addresses: [{ ...person.addresses[0], zipCode: cep }] });
    if (cep.length >= 6) {
      const address = await getAddressByCep(cep);
      setPerson({
        ...person,
        addresses: [{ ...person.addresses[0], ...address, zipCode: cep }],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await updatePerson(Number(id), person);
      alert('Pessoa atualizada com sucesso!');
    } else {
      await createPerson(person);
      alert('Pessoa criada com sucesso!');
    }
    navigate('/persons');
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h2>{id ? 'Editar Pessoa' : 'Cadastrar Pessoa'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input name="name" value={person.name} onChange={handleChange} required />
        </div>
        <div>
          <label>CPF:</label>
          <input name="cpf" value={person.cpf} onChange={handleChange} />
        </div>
        <div>
          <label>Data de Nascimento:</label>
          <input name="birthDate" type="date" value={person.birthDate} onChange={handleChange} />
        </div>
        <div>
          <label>Mãe:</label>
          <input name="nameMother" value={person.nameMother} onChange={handleChange} />
        </div>
        <div>
          <label>Pai:</label>
          <input name="nameFather" value={person.nameFather} onChange={handleChange} />
        </div>
        {/* Campos para endereços, contatos e dependentes podem ser adicionados aqui */}
        <div>
          <label>CEP:</label>
          <input
            name="zipCode"
            value={person.addresses[0]?.zipCode || ''}
            onChange={handleCepChange}
            maxLength={8}
          />
        </div>
        <div>
          <label>Rua:</label>
          <input
            name="street"
            value={person.addresses[0]?.street || ''}
            onChange={e => setPerson({
              ...person,
              addresses: [{ ...person.addresses[0], street: e.target.value }],
            })}
          />
        </div>
        <div>
          <label>Número:</label>
          <input
            name="number"
            value={person.addresses[0]?.number || ''}
            onChange={e => setPerson({
              ...person,
              addresses: [{ ...person.addresses[0], number: e.target.value }],
            })}
          />
        </div>
        <div>
          <label>Bairro:</label>
          <input
            name="neighborhood"
            value={person.addresses[0]?.neighborhood || ''}
            onChange={e => setPerson({
              ...person,
              addresses: [{ ...person.addresses[0], neighborhood: e.target.value }],
            })}
          />
        </div>
        <div>
          <label>Cidade:</label>
          <input
            name="city"
            value={person.addresses[0]?.city || ''}
            onChange={e => setPerson({
              ...person,
              addresses: [{ ...person.addresses[0], city: e.target.value }],
            })}
          />
        </div>
        <div>
          <label>Estado:</label>
          <input
            name="state"
            value={person.addresses[0]?.state || ''}
            onChange={e => setPerson({
              ...person,
              addresses: [{ ...person.addresses[0], state: e.target.value }],
            })}
          />
        </div>
        <div>
          <label>País:</label>
          <input
            name="country"
            value={person.addresses[0]?.country || ''}
            onChange={e => setPerson({
              ...person,
              addresses: [{ ...person.addresses[0], country: e.target.value }],
            })}
          />
        </div>
        <button type="submit">{id ? 'Salvar' : 'Cadastrar'}</button>
      </form>
    </div>
  );
}
