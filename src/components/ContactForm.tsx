import type { Contact } from '../types/person';

interface ContactFormProps {
  contacts: Contact[];
  onContactsChange: (contacts: Contact[]) => void;
}

export default function ContactForm({ contacts, onContactsChange }: ContactFormProps) {
  const handleContactChange = (idx: number, field: keyof Contact, value: string) => {
    const newContacts = [...contacts];
    newContacts[idx] = { ...newContacts[idx], [field]: value };
    onContactsChange(newContacts);
  };

  const handleAddContact = () => {
    onContactsChange([...contacts, {}]);
  };

  const handleRemoveContact = (idx: number) => {
    const newContacts = contacts.filter((_, i) => i !== idx);
    onContactsChange(newContacts);
  };

  return (
    <div>
      <h3 className="section-title">Contatos</h3>
      
      {contacts.map((contact, idx) => (
        <div key={idx} className="item-card">
          <div className="form-grid-3">
            <input
              name={`email-${idx}`}
              type="email"
              value={contact.email || ''}
              onChange={e => handleContactChange(idx, 'email', e.target.value)}
              placeholder="Email"
              className="form-input"
            />
            <input
              name={`ddd-${idx}`}
              value={contact.ddd || ''}
              onChange={e => handleContactChange(idx, 'ddd', e.target.value)}
              placeholder="DDD"
              maxLength={2}
              className="form-input"
            />
            <input
              name={`telephoneNumber-${idx}`}
              value={contact.telephoneNumber || ''}
              onChange={e => handleContactChange(idx, 'telephoneNumber', e.target.value)}
              placeholder="Telefone"
              className="form-input"
            />
          </div>
          <button
            type="button"
            onClick={() => handleRemoveContact(idx)}
            className="btn btn-danger"
            title="Remover contato"
          >
            Remover
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddContact}
        className="btn-add"
      >
        + Adicionar Contato
      </button>
    </div>
  );
} 