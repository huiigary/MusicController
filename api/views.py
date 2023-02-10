from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import generics  # Used to inherit generic API view
from .models import Room
from .serializers import RoomSerializers

# Create your views here.


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()  # all the Room objects
    # To convert Room's fields into a Serializer for display of Room's fields as JSON
    serializer_class = RoomSerializers
