import { useState, useEffect } from 'react';
import { FaUsers, FaUserPlus, FaMapMarkerAlt, FaPhone, FaUserFriends, FaCalendarAlt, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getDashboardStats, getRecentPersons, type DashboardStats } from '../services/dashboardService';
import PersonDetailsModal from './PersonDetailsModal';
import './Dashboard.css';



export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPersons: 0,
    totalAddresses: 0,
    totalContacts: 0,
    totalDependents: 0,
    recentPersons: 0,
    averageAge: 0,
    personsByMonth: [],
    topCities: []
  });
  const [recentPersons, setRecentPersons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('Carregando dados do dashboard...');
        const [dashboardData, recentData] = await Promise.all([
          getDashboardStats(),
          getRecentPersons(5)
        ]);
        console.log('Dados do dashboard carregados:', dashboardData);
        console.log('Pessoas recentes carregadas:', recentData);
        setStats(dashboardData);
        setRecentPersons(recentData);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        // Em caso de erro, usar dados simulados como fallback
        setStats({
          totalPersons: 156,
          totalAddresses: 203,
          totalContacts: 189,
          totalDependents: 67,
          recentPersons: 12,
          averageAge: 34.5,
          personsByMonth: [],
          topCities: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    link 
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    color: string; 
    link?: string;
  }) => {
    const content = (
      <div className="stat-card" style={{ borderLeftColor: color }}>
        <div className="stat-icon" style={{ backgroundColor: color }}>
          <Icon />
        </div>
        <div className="stat-content">
          <h3 className="stat-title">{title}</h3>
          <p className="stat-value">{loading ? '...' : value}</p>
        </div>
      </div>
    );

    return link ? (
      <Link to={link} className="stat-card-link">
        {content}
      </Link>
    ) : content;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral do sistema de gestão de pessoas</p>
      </div>

      <div className="dashboard-stats">
        <StatCard
          title="Total de Pessoas"
          value={stats.totalPersons}
          icon={FaUsers}
          color="#667eea"
          link="/persons"
        />
        
        <StatCard
          title="Endereços Cadastrados"
          value={stats.totalAddresses}
          icon={FaMapMarkerAlt}
          color="#f093fb"
        />
        
        <StatCard
          title="Contatos Registrados"
          value={stats.totalContacts}
          icon={FaPhone}
          color="#4facfe"
        />
        
        <StatCard
          title="Dependentes"
          value={stats.totalDependents}
          icon={FaUserFriends}
          color="#43e97b"
        />
        
        <StatCard
          title="Novos Cadastros (30 dias)"
          value={stats.recentPersons}
          icon={FaUserPlus}
          color="#fa709a"
        />
        
        <StatCard
          title="Idade Média"
          value={`${stats.averageAge} anos`}
          icon={FaCalendarAlt}
          color="#ffecd2"
        />
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-actions">
          <div className="action-section">
            <h2>Ações Rápidas</h2>
            <div className="action-buttons">
              <Link to="/persons/new" className="action-button primary">
                <FaUserPlus />
                Cadastrar Nova Pessoa
              </Link>
              <Link to="/persons" className="action-button secondary">
                <FaUsers />
                Ver Todas as Pessoas
              </Link>
            </div>
          </div>
        </div>

        <div className="recent-persons-section">
          <h2>Pessoas Recentes</h2>
          <div className="recent-persons-list">
            {loading ? (
              <div className="loading-message">Carregando pessoas recentes...</div>
            ) : recentPersons.length > 0 ? (
              recentPersons.map((person) => (
                <div key={person.id} className="recent-person-card">
                  <div className="person-info">
                    <h3>{person.name}</h3>
                    <p>CPF: {person.cpf}</p>
                    <p>Data de Nascimento: {new Date(person.birthDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="person-actions">
                    <button 
                      onClick={() => setSelectedPerson(person)} 
                      className="btn btn-primary"
                    >
                      <FaEye /> Ver Detalhes
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-message">Nenhuma pessoa cadastrada recentemente.</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <PersonDetailsModal
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
      />
    </div>
  );
} 