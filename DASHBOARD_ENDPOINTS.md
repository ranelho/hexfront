# Endpoints do Dashboard

Este documento descreve os endpoints necessários para o dashboard do sistema de gestão de pessoas.

## 1. Estatísticas Gerais

### GET `/hex/api/dashboard/stats`

Retorna estatísticas gerais do sistema.

**Resposta:**
```json
{
  "totalPersons": 156,
  "totalAddresses": 203,
  "totalContacts": 189,
  "totalDependents": 67,
  "recentPersons": 12,
  "averageAge": 34.5,
  "personsByMonth": [
    {
      "month": "2024-01",
      "count": 15
    },
    {
      "month": "2024-02", 
      "count": 23
    }
  ],
  "topCities": [
    {
      "city": "São Paulo",
      "count": 45
    },
    {
      "city": "Rio de Janeiro",
      "count": 32
    }
  ]
}
```

## 2. Pessoas Recentes

### GET `/hex/api/dashboard/recent-persons?limit=5`

Retorna as pessoas cadastradas mais recentemente.

**Parâmetros:**
- `limit` (opcional): Número de registros (padrão: 5)

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "João Silva",
    "cpf": "123.456.789-00",
    "birthDate": "1990-05-15",
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

## 3. Pessoas por Mês

### GET `/hex/api/dashboard/persons-by-month`

Retorna o número de pessoas cadastradas por mês nos últimos 12 meses.

**Resposta:**
```json
[
  {
    "month": "2024-01",
    "count": 15
  },
  {
    "month": "2023-12", 
    "count": 12
  }
]
```

## Implementação Sugerida no Backend

### Controller
```java
@RestController
@RequestMapping("/hex/api/dashboard")
public class DashboardController {

    @Autowired
    private PersonService personService;
    
    @Autowired
    private AddressService addressService;
    
    @Autowired
    private ContactService contactService;
    
    @Autowired
    private DependentService dependentService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats() {
        DashboardStats stats = new DashboardStats();
        
        stats.setTotalPersons(personService.count());
        stats.setTotalAddresses(addressService.count());
        stats.setTotalContacts(contactService.count());
        stats.setTotalDependents(dependentService.count());
        stats.setRecentPersons(personService.countRecent(30)); // últimos 30 dias
        stats.setAverageAge(personService.getAverageAge());
        stats.setPersonsByMonth(personService.getPersonsByMonth());
        stats.setTopCities(addressService.getTopCities());
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent-persons")
    public ResponseEntity<List<Person>> getRecentPersons(
            @RequestParam(defaultValue = "5") int limit) {
        List<Person> recentPersons = personService.findRecent(limit);
        return ResponseEntity.ok(recentPersons);
    }

    @GetMapping("/persons-by-month")
    public ResponseEntity<List<MonthlyStats>> getPersonsByMonth() {
        List<MonthlyStats> monthlyStats = personService.getPersonsByMonth();
        return ResponseEntity.ok(monthlyStats);
    }
}
```

### DTOs
```java
public class DashboardStats {
    private Long totalPersons;
    private Long totalAddresses;
    private Long totalContacts;
    private Long totalDependents;
    private Long recentPersons;
    private Double averageAge;
    private List<MonthlyStats> personsByMonth;
    private List<CityStats> topCities;
    
    // getters e setters
}

public class MonthlyStats {
    private String month;
    private Long count;
    
    // getters e setters
}

public class CityStats {
    private String city;
    private Long count;
    
    // getters e setters
}
```

### Queries SQL Sugeridas

```sql
-- Contar pessoas dos últimos 30 dias
SELECT COUNT(*) FROM persons 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Idade média
SELECT AVG(YEAR(NOW()) - YEAR(birth_date)) as average_age 
FROM persons;

-- Pessoas por mês (últimos 12 meses)
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as month,
    COUNT(*) as count
FROM persons 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month DESC;

-- Top cidades
SELECT 
    city,
    COUNT(*) as count
FROM addresses 
GROUP BY city 
ORDER BY count DESC 
LIMIT 10;
```

## Benefícios

1. **Visão Geral**: Dashboard com estatísticas em tempo real
2. **Análise Temporal**: Tendências de cadastros por mês
3. **Distribuição Geográfica**: Top cidades com mais pessoas
4. **Performance**: Endpoints otimizados com queries específicas
5. **Escalabilidade**: Fácil adição de novas métricas

## Próximos Passos

1. Implementar os endpoints no backend
2. Adicionar cache para melhorar performance
3. Criar gráficos no frontend usando as estatísticas
4. Adicionar filtros por período
5. Implementar exportação de relatórios 