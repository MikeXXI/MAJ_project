import unittest
from main import app, db, Users

class TestUserCreation(unittest.TestCase):
    def setUp(self):
        # Configuration de l'application pour les tests
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app = app.test_client()
        db.create_all()

    def tearDown(self):
        # Nettoyage après les tests
        db.session.remove()
        db.drop_all()

    def test_create_user(self):
        # Données de test
        user_data = {
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john@example.com',
            'dateBirth': '1990-01-01',
            'postalCode': '12345',
            'city': 'New York'
        }

        # Envoi de la requête POST pour créer un nouvel utilisateur
        response = self.app.post('/users', json=user_data)

        # Vérification du code de statut HTTP
        self.assertEqual(response.status_code, 201)

        # Vérification que l'utilisateur a été ajouté à la base de données
        user = Users.query.filter_by(email=user_data['email']).first()
        self.assertIsNotNone(user)
        self.assertEqual(user.firstname, user_data['firstname'])
        self.assertEqual(user.lastname, user_data['lastname'])
        self.assertEqual(user.dateBirth, user_data['dateBirth'])
        self.assertEqual(user.postalCode, user_data['postalCode'])
        self.assertEqual(user.city, user_data['city'])

if __name__ == '__main__':
    unittest.main()
