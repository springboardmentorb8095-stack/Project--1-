from rest_framework import serializers
from .models import Contract
from proposals.serializers import ProposalSerializer

class ContractSerializer(serializers.ModelSerializer):
    proposal = ProposalSerializer(read_only=True)
    class Meta:
        model = Contract
        fields = ('id', 'proposal', 'client', 'freelancer', 'bid_amount', 'status', 'created_at')
        read_only_fields = ('client', 'freelancer', 'proposal')
