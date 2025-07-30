import { useState } from 'react';
import { createPerson } from '../services/personService';

interface Address {
  zipCode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface Person {
  name: string;
  cpf: string;
  birthDate: string;
  nameMother: string;
  nameFather: string;
  addresses: Address[];
}

const initialState: Person = {
  name: '',
  cpf: '',
  birthDate: '',
  nameMother: '',
  nameFather: '',
  addresses: [{}],
};

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function PersonFormModal({ onClose, onSuccess }: Props) {
  const [person, setPerson] = useState<Person>({ ...initialState, addresses: [] }); // começa sem endereço
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState<number | null>(null);
  const [cepError, setCepError] = useState<(string | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerson({ ...person, [e.target.name]: e.target.value });
  };

  const handleCepChange = (idx: number, value: string) => {
    const addresses = [...person.addresses];
    addresses[idx] = { ...addresses[idx], zipCode: value };
    setPerson({ ...person, addresses });
    const errors = [...cepError];
    errors[idx] = null;
    setCepError(errors);
  };

  const handleCepBlur = async (idx: number) => {
    const cep = person.addresses[idx]?.zipCode || '';
    if (cep.length === 8) {
      setCepLoading(idx);
      const errors = [...cepError];
      errors[idx] = null;
      setCepError(errors);
      try {
        const response = await fetch(`http://localhost:8080/hex/api/address/zip-code/${cep}`);
        const data = await response.json();
        if (data && data.street) {
          const addresses = [...person.addresses];
          addresses[idx] = {
            ...addresses[idx],
            zipCode: data.zipCode?.replace(/\D/g, '') || cep,
            street: data.street || '',
            neighborhood: data.neighborhood || '',
            city: data.city || '',
            state: data.state || '',
            country: data.country || 'Brasil',
            // número permanece para o usuário preencher
          };
          setPerson({ ...person, addresses });
        } else {
          const errors = [...cepError];
          errors[idx] = 'CEP não encontrado.';
          setCepError(errors);
        }
      } catch (err) {
        const errors = [...cepError];
        errors[idx] = 'Erro ao buscar CEP.';
        setCepError(errors);
      }
      setCepLoading(null);
    }
  };

  const handleAddressChange = (idx: number, field: keyof Address, value: string) => {
    const addresses = [...person.addresses];
    addresses[idx] = { ...addresses[idx], [field]: value };
    setPerson({ ...person, addresses });
  };

  const handleAddAddress = () => {
    setPerson({ ...person, addresses: [...person.addresses, {}] });
    setCepError([...cepError, null]);
  };

  const handleRemoveAddress = (idx: number) => {
    const addresses = person.addresses.filter((_, i) => i !== idx);
    setPerson({ ...person, addresses });
    setCepError(cepError.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await createPerson(person);
    setLoading(false);
    onSuccess();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: 36,
        minWidth: 820, // aumentado
        maxWidth: 1100, // aumentado
        boxShadow: '0 2px 24px rgba(0,0,0,0.18)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 18, right: 18, background: 'transparent', border: 'none', fontSize: 26, cursor: 'pointer', color: '#888' }}
          title="Fechar"
        >
          ×
        </button>
        <h2 style={{ color: '#1976d2', marginBottom: 18, textAlign: 'center' }}>Cadastrar Pessoa</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))', // 4 colunas
            gap: 24 // espaçamento maior
          }}
        >
          <input name="name" value={person.name} onChange={handleChange} placeholder="Nome" required style={inputStyle} />
          <input name="cpf" value={person.cpf} onChange={handleChange} placeholder="CPF" style={inputStyle} />
          <input name="birthDate" type="date" value={person.birthDate} onChange={handleChange} placeholder="Data de Nascimento" style={inputStyle} />
          <input name="nameMother" value={person.nameMother} onChange={handleChange} placeholder="Nome da Mãe" style={inputStyle} />
          <input name="nameFather" value={person.nameFather} onChange={handleChange} placeholder="Nome do Pai" style={inputStyle} />

          {/* Só mostra os campos de endereço se houver algum endereço */}
          {person.addresses.length > 0 && person.addresses.map((address, idx) => (
            <div key={idx} style={{
              gridColumn: '1/-1',
              border: '1px solid #eee',
              borderRadius: 8,
              padding: 16,
              marginBottom: 8,
              position: 'relative'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))', // 4 colunas para endereço
                gap: 16
              }}>
                <input
                  name={`zipCode-${idx}`}
                  value={address.zipCode || ''}
                  onChange={e => handleCepChange(idx, e.target.value)}
                  onBlur={() => handleCepBlur(idx)}
                  placeholder="CEP"
                  maxLength={8}
                  style={inputStyle}
                />
                <input name={`street-${idx}`} value={address.street || ''} onChange={e => handleAddressChange(idx, 'street', e.target.value)} placeholder="Rua" style={inputStyle} />
                <input name={`number-${idx}`} value={address.number || ''} onChange={e => handleAddressChange(idx, 'number', e.target.value)} placeholder="Número" style={inputStyle} />
                <input name={`neighborhood-${idx}`} value={address.neighborhood || ''} onChange={e => handleAddressChange(idx, 'neighborhood', e.target.value)} placeholder="Bairro" style={inputStyle} />
                <input name={`city-${idx}`} value={address.city || ''} onChange={e => handleAddressChange(idx, 'city', e.target.value)} placeholder="Cidade" style={inputStyle} />
                <input name={`state-${idx}`} value={address.state || ''} onChange={e => handleAddressChange(idx, 'state', e.target.value)} placeholder="Estado" style={inputStyle} />
                <input name={`country-${idx}`} value={address.country || ''} onChange={e => handleAddressChange(idx, 'country', e.target.value)} placeholder="País" style={inputStyle} />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveAddress(idx)}
                style={{
                  background: '#fff',
                  border: '1px solid #d32f2f',
                  color: '#d32f2f',
                  borderRadius: 6,
                  fontSize: 15,
                  fontWeight: 'bold',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  marginTop: 4,
                  marginBottom: 4,
                  gridColumn: 'span 4'
                }}
                title="Remover endereço"
              >
                Remover
              </button>
              {(cepLoading === idx) && <span style={{ position: 'absolute', left: 12, bottom: 8, color: '#1976d2', fontSize: 13 }}>Buscando...</span>}
              {cepError[idx] && <span style={{ position: 'absolute', left: 120, bottom: 8, color: '#d32f2f', fontSize: 13 }}>{cepError[idx]}</span>}
            </div>
          ))}

          {/* Botão para adicionar endereço sempre visível */}
          <button
            type="button"
            onClick={handleAddAddress}
            style={{
              gridColumn: '1/-1',
              marginBottom: 8,
              background: '#e3f2fd',
              color: '#1976d2',
              border: 'none',
              borderRadius: 8,
              fontWeight: 'bold',
              fontSize: 15,
              padding: '8px 18px',
              cursor: 'pointer'
            }}
          >
            + Adicionar Endereço
          </button>
          <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <button type="submit" disabled={loading} style={{ padding: '12px 32px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', fontSize: 17, cursor: loading ? 'not-allowed' : 'pointer', minWidth: 160 }}>
              {loading ? 'Salvando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #ccc',
  fontSize: 15,
  outline: 'none',
  width: '100%',
};
