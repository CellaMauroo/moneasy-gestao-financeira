from django.core.management.base import BaseCommand
from moneasy_api.models import *
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Seed database with initial data'

    def handle(self, *args, **kwargs):
        # Limpa os dados antigos
        Comment.objects.all().delete()
        Post.objects.all().delete()
        Income.objects.all().delete()
        IncomeType.objects.all().delete()
        Lesson.objects.all().delete()
        Expense.objects.all().delete()
        ExpenseCategory.objects.all().delete()
        ExpenseGroup.objects.all().delete()
        User.objects.all().delete()

        # Criação de usuários
        users = []
        for i in range(3):
            user = User.objects.create(
                username=f'user{i}',
                email=f'user{i}@example.com',
                password='123456',
                register_date=timezone.now()
            )
            users.append(user)

        # Grupos de despesas
        groups = []
        for name in ['Moradia', 'Alimentação', 'Educação']:
            group = ExpenseGroup.objects.create(group_name=name)
            groups.append(group)

        # Categorias de despesas
        categories = []
        for group in groups:
            for suffix in ['1', '2']:
                category = ExpenseCategory.objects.create(
                    category_name=f'{group.group_name} Categoria {suffix}',
                    group=group
                )
                categories.append(category)

        # Despesas
        for i in range(10):
            Expense.objects.create(
                expense_name=f'Despesa {i}',
                expense_date=timezone.now(),
                group=random.choice(groups),
                category=random.choice(categories),
                user=random.choice(users)
            )

        # Aulas
        for i in range(5):
            Lesson.objects.create(
                type='Vídeo',
                title=f'Aula {i}',
                link=f'https://example.com/aula{i}',
                created_at=timezone.now(),
                group=random.choice(groups),
                category=random.choice(categories)
            )

        # Tipos de renda
        income_types = []
        for label in ['Salário', 'Freelancer', 'Investimento']:
            itype = IncomeType.objects.create(type=label)
            income_types.append(itype)

        # Rendas
        for i in range(6):
            Income.objects.create(
                value=random.uniform(500, 3000),
                type=random.choice(income_types),
                income_date=timezone.now(),
                user=random.choice(users)
            )

        # Posts e comentários
        for i in range(3):
            post = Post.objects.create(
                title=f'Post {i}',
                body='Conteúdo do post...',
                created_at=timezone.now(),
                user=random.choice(users)
            )
            for j in range(2):
                Comment.objects.create(
                    body=f'Comentário {j} para post {i}',
                    created_at=timezone.now(),
                    user=random.choice(users),
                    post=post
                )

        self.stdout.write(self.style.SUCCESS('DB populada'))
