from mongoengine import Document, StringField, IntField, DateTimeField
from datetime import datetime

class Payment(Document):
    order_id = StringField(max_length=100, unique=True, required=True)
    payment_id = StringField(max_length=100)
    signature = StringField(max_length=200)
    amount = IntField(required=True)
    status = StringField(max_length=20, default="created")
    created_at = DateTimeField(default=datetime.utcnow)

    def __str__(self):
        return self.order_id

    meta = {
        'collection': 'payments'
    }