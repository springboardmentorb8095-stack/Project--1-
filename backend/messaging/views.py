# messaging/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Message, Conversation
from .serializers import MessageSerializer, ConversationSerializer


# ----------------------------
# List all messages in a conversation
# ----------------------------
class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        conversation_id = self.kwargs.get('conversation_id')
        return Message.objects.filter(conversation_id=conversation_id).order_by('timestamp')


# ----------------------------
# Create a new message
# ----------------------------
class MessageCreateView(generics.CreateAPIView):
    serializer_class = MessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ----------------------------
# Mark a message as read
# ----------------------------
class MessageMarkReadView(APIView):
    def post(self, request, pk):
        try:
            message = Message.objects.get(pk=pk)
        except Message.DoesNotExist:
            return Response({"error": "Message not found"}, status=status.HTTP_404_NOT_FOUND)

        message.read = True
        message.save()
        return Response({"success": "Message marked as read"})


# ----------------------------
# Fetch last messages for a user (for sidebar)
# ----------------------------
class MessageListByUserView(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            # Get all conversations of this user
            conversations = Conversation.objects.filter(participants=user)

            messages_data = []
            for conv in conversations:
                last_message = Message.objects.filter(conversation=conv).order_by('-timestamp').first()
                if last_message:
                    messages_data.append({
                        "id": conv.id,
                        "name": ", ".join([p.username for p in conv.participants.exclude(id=user.id)]),
                        "lastMessage": last_message.content,
                        "online": any(p.is_active for p in conv.participants.exclude(id=user.id))
                    })

            return Response(messages_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
