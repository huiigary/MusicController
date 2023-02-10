from rest_framework import serializers
from .models import Room
# serializers = generate helpful berbose representation strings to inspect state the fields in the model


class RoomSerializers(serializers.ModelSerializer):
    class Meta:  # model meta= Is the inner class of your model, to change behaviour of model fileds like ordering... This is optional to be added to classes
        model = Room
        fields = '__all__'
        # fields = ('id', 'code', 'host', 'guests_can_pause',
        #           'votes_to_skip', 'created_at')
