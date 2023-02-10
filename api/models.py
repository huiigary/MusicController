from django.db import models
import string
import random
# Create your models here.


def generate_unique_code():
    codeLength = 6
    while (True):
        code = ''.join(random.choices(string.ascii_uppercase, k=codeLength))
        if (Room.objects.filter(code=code)).count() == 0:
            break
        return code


class Room(models.Model):  # models.Model = says this is a model
    # code = a field this Room will have
    code = models.CharField(max_length=8, default='', unique=True)
    # unique=true says I will only have 1 host
    host = models.CharField(max_length=50, unique=True)
    guests_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
