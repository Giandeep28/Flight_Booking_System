"""
AI Chatbot Engine - Rule-based + keyword NLP for flight assistance
"""
import re
import random
from datetime import datetime

# ── Intent patterns ─────────────────────────────────────────────
INTENTS = {
    "search_flight": [
        r"(?:search|find|look|show|get)\s+(?:me\s+)?(?:a\s+)?flight",
        r"flight(?:s)?\s+(?:from|to|between)",
        r"(?:fly|travel|go)\s+(?:from|to)",
        r"(?:cheapest|best|fastest)\s+flight",
        r"book.*(?:from|to)\s+\w+",
    ],
    "price_inquiry": [
        r"(?:how\s+much|price|cost|fare|rate|charge)",
        r"(?:cheapest|lowest|best)\s+(?:price|fare|deal)",
        r"(?:budget|affordable)",
    ],
    "booking_help": [
        r"(?:help|assist|guide)\s+(?:me\s+)?(?:book|reserve)",
        r"(?:how\s+(?:to|do\s+i))\s+book",
        r"booking\s+(?:process|steps|help)",
    ],
    "status_check": [
        r"(?:check|track|where|status)\s+(?:my\s+)?(?:flight|booking|pnr)",
        r"pnr\s+(?:status|check)",
        r"(?:my\s+)?booking\s+(?:status|details)",
    ],
    "cancellation": [
        r"(?:cancel|refund|money\s+back)",
        r"(?:cancellation|cancelling)",
    ],
    "baggage": [
        r"(?:baggage|luggage|bag|carry.?on|check.?in\s+bag)",
        r"(?:weight|kg|kilogram)\s+(?:limit|allowance)",
    ],
    "greeting": [
        r"^(?:hi|hello|hey|good\s+(?:morning|afternoon|evening)|namaste)",
    ],
    "thanks": [
        r"(?:thank|thanks|thx|appreciate)",
    ],
}

# ── Response templates ──────────────────────────────────────────
RESPONSES = {
    "search_flight": [
        "I'd love to help you find the perfect flight! 🛫\n\nPlease use our search portal above — enter your departure city, destination, and travel date. I'll show you the best options sorted by price, duration, and ratings.\n\n💡 **Tip**: Book 2-3 weeks ahead for the best fares!",
        "Sure! Use the flight search at the top of the page. Enter your origin and destination, pick a date, and hit **SEARCH FLIGHTS**.\n\nI recommend checking both weekday and weekend prices — you might save 15-30%! ✈️",
    ],
    "price_inquiry": [
        "Flight prices vary based on:\n\n📅 **Booking Date**: Earlier = cheaper (2-3 weeks ideal)\n📊 **Demand**: Peak seasons cost more\n✈️ **Airline**: Low-cost vs full-service\n\n**Current average domestic fares**: ₹2,500 - ₹8,000\n**International from India**: ₹7,000 - ₹55,000\n\nSearch now to see current prices!",
        "Great question! Here are typical fare ranges:\n\n🇮🇳 **Domestic**: ₹2,500 - ₹12,000\n🌍 **International (Asia)**: ₹15,000 - ₹35,000\n🌎 **International (Europe/US)**: ₹35,000 - ₹80,000\n\nPrices update in real-time. Use the search to get exact fares!",
    ],
    "booking_help": [
        "Booking is simple! Here's how:\n\n1️⃣ **Search**: Enter cities and date above\n2️⃣ **Select**: Pick your preferred flight\n3️⃣ **Details**: Enter passenger information\n4️⃣ **Pay**: Complete the secure payment\n5️⃣ **Confirm**: Receive your PNR instantly!\n\nNeed help with any step? Just ask! 🎫",
    ],
    "status_check": [
        "To check your booking status:\n\n📋 Go to **Booking Hub** > **Check Booking PNR**\n📝 Enter your PNR number (e.g., SV12345)\n📧 Enter your last name\n\nYour complete itinerary, seat assignment, and e-ticket will be displayed.\n\nDon't have your PNR? Check your email for the confirmation! 📩",
    ],
    "cancellation": [
        "Our cancellation policy:\n\n⏰ **>72 hours before**: Full refund (minus ₹250 processing fee)\n⏰ **24-72 hours**: 50% refund\n⏰ **<24 hours**: No refund (credit only)\n\nTo cancel: **Booking Hub** > **Check Booking PNR** > **Cancel Booking**\n\nRefunds are processed within 7-10 business days. 💳",
    ],
    "baggage": [
        "Baggage allowance depends on your airline:\n\n🧳 **Economy (Domestic)**:\n   • Cabin: 7 kg\n   • Check-in: 15-20 kg\n\n🧳 **Economy (International)**:\n   • Cabin: 7 kg\n   • Check-in: 20-30 kg\n\n💼 **Business/First**: Up to 40 kg check-in\n\nYou can add extra baggage during booking! Each +5 kg costs ₹500-₹1,500.",
    ],
    "greeting": [
        "Hello! Welcome to SkyVoyage! ✈️\n\nI'm SkyBot, your personal travel assistant. I can help you with:\n\n🔍 Finding flights\n💰 Price information\n📋 Booking assistance\n🎫 Booking status\n📦 Baggage queries\n\nHow can I assist you today?",
        "Namaste! 🙏 Welcome to SkyVoyage!\n\nI'm here to make your travel experience seamless. Ask me anything about flights, bookings, or travel tips!",
    ],
    "thanks": [
        "You're welcome! Have a wonderful journey! ✈️🌟",
        "Happy to help! Fly safe and enjoy your trip! 🎫✨",
    ],
}

DEFAULT_RESPONSES = [
    "I'm not sure I understood that. Could you rephrase? I can help with:\n\n• Flight search\n• Price information\n• Booking help\n• Booking status\n• Baggage info\n• Cancellation policy",
    "Hmm, I didn't quite get that. Try asking about flights, prices, bookings, or travel tips! ✈️",
]


def classify_intent(message: str) -> str:
    """Classify user message into an intent category"""
    text = message.lower().strip()
    
    for intent, patterns in INTENTS.items():
        for pattern in patterns:
            if re.search(pattern, text):
                return intent
    
    return "unknown"


def get_response(message: str) -> dict:
    """Get chatbot response for a user message"""
    intent = classify_intent(message)
    
    if intent in RESPONSES:
        response_text = random.choice(RESPONSES[intent])
    else:
        response_text = random.choice(DEFAULT_RESPONSES)
    
    return {
        "intent": intent,
        "response": response_text,
        "timestamp": datetime.now().isoformat(),
        "suggestions": _get_suggestions(intent),
    }


def _get_suggestions(intent: str) -> list:
    """Get contextual follow-up suggestions"""
    suggestions_map = {
        "search_flight": ["Show me cheapest flights", "What airlines fly Delhi to Mumbai?", "Help me book"],
        "price_inquiry": ["Search flights now", "Best time to book?", "Student discounts"],
        "booking_help": ["Search flights", "Check my booking", "Baggage rules"],
        "status_check": ["Cancel my booking", "Modify booking", "Baggage info"],
        "cancellation": ["Refund policy", "Modify booking", "Contact support"],
        "baggage": ["Book extra baggage", "Cabin bag rules", "Search flights"],
        "greeting": ["Search flights", "Price inquiry", "Booking help"],
        "thanks": ["Search more flights", "Check booking", "Travel tips"],
    }
    return suggestions_map.get(intent, ["Search flights", "Price info", "Help"])
