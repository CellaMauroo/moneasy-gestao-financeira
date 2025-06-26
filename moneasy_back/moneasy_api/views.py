from rest_framework import viewsets, permissions
from rest_framework.response import Response
from datetime import date
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
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return Expense.objects.filter(user_id=user_id)
        return Expense.objects.none()

    @action(detail=False, methods=['get'])
    def by_month(self, request):
        mes_str = request.query_params.get('mes')
        user_id = request.query_params.get('user_id')

        if not mes_str or not user_id:
            return Response({'erro': 'Parâmetros "user_id" e "mes" são obrigatórios.'}, status=400)

        try:
            ano, mes = map(int, mes_str.split('-'))
            data_inicio = date(ano, mes, 1)
            data_fim = data_inicio + relativedelta(months=1) - relativedelta(days=1)
        except Exception as e:
            return Response({'erro': f'Formato de mês inválido. Use YYYY-MM. Erro: {str(e)}'}, status=400)

        despesas = Expense.objects.filter(
            user_id=user_id,
            expense_date__date__gte=data_inicio,
            expense_date__date__lte=data_fim
        ).order_by('-expense_date')

        serializer = ExpenseSerializer(despesas, many=True)
        return Response(serializer.data)


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


