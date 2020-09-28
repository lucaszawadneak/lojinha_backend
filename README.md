<h1 align="center">
    <img height="200" alt="UFPR" src="https://upload.wikimedia.org/wikipedia/pt/9/9c/Ufpr_logo.jpg" />
</h1>

<h3 align="center">
  Lojinha - Backend
</h3>
<p align="center">
  Servidor NodeJS para aplicativo Lojinha desenvolvido na UFPR
</p>

## :computer: Passos para replicação

### **Pré instalação**

Primeiramente é necessário serguir os passos de instalação do [Node](https://nodejs.org/en/download/) e [Docker](https://docs.docker.com/engine/install/) em sua máquina.

Após a instalação dessas dependências, recomendamos instalar a ferramenta [Insomnia](https://support.insomnia.rest/article/23-installation) ou qualquer outra tecnologia para fazer o teste das rotas e requisições.

### **Passo 1 - Criando a base de dados**

Usando um terminal na sua máquina, crie uma base de dados MongoDB com o auxílio do Docker:

```bash
# Cria uma base de dados MongoDB usando a versão mais recente, na porta 27017
$ sudo docker run --name lojinha -p 27017:27017 -d -t mongo

# Verifique se o docker iniciou a base de dados
$ sudo docker start lojinha
```

É importante lembrar que a base de dados tem que ser inicializada toda vez que a máquina for desligada.

### **Passo 2 - Baixando o repositório e instalando dependências**

Em um terminal da sua máquia, rode o seguinte comando:

```bash
# Clona o repositório
$ git clone https://github.com/lucaszawadneak/lojinha_backend.git

# Entre na pasta
$ cd lojinha_backend

# Instale as dependencias com yarn ou npm
$ yarn

$ npm install
```

### **Passo 3 - Criando as variáveis de ambiente**

Dentro do diretório do projeto, crie um arquivo .env com os seguintes campos:

```bash
SIGA_TOKEN=
API_URL=mongodb://localhost:27017/lojinha
AUTH_SECRET=dev
SIGA_URL=
```

O campo SIGA_TOKEN faz referência ao token para poder usar rotas na integração com o SIGA.

O campo API_URL é a url por onde o servidor tem acesso a base de dados MongoDB

O campo AUTH_SECRET é uma chave qualquer que codifica os tokens da nossa aplicação (apenas digite qualquer palavra para testes).

O campo SIGA_URL é o url para requisições no SIGA.

**Por motivos de segurança, os dados referentes ao SIGA não serão compartilhados nessa documentação. Caso você não tenha acesso a essas informações, deixe os campos em branco**

### **Passo 4 - Rode a aplicação**

Dentro do diretório do projeto, rode:

```bash
$ yarn dev
```

,ou:

```bash
$ npm run dev
```

Para iniciar o servidor Node da aplicação. Agora é só **utilizar do seu testador de requisições de preferência** para utilizar. Verifique as rotas do projeto na Disposição das rotas, logo abaixo.

O projeto está rodando por padrão no url **http://localhost:3333/** (ou seja, na porta 3333)

## :arrow_right_hook: Disposição das rotas

### _Rotas de autenticação_

**POST /login** -
Recebe cpf e senha do usuário para tentar logar ou pelo próprio sistema, ou pelo SIGA.
Retorna informações do usuário como token, id, nome,cpf,email e id do avatar.

### _Rotas de envio de arquivos_

**POST /files** -
Recebe um arquivo único e o retorna id, nome da imagem e url de acesso.

### _Rotas de gerenciamento de usuários_

**POST /user** -
Recebe informações de cadastro de usuário como nome, cpf, email e senha. Retorna uma mensagem de sucesso.

**GET /user/:id** -
Recebe id de um usuário como parametro e retorna informações sobre o mesmo - id,nome,email,cpf,data de criação.

Exemplo: /user/5f5fc897eb435e3b2e614df3

**DELETE /user/:id** -
Recebe id de um usuário como parametro e retorna mensagem de confirmação se o usuário for deletado.

Exemplo: /user/5f5fc897eb435e3b2e614df3

**PUT /user/:id** -
Recebe id de usuário e informações a serem atualizadas e retorna mensagem de confirmação.

### _Rotas de gerenciamento de produtos_

**POST /product** -
Recebe informações de cadastro de produto como título, preço, descrição, id do avatar, categoria, id de usuário. Retorna as informações do produto já registrado na base de dados.

**GET /product/:id** -
Recebe id de um produto e retorna informações sobre o mesmo, como título,descrição, preço, url da image, dados do autor, categoria.

**GET /products** -
Retorna lista de todos os produtos cadastrados.

**DELETE /product/:id** -
Recebe id de um produto como parametro e retorna mensagem de confirmação se o produto for deletado.

## :computer: Disposição das rotas

### Rotas de autenticação

**POST /login** -
Recebe cpf e senha do usuário para tentar logar ou pelo próprio sistema, ou pelo SIGA.
Retorna informações do usuário como token, id, nome,cpf,email e id do avatar.

### Rotas de envio de arquivos

**POST /files** -
Recebe arquivos e retorna um array com o id das fotos no banco de dados.

### Rotas de gerenciamento de usuários

**POST /user** -
Recebe informações de cadastro de usuário como nome, cpf, email e senha. Retorna uma mensagem de sucesso.

**GET /user/:id** -
Recebe id de um usuário como parametro e retorna informações sobre o mesmo - id,nome,email,cpf,data de criação.

Exemplo: /user/5f5fc897eb435e3b2e614df3

**DELETE /user/:id** -
Recebe id de um usuário como parametro e retorna mensagem de confirmação se o usuário for deletado.

Exemplo: /user/5f5fc897eb435e3b2e614df3

**POST /update_user/:id** -
Recebe id de usuário e informações a serem atualizadas e retorna mensagem de confirmação.

### Rotas de gerenciamento de produtos

**POST /product** -
Recebe informações de cadastro de produto como título, preço, descrição, id do avatar, categoria, id de usuário. Retorna as informações do produto já registrado na base de dados.

**GET /product/:id** -
Recebe id de um produto e retorna informações sobre o mesmo, como título,descrição, preço, url da image, dados do autor, categoria.

**GET /products** -
Retorna lista de todos os produtos cadastrados.

**DELETE /product/:id** -
Recebe id de um produto como parametro e retorna mensagem de confirmação se o produto for deletado.

## :wrench: Tecnologias usadas:

Neste projeto foram usadas as seguintes tecnologias e ferramentas:

-   [**Insomnia**](https://support.insomnia.rest/article/23-installation/)
-   [**NodeJS**](https://nodejs.org/en/)
-   [**ExpressJS**](https://expressjs.com/)
-   [**Nodemon**](https://nodemon.io/)
-   [**Docker**](https://www.docker.com/)
-   [**MongoDB**](https://www.mongodb.com/)
-   [**mongoose**](https://mongoosejs.com/)
-   [**Yup**](https://github.com/jquense/yup)
-   [**jwt**](https://www.npmjs.com/package/jsonwebtoken/)
-   [**bcryptJS**](https://www.npmjs.com/package/bcryptjs)
-   [**multer**](https://github.com/expressjs/multer)

## :hourglass_flowing_sand: Time de desenvolvimento:
