# Conversor de Moeda - AWS

Este projeto é uma aplicação web de conversão de moedas desenvolvida em **React (Vite) com TypeScript, Tailwind + Shadcn UI**. Ele permite cadastrar, editar, excluir e converter moedas, consumindo uma API hospedada no **AWS API Gateway**.

## Principais Funcionalidades

- Cadastro, edição e exclusão de moedas.
- Conversão de valores em reais para moedas cadastradas.
- Interface moderna com componentes reutilizáveis.
- Consumo de API REST no **API Gateway** da AWS.
- Pronto para deploy em uma instância **EC2** usando **Docker**

## Como executar

### 1. Clonar o repositório

```sh
git clone https://github.com/camilavrls/aws-project.git
cd aws-front
```

### 2. Rodar localmente
```sh
npm install
npm run dev
```
Acesse http://localhost no navegador.

### 3. Docker
O projeto possui um Dockerfile pronto para produção. Para criar e rodar o container:
```sh
docker build -t conversor-moeda .
docker run -p 80:80 conversor-moeda
```

A aplicação estará disponível na porta 80 do host.

### 4. Integração com API Gateway
A aplicação consome uma API REST hospedada no AWS API Gateway para todas as operações de moedas. O endpoint está configurado diretamente no código-fonte em src/App.tsx.