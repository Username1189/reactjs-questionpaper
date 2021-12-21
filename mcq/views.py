from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializer import *
  
class ReactView(APIView):
    serializer_class = ReactSerializer

    def get_choice(self, detail):
        a = ""
        for choice in detail.all():
            a += str(choice) + " "
        return a
  
    def get(self, request):
        detail = [ {"question_id": detail.question_id,
            "choices": self.get_choice(detail.choices),
            "ques_desc": detail.ques_desc,
            "correct_answers": self.get_choice(detail.correct_answers),
            "correct_points": detail.correct_points,
            "wrong_points": detail.wrong_points }
            for detail in Question.objects.all()]
        return Response(detail)
  
    def post(self, request):
        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
