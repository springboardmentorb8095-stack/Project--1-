from django.urls import path
from .views import MessageListView, MessageCreateView, MessageMarkReadView, MessageListByUserView

urlpatterns = [
    path('<int:conversation_id>/', MessageListView.as_view(), name='message-list'),
    path('create/', MessageCreateView.as_view(), name='message-create'),
    path('mark-read/<int:pk>/', MessageMarkReadView.as_view(), name='message-mark-read'),
    path('user/<str:username>/', MessageListByUserView.as_view(), name='user-messages'),
]
