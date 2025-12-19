"""Quick test of Google Places API key"""
import requests
import sys

api_key = sys.argv[1] if len(sys.argv) > 1 else ""

if not api_key:
    print("ERROR: No API key provided")
    sys.exit(1)

# Test with a simple place search
url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
params = {
    'query': 'Doha Qatar school',
    'key': api_key
}

print(f"Testing API key: {api_key[:20]}...")
print(f"Making test request to Google Places API...")

try:
    response = requests.get(url, params=params, timeout=10)
    data = response.json()

    print(f"\nResponse status: {data.get('status')}")

    if data.get('status') == 'OK':
        print("SUCCESS! API key is working correctly")
        print(f"Found {len(data.get('results', []))} test results")
        sys.exit(0)
    elif data.get('status') == 'REQUEST_DENIED':
        print("ERROR: REQUEST_DENIED")
        print(f"Error message: {data.get('error_message', 'No error message')}")
        print("\nPlease check:")
        print("1. Places API is enabled")
        print("2. API key has no restrictions")
        print("3. Wait 1-2 minutes for changes to propagate")
        sys.exit(1)
    else:
        print(f"ERROR: {data.get('status')}")
        print(f"Message: {data.get('error_message', 'No error message')}")
        sys.exit(1)

except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
