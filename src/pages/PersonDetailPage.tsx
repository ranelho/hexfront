import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPerson, deletePerson } from '../services/personService';

export default function PersonDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getPerson(Number(id)).then((data) => {
        setPerson(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/persons/edit/${person.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Deseja realmente excluir esta pessoa?')) {
      await deletePerson(person.id);
      alert('Pessoa excluída com sucesso!');
      navigate('/persons');
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!person) return <div>Pessoa não encontrada.</div>;

  return (
    <div>
      <h2>Detalhes da Pessoa</h2>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={handleEdit}>Editar</button>
        <button onClick={handleDelete} style={{ marginLeft: '8px', color: 'red' }}>Excluir</button>
      </div>
      <p><strong>ID:</strong> {person.id}</p>
      <p><strong>Nome:</strong> {person.name}</p>
      <p><strong>CPF:</strong> {person.cpf}</p>
      <p><strong>Data de Nascimento:</strong> {person.birthDate}</p>
      <p><strong>Mãe:</strong> {person.nameMother}</p>
      <p><strong>Pai:</strong> {person.nameFather}</p>
      <h3>Endereços</h3>
      <ul>
        {person.addresses?.map((addr: any) => (
          <li key={addr.id}>{addr.street}, {addr.number} - {addr.city}/{addr.state} ({addr.zipCode})</li>
        ))}
      </ul>
      <h3>Contatos</h3>
      <ul>
        {person.contacts?.map((contact: any) => (
          <li key={contact.id}>{contact.email} {contact.ddd} {contact.telephoneNumber}</li>
        ))}
      </ul>
      <h3>Dependentes</h3>
      <ul>
        {person.dependents?.map((dep: any) => (
          <li key={dep.id}>{dep.name} ({dep.dependentType})</li>
        ))}
      </ul>
    </div>
  );
}
