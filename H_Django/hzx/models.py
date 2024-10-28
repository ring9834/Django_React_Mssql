from django.db import models

# Create your models here.
class StudentEnroll(models.Model):
    enroll_text = models.CharField(max_length=200)
    enroll_date = models.DateTimeField('date published')
    phone = models.CharField(null=True, max_length=20)
    def __str__(self):
        return self.enroll_text

class StudentInfo(models.Model):
    name = models.CharField("Name", max_length=240)
    email = models.EmailField()
    document = models.CharField("Document", max_length=20)
    phone = models.CharField(max_length=20)
    registrationDate = models.DateField("Registration Date", auto_now_add=True)

    def __str__(self):
        return self.name
