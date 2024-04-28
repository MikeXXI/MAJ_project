import pytest
from main import app, db, Users 
from datetime import date
from dotenv import load_dotenv
load_dotenv() 


@pytest.fixture(scope='module')
def test_client():
    # Set up the Flask application for testing
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['TESTING'] = True

    # Establish an application context
    with app.app_context():
        db.create_all()  # Create database tables for the tests
        testing_client = app.test_client()  # Get the test client
        yield testing_client  # this is where the testing happens!
        db.drop_all()  # Clean up the DB

@pytest.fixture(scope='module')
def init_database():
    # Insert user data within an application context
    with app.app_context():
        user1 = Users(firstname='John', lastname='Doe', email='john@example.com',
                      dateBirth=date(1990, 1, 1), postalCode='12345', city='Chicago')
        user2 = Users(firstname='Jane', lastname='Doe', email='jane@example.com',
                      dateBirth=date(1995, 1, 1), postalCode='54321', city='Nantes')
        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()

        yield db  # this is where the testing happens!

        db.session.remove()
        db.drop_all()

def test_get_users(test_client, init_database):
    response = test_client.get('/users')
    assert response.status_code == 200
    assert len(response.json) == 2
    assert response.json[0]['email'] == 'john@example.com'
    assert response.json[1]['email'] == 'jane@example.com'

def test_create_user(test_client, init_database):
    response = test_client.post('/users', json={
        'firstname': 'Alice',
        'lastname': 'Smith',
        'email': 'alice@example.com',
        'dateBirth': '1985-05-05',
        'postalCode': '67890',
        'city': 'Chicago'
    })
    assert response.status_code == 201
    assert 'Utilisateur crée avec succès' in response.json['message']

def test_create_user_duplicate_email(test_client, init_database):
    response = test_client.post('/users', json={
        'firstname': 'Bob',
        'lastname': 'Brown',
        'email': 'john@example.com',
        'dateBirth': '1985-05-05',
        'postalCode': '67890',
        'city': 'Chicago'
    })
    assert response.status_code == 400
    assert 'Cet email existe déjà' in response.json['message']

def test_delete_user(test_client, init_database):
    # Assuming user_id of 1 is for John Doe added in init_database
    user_id_to_delete = 1
    response = test_client.delete(f'/users/{user_id_to_delete}')
    assert response.status_code == 200
    assert 'Utilisateur supprimé avec succès' in response.json['message']

    # Verify user is actually deleted
    response = test_client.get('/users')
    assert response.status_code == 200
    assert len(response.json) == 1  # one less than before

def test_delete_user_incorrect_password(test_client, init_database):
    # Assuming user_id of 2 is for Jane Doe added in init_database
    user_id_to_delete = 2
    response = test_client.delete(f'/users/{user_id_to_delete}', json={'password': 'wrong_password'})
    assert response.status_code == 400
    assert 'Mot de passe incorrect' in response.json['message']

def test_delete_user_not_found(test_client, init_database):
    non_existent_user_id = 999
    response = test_client.delete(f'/users/{non_existent_user_id}')
    assert response.status_code == 404
    assert 'Utilisateur non trouvé' in response.json['message']
