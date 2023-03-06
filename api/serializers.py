from rest_framework import serializers
from .models import Room
# serializers = generate helpful berbose representation strings to inspect state the fields in the model


class RoomSerializer(serializers.ModelSerializer):
    class Meta:  # model meta= Is the inner class of your model, to change behaviour of model fileds like ordering... This is optional to be added to classes
        model = Room
        fields = '__all__'
        # fields = ('id', 'code', 'host', 'guests_can_pause',
        #           'votes_to_skip', 'created_at')


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        # To serialize a request we want to send to POST request
        fields = ('guests_can_pause', 'votes_to_skip')
class UpdateRoomSerializer(serializers.ModelSerializer):
    # redefine code field to not reference model(bc code is unique)
    code = serializers.CharField(validators=[])
    class Meta:
        model = Room
        fields = ('guests_can_pause', 'votes_to_skip', 'code')
