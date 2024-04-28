import pytest
from main import app, db, Users

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    client = app.test_client()

    with app.app_context():
        db.create_all()
        yield client
        db.session.remove()
        db.drop_all()

def test_get_users(client):
    # Créer des utilisateurs de test dans la base de données
    user1 = Users(firstname='John', lastname='Doe', email='john@example.com', dateBirth='1990-01-01', postalCode='12345', city='New York')
    user2 = Users(firstname='Jane', lastname='Doe', email='jane@example.com', dateBirth='1995-01-01', postalCode='54321', city='Los Angeles')
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    # Effectuer une requête GET pour récupérer les utilisateurs
    response = client.get('/users')

    # Vérifier le code de statut de la réponse
    assert response.status_code == 200

    # Vérifier que les données des utilisateurs sont correctes dans la réponse JSON
    data = response.json
    assert len(data) == 2
    assert data[0]['firstname'] == 'John'
    assert data[1]['firstname'] == 'Jane'

def test_create_user(client):
    # Données de test pour la création d'un nouvel utilisateur
    user_data = {
        'firstname': 'Alice',
        'lastname': 'Smith',
        'email': 'alice@example.com',
        'dateBirth': '1985-05-05',
        'postalCode': '67890',
        'city': 'Chicago'
    }

    # Effectuer une requête POST pour créer un nouvel utilisateur
    response = client.post('/users', json=user_data)

    # Vérifier le code de statut de la réponse
    assert response.status_code == 201

    # Vérifier que l'utilisateur a été ajouté à la base de données
    user = Users.query.filter_by(email=user_data['email']).first()
    assert user is not None
    assert user.firstname == user_data['firstname']

def test_delete_user(client):
    # Créer un utilisateur de test dans la base de données
    user = Users(firstname='Bob', lastname='Johnson', email='bob@example.com', dateBirth='1980-02-02', postalCode='13579', city='Seattle')
    db.session.add(user)
    db.session.commit()

    # Effectuer une requête DELETE pour supprimer l'utilisateur
    response = client.delete('/users/{}'.format(user._id))

    # Vérifier le code de statut de la réponse
    assert response.status_code == 200

    # Vérifier que l'utilisateur a été supprimé de la base de données
    assert Users.query.get(user._id) is None
