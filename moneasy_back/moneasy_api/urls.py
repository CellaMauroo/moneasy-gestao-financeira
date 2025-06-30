from rest_framework.routers import DefaultRouter
from rest_framework.routers import APIRootView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.urls import path, include
from .views import *

class PublicAPIRootView(APIRootView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

router = DefaultRouter()
router.APIRootView = PublicAPIRootView
router.register(r'user', UserViewSet)
router.register(r'expense-group', ExpenseGroupViewSet)
router.register(r'expense-category', ExpenseCategoryViewSet)
router.register(r'expense', ExpenseViewSet)
router.register(r'lesson', LessonViewSet)
router.register(r'income', IncomeViewSet)
router.register(r'income-type', IncomeTypeViewSet)
router.register(r'post', PostViewSet)
router.register(r'comment', CommentViewSet)


app_name = 'moneasy_api'

urlpatterns = [
    path('', include(router.urls))
]
