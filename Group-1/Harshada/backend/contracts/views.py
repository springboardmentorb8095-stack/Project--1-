from rest_framework import generics, permissions
from .models import Contract, Proposal
from .serializers import ContractSerializer

# ---------------- Contract Creation ---------------- #
class ContractCreateView(generics.CreateAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """
        Automatically assign client, freelancer, and bid_amount
        based on the accepted proposal.
        """
        proposal = serializer.validated_data.get('proposal')
        if not proposal:
            raise ValueError("Proposal must be provided to create a contract")
        serializer.save(
            client=proposal.client,
            freelancer=proposal.freelancer,
            bid_amount=proposal.bid_amount,
            status="Pending"
        )

# ---------------- List Contracts ---------------- #
class ContractListView(generics.ListAPIView):
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Users (clients or freelancers) see only contracts related to them
        """
        user = self.request.user
        return Contract.objects.filter(client=user) | Contract.objects.filter(freelancer=user)

# ---------------- Update Contract Status ---------------- #
class ContractUpdateStatusView(generics.UpdateAPIView):
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Contract.objects.all()

    def perform_update(self, serializer):
        """
        Ensure only client or freelancer involved can update status
        """
        contract = self.get_object()
        user = self.request.user
        if user != contract.client and user != contract.freelancer:
            raise PermissionError("You are not allowed to update this contract")
        serializer.save()
