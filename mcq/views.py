from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializer import *
  
class ReactView(APIView):
    serializer_class = ReactSerializer
  
    def get(self, request):
        detail = [ {"question_id": detail.question_id,
            "choices": [str(a) for a in detail.choices.all()],
            "ques_desc": detail.ques_desc,
            "correct_answers": [str(a) for a in detail.correct_answers.all()]}
            for detail in Question.objects.all()]
        return Response(detail)
  
    def post(self, request):
        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
