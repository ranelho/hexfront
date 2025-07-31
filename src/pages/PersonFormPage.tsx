import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPerson, getPerson, updatePerson } from '../services/personService';
import AddressForm from '../components/AddressForm';
import ContactForm from '../components/ContactForm';
import DependentForm from '../components/DependentForm';
import '../styles/components.css';

const initialState = {
  name: '',
  cpf: '',
  birthDate: '',
  nameMother: '',
  nameFather: '',
  addresses: [{}],
  contacts: [{}],
  dependents: [{}],
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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#1976d2', marginBottom: '30px', textAlign: 'center' }}>
        {id ? 'Editar Pessoa' : 'Cadastrar Pessoa'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* Seção de Dados Pessoais */}
        <div className="form-section">
          <h3 className="section-title">Dados Pessoais</h3>
          
                     <div style={{ 
             display: 'grid', 
             gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
             gap: '12px'
           }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                Nome:
              </label>
                             <input 
                 name="name" 
                 value={person.name} 
                 onChange={handleChange} 
                 required 
                 style={{
                   padding: '8px 12px',
                   borderRadius: '4px',
                   border: 'none',
                   backgroundColor: '#f8f9fa',
                   fontSize: '14px',
                   outline: 'none',
                   width: '100%',
                   transition: 'background-color 0.2s ease'
                 }}
                 onFocus={(e) => e.target.style.backgroundColor = '#ffffff'}
                 onBlur={(e) => e.target.style.backgroundColor = '#f8f9fa'}
               />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                CPF:
              </label>
                             <input 
                 name="cpf" 
                 value={person.cpf} 
                 onChange={handleChange}
                 style={{
                   padding: '8px 12px',
                   borderRadius: '4px',
                   border: 'none',
                   backgroundColor: '#f8f9fa',
                   fontSize: '14px',
                   outline: 'none',
                   width: '100%',
                   transition: 'background-color 0.2s ease'
                 }}
                 onFocus={(e) => e.target.style.backgroundColor = '#ffffff'}
                 onBlur={(e) => e.target.style.backgroundColor = '#f8f9fa'}
               />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                Data de Nascimento:
              </label>
                             <input 
                 name="birthDate" 
                 type="date" 
                 value={person.birthDate} 
                 onChange={handleChange}
                 style={{
                   padding: '8px 12px',
                   borderRadius: '4px',
                   border: 'none',
                   backgroundColor: '#f8f9fa',
                   fontSize: '14px',
                   outline: 'none',
                   width: '100%',
                   transition: 'background-color 0.2s ease'
                 }}
                 onFocus={(e) => e.target.style.backgroundColor = '#ffffff'}
                 onBlur={(e) => e.target.style.backgroundColor = '#f8f9fa'}
               />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                Mãe:
              </label>
                             <input 
                 name="nameMother" 
                 value={person.nameMother} 
                 onChange={handleChange}
                 style={{
                   padding: '8px 12px',
                   borderRadius: '4px',
                   border: 'none',
                   backgroundColor: '#f8f9fa',
                   fontSize: '14px',
                   outline: 'none',
                   width: '100%',
                   transition: 'background-color 0.2s ease'
                 }}
                 onFocus={(e) => e.target.style.backgroundColor = '#ffffff'}
                 onBlur={(e) => e.target.style.backgroundColor = '#f8f9fa'}
               />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#333', fontSize: '14px' }}>
                Pai:
              </label>
                             <input 
                 name="nameFather" 
                 value={person.nameFather} 
                 onChange={handleChange}
                 style={{
                   padding: '8px 12px',
                   borderRadius: '4px',
                   border: 'none',
                   backgroundColor: '#f8f9fa',
                   fontSize: '14px',
                   outline: 'none',
                   width: '100%',
                   transition: 'background-color 0.2s ease'
                 }}
                 onFocus={(e) => e.target.style.backgroundColor = '#ffffff'}
                 onBlur={(e) => e.target.style.backgroundColor = '#f8f9fa'}
               />
            </div>
          </div>
        </div>

        {/* Seção de Endereços */}
        <div className="form-section">
          <AddressForm 
            addresses={person.addresses || [{}]} 
            onAddressesChange={(addresses) => setPerson({ ...person, addresses })}
          />
        </div>

        {/* Seção de Contatos */}
        <div className="form-section">
          <ContactForm 
            contacts={person.contacts || [{}]} 
            onContactsChange={(contacts) => setPerson({ ...person, contacts })}
          />
        </div>

        {/* Seção de Dependentes */}
        <div className="form-section">
          <DependentForm 
            dependents={person.dependents || [{}]} 
            onDependentsChange={(dependents) => setPerson({ ...person, dependents })}
          />
        </div>

        {/* Botão de Submit */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button type="submit" className="btn-submit">
            {id ? 'Salvar Alterações' : 'Cadastrar Pessoa'}
          </button>
        </div>
      </form>
    </div>
  );
}
