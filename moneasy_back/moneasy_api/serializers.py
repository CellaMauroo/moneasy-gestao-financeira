from rest_framework import serializers
from django.core.exceptions import ValidationError
from validate_docbr import CPF
from moneasy_api.models import *
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Comment, User, Post   

class UserSlimSerializer(serializers.ModelSerializer):
    """Só expõe o username (ou outros poucos campos)."""
    class Meta:
        model  = User
        fields = ("id", "username")        
        
UserModel = get_user_model()
class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = UserModel
        fields = ("id", "username")

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
    
    #CPF validator
    def validate_cpf(self, value):
        cpf = CPF()
        if not cpf.validate(value):
            raise serializers.ValidationError('Insira um CPF válido')
        return value


class ExpenseGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseGroup
        fields = '__all__'


class ExpenseCategorySerializer(serializers.ModelSerializer):
    group = ExpenseGroupSerializer(read_only=True)
    class Meta:
        model = ExpenseCategory
        fields = '__all__'


class ExpenseSerializer(serializers.ModelSerializer):
    category = ExpenseCategorySerializer(read_only=True)
    
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ExpenseCategory.objects.all(), write_only=True, source='category'
    )
    group_id = serializers.PrimaryKeyRelatedField(
        queryset=ExpenseGroup.objects.all(), write_only=True, source='group'
    )
    class Meta:
        model = Expense
        fields = ['expense_name','expense_date', 'value', 'user', 'category', 'category_id', 'group_id']



class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'


class IncomeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomeType
        fields = '__all__'


class IncomeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Income
        fields = '__all__'
    
    def validate_value(self, value):
        if value <= 0:
            raise serializers.ValidationError("O valor da renda deve ser maior que zero.")
        return value


class PostSerializer(serializers.ModelSerializer):
    user    = SimpleUserSerializer(read_only=True)   
    user_id = serializers.PrimaryKeyRelatedField(    
        queryset=UserModel.objects.all(),
        source="user",
        write_only=True
    )

    class Meta:
        model  = Post
        fields = ("id", "title", "body", "created_at",
                  "user", "user_id")                

class CommentSerializer(serializers.ModelSerializer):
   
    user = UserSlimSerializer(read_only=True)

    
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source="user"
    )
    post_id = serializers.PrimaryKeyRelatedField(
        queryset=Post.objects.all(), write_only=True, source="post"
    )

    class Meta:
        model  = Comment
        fields = [
            "id", "body", "created_at",
            "user",                
            "post",                
            "user_id", "post_id",  
        ]
        read_only_fields = ("id", "created_at", "user", "post")