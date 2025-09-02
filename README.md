# Microsserviços - Walletcore & Balances

Este projeto contém dois microsserviços que se comunicam via Apache Kafka em uma arquitetura event-driven:

- **Walletcore**: Microsserviço em Go para gerenciamento de carteiras e transações
- **Balances**: Microsserviço em Node.js/NestJS para consulta de saldos

## 📋 Pré-requisitos

- Docker
- Docker Compose
- Git

## 🚀 Como executar

### 1. Clone o repositório (se ainda não foi feito)

```bash
git clone <seu-repositorio>
cd desafio-eda
```

### 2. Configure as variáveis de ambiente

O arquivo `.env` já está configurado com valores padrão. Se necessário, você pode editá-lo:

```bash
# Configurações gerais
NODE_ENV=production

# MySQL (para o Walletcore)
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=wallet

# PostgreSQL (para o Balances)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=balances
POSTGRES_PORT=5432

# Kafka
KAFKA_BOOTSTRAP_SERVERS=kafka:29092
```

### 3. Execute com Docker Compose

```bash
# Subir todos os serviços
docker-compose up -d

# Para ver os logs
docker-compose logs -f

# Para ver logs de um serviço específico
docker-compose logs -f walletcore
docker-compose logs -f balances
```

### 4. Aguarde a inicialização

Os serviços podem levar alguns minutos para inicializar completamente. O Docker Compose irá:

1. Subir Zookeeper e Kafka
2. Subir os bancos de dados (MySQL e PostgreSQL)
3. Aguardar os bancos ficarem saudáveis
4. Compilar e subir os microsserviços

## 🔗 URLs de Acesso

### Microsserviços
- **Walletcore API**: http://localhost:8080
- **Balances API**: http://localhost:3003

### Infraestrutura
- **Kafka Control Center**: http://localhost:9021
- **MySQL**: localhost:3306
- **PostgreSQL**: localhost:5432

## 📡 Endpoints Disponíveis

### Walletcore (Go) - Porta 8080

```bash
# Criar cliente
POST http://localhost:8080/clients
{
  "name": "João Silva",
  "email": "joao@email.com"
}

# Criar conta
POST http://localhost:8080/accounts
{
  "client_id": "uuid-do-cliente"
}

# Adicionar saldo
POST http://localhost:8080/accounts/credit
{
  "client_id": "uuid-do-cliente",
  "account_id": "uuid-da-conta",
  "amount": 1000.00
}

# Criar transação
POST http://localhost:8080/transactions
{
  "account_id_from": "uuid-conta-origem",
  "account_id_to": "uuid-conta-destino",
  "amount": 100.00
}
```

### Balances (Node.js) - Porta 3003

```bash
# Consultar saldo
GET http://localhost:3003/balances/{account_id}
```

## 🧪 Requisições para Teste

### Dados de Exemplo Pré-carregados

O sistema já vem com dados de exemplo carregados automaticamente:

**Clientes:**
- `client-001` - João Silva (joao@email.com)
- `client-002` - Maria Santos (maria@email.com)
- `client-003` - Pedro Oliveira (pedro@email.com)

**Contas:**
- `account-001` - Cliente: client-001, Saldo: R$ 1000.00
- `account-002` - Cliente: client-002, Saldo: R$ 500.00
- `account-003` - Cliente: client-003, Saldo: R$ 750.00

### Exemplos de Requisições HTTP

#### 1. Criar um novo cliente
```http
POST http://localhost:8080/clients HTTP/1.1
Content-Type: application/json

{
  "name": "John Doe",
  "email": "j@j.com"
}
```

#### 2. Criar uma nova conta (use o ID retornado do cliente acima)
```http
POST http://localhost:8080/accounts HTTP/1.1
Content-Type: application/json

{
  "client_id": "client-001"
}
```

#### 3. Criar uma transação entre contas existentes
```http
POST http://localhost:8080/transactions HTTP/1.1
Content-Type: application/json

{
  "account_id_from": "account-001",
  "account_id_to": "account-002",
  "amount": 250.50
}
```

#### 4. Consultar saldo de uma conta
```http
GET http://localhost:3003/balances/account-001 HTTP/1.1
Content-Type: application/json
```

#### 5. Consultar saldo de outra conta
```http
GET http://localhost:3003/balances/account-002 HTTP/1.1
Content-Type: application/json
```

### Fluxo de Teste Completo

1. **Teste a consulta inicial dos saldos:**
   - `GET /balances/account-001` (deve retornar 1000.00)
   - `GET /balances/account-002` (deve retornar 500.00)

2. **Crie uma transação:**
   - `POST /transactions` transferindo 100.00 de account-001 para account-002

3. **Verifique os saldos atualizados:**
   - `GET /balances/account-001` (deve retornar 900.00)
   - `GET /balances/account-002` (deve retornar 600.00)

4. **Crie um novo cliente e conta:**
   - `POST /clients` para criar um novo cliente
   - `POST /accounts` usando o ID do cliente criado
   - Teste transações com a nova conta

## 🛠️ Comandos Úteis

### Parar os serviços
```bash
docker-compose down
```

### Parar e remover volumes (apaga dados)
```bash
docker-compose down -v
```

### Rebuild dos serviços
```bash
docker-compose up --build
```

### Verificar status dos serviços
```bash
docker-compose ps
```

### Acessar logs específicos
```bash
# Walletcore
docker-compose logs -f walletcore

# Balances  
docker-compose logs -f balances

# Kafka
docker-compose logs -f kafka

# MySQL
docker-compose logs -f mysql

# PostgreSQL
docker-compose logs -f postgres
```

## 🔧 Troubleshooting

### Problema com permissões do Docker
Se você receber erros de permissão, certifique-se de que seu usuário está no grupo docker:

```bash
sudo usermod -aG docker $USER
# Faça logout e login novamente
```

### Erro de porta já em uso
Se alguma porta já estiver em uso, você pode:

1. Parar o processo que está usando a porta
2. Ou modificar as portas no `docker-compose.yml`

### Reiniciar serviços específicos
```bash
# Reiniciar apenas o walletcore
docker-compose restart walletcore

# Reiniciar apenas o balances
docker-compose restart balances
```

### Verificar conectividade do Kafka
```bash
# Entrar no container do kafka
docker-compose exec kafka bash

# Listar tópicos
kafka-topics --bootstrap-server localhost:9092 --list

# Consumir mensagens de um tópico
kafka-console-consumer --bootstrap-server localhost:9092 --topic transactions --from-beginning
```

## 📊 Monitoramento

### Kafka Control Center
Acesse http://localhost:9021 para:
- Visualizar tópicos
- Monitorar produtores e consumidores
- Ver mensagens em tempo real

### Logs dos Microsserviços
```bash
# Ver logs em tempo real
docker-compose logs -f walletcore balances
```

## 🗄️ Bancos de Dados

### MySQL (Walletcore)
```bash
# Conectar ao MySQL
docker-compose exec mysql mysql -uroot -proot wallet

# Ver tabelas
SHOW TABLES;
```

### PostgreSQL (Balances)
```bash
# Conectar ao PostgreSQL
docker-compose exec postgres psql -U postgres -d balances

# Ver tabelas
\dt
```

## 🔄 Fluxo da Aplicação

1. **Walletcore** recebe uma transação via API REST
2. Processa a transação e atualiza os saldos no MySQL
3. Publica eventos no Kafka:
   - `TransactionCreated`
   - `BalanceUpdated`
4. **Balances** consome os eventos do Kafka
5. Atualiza a view materializada no PostgreSQL
6. Disponibiliza consulta rápida de saldos via API REST

## 📝 Notas Importantes

- O Walletcore usa MySQL como banco principal
- O Balances usa PostgreSQL para views materializadas
- A comunicação entre serviços é assíncrona via Kafka
- Os bancos são independentes (um por microsserviço)
- Aguarde alguns minutos na primeira execução para download das imagens e build
