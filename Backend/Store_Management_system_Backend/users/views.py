from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User

@api_view(['POST'])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"status": "error", "message": "Username and password required"}, status=400)

    try:
        user = User.objects(username=username, password=password).first()
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)

    if user:
        # Handle both Enum and plain string for role
        role_value = user.role.value if hasattr(user.role, 'value') else user.role
        return Response({
            "status": "success",
            "full_name": user.full_name,
            "username": user.username,
            "role": role_value
        }, status=200)
    else:
        return Response({"status": "error", "message": "Invalid credentials"}, status=401)
