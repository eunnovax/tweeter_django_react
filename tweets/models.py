from django.db import models
import random
from django.conf import settings

User = settings.AUTH_USER_MODEL
# Create your models here.
class TweetLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tweet = models.ForeignKey("Tweet", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

class Tweet(models.Model):
    # Maps to SQL data
    # id = models.AutoField(primary_key = True)
    parent = models.ForeignKey("self", null=True, on_delete=models.SET_NULL)
    likes = models.ManyToManyField(User, related_name='tweet_user', blank=True, through=TweetLike)
    user = models.ForeignKey(User, on_delete=models.CASCADE) # many users can have many tweets
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to='images/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    # def __str__(self):
    #     return self.content

    class Meta:
        ordering = ['-id']

    @property
    def is_retweet(self):
        return self.parent != None
    def serialize(self):
        '''
        Old method of adding serializers
        '''
        return {
            "id": self.id,
            "content": self.content,
            "likes": random.randint(0, 200)
        }