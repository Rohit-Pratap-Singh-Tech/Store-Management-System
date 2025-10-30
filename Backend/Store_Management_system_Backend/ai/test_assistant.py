import pytest
from unittest.mock import patch, MagicMock
from rest_framework.test import APIRequestFactory
from rest_framework import status
from ai.views import assistant


@pytest.fixture
def api_factory():
    return APIRequestFactory()


# --- 1️⃣ Missing Query Case ---
def test_assistant_missing_query(api_factory):
    request = api_factory.post('/assistant/', {}, format='json')
    response = assistant(request)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Query is required" in response.data["error"]


# --- 2️⃣ No API Key Case ---
@patch("ai.views._GENAI_READY", False)
def test_assistant_no_api_key(api_factory):
    request = api_factory.post('/assistant/', {"query": "Show sales this week"}, format='json')
    response = assistant(request)
    assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
    assert "AI assistant is not configured" in response.data["error"]


# --- 3️⃣ Mocked Gemini Call (success path) ---
@patch("ai.views._GENAI_READY", True)
@patch("ai.views.model")
def test_assistant_with_mocked_genai(mock_model, api_factory):
    # Create a fake chat object that mimics Gemini responses
    mock_chat = MagicMock()

    # 1st call simulates Gemini requesting a function call
    mock_function_call = MagicMock()
    mock_function_call.name = "sell_this_week"
    mock_function_call.args = {}

    mock_part = MagicMock()
    mock_part.function_call = mock_function_call

    mock_candidate = MagicMock()
    mock_candidate.content.parts = [mock_part]

    mock_first_response = MagicMock()
    mock_first_response.candidates = [mock_candidate]
    mock_first_response.text = None

    # 2nd call simulates Gemini returning final text
    mock_final_response = MagicMock()
    mock_final_response.text = "This week's total sales are ₹25,000."

    # Configure mock chat sequence
    mock_chat.send_message.side_effect = [mock_first_response, mock_final_response]
    mock_model.start_chat.return_value = mock_chat

    request = api_factory.post('/assistant/', {"query": "Show this week's sales"}, format='json')
    response = assistant(request)

    # --- Assertions ---
    assert response.status_code == 200
    assert "₹25,000" in response.data["answer"]
    mock_model.start_chat.assert_called_once()
    assert mock_chat.send_message.call_count == 2

