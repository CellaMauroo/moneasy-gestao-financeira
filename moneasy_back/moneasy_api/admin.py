from django.contrib import admin
from .models import (
    User, ExpenseGroup, ExpenseCategory, Expense,
    Lesson, IncomeType, Income, Post, Comment
)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'register_date')
    search_fields = ('username', 'email')
    ordering = ('register_date',)


@admin.register(ExpenseGroup)
class ExpenseGroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'group_name')
    search_fields = ('group_name',)


@admin.register(ExpenseCategory)
class ExpenseCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'category_name', 'group')
    list_filter = ('group',)
    search_fields = ('category_name',)


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('id', 'expense_name', 'expense_date', 'value', 'group', 'category', 'user')
    list_filter = ('group', 'category', 'user')
    search_fields = ('expense_name',)
    ordering = ('expense_date',)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'title', 'link', 'created_at', 'group', 'category')
    list_filter = ('group', 'category')
    search_fields = ('title', 'type')


@admin.register(IncomeType)
class IncomeTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'type')
    search_fields = ('type',)


@admin.register(Income)
class IncomeAdmin(admin.ModelAdmin):
    list_display = ('id', 'value', 'type', 'income_date', 'user')
    list_filter = ('type', 'user')
    ordering = ('income_date',)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'created_at', 'user')
    search_fields = ('title',)
    ordering = ('created_at',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'body', 'created_at', 'user', 'post')
    list_filter = ('user', 'post')
    search_fields = ('body',)
    ordering = ('created_at',)
