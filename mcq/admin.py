from django.contrib import admin
from .models import Answer, Choice, Question

admin.site.register(Choice)
admin.site.register(Answer)
admin.site.register(Question)
