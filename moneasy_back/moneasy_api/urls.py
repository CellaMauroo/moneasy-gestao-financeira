from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'expense-group', ExpenseGroupViewSet)
router.register(r'expense-category', ExpenseCategoryViewSet)
router.register(r'expense', ExpenseViewSet)
router.register(r'lesson', LessonViewSet)
router.register(r'income-type', IncomeTypeViewSet)
router.register(r'post', PostViewSet)
router.register(r'comment', CommentViewSet)

app_name = 'moneasy_api'

urlpatterns = router.urls