from django.db import models

class User(models.Model):
    username = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    register_date = models.DateTimeField()

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'users'


class ExpenseGroup(models.Model):
    group_name = models.CharField(max_length=255)

    def __str__(self):
        return self.group_name

    class Meta:
        db_table = 'expense_groups'


class ExpenseCategory(models.Model):
    category_name = models.CharField(max_length=255)
    group = models.ForeignKey(ExpenseGroup, on_delete=models.CASCADE, related_name='categories')

    def __str__(self):
        return self.category_name

    class Meta:
        db_table = 'expense_categories'


class Expense(models.Model):
    expense_name = models.CharField(max_length=255)
    expense_date = models.DateTimeField()
    value = models.DecimalField(max_digits=10, decimal_places=2)
    group = models.ForeignKey(ExpenseGroup, on_delete=models.CASCADE, related_name='expenses')
    category = models.ForeignKey(ExpenseCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='expenses')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')

    def __str__(self):
        return self.expense_name

    class Meta:
        db_table = 'expenses'


class Lesson(models.Model):
    type = models.CharField(max_length=100)
    title = models.CharField(max_length=255)
    link = models.CharField(max_length=255)
    created_at = models.DateTimeField()
    group = models.ForeignKey(ExpenseGroup, on_delete=models.CASCADE, related_name='lessons')
    category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE, related_name='lessons')

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'lessons'


class IncomeType(models.Model):
    type = models.CharField(max_length=100)

    def __str__(self):
        return self.type

    class Meta:
        db_table = 'income_type'


class Income(models.Model):
    value = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.ForeignKey(IncomeType, on_delete=models.CASCADE, related_name='incomes')
    income_date = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incomes')

    def __str__(self):
        return f"{self.value} - {self.type}"

    class Meta:
        db_table = 'income'


class Post(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    created_at = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'posts'


class Comment(models.Model):
    body = models.TextField()
    created_at = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"

    class Meta:
        db_table = 'comments'
