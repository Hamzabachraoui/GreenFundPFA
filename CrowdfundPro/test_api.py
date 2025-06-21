#!/usr/bin/env python3
"""
Script de test pour vérifier les APIs du backend
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api"

def test_api_endpoints():
    """Test des endpoints principaux"""
    
    print("🧪 Test des endpoints API...")
    
    # Test 1: Vérifier que le serveur répond
    try:
        response = requests.get(f"{BASE_URL}/projects/")
        print(f"✅ GET /api/projects/ - Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   📊 Nombre de projets: {data.get('count', 0)}")
    except Exception as e:
        print(f"❌ Erreur GET /api/projects/: {e}")
    
    # Test 2: Test des statistiques du porteur (sans authentification)
    try:
        response = requests.get(f"{BASE_URL}/projects/stats/porteur/")
        print(f"✅ GET /api/projects/stats/porteur/ - Status: {response.status_code}")
        if response.status_code == 401:
            print("   🔒 Authentification requise (normal)")
    except Exception as e:
        print(f"❌ Erreur GET /api/projects/stats/porteur/: {e}")
    
    # Test 3: Test des utilisateurs
    try:
        response = requests.get(f"{BASE_URL}/users/")
        print(f"✅ GET /api/users/ - Status: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur GET /api/users/: {e}")
    
    # Test 4: Test des investissements
    try:
        response = requests.get(f"{BASE_URL}/investments/")
        print(f"✅ GET /api/investments/ - Status: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur GET /api/investments/: {e}")

if __name__ == "__main__":
    test_api_endpoints() 