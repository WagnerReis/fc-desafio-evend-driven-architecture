# 💰 Balances Microservice

Microsserviço desenvolvido em **Node.js** com **NestJS** responsável por fornecer consultas rápidas de saldos das contas. Este serviço consome eventos do Kafka e mantém uma view materializada no PostgreSQL para otimizar as consultas.

## 📋 Visão Geral

O **Balances** é um microsserviço de **consulta (Query)** em uma arquitetura **CQRS** (Command Query Responsibility Segregation). Ele:

- 📥 **Consome eventos** do Kafka (`BalanceUpdated`)
- 🗄️ **Armazena dados** em PostgreSQL (view materializada)
- 🔍 **Fornece API REST** para consulta rápida de saldos
- ⚡ **Otimiza performance** das consultas separando leitura de escrita

## 🏗️ Arquitetura

```
┌─────────────────┐    Kafka     ┌─────────────────┐    HTTP      ┌─────────────────┐
│   Walletcore    │────Events────│    Balances     │────Query────│    Cliente      │
│   (Command)     │              │    (Query)      │             │   (Frontend)    │
└─────────────────┘              └─────────────────┘             └─────────────────┘
       │                                 │
       ▼                                 ▼
┌─────────────────┐              ┌─────────────────┐
│     MySQL       │              │   PostgreSQL    │
│ (Source Truth)  │              │ (View Material) │
└─────────────────┘              └─────────────────┘
```

## 🚀 Tecnologias

- **Node.js** 22.17.1
- **NestJS** 11.x (Framework)
- **TypeScript** 5.7.x
- **PostgreSQL** 16 (Banco de dados)
- **Prisma** 6.15.x (ORM)
- **KafkaJS** 2.2.4 (Cliente Kafka)
- **Docker** & **Docker Compose**

## 📁 Estrutura do Projeto

```
src/
├── balances/
│   ├── balances.controller.ts     # Controller REST + Kafka Consumer
│   ├── balances.service.ts        # Lógica de negócio
│   ├── balances.module.ts         # Módulo NestJS
│   ├── dto/
│   │   └── create-balance.dto.ts  # DTOs de entrada
│   ├── entities/
│   │   └── balance.entity.ts      # Entidades
│   └── repositories/
│       ├── balance-repository.interface.ts  # Interface do repositório
│       └── prisma/
│           ├── balance-repository.ts        # Implementação Prisma
│           └── prisma-balance.mapper.ts     # Mapeador de dados
├── prisma/
│   ├── prisma.module.ts           # Módulo Prisma
│   └── prisma.service.ts          # Serviço Prisma
├── app.module.ts                  # Módulo principal
└── main.ts                        # Bootstrap da aplicação
```

## 🗄️ Modelo de Dados

### Tabela: `balances`

```sql
CREATE TABLE balances (
  id                      TEXT PRIMARY KEY,
  account_id_from         TEXT NOT NULL,
  account_id_to           TEXT NOT NULL,
  balance_account_id_from DECIMAL(10,2) NOT NULL,
  balance_account_id_to   DECIMAL(10,2) NOT NULL,
  created_at              TIMESTAMP DEFAULT NOW(),
  updated_at              TIMESTAMP DEFAULT NOW()
);
```

## 🔗 API Endpoints

### 📋 Consultar Saldo de Conta

```http
GET /balances/{account_id}
```

**Parâmetros:**
- `account_id` (string): ID da conta para consulta

**Resposta de Sucesso (200):**
```json
{
  "id": "clr123...",
  "accountIdFrom": "account-001",
  "accountIdTo": "account-002", 
  "balanceAccountIdFrom": 900.00,
  "balanceAccountIdTo": 600.00,
  "createdAt": "2025-09-02T14:30:00.000Z",
  "updatedAt": "2025-09-02T14:30:00.000Z"
}
```

**Resposta de Erro (404):**
```json
{
  "statusCode": 404,
  "message": "Account or Balance not found"
}
```

## 📡 Kafka Integration

### Consumer

**Tópico:** `balances`  
**Group ID:** `wallet`

### Formato da Mensagem Consumida

```json
{
  "Name": "BalanceUpdated",
  "Payload": {
    "account_id_from": "account-001",
    "account_id_to": "account-002",
    "balance_account_id_from": 900.00,
    "balance_account_id_to": 600.00
  }
}
```

## 🛠️ Configuração de Ambiente

### Variáveis de Ambiente

```bash
# Aplicação
NODE_ENV=production
PORT=3000

# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=balances
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:password@postgres:5432/balances?schema=public

# Kafka
KAFKA_BOOTSTRAP_SERVERS=kafka:29092
```

## 🚀 Como Executar

### 🐳 Com Docker (Recomendado)

```bash
# No diretório raiz do projeto (desafio-eda)
docker compose up -d
```

### 💻 Desenvolvimento Local

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Executar migrações do banco
npx prisma migrate deploy

# 4. Gerar client Prisma
npx prisma generate

# 5. Executar em modo desenvolvimento
npm run start:dev

# 6. Ou executar em produção
npm run build
npm run start:prod
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes com watch
npm run test:watch

# Testes de cobertura
npm run test:cov

# Testes E2E
npm run test:e2e
```

## 📊 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Executar com hot reload
npm run start:debug        # Executar com debug

# Build
npm run build              # Compilar TypeScript

# Produção
npm run start:prod         # Executar versão compilada

# Qualidade de Código
npm run lint               # Executar linter
npm run format             # Formatar código

# Banco de Dados
npx prisma migrate dev     # Executar migrações (dev)
npx prisma migrate deploy  # Executar migrações (prod)
npx prisma generate        # Gerar client Prisma
npx prisma studio          # Interface visual do banco
```

## 🔍 Monitoramento & Debug

### Logs da Aplicação

```bash
# Via Docker
docker compose logs -f balances

# Logs específicos
docker compose logs -f balances | grep ERROR
```

### Prisma Studio

```bash
# Interface visual para visualizar dados
npx prisma studio
# Acesse: http://localhost:5555
```

### Conectar ao PostgreSQL

```bash
# Via Docker
docker compose exec postgres psql -U postgres -d balances

# Comandos úteis
\dt              # Listar tabelas
\d balances      # Descrever tabela balances
SELECT * FROM balances LIMIT 10;
```

## 🐛 Troubleshooting

### Problema: Erro de conexão com Kafka

```bash
# Verificar se o Kafka está rodando
docker compose ps kafka

# Verificar logs do Kafka
docker compose logs kafka

# Reiniciar serviços
docker compose restart kafka balances
```

### Problema: Erro de conexão com PostgreSQL

```bash
# Verificar se o PostgreSQL está saudável
docker compose ps postgres

# Conectar manualmente ao banco
docker compose exec postgres psql -U postgres -d balances -c "SELECT 1;"
```

### Problema: Migrações não aplicadas

```bash
# Executar migrações manualmente
docker compose exec balances npx prisma migrate deploy

# Ou resetar o banco (⚠️ APAGA DADOS)
docker compose exec balances npx prisma migrate reset
```

### Problema: Dependências desatualizadas

```bash
# Reinstalar node_modules
docker compose exec balances rm -rf node_modules package-lock.json
docker compose exec balances npm install

# Ou rebuild completo
docker compose up --build balances
```

## 📈 Performance & Otimização

### Índices Recomendados

```sql
-- Otimizar consultas por account_id
CREATE INDEX idx_balances_account_from ON balances(account_id_from);
CREATE INDEX idx_balances_account_to ON balances(account_id_to);

-- Otimizar consultas por data
CREATE INDEX idx_balances_created_at ON balances(created_at);
```

### Monitoramento de Performance

- **Response Time**: Consultas devem ser < 100ms
- **Memory Usage**: Monitorar uso de memória do Node.js
- **Connection Pool**: Verificar pool de conexões do Prisma

## 🤝 Integração com Walletcore

Este microsserviço trabalha em conjunto com o **Walletcore**:

1. **Walletcore** processa transações
2. **Walletcore** publica eventos `BalanceUpdated` no Kafka
3. **Balances** consome os eventos
4. **Balances** atualiza a view materializada
5. **Balances** fornece consultas rápidas via REST API

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ usando NestJS**
