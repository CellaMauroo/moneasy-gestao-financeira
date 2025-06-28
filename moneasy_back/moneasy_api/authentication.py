import jwt
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import os
from .models import User 
from datetime import timedelta

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

class SupabaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        
        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ")[1]
        
        if not SUPABASE_JWT_SECRET:
            raise AuthenticationFailed("SUPABASE_JWT_SECRET não configurado no servidor.")

        try:
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                # A LINHA QUE FALTAVA:
                audience="authenticated", 
                options={
                    "verify_exp": True,
                    "leeway": timedelta(seconds=30) 
                }
            )

            supabase_id = payload.get('sub')
            if not supabase_id:
                raise AuthenticationFailed("Payload do token não contém o 'sub' (ID do usuário).")

            user = User.objects.get(supabase_id=supabase_id)
            
            return (user, payload)

        except User.DoesNotExist:
            raise AuthenticationFailed("Usuário não encontrado no banco de dados do Django.")
        
        except jwt.PyJWTError as e:
            print(f"!!! ERRO DETALHADO DO PYJWT: {type(e).__name__} - {e}")
            raise AuthenticationFailed(f"Token inválido ou expirado: {e}")