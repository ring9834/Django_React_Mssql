# Django_React_Mssql --- Back end --- Django
Ctrl+Shift+P, Then select the Python: Select Create Environment

Ctrl+Shift+P, Then select the Python: Select Interpreter command

source .venv/bin/activate (Linux/macOS) or .venv\Scripts\Activate.ps1 (Windows)

python -m pip install --upgrade pip

python -m pip install django

django-admin startproject web_project .

django-admin startapp hzx

pip install djangorestframework  #Django REST framework is a powerful and flexible toolkit for building Web APIs in Django, and it's the go-to choice for this task.

pip install django django-cors-headers # an app for handling the server headers required for CORS

After installing REST framework and 'corsheaders', add them as well as our app ‘hzx’ to the INSTALLED_APPS in our Django project's settings.py file:
INSTALLED_APPS = [ 
 ... 
'rest_framework',
'corsheaders',
'hzx',
 ]

Add the middleware related to corsheaders to MIDDLEWARE of settings.py. These correspond to a filter that will intercept all of our application’s requests and apply CORS logic to them.
MIDDLEWARE = [
     ...
    'corsheaders.middleware.CorsMiddleware',
]

In the models.py of hzx python app, add the following codes. Student class extends from Django’s Model class. This will make our lives easier once it connects directly to the Django models framework, which we’ll use to create our database tables.
class Student(models.Model):
    name = models.CharField("Name", max_length=240)
    email = models.EmailField()
    document = models.CharField("Document", max_length=20)
    phone = models.CharField(max_length=20)
    registrationDate = models.DateField("Registration Date", auto_now_add=True)

    def __str__(self):
        return self.name

Migrations are Django’s way of propagating changes we make to our models — such as adding a field or deleting a model — into our database schema.
python manage.py makemigrations
python manage.py migrate # apply the changes to the database
python manage.py makemigrations --empty --name student hzx # Create a data migration file which represents the direct manipulation of data into the database. We will see a file named ‘0002_student.py’ in hzx app folder.

In the file 0002_students.py, we modify its content as follows. create_data function will create initial data, just so that our database isn’t empty when the API starts.
def create_data(apps, schema_editor):
    Student = apps.get_model('hzx', 'Student')
    Student(name="Julia Hang", email="julia@email.com", document="54879685", phone="12345678").save()

class Migration(migrations.Migration):

    dependencies = [
        ('hzx', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_data),
    ]

python manage.py migrate # Important! If we don’t want use previous dependencies such 0001_initial, just comment all the Operations in all the files like ‘0003_studentenroll_phone.py’.
class Migration(migrations.Migration):
    dependencies = [
        ('hzx', '0002_studentenroll'),
]
the actions Django has to perform once the migration is triggered
    operations = [ 
        // migrations.AddField(
        //     model_name='studentenroll',
        //     name='phone',
        //     field=models.CharField(max_length=20, null=True),
        // ),
    ]

# Django_React_Mssql --- Front end --- React

#python manage.py migrate hzx zero # If we want to reverse all migrations applied for an app, use the name zero

A view is the initial entrypoint of a request made upon a specific endpoint served by a URL. This is all mapped by the Django REST framework once we connect the function itself to the endpoint. We’ll also make use of serializers which allow complex data, such as QuerySets and model instances, to be converted to native Python datatypes that can then be easily rendered into JSON. Let create a new file serializers.py into the hzx/ folder and add the following content.
from rest_framework import serializers
from .models import StudentInfo
class StudentInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentInfo
        fields = ('pk', 'name', 'email', 'document', 'phone', 'registrationDate')
The Meta class is important here because it defines the metadata information that our model has (database) and that must be converted to the StudentInfo class.

Let’s open the urls.py file located in the web_project/ folder and change its content to the following.
from django.contrib import admin
from hzx import views
from django.urls import path, re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^api/hzx/$', views.students_set),
    re_path(r'^api/hzx/([0-9])$', views.students_info),
]

The hzx/views.py has codes as follows. The first endpoint will handle both creations (POST) and listing (GET). The second one will remove (DELETE) or update (PUT) the data of a single studentinfo.
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import StudentInfo
from .serializers import *

@api_view(['GET', 'POST'])
def students_set(request):
    if request.method == 'GET':
        data = StudentInfo.objects.all()
        serializer = StudentInfoSerializer(data, context={'request': request}, many=True)
        
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = StudentInfoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def students_info(request, pk):
    try:
        student = StudentInfo.objects.get(pk=pk)
    except StudentInfo.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = StudentInfoSerializer(student, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
For the POST method, note that we’re first calling the is_valid() method on the serializer to ensure that the data received is conformed with our model.

python manage.py runserver # run our Django application in order to test these endpoints. Access http://localhost:8000/api/hzx/.

We will see the Django’s Browsable API, a human-friendly HTML output that allows for easy browsing of resources, as well as forms for submitting data to the resources. It’s very handy for testing our endpoints easily without having to make use of cURL or other UI tools.

#Aforementioned is the part of back-end building.Now we come to the front-end React application

Once we have Node and npm installed, let’s run the following command in the root folder of our Django project to create our React app. Here we create React app in the folder Python_Django_React in which the folder H_Django which contain our Django project has existed. In this case, python webapi server and React app can be run separately or respectively.
npx create-react-app h_react # Create React app

Here, we’ll use Bootstrap with React for styling with the powerful reactstrap package. Reactstrap is a popular library that provides Bootstrap components as React components. It allows developers to use Bootstrap's styling and lawet features in React applications without having to deal directly with jQuery or Bootstrap’s traditional JavaScript. With Reactstrap, we can easily create responsive web applications by utilizing pre-built components like modals, buttons, alerts, forms, and more.

We also use Axios which is a popular JavaScript library used for making HTTP requests, typically in web applications. It allows developers to send asynchronous requests to APIs and handle responses easily (e.g. automatically transforms response data into JSON, simplifying data handling).
npm install bootstrap reactstrap axios --save

In the src/index.js file add the following import.
import "bootstrap/dist/css/bootstrap.min.css";

In src/ folder, create another folder called constants, and then a file index.js. This file will store the utility constants of our React project. Now add a single constant to hold the URL of our API.
export const API_URL = "http://localhost:8000/api/hzx/";

Then in components folder, create the Header.js and NewStudentInfo.js, add relevant codes.
Then create a new component file called StudentModal.js and add the relevant codes.
Then create a component called StudentSet.js and add the relevant codes in it.
Then create a component called ConfirmRemovalModal.js and add the relevant codes in it.
Then create a component called MyHome.js and add the relevant codes in it.
At last in App.js, we use the codes as follows:
import React, { Component, Fragment } from "react";
import Header from "./components/Header";
import MyHome from "./components/MyHome";

class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <MyHome />
      </Fragment>
    );
  }
}

export default App;

Run the command npm start and our React app will open the browser. Before that, we should make sure to have your Django API up and running as well.

NOTE: CORS_ORIGIN_ALLOW_ALL = True # since we’re working full localhost, we’ll disable the CORS feature by adding this line of code into our web_project/settings.py. Or, we will not get right result when testing using localhost.
