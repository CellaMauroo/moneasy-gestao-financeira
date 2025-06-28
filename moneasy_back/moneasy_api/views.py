from rest_framework import viewsets, permissions
from django.db.models.functions import ExtractYear, ExtractMonth
from django.db.models import Sum
from rest_framework.response import Response
from datetime import date, datetime
from rest_framework.decorators import action
from dateutil.relativedelta import relativedelta
from moneasy_api.serializers import *
from moneasy_api.models import *
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny
import jwt
import os
# Create your views here.
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

class SupabaseLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            raise AuthenticationFailed("Token JWT ausente ou inválido.")

        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expirado.")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Token inválido.")
        
        return Response({
            "mensagem": "Token válido. Acesso liberado.",
            "usuario_email": payload.get("email"),
        })
    
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ExpenseGroupViewSet(viewsets.ModelViewSet):
    queryset = ExpenseGroup.objects.all()
    serializer_class = ExpenseGroupSerializer


class ExpenseCategoryViewSet(viewsets.ModelViewSet):
    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer




class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.none()
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return Expense.objects.filter(user_id=user_id)
        return Expense.objects.all()

    @action(detail=False, methods=['get'])
    def by_month(self, request):
        month_str = request.query_params.get('month')
        user_id = request.query_params.get('user_id')

        if not month_str or not user_id:
            return Response({'erro': 'Parâmetros "user_id" e "month" são obrigatórios.'}, status=400)

        try:
            year, month = map(int, month_str.split('-'))
            start_date = date(year, month, 1)
            end_date = start_date + relativedelta(months=1) - relativedelta(days=1)
        except Exception as e:
            return Response({'erro': f'Formato de mês inválido. Use YYYY-MM. Erro: {str(e)}'}, status=400)

        expenses = Expense.objects.filter(
            user_id=user_id,
            expense_date__date__gte=start_date,
            expense_date__date__lte=end_date
        ).order_by('-expense_date')

        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def last_months(self, request):
        user_id = request.query_params.get('user_id')
        months_str = request.query_params.get('months')
        
        if not months_str or not user_id:
            return Response({'erro': 'Parâmetros "user_id" e "months" são obrigatórios.'}, status=400)
        
        try:
            current_date = date.today()
            months_str =  int(months_str)
            final_date = (current_date.replace(day=1) + relativedelta(months=1)) - relativedelta(days=1)
            initial_date = (current_date.replace(day=1) - relativedelta(months=months_str-1))
        except Exception as e:
            return Response({'erro': f'Erro: {str(e)}'}, status=400)
        
        expenses = Expense.objects.filter(
        user_id=user_id,
        expense_date__date__gte=initial_date,
        expense_date__date__lte=final_date)

        expenses_per_month = {}

        actual_month = initial_date
        while actual_month <= final_date:
            month_key = actual_month.strftime('%Y-%m')
            expenses_per_month[month_key] = []
            actual_month += relativedelta(months=1)

        
        for expense in expenses:
            month_key = expense.expense_date.strftime('%Y-%m')
            expenses_per_month[month_key].append(expense)

    
        result = []
        for month, expenses_list in expenses_per_month.items():
            serializer = ExpenseSerializer(expenses_list, many=True)
            total_month = sum([expense.value for expense in expenses_list])
            result.append({
                'month': month,
                'total': total_month,
                'expenses': serializer.data
            })

        return Response(result)


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer


class IncomeTypeViewSet(viewsets.ModelViewSet):
    queryset = IncomeType.objects.all()
    serializer_class = IncomeTypeSerializer


class IncomeViewSet(viewsets.ModelViewSet):
    queryset = Income.objects.none()
    serializer_class = IncomeSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return Income.objects.filter(user_id=user_id)
        return Income.objects.all()

    @action(detail=False, methods=['get'])
    def by_month(self, request):
        month_str = request.query_params.get('month')
        user_id = request.query_params.get('user_id')

        if not month_str or not user_id:
            return Response({'erro': 'Parâmetros "user_id" e "month" são obrigatórios.'}, status=400)

        try:
            year, month = map(int, month_str.split('-'))
            start_date = date(year, month, 1)
            end_date = start_date + relativedelta(months=1) - relativedelta(days=1)
        except Exception as e:
            return Response({'erro': f'Formato de mês inválido. Use YYYY-MM. Erro: {str(e)}'}, status=400)

        income = Income.objects.filter(
            user_id=user_id,
            income_date__date__gte=start_date,
            income_date__date__lte=end_date
        ).order_by('-income_date')

        serializer = IncomeSerializer(income, many=True)
        return Response(serializer.data)
    

    @action(detail=False, methods=['get'])
    def last_months(self, request):
        user_id = request.query_params.get('user_id')
        months_str = request.query_params.get('months')
        
        if not months_str or not user_id:
            return Response({'erro': 'Parâmetros "user_id" e "months" são obrigatórios.'}, status=400)
        
        try:
            current_date = date.today()
            months_str =  int(months_str)
            final_date = (current_date.replace(day=1) + relativedelta(months=1)) - relativedelta(days=1)
            initial_date = (current_date.replace(day=1) - relativedelta(months=months_str-1))
        except Exception as e:
            return Response({'erro': f'Erro: {str(e)}'}, status=400)
        
        incomes = Income.objects.filter(
        user_id=user_id,
        income_date__date__gte=initial_date,
        income_date__date__lte=final_date)

        income_per_month = {}

        actual_month = initial_date
        while actual_month <= final_date:
            key_month = actual_month.strftime('%Y-%m')
            income_per_month[key_month] = []
            actual_month += relativedelta(months=1)

        
        for income in incomes:
            key_month = income.income_date.strftime('%Y-%m')
            income_per_month[key_month].append(income)

    
        result = []
        for month, incomes_list in income_per_month.items():
            serializer = IncomeSerializer(incomes_list, many=True)
            total_month = sum([income.value for income in incomes_list])
            result.append({
                'month': month,
                'total': total_month,
                'incomes': serializer.data
            })

        return Response(result)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


