# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from api.views import (
#     sell_this_week, sell_this_month, sell_this_year,
#     sell_per_week, sell_per_month, sell_per_year,
#     product_list, transaction_list
# )
# from openai import OpenAI
# import os
#
# # Functions mapping
# FUNCTIONS = {
#     "sell_this_week": sell_this_week,
#     "sell_this_month": sell_this_month,
#     "sell_this_year": sell_this_year,
#     "sell_per_week": sell_per_week,
#     "sell_per_month": sell_per_month,
#     "sell_per_year": sell_per_year,
#     "product_list": product_list,
#     "transaction_list": transaction_list,
# }
#
# @api_view(['POST'])
# def assistant(request):
#     user_query = request.data.get("query", "")
#
#     response = client.chat.completions.create(
#         model="gpt-4o-mini",
#         messages=[
#             {"role": "system", "content": "You are a store management AI assistant."},
#             {"role": "user", "content": user_query}
#         ]
#     )
#
#     # Correct way to get response text
#     answer = response.choices[0].message["content"]
#
#     return Response({"answer": answer})
