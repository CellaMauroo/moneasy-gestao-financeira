# moneasy_api/management/commands/verify_jwt.py

import jwt
import os
import time
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Cria e verifica um token JWT localmente usando o segredo do Supabase.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Iniciando teste de validação de JWT..."))

        try:
            # 1. Pega o segredo do ambiente
            secret_key = os.getenv('SUPABASE_JWT_SECRET')
            
            if not secret_key:
                self.stdout.write(self.style.ERROR("ERRO: A variável SUPABASE_JWT_SECRET não foi encontrada no ambiente."))
                return

            self.stdout.write(f"Segredo encontrado, começando com: {secret_key[:10]}...")

            # 2. Cria um payload de teste simples
            payload_to_encode = {
                'sub': '1234567890',
                'name': 'Teste Local',
                'iat': int(time.time()),
                'exp': int(time.time()) + 3600 # Expira em 1 hora
            }
            self.stdout.write(f"Payload a ser codificado: {payload_to_encode}")

            # 3. CRIA (encode) o token usando o segredo
            encoded_token = jwt.encode(payload_to_encode, secret_key, algorithm="HS256")
            self.stdout.write(f"Token gerado localmente: {encoded_token}")

            # 4. VERIFICA (decode) o token que acabamos de criar, usando o mesmo segredo
            self.stdout.write("Tentando decodificar o token gerado localmente...")
            decoded_payload = jwt.decode(encoded_token, secret_key, algorithms=["HS256"])
            self.stdout.write(f"Payload decodificado: {decoded_payload}")
            
            # 5. Verificação final
            if decoded_payload['sub'] == payload_to_encode['sub']:
                self.stdout.write(self.style.SUCCESS("\n>>> SUCESSO! O segredo no seu arquivo .env é válido e o PyJWT está funcionando corretamente."))
            else:
                self.stdout.write(self.style.ERROR("\n>>> FALHA! Algo muito estranho aconteceu."))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"\n>>> FALHA! O teste local falhou. Erro: {e}"))
            self.stdout.write(self.style.WARNING("Isso fortemente indica que o valor da sua chave SUPABASE_JWT_SECRET no arquivo .env está corrompido (caracteres invisíveis, etc)."))