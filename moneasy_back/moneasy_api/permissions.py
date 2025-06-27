# permissions.py
import jwt
import os
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import AuthenticationFailed

SUPABASE_JWT_SECRET = os.getenv('SUPABASE_JWT_SECRET')

class IsAuthenticatedWithSupabase(BasePermission):
    def has_permission(self, request, view):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            raise AuthenticationFailed("Token ausente ou mal formado.")

        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"])
            request.user = payload  # Aqui você tem acesso a email, sub (ID), etc.
            return True
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expirado.")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Token inválido.")
