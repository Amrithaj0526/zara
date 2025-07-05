#!/usr/bin/env python3
"""
Test script for profile functionality
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_profile():
    print("🧪 Testing Profile Functionality")
    print("=" * 40)
    
    # 1. Login to get token
    print("1. Logging in...")
    login_data = {
        "username": "newuser123",
        "password": "TestPass123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if response.status_code != 200:
        print(f"❌ Login failed: {response.status_code}")
        print(response.text)
        return
    
    token = response.json()['token']
    print("✅ Login successful")
    
    # 2. Test profile GET
    print("\n2. Testing profile GET...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/profile/", headers=headers)
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        profile = response.json()
        print("✅ Profile GET successful")
        print(f"Profile data: {json.dumps(profile, indent=2)}")
    else:
        print(f"❌ Profile GET failed: {response.text}")
    
    # 3. Test profile UPDATE
    print("\n3. Testing profile UPDATE...")
    update_data = {
        "bio": "This is a test bio for the profile",
        "location": "Test City, Country",
        "skills": "Python, JavaScript, React",
        "experience": "Software Developer with 3 years experience",
        "education": "Bachelor's in Computer Science"
    }
    
    response = requests.put(f"{BASE_URL}/profile/", json=update_data, headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("✅ Profile UPDATE successful")
        result = response.json()
        print(f"Update result: {json.dumps(result, indent=2)}")
    else:
        print(f"❌ Profile UPDATE failed: {response.text}")
    
    # 4. Test profile GET again to see changes
    print("\n4. Testing profile GET after update...")
    response = requests.get(f"{BASE_URL}/profile/", headers=headers)
    if response.status_code == 200:
        profile = response.json()
        print("✅ Profile GET after update successful")
        print(f"Updated profile: {json.dumps(profile, indent=2)}")
    else:
        print(f"❌ Profile GET after update failed: {response.text}")

if __name__ == "__main__":
    test_profile() 