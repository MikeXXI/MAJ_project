import pytest
from main import app, db, Users
from datetime import date

@pytest.fixture(scope='module')
def test_client():
    # Configure the app with the testing configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['TESTING'] = True

    # Create the database and the database table
    db.create_all()

    # Get the test client
    testing_client = app.test_client()

    # Establish an application context
    ctx = app.app_context()
    ctx.push()

    yield testing_client  # this is where the testing happens!

    ctx.pop()

@pytest.fixture(scope='module')
def init_database():
    # Insert user data
    user1 = Users(firstname='John', lastname='Doe', email='john@example.com',
                  dateBirth=date(1990, 1, 1), postalCode='12345', city='New York')
    user2 = Users(firstname='Jane', lastname='Doe', email='jane@example.com',
                  dateBirth=date(1995, 1, 1), postalCode='54321', city='Los Angeles')
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    yield db  # this is where the testing happens!

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
    # You would normally retrieve this from your data store
    user_id_to_delete = 1
    response = test_client.delete(f'/users/{user_id_to_delete}', json={'password': 'test'})
    assert response.status_code == 200
    assert 'Utilisateur supprimé avec succès' in response.json['message']

    # Verify user is actually deleted
    response = test_client.get('/users')
    assert response.status_code == 200
    assert len(response.json) == 1  # one less than before

def test_delete_user_incorrect_password(test_client, init_database):
    user_id_to_delete = 2
    response = test_client.delete(f'/users/{user_id_to_delete}', json={'password': 'wrong_password'})
    assert response.status_code == 400
    assert 'Mot de passe incorrect' in response.json['message']

def test_delete_user_not_found(test_client, init_database):
    non_existent_user_id = 999
    response = test_client.delete(f'/users/{non_existent_user_id}', json={'password': 'test'})
    assert response.status_code == 404
    assert 'Utilisateur non trouvé' in response.json['message']
