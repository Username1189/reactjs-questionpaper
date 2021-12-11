from django.db import models
from django.db.models.base import Model

class Choice(models.Model):
    name = models.CharField(max_length=500, null=True)

    def __str__(self):
        return self.name

class Answer(models.Model):
    answer = models.CharField(max_length=500, null=True)

    def __str__(self):
        return self.answer

class Question(models.Model):
    question_id = models.IntegerField(null=False, unique=True)
    choices = models.ManyToManyField(Choice)
    ques_desc = models.CharField(max_length=500, null=False)
    correct_answers = models.ManyToManyField(Answer)

    def __str__(self):
        return  str(self.question_id) + " - " + str(self.ques_desc)
