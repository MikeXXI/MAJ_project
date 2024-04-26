from multiprocessing import process
import os
import mysql.connector
from fastapi import FastAPI, APIRouter, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from typing import List
from urllib import request
from datetime import date
from pydantic import BaseModel
import bcrypt

from models.Users import User

app = FastAPI(description="API for the users database", version="0.1.0", title="Users API")
api_router = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Remplacez ceci par l'URL de votre frontend
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],  # Ajoutez les méthodes HTTP que vous utilisez
    allow_headers=["*"],
)

try:
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="maj_bdd"
    )
    print("Connexion à la base de données réussie")
except mysql.connector.Error as err:
    print("Erreur de connexion à la base de données :", err)

cursor = connection.cursor()

@api_router.get("/", status_code=200)
async def root():
    return {"message": "Hello World"}
    
@api_router.get("/users", status_code=200)
async def get_users():
    query = ('SELECT * FROM users')
    cursor.execute(query)
    db_user = cursor.fetchall()
    return_data = []
    for db_user in db_user:
        return_data.append(User(
            _id = db_user[0],
            firstname = db_user[1],
            lastname = db_user[2],
            email = db_user[3],
            dateBirth = db_user[4],
            postalCode = db_user[5],
            city = db_user[6]))
    return return_data


@api_router.post("/users", status_code=201)
async def create_user(user: User):
    try:
        cursor.execute("INSERT INTO users (firstname, lastname, email, dateBirth, postalCode, city) VALUES (%s, %s, %s, %s, %s, %s)",
                       [user.firstname, user.lastname, user.email, user.dateBirth, user.postalCode, user.city])
        connection.commit()
        return {"message": "User created"}
    except mysql.connector.Error as err:
        return {"error": err}
    
@api_router.delete("/users/{user_id}", status_code=200)
async def delete_user(user_id: int, body: dict):
    try:
        # serverPassword = os.getenv("SERVER_PASSWORD")
        serverPassword = "secret++"
        isPasswordCorrect = body["password"]
        print ("serverPassword : ", serverPassword)
        if isPasswordCorrect == serverPassword:
            user = cursor.execute("SELECT * FROM users WHERE _id = %s", (user_id,))
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            else:
                cursor.execute("DELETE FROM users WHERE _id = %s", (user_id,))
                connection.commit()
                return {"message": "User deleted"}
        else:
            raise HTTPException(status_code=401, detail="Wrong password")
             
    except mysql.connector.Error as err:
        return {"error": err}

app.include_router(api_router)
