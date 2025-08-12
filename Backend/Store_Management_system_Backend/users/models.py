from mongoengine import Document, StringField, EnumField
import enum

class UserRole(enum.Enum):
    ADMIN = "Admin"
    MANAGER = "Manager"
    CASHIER = "Cashier"
    INVENTORY_MANAGER = "Inventory Manager"

class User(Document):
    full_name = StringField(required=True, max_length=200)
    username = StringField(required=True, unique=True, max_length=150)
    role = EnumField(UserRole, required=True)
    password = StringField(required=True, min_length=8)
    confirm_password = StringField(required=True, min_length=8)

    meta = {
        "collection": "users",
        "indexes": [
            {"fields": ["username"], "unique": True}
        ]
    }

    def clean(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")