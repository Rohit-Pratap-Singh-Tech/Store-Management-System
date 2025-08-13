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


# front should have logic to check if the user is logged in and is an admin
# if not, it should redirect to the login page
@api_view(['POST'])
def register_staff(request):
    full_name = request.data.get("full_name")
    username = request.data.get("username")
    role = request.data.get("role")
    password = request.data.get("password")
    confirm_password = request.data.get("confirm_password")
    if role== "Admin":
        return Response({"status": "error", "message": "Admin should be limited "}, status=403)
    if not all([full_name, username, role, password, confirm_password]):
        return Response({"status": "error", "message": "All fields are required"}, status=400)
    if password != confirm_password:
        return Response({"status": "error", "message": "Passwords do not match"}, status=400)
    # change to check password length to 8 after testing
    if len(password) < 2:
        return Response({"status": "error", "message": "Password must be at least 8 characters long"}, status=400)
    try:
        if User.objects(username=username):
            return Response({"status": "error", "message": "User already exists"}, status=400)
        else:
            user = User(
                full_name=full_name,
                username=username,
                role=role,
                password=password,
                confirm_password=confirm_password
            )
            user.clean()
            user.save()
            return Response({"status": "success", "message": "User registered successfully"}, status=201)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)

"""
Data will be like this 
{
    "username": "testuser",
    "old_password": "oldpassword",
    "new_password": "newpassword",
    "confirm_new_password": "newpassword"
}
"""
@api_view(['POST'])
def change_password(request):
    username = request.data.get("username")
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")
    confirm_new_password = request.data.get("confirm_new_password")
    if not all([username, old_password, new_password, confirm_new_password]):
        return Response({"status": "error", "message": "All fields are required"}, status=400)
    if new_password != confirm_new_password:
        return Response({"status": "error", "message": "New passwords do not match"}, status=400)
    if len(new_password) < 2:
        return Response({"status": "error", "message": "New password must be at least 8 characters long"}, status=400)
    try:
        user = User.objects(username=username, password=old_password).first()
        if not user:
            return Response({"status": "error", "message": "user not found"}, status=401)
        user.password = new_password
        user.confirm_password = confirm_new_password
        user.clean()
        user.save()
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)
    return Response({"status": "success", "message": "User Password Changed successfully"}, status=200)

