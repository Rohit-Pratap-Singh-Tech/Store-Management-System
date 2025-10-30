import os
from dotenv import load_dotenv
import google.generativeai as genai

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from rest_framework import status

from api.views import (
    sell_this_week, sell_this_month, sell_this_year,
    sell_per_week, sell_per_month, sell_per_year,
    product_list, product_search,
    category_list, category_search,
    sale_list, sale_search,
    transaction_list, transaction_search_with_employee
)

# --- Configuration ---
# Load environment variables from a local .env if present
load_dotenv()
try:
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    _GENAI_READY = True
except KeyError:
    print("Warning: GEMINI_API_KEY not found. AI assistant disabled until provided.")
    _GENAI_READY = False

# --- Function and Tool Definitions ---
FUNCTIONS = {
    "sell_this_week": sell_this_week,
    "sell_this_month": sell_this_month,
    "sell_this_year": sell_this_year,
    "sell_per_week": sell_per_week,
    "sell_per_month": sell_per_month,
    "sell_per_year": sell_per_year,
    "product_list": product_list,
    "product_search": product_search,
    "category_list": category_list,
    "category_search": category_search,
    "sale_list": sale_list,
    "sale_search": sale_search,
    "transaction_list": transaction_list,
    "transaction_search_with_employee": transaction_search_with_employee,
}

# Functions that don't need parameters
NO_PARAM_FUNCTIONS = {
    "sell_this_week", "sell_this_month", "sell_this_year",
    "sell_per_week", "sell_per_month", "sell_per_year",
    "product_list", "category_list", "sale_list", "transaction_list"
}

# Functions that require parameters but must be called via GET (views are @api_view(['GET']))
PARAM_GET_FUNCTIONS = {
    "product_search", "category_search", "sale_search", "transaction_search_with_employee"
}

tools = [
    {
        "function_declarations": [
            {"name": "sell_this_week", "description": "Get all sales from the last 7 days."},
            {"name": "sell_this_month", "description": "Get all sales for the current calendar month."},
            {"name": "sell_this_year", "description": "Get all sales for the current calendar year."},
            {"name": "sell_per_week", "description": "Get sales grouped by week for all time."},
            {"name": "sell_per_month", "description": "Get sales grouped by month for all time."},
            {"name": "sell_per_year", "description": "Get sales grouped by year for all time."},
            {"name": "product_list", "description": "Get a list of all products in the store."},
            {
                "name": "product_search",
                "description": "Get details for a product by exact name.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "product_name": {"type": "string", "description": "Exact product name."}
                    },
                    "required": ["product_name"]
                }
            },
            {"name": "category_list", "description": "List all categories."},
            {
                "name": "category_search",
                "description": "Get a category and its products by name.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "category_name": {"type": "string", "description": "Exact category name."}
                    },
                    "required": ["category_name"]
                }
            },
            {"name": "sale_list", "description": "List all sales."},
            {
                "name": "sale_search",
                "description": "Get sales for a specific employee.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "employee_username": {"type": "string", "description": "Employee username."}
                    },
                    "required": ["employee_username"]
                }
            },
            {"name": "transaction_list", "description": "Get a list of all transactions ever made."},
            {
                "name": "transaction_search_with_employee",
                "description": "Get sales/transactions for a specific employee.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "employee_username": {
                            "type": "string",
                            "description": "Username of the employee."
                        }
                    },
                    "required": ["employee_username"]
                }
            },
        ]
    }
]

SYSTEM_INSTRUCTION = (
    "You are a helpful retail assistant. "
    "Use the provided tools to answer questions about sales, products, and transactions. "
    "When users ask about sales 'till now' or 'so far', use sell_this_year. "
    "For weekly/monthly/yearly breakdowns, use the sell_per_* functions. "
    "For product availability, price, stock, and location, use product_search or product_list. "
    "For categories and their products, use category_list or category_search. "
    "For employee-specific sales, use sale_search or transaction_search_with_employee. "
    "If a parameter is missing, ask the user for the exact name needed."
)

# Initialize the model
# Use a supported model identifier
model = genai.GenerativeModel(
    model_name='gemini-2.0-flash',
    system_instruction=SYSTEM_INSTRUCTION
)


@api_view(['POST'])
def assistant(request: Request):
    """
    Handles user queries with Gemini + DRF view function calling.
    """
    user_query = request.data.get("query")
    if not user_query:
        return Response({"error": "Query is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if not _GENAI_READY:
            return Response(
                {"error": "AI assistant is not configured. Please set GEMINI_API_KEY on the server."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        chat = model.start_chat()
        response = chat.send_message(user_query, tools=tools)

        max_iterations = 10
        iteration_count = 0

        while iteration_count < max_iterations:
            iteration_count += 1

            if not response.candidates or not response.candidates[0].content.parts:
                break

            has_function_call = False
            function_responses = []

            for part in response.candidates[0].content.parts:
                if hasattr(part, "function_call") and part.function_call:
                    has_function_call = True
                    function_call = part.function_call
                    function_name = function_call.name
                    print(f"Model requested function: {function_name}")

                    if function_name not in FUNCTIONS:
                        function_responses.append({
                            "name": function_name,
                            "response": {"error": f"Unknown function '{function_name}'"}
                        })
                        continue

                    function_to_call = FUNCTIONS[function_name]
                    function_args = dict(function_call.args) if function_call.args else {}

                    try:
                        factory = APIRequestFactory()

                        # Route to correct HTTP method based on backend view definitions
                        if function_name in NO_PARAM_FUNCTIONS:
                            mock_request = factory.get('/')
                        elif function_name in PARAM_GET_FUNCTIONS:
                            mock_request = factory.get('/', function_args, format='json')
                        else:
                            mock_request = factory.post('/', function_args, format='json')

                        # Don't wrap in Request again - APIRequestFactory already creates the right type
                        api_response = function_to_call(mock_request)
                        function_result = api_response.data

                        print(f"Function {function_name} result: {function_result}")

                    except Exception as e:
                        print(f"Error in {function_name}: {e}")
                        import traceback
                        traceback.print_exc()
                        function_result = {"error": str(e)}

                    function_responses.append({
                        "name": function_name,
                        "response": {
                            "result": function_result
                        }
                    })

            if not has_function_call:
                break

            if function_responses:
                response = chat.send_message({
                    "parts": [
                        {
                            "function_response": {
                                "name": func_resp["name"],
                                "response": func_resp["response"]
                            }
                        } for func_resp in function_responses
                    ]
                })

        if response.text:
            return Response({"answer": response.text})
        else:
            return Response(
                {"error": "Model did not return a final text response."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    except Exception as e:
        print(f"Assistant error: {e}")
        import traceback
        traceback.print_exc()
        return Response(
            {"error": f"Internal server error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )