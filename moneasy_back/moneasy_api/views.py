from rest_framework import viewsets, permissions
from django.db.models.functions import ExtractYear, ExtractMonth
from django.db.models import Sum
from rest_framework.response import Response
from datetime import date, datetime
from rest_framework.decorators import action
from dateutil.relativedelta import relativedelta
from moneasy_api.serializers import *
from moneasy_api.models import *

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
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
            initial_date = (current_date.replace(day=1) - relativedelta(months=months_str))
        except Exception as e:
            return Response({'erro': f'Erro: {str(e)}'}, status=400)
        
        expenses = Expense.objects.filter(
        user_id=user_id,
        expense_date__date__gte=initial_date,
        expense_date__date__lte=final_date)

        despesas_por_mes = {}

        mes_atual = initial_date
        while mes_atual <= final_date:
            chave_mes = mes_atual.strftime('%Y-%m')
            despesas_por_mes[chave_mes] = []
            mes_atual += relativedelta(months=1)

        
        for despesa in expenses:
            chave_mes = despesa.expense_date.strftime('%Y-%m')
            despesas_por_mes[chave_mes].append(despesa)

    
        resultado = []
        for mes, lista_despesas in despesas_por_mes.items():
            serializer = ExpenseSerializer(lista_despesas, many=True)
            total_mes = sum([despesa.value for despesa in lista_despesas])
            resultado.append({
                'month': mes,
                'total': total_mes,
                'expenses': serializer.data
            })

        return Response(resultado)

        



        






class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer


class IncomeTypeViewSet(viewsets.ModelViewSet):
    queryset = IncomeType.objects.all()
    serializer_class = IncomeTypeSerializer


class IncomeViewSet(viewsets.ModelViewSet):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


