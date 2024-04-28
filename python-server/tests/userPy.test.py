import pytest
from fastapi.testclient import TestClient
from main import app
from models.Users import User
from datetime import datetime

client = TestClient(app)

@pytest.fixture(scope="module")
def create_test_user():
    # Crée un utilisateur de test
    test_user = User(
        firstname="John",
        lastname="Doe",
        email="john.doe@example.com",
        dateBirth=datetime(1995, 7, 15),
        postalCode="54321",
        city="Springfield"
    )
    return test_user

def test_get_users(create_test_user):
    # Test de la route GET /users
    response = client.get("/users")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0
    # Ajoutez davantage d'assertions pour vérifier les détails des utilisateurs si nécessaire

def test_create_user(create_test_user):
    # Test de la route POST /users
    new_user_data = {
        "firstname": "Jane",
        "lastname": "Doe",
        "email": "jane.doe@example.com",
        "dateBirth": "1990-01-01T00:00:00.000Z",
        "postalCode": "12345",
        "city": "Paris"
    }
    response = client.post("/users", json=new_user_data)
    assert response.status_code == 201
    assert response.json()["message"] == "User created"

def test_delete_user(create_test_user):
    # Test de la route DELETE /users/{user_id}
    user_id_to_delete = 1  # Remplacez par l'ID réel de l'utilisateur à supprimer
    password = {"password": "secret++"}
    response = client.delete(f"/users/{user_id_to_delete}", json=password)
    assert response.status_code == 200
    assert response.json()["message"] == "User deleted"

    # Vérifiez également que l'utilisateur est réellement supprimé de la base de données en appelant GET /users
    response_get = client.get("/users")
    assert response_get.status_code == 200
    assert len(response_get.json()) == 0  # Vérifiez que la liste des utilisateurs est vide après la suppression

