import urllib.request
import json

url = "http://127.0.0.1:8000/api/grievances"
payload = {
    "title": "Severe Pothole Report",
    "description": "There is a massive pothole on 5th avenue endangering vehicles and pedestrians",
    "location": "5th Avenue and 42nd Street"
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')

try:
    with urllib.request.urlopen(req) as response:
        res = json.loads(response.read().decode('utf-8'))
        print("--- POST /api/grievances SUCCESS ---")
        print(f"Ticket ID: {res['id']}")
        print(f"Category: {res['category']} (Expected: Roads)")
        print(f"Urgency: {res['urgency']} (Expected: High)")
        print(f"Department: {res['department']}")
        print(f"AI Confidence: {res['ai_confidence']}")
        print(f"AI Reasoning: {res['ai_reasoning']}")

        ticket_id = res['id']

        # Test PATCH status
        patch_url = f"http://127.0.0.1:8000/api/grievances/{ticket_id}"
        patch_data = json.dumps({"status": "In Progress"}).encode('utf-8')
        patch_req = urllib.request.Request(patch_url, data=patch_data, headers={'Content-Type': 'application/json'}, method='PATCH')
        
        with urllib.request.urlopen(patch_req) as patch_res:
            updated = json.loads(patch_res.read().decode('utf-8'))
            print("--- PATCH /api/grievances/{id} SUCCESS ---")
            print(f"Updated Status: {updated['status']}")
except Exception as e:
    print(f"API Test Error: {e}")
