

## Instalação

Para começar a trabalhar com este projeto, siga os passos abaixo:

1. **Clone o Repositório:**

   ```bash
   git clone https://github.com/alexpxmort/shorterx-api
   cd shorterx-api
   ```

2. **Instale as Dependências:**

   Certifique-se de que você tenha o [Node.js](https://nodejs.org/pt/blog/release/v20.9.0) instalado. Em seguida, execute o comando abaixo para instalar as dependências do projeto:
   Node - 20.9.0

   ```bash
   yarn install ou npm install
   ```

## Docs

A documentação da Api esta no Swagger [Link](http://localhost:5000/api/docs)

## Configuração do Banco de Dados

Certifique-se de que você tem um banco de dados MySQL configurado. Você pode criar o banco de dados necessário usando o seguinte comando:

```sql
CREATE DATABASE api;
```

crie um arquivo .env com a configuração do seu database

e coloque como mostrado abaixo

```bash
DATABASE_URL="mysql://seu-user:sua-senha@127.0.0.1:3306/api"
```

certifique de trocar seu-user pelo seu usuário no mysql e onde esta sua-senha
pela sua senha

pode se basear no .env.example

## Migrações do Prisma

Depois de instalar as dependências e configurar o banco de dados, execute as migrações do Prisma:

```bash
npx prisma migrate dev
```

Isso aplicará todas as migrações pendentes ao banco de dados MySQL.

## Executando a Aplicação

Você pode executar a aplicação em diferentes modos:

- **Modo de Desenvolvimento:**

  Este modo fornece recarregamento automático e é útil durante o desenvolvimento.

  ```bash
  yarn dev ou npm run dev
  ```


- **Modo Padrão:**

  Este modo executa a aplicação sem recarregamento automático.

  ```bash
  yarn start ou npm start
  ```

Após isso o servidor estará disponível em `http://localhost:5000`.

## Testes

Execute os seguintes comandos para realizar diferentes tipos de testes:

- **Testes Unitários:**

  ```bash
  yarn test ou npm run test
  ```

- **Cobertura de Testes:**

  ```bash
  yarn test:coverage ou npm run test:coverage
  ```

## Mantenha-se em Contato

- **Autor:** [Alex Pereira de Oliveira](https://www.linkedin.com/in/alex-pereira-de-oliveira-628245160/)

