
# Documentação do Aplicativo GoWay

## Visão Geral

GoWay é um aplicativo de mobilidade urbana projetado para conectar passageiros a motoristas. Ele suporta três tipos de usuários: passageiros, motoristas e administradores. O backend é desenvolvido em Node.js e utiliza Express.js, Mongoose, e MongoDB.

## Estrutura de Pastas

- `src/config/`: Configurações gerais, incluindo conexão com banco de dados.
- `src/controllers/`: Controladores de lógica de negócios.
- `src/models/`: Modelos de dados MongoDB.
- `src/middleware/`: Middlewares de autenticação, autorização e tratamento de erros.
- `src/routes/`: Rotas da API para endpoints públicos e privados.
- `src/utils/`: Utilitários e funções auxiliares.
- `src/services/`: Serviços para lógica adicional, como notificações e comunicação com APIs externas.

## Modelos de Dados

### Usuários (Passageiros e Motoristas)

#### Passageiro
- **Campos principais**: nome, e-mail, senha, telefone, data de nascimento, gênero, métodos de pagamento, endereço de emergência.
- **Funcionalidades exclusivas**: cadastro de endereços favoritos, configuração de métodos de pagamento e histórico de corridas.

#### Motorista
- **Campos principais**: informações de contato, documentos (CNH, antecedentes), informações do veículo (modelo, ano, placa, seguro).
- **Funcionalidades exclusivas**: atualização de localização, verificação de disponibilidade e status.

#### Administração (Admin)
- **Responsabilidades**: controle do status de usuários e motoristas, gerenciamento de segurança e acesso aos dados dos usuários para verificações.

### Corrida (Ride)

- **Informações**: ponto de partida e destino, passageiro, motorista, preço, distância, duração, método de pagamento, status (pendente, aceito, em andamento, finalizado, cancelado).
- **Funcionalidades adicionais**: rating para avaliação da corrida e motorista.

## Funcionalidades por Usuário

### Passageiro
- **Cadastro e Login**: endpoint para registro e login com verificação de e-mail e senha.
- **Solicitação de Corrida**: criação de nova corrida com informações de partida e destino, preço estimado e método de pagamento.
- **Histórico de Corridas**: consulta de corridas passadas, com detalhes de motorista e avaliação.
- **Favoritos**: armazenamento de endereços favoritos para facilitar solicitações futuras.
- **Avaliações**: avaliações de motoristas ao final de uma corrida.

### Motorista
- **Cadastro e Login**: registro de motoristas com upload de documentos e informações do veículo.
- **Aceitação de Corridas**: visualização de corridas próximas e aceitação das mesmas.
- **Localização em Tempo Real**: atualização periódica da localização para que passageiros possam acompanhar.
- **Status e Disponibilidade**: atualização de status para indicar se está disponível ou em corrida.

### Administrador
- **Gerenciamento de Usuários**: controle do status de usuários e motoristas (ativo, suspenso, inativo).
- **Verificação de Documentação**: checagem de documentos enviados por motoristas, como CNH e antecedentes criminais.
- **Controle de Corridas**: monitoramento do histórico e situação atual das corridas.

## Arquitetura e Funcionalidades Técnicas

- **Banco de Dados**: MongoDB para armazenamento de dados com índices geoespaciais para busca de motoristas próximos.
- **Autenticação e Autorização**: JWT para autenticação de usuários, com middlewares para proteger rotas e verificação de permissões.
- **Comunicação em Tempo Real**: Socket.IO para atualizar motoristas sobre novas corridas e passageiros sobre o progresso da corrida.
- **Geolocalização**: integração de APIs para calcular distâncias e rotas.
- **Segurança**: Helmet para proteção de cabeçalhos HTTP, CORS para controle de acesso, e bcrypt para hash de senhas.
- **Erros e Logs**: tratamento centralizado de erros e logs com Morgan para monitoramento em desenvolvimento.

## Pontos de Melhoria

1. **Notificações**: Implementar notificações push para atualizar usuários em tempo real sobre o status das corridas.
2. **Relatórios e Painéis de Controle**: Desenvolvimento de painéis administrativos para visualização de dados em tempo real e métricas do sistema.
3. **Tarifação Dinâmica**: Implementar lógica de tarifas variáveis de acordo com a demanda e horário.
4. **Integração de Pagamentos**: Adicionar integração com gateways de pagamento, como Stripe ou PayPal.
5. **Verificação de Documentos**: API ou sistema para verificação automática de documentos de motoristas.

---
