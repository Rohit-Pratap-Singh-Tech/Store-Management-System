# from email.message import EmailMessage
# import smtplib
# import os
#
# # --- Email Configuration from Environment ---
# EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
# EMAIL_PORT = int(os.getenv("EMAIL_PORT", "465"))
# EMAIL_USER = os.getenv("EMAIL_USER")
# EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
# EMAIL_FROM = os.getenv("EMAIL_FROM", EMAIL_USER)
#
# # --- Get Admin and Manager Emails from Environment ---
# def get_admin_emails():
#     """Get admin emails from environment variable"""
#     emails = os.getenv("ADMIN_EMAILS", "")
#     if not emails:
#         return []
#     # Split by comma and remove whitespace
#     return [email.strip() for email in emails.split(",") if email.strip()]
#
# def get_manager_emails():
#     """Get manager emails from environment variable"""
#     emails = os.getenv("MANAGER_EMAILS", "")
#     if not emails:
#         return []
#     # Split by comma and remove whitespace
#     return [email.strip() for email in emails.split(",") if email.strip()]
#
#
# # --- Email Utility ---
# def send_email(subject, body, recipients):
#     """Reusable email sender with environment variable configuration"""
#     if not recipients:
#         print("⚠️ No recipients provided")
#         return
#
#     if not EMAIL_USER or not EMAIL_PASSWORD:
#         print("⚠️ Warning: Email credentials not configured in .env file")
#         return
#
#     try:
#         msg = EmailMessage()
#         msg["From"] = EMAIL_FROM
#         msg["To"] = ", ".join(recipients)
#         msg["Subject"] = subject
#         msg.set_content(body)
#
#         with smtplib.SMTP_SSL(EMAIL_HOST, EMAIL_PORT) as smtp:
#             smtp.login(EMAIL_USER, EMAIL_PASSWORD)
#             smtp.send_message(msg)
#
#         print(f"✅ Email sent successfully to {len(recipients)} recipient(s): {', '.join(recipients)}")
#     except Exception as e:
#         print(f"❌ Failed to send email: {str(e)}")
#
#
# # --- ADMIN ALERT FUNCTION ---
# def send_admin_alert(product):
#     """Send low-stock alert to all admins from environment variables"""
#     try:
#         admin_emails = get_admin_emails()
#
#         if not admin_emails:
#             print("⚠️ No admin emails configured in .env file (ADMIN_EMAILS)")
#             return
#
#         subject = f"⚠️ Low Stock Alert: {product.product_name}"
#         body = (
#             f"Dear Admin,\n\n"
#             f"The product '{product.product_name}' is low on stock.\n"
#             f"Current Quantity: {product.quantity_in_stock}\n"
#             f"Location: {product.location}\n\n"
#             f"Please take action to restock.\n\n"
#             f"— Inventory Management System"
#         )
#         send_email(subject, body, admin_emails)
#         print(f"📧 Admin alert sent for: {product.product_name}")
#     except Exception as e:
#         print(f"❌ Error sending admin alert: {str(e)}")
#
#
# # --- MANAGER ALERT FUNCTION ---
# def send_manager_alert(product):
#     """Send low-stock alert to all managers from environment variables"""
#     try:
#         manager_emails = get_manager_emails()
#
#         if not manager_emails:
#             print("⚠️ No manager emails configured in .env file (MANAGER_EMAILS)")
#             return
#
#         subject = f"⚠️ Stock Running Low: {product.product_name}"
#         body = (
#             f"Dear Manager,\n\n"
#             f"The product '{product.product_name}' has limited stock left.\n"
#             f"Current Quantity: {product.quantity_in_stock}\n"
#             f"Location: {product.location}\n\n"
#             f"Please coordinate with admin for restocking.\n\n"
#             f"— Inventory Management System"
#         )
#         send_email(subject, body, manager_emails)
#         print(f"📧 Manager alert sent for: {product.product_name}")
#     except Exception as e:
#         print(f"❌ Error sending manager alert: {str(e)}")