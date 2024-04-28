from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_ROOT_PASSWORD')}@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DATABASE')}"
app.config['SERVER_PASSWORD'] = os.getenv('SERVER_PASSWORD') 
db = SQLAlchemy(app)
CORS(app)

class Users(db.Model):
    _id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    firstname = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    dateBirth = db.Column(db.Date, nullable=False)
    postalCode = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"User(_id={self._id}, firstname={self.firstname}, lastname={self.lastname}, email={self.email}, dateBirth={self.dateBirth}, postalCode={self.postalCode}, city={self.city})"


@app.route('/')
def hello():
    return jsonify({'message': 'Hello, World!'})

  
@app.route('/users', methods=['GET'])
def get_users():
    users = Users.query.all()
    user_list = []
    for user in users:
        user_data = {
            '_id': user._id,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'email': user.email,
            'dateBirth': user.dateBirth,
            'postalCode': user.postalCode,
            'city': user.city
        }
        user_list.append(user_data)

    return jsonify(user_list), 200

@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')
    dateBirth = data.get('dateBirth')
    postalCode = data.get('postalCode')
    city = data.get('city')

    existing_email = Users.query.filter_by(email=email).first()
    if existing_email:
        return jsonify({'message': 'Cet email existe déjà'}), 400

    new_user = Users(firstname=firstname, lastname=lastname, email=email, dateBirth=dateBirth, postalCode=postalCode, city=city)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Utilisateur crée avec succès'}), 201

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    data = request.json
    passwordVerif = data.get('password')

    if not passwordVerif:
        return jsonify({'Mot de passe incorrect'}), 400
    existing_user = Users.query.filter_by(_id=user_id).first()
    if not existing_user:
        return jsonify({'message': 'Utilisateur non trouvé'}), 404

    db.session.delete(existing_user)
    db.session.commit()

    return jsonify({'message': 'Utilisateur supprimé avec succès'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)