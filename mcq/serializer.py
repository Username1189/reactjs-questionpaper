from rest_framework import serializers
from .models import *
  
class ReactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['question_id', 'choices', 'ques_desc', 'correct_answers']
