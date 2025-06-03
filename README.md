# Tutorial para rodar e consumir a api localmente
# Antes de começar, certifique-se de ter instalado:
Python 3.8+
pip
Git
Virtualenv - Opcional
PostgreSQL 

## Opcional: Criação de venv (ambiente virtual)
# Linux / Mac
python3 -m venv venv
source venv/bin/activate
# Windows
python -m venv venv ou virtualenv venv
venv/Scripts/activate

# Instalação de dependências do projeto: 
pip install -r requirements.txt
# Criação da database local
Para isso, você deve ter o postgresql instalado e, se quiser, alguma ferramenta de administração de sgdb 
Então deve criar uma database no servidor padrão do postgres para fazer a conexão com o django

# Configuração do .env:
# No diretório moneasy_back, há um arquivo .env.example. Nele, remova o .example e substitua:
# OBS: a secret key é única mas não está pública no repo por motivos de segurança
SECRET_KEY = 'secret_key'
NAME = 'nome da database criada',
USER = 'seu usuário',
PASSWORD = 'sua senha',

# Com as configurações do .env corretas, execute:
python manage.py makemigrations
python manage.py migrate

# Para popular a db com dados teste, execute dentro de moneasy_back:
python manage.py seed

# Para rodar o servidor:
python manage.py runserver
o link para acessar a api: http://localhost:8000/api/

