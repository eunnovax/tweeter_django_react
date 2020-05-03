from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404, JsonResponse
from django.conf import settings
from django.utils.http import is_safe_url
from .models import Tweet
from .forms import TweetForm
import random

ALLOWED_HOSTS = settings.ALLOWED_HOSTS

# Create your views here.
def home_view(request, *args, **kwargs):
    # print(args, kwargs)
    # return HttpResponse("<h1>Hello Django</h1>")
    # print(request.user or None)
    return render(request, "pages/home.html", context={}, status=200)

def tweet_create_view(request, *args, **kwargs):
    # print("ajax", request.is_ajax())\
    user = request.user
    if not request.user.is_authenticated:
        user = None
        if request.is_ajax():
            return JsonResponse({}, status=401)
        return redirect(settings.LOGIN_URL)
    form = TweetForm(request.POST or None)
    next_url = request.POST.get("next") or None
    if form.is_valid():
        obj = form.save(commit=False)
        obj.user = user
        obj.save()
        # if next_url != None and is_safe_url(next_url, ALLOWED_HOSTS):
        #     return redirect(next_url)
        if request.is_ajax():
            return JsonResponse(obj.serialize(), status = 201) # 201 == created items
        form = TweetForm()
    if form.errors:
        if request.is_ajax():
            return JsonResponse(form.errors, status=400)
    return render(request, 'components/form.html', context={"form": form})

def tweet_detail_view(request, tweet_id, *args, **kwargs):
    # print(args, kwargs)
    """
    REST API view
    Consumed by JS/React/Swift/iOS/Android
    return json data
    """
    data = {
        "id": tweet_id,
    }
    status = 200
    try:
        obj = Tweet.objects.get(id=tweet_id)
        data['content'] = obj.content
    except:
        data['message'] = 'Not found'
        status = 404
    
    return JsonResponse(data, status = status)  #json.dumps content_type="application/json"

def tweet_list_view(request, *args, **kwargs):
    """
    REST API view
    Consumed by JS/React/Swift/iOS/Android
    return json data
    """
    qs = Tweet.objects.all()
    tweets_list = [x.serialize() for x in qs]
    data = {
        "isUser": False,
        "response": tweets_list
    }
    return JsonResponse(data)