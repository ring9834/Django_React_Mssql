from rest_framework import serializers
from .models import StudentInfo

class StudentInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentInfo
        fields = ('pk', 'name', 'email', 'document', 'phone', 'registrationDate')
