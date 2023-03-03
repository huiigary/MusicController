from django.http import HttpResponse
from django.shortcuts import render
# generics=Used to inherit generic API view, status=get status codes
from rest_framework import generics, status
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response  # To send custom response from view
from django.http import JsonResponse

ROOM_CODE = 'room_code'
class RoomView(generics.CreateAPIView):
    queryset = Room.objects.all()  # all the Room objects
    # To convert Room's fields into a Serializer for display of Room's fields as JSON
    serializer_class = RoomSerializer

class GetRoom(APIView):
    serializer_class =RoomSerializer
    lookup_url_kwarg='code' # parameter is code

    def get(self, request, format=None):
        code= request.GET.get(self.lookup_url_kwarg)
        if code!= None:
            #find room object with this code
            room = Room.objects.filter(code=code)
            if len(room)>0:
                data = RoomSerializer(room[0]).data
                # is current session key same as current host
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status= status.HTTP_200_OK)
            #room is not found
            return Response({'Room not found':'invalid room code'}, status = status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class JoinRoom(APIView):
    lookup_url_kwarg='code'
    def post(self, request, format=None):
        
        # if no session, create one
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        code = request.data.get(self.lookup_url_kwarg)
        # check if have code
        if code != None:
            room_result =Room.objects.filter(code=code)
            if len(room_result) >0:
                room = room_result[0]
                self.request.session['room_code']=room.code # Make a note that user is in this rom... "room_code" is some new key we made in the user session
                return Response({'message:': 'room joined'}, status=status.HTTP_200_OK)
            return Response({'Bad Request:': 'invalid room code '}, status=status.HTTP_400_BAD_REQUEST)
        return Response( {'Bad request': 'invalid post data, did not find code key'}, status=status.HTTP_400_BAD_REQUEST)

        

class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guests_can_pause = serializer.data.get('guests_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guests_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guests_can_pause', 'votes_to_skip'])
                self.request.session['room_code']= room.code # Make a note that user is in this rom... "room_code" is some new key we made in the user session

                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guests_can_pause=guests_can_pause,
                            votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code']=room.code # Make a note that user is in this rom... "room_code" is some new key we made in the user session

                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
    
class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code': self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)
class UserInRoom(APIView):
        def get(self, request, format=None):
             if not self.request.session.exists(self.request.session.session_key):
                self.request.session.create()
            # send the room code to user
             data = {
                'code': self.request.session.get(ROOM_CODE)
            }
            # JsonResponse - take python dictionary rather than object
             return JsonResponse(data, status=status.HTTP_200_OK)
        
class LeaveRoom(APIView):
    def post(self, request, format=None):
        if ROOM_CODE in self.request.session:
            code =self.request.session.pop(ROOM_CODE)  # remove the room code
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len (room_results)>0:
                room= room_results[0]
                room.delete()
        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)
