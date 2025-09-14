import razorpay
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Payment
import logging

logger = logging.getLogger(__name__)
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


@api_view(['POST'])
def create_order(request):
    amount = request.data.get("amount")
    if not amount:
        return Response({"status": "error", "message": "Amount is required"}, status=400)

    try:
        amount_float = float(amount)
        if amount_float <= 0:
            return Response({"status": "error", "message": "Amount must be greater than 0"}, status=400)

        amount_paise = int(amount_float * 100)  # Razorpay expects paise

        order = client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "payment_capture": 1
        })

        # Store original amount (not paise)
        payment = Payment(
            order_id=order["id"],
            amount=amount_paise,  # Store in paise for consistency
            status="created"
        )
        payment.save()

        return Response({
            "status": "success",
            "order": order,
            "payment_id": str(payment.id)
        }, status=201)

    except ValueError:
        return Response({"status": "error", "message": "Invalid amount format"}, status=400)
    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        return Response({"status": "error", "message": "Failed to create order"}, status=500)


@api_view(['POST'])
def verify_payment(request):
    data = request.data

    # Validate required fields
    required_fields = ["razorpay_order_id", "razorpay_payment_id", "razorpay_signature"]
    for field in required_fields:
        if not data.get(field):
            return Response({"status": "error", "message": f"{field} is required"}, status=400)

    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": data["razorpay_order_id"],
            "razorpay_payment_id": data["razorpay_payment_id"],
            "razorpay_signature": data["razorpay_signature"],
        })

        # Find payment in MongoDB using MongoEngine
        payment = Payment.objects(order_id=data["razorpay_order_id"]).first()
        if not payment:
            return Response({"status": "error", "message": "Payment record not found"}, status=404)

        # Update payment details
        payment.payment_id = data["razorpay_payment_id"]
        payment.signature = data["razorpay_signature"]
        payment.status = "paid"
        payment.save()

        return Response({
            "status": "success",
            "message": "Payment verified successfully",
            "payment_id": str(payment.id)
        }, status=200)

    except razorpay.errors.SignatureVerificationError:
        # Update payment status to failed
        try:
            payment = Payment.objects(order_id=data["razorpay_order_id"]).first()
            if payment:
                payment.status = "failed"
                payment.save()
        except Exception as save_error:
            logger.error(f"Error updating failed payment status: {str(save_error)}")

        return Response({"status": "error", "message": "Payment signature verification failed"}, status=400)

    except Payment.DoesNotExist:
        return Response({"status": "error", "message": "Payment not found"}, status=404)

    except Exception as e:
        logger.error(f"Error verifying payment: {str(e)}")
        return Response({"status": "error", "message": "Payment verification failed"}, status=500)


@api_view(['GET'])
def get_payment_status(request, order_id):
    """Get payment status by order ID"""
    try:
        payment = Payment.objects(order_id=order_id).first()
        if not payment:
            return Response({"status": "error", "message": "Payment not found"}, status=404)

        return Response({
            "status": "success",
            "payment": {
                "order_id": payment.order_id,
                "payment_id": payment.payment_id,
                "amount": payment.amount,
                "status": payment.status,
                "created_at": payment.created_at,
                "updated_at": payment.updated_at
            }
        }, status=200)

    except Exception as e:
        logger.error(f"Error fetching payment status: {str(e)}")
        return Response({"status": "error", "message": "Failed to fetch payment status"}, status=500)