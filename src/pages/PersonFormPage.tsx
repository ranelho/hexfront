import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPerson, getPerson, updatePerson, getMaritalStatuses, getGenders } from '../services/personService';
import AddressForm from '../components/AddressForm';
import ContactForm from '../components/ContactForm';
import DependentForm from '../components/DependentForm';
import '../styles/components.css';

const initialState = {
  name: '',
  cpf: '',
  rg: '',
  rgIssuer: '',
  birthDate: '',
  nameMother: '',
  nameFather: '',
  maritalStatus: '',
  profession: '',
  nationality: '',
  gender: '',
  emergencyContact: '',
  emergencyPhone: '',
  addresses: [],
  contacts: [],
  dependents: [],
};

export default function PersonFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState<any>(initialState);
  const [loading, setLoading] = useState(!!id);
  const [maritalStatuses, setMaritalStatuses] = useState<{ value: string; label: string }[]>([]);
  const [genders, setGenders] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        try {
          const data = await getPerson(Number(id));
          setPerson(data);
        } catch (error) {
          console.error('Erro ao carregar pessoa:', error);
        } finally {
          setLoading(false);
        }
      }

      // Carregar enums
      try {
        const [maritalData, genderData] = await Promise.all([
          getMaritalStatuses(),
          getGenders()
        ]);
        setMaritalStatuses(maritalData);
        setGenders(genderData);
      } catch (error) {
        console.error('Erro ao carregar enums:', error);
      }
    };

    loadData();
  }, [id]);

  // Função para formatar CPF
  const formatCPF = (value: string): string => {
    const cpfLimpo = value.replace(/\D/g, '');
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para limpar CPF (remover máscara)
  const cleanCPF = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      const cpfLimpo = cleanCPF(value);
      const cpfFormatado = formatCPF(cpfLimpo);
      setPerson({ ...person, [name]: cpfFormatado });
    } else {
      setPerson({ ...person, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const personToSubmit = { ...person };
    
    if (personToSubmit.cpf) {
      personToSubmit.cpf = cleanCPF(personToSubmit.cpf);
    }
    
    try {
      if (id) {
        await updatePerson(Number(id), personToSubmit);
        alert('Pessoa atualizada com sucesso!');
      } else {
        await createPerson(personToSubmit);
        alert('Pessoa criada com sucesso!');
      }
      navigate('/persons');
    } catch (error) {
      console.error('Erro ao salvar pessoa:', error);
      alert('Erro ao salvar pessoa. Tente novamente.');
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <h2 style={{ 
          color: '#1976d2', 
          marginBottom: '40px', 
          textAlign: 'center',
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {id ? 'Editar Pessoa' : 'Cadastrar Pessoa'}
        </h2>
      
      <form onSubmit={handleSubmit}>
        {/* Seção de Dados Básicos */}
        <div className="form-section" style={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '40px',
          border: '1px solid rgba(1976d2, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 className="section-title" style={{
            fontSize: '1.5rem',
            marginBottom: '25px',
            color: '#1976d2',
            borderBottom: '2px solid #1976d2',
            paddingBottom: '10px'
          }}>📋 Dados Básicos</h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '20px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1976d2', fontSize: '14px' }}>
                Nome Completo *
              </label>
              <input 
                name="name" 
                value={person.name} 
                onChange={handleChange} 
                required 
                placeholder="Digite o nome completo"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e1e8ed',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1976d2';
                  e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1976d2', fontSize: '14px' }}>
                Data de Nascimento *
              </label>
              <input 
                name="birthDate" 
                type="date" 
                value={person.birthDate} 
                onChange={handleChange}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e1e8ed',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1976d2';
                  e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1976d2', fontSize: '14px' }}>
                Gênero
              </label>
              <select 
                name="gender" 
                value={person.gender} 
                onChange={handleChange}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e1e8ed',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1976d2';
                  e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              >
                <option value="">Selecione...</option>
                {genders.map((gender) => (
                  <option key={gender.value} value={gender.value}>
                    {gender.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1976d2', fontSize: '14px' }}>
                Estado Civil
              </label>
              <select 
                name="maritalStatus" 
                value={person.maritalStatus} 
                onChange={handleChange}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e1e8ed',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1976d2';
                  e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              >
                <option value="">Selecione...</option>
                {maritalStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1976d2', fontSize: '14px' }}>
                Nacionalidade
              </label>
              <input 
                name="nationality" 
                value={person.nationality} 
                onChange={handleChange}
                placeholder="Ex: Brasileira"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e1e8ed',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1976d2';
                  e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1976d2', fontSize: '14px' }}>
                Profissão
              </label>
              <input 
                name="profession" 
                value={person.profession} 
                onChange={handleChange}
                placeholder="Digite a profissão"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e1e8ed',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1976d2';
                  e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>


          </div>
        </div>

        {/* Seção de Documentos */}
        <div className="form-section" style={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '40px',
          border: '1px solid rgba(1976d2, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 className="section-title" style={{
            fontSize: '1.5rem',
            marginBottom: '25px',
            color: '#1976d2',
            borderBottom: '2px solid #1976d2',
            paddingBottom: '10px'
          }}>📄 Documentos</h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '20px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1976d2', fontSize: '14px' }}>
                CPF *
              </label>
              <input 
                name="cpf" 
                value={person.cpf} 
                onChange={handleChange}
                placeholder="000.000.000-00"
                maxLength={14}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e1e8ed',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  fontFamily: 'monospace'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1976d2';
                  e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
                onKeyPress={(e) => {
                  if (!/\d/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1976d2', fontSize: '14px' }}>
                RG
              </label>
              <input 
                name="rg" 
                value={person.rg} 
                onChange={handleChange}
                placeholder="Digite o RG"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e1e8ed',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1976d2';
                  e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1976d2', fontSize: '14px' }}>
                Órgão Emissor
              </label>
              <input 
                name="rgIssuer" 
                value={person.rgIssuer} 
                onChange={handleChange}
                placeholder="Ex: SSP"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e1e8ed',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1976d2';
                  e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>
          </div>
        </div>

        {/* Seção de Filiação */}
        <div className="form-section" style={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '40px',
          border: '1px solid rgba(1976d2, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 className="section-title" style={{
            fontSize: '1.5rem',
            marginBottom: '25px',
            color: '#1976d2',
            borderBottom: '2px solid #1976d2',
            paddingBottom: '10px'
          }}>👨‍👩‍👧‍👦 Filiação</h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1976d2', fontSize: '14px' }}>
                Nome da Mãe
              </label>
              <input 
                name="nameMother" 
                value={person.nameMother} 
                onChange={handleChange}
                placeholder="Digite o nome da mãe"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e1e8ed',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1976d2';
                  e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1976d2', fontSize: '14px' }}>
                Nome do Pai
              </label>
              <input 
                name="nameFather" 
                value={person.nameFather} 
                onChange={handleChange}
                placeholder="Digite o nome do pai"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e1e8ed',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1976d2';
                  e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>
          </div>
        </div>

        {/* Seção de Contatos de Emergência */}
        <div className="form-section" style={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '40px',
          border: '1px solid rgba(1976d2, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 className="section-title" style={{
            fontSize: '1.5rem',
            marginBottom: '25px',
            color: '#1976d2',
            borderBottom: '2px solid #1976d2',
            paddingBottom: '10px'
          }}>🚨 Contatos de Emergência</h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1976d2', fontSize: '14px' }}>
                Contato de Emergência
              </label>
              <input 
                name="emergencyContact" 
                value={person.emergencyContact} 
                onChange={handleChange}
                placeholder="Digite o nome do contato de emergência"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e1e8ed',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1976d2';
                  e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1976d2', fontSize: '14px' }}>
                Telefone de Emergência
              </label>
              <input 
                name="emergencyPhone" 
                value={person.emergencyPhone} 
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  let maskedValue = '';
                  if (value.length > 0) {
                    if (value.length <= 2) {
                      maskedValue = `(${value}`;
                    } else if (value.length <= 7) {
                      maskedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                    } else {
                      maskedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                    }
                  }
                  handleChange({ target: { name: 'emergencyPhone', value: maskedValue } });
                }}
                placeholder="(11) 99999-9999"
                maxLength={15}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e1e8ed',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1976d2';
                  e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e8ed';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>
          </div>
        </div>

        {/* Seção de Endereços */}
        <div className="form-section">
          <AddressForm 
            addresses={person.addresses || []} 
            onAddressesChange={(addresses) => setPerson({ ...person, addresses })}
          />
        </div>

        {/* Seção de Contatos */}
        <div className="form-section">
          <ContactForm 
            contacts={person.contacts || []} 
            onContactsChange={(contacts) => setPerson({ ...person, contacts })}
          />
        </div>

        {/* Seção de Dependentes */}
        <div className="form-section">
          <DependentForm 
            dependents={person.dependents || []} 
            onDependentsChange={(dependents) => setPerson({ ...person, dependents })}
          />
        </div>

        {/* Botão de Submit */}
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <button type="submit" style={{
            padding: '16px 40px',
            background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '16px',
            cursor: 'pointer',
            minWidth: '200px',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(25, 118, 210, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(25, 118, 210, 0.3)';
          }}>
            {id ? 'Salvar Alterações' : 'Cadastrar Pessoa'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
