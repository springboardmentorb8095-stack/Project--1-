from django.urls import path
from .views import ContractCreateView, ContractListView, ContractUpdateStatusView

urlpatterns = [
    path('create/', ContractCreateView.as_view(), name='contract-create'),
    path('list/', ContractListView.as_view(), name='contract-list'),
    path('<int:pk>/update/', ContractUpdateStatusView.as_view(), name='contract-update'),
]
