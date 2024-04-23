import mysql.connector
from fastapi import FastAPI, APIRouter, HTTPException, status
import uvicorn
import json
from typing import List
from datetime import date
from pydantic import BaseModel
import bcrypt

from models.Users import User

app = FastAPI(description="API for the users database", version="0.1.0", title="Users API")
api_router = APIRouter()

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
    try:
        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()
        return users
    except mysql.connector.Error as err:
        return {"error": err}

@api_router.post("/users", status_code=201)
async def create_user(user: dict):
    try:
        cursor.execute("INSERT INTO users (firstname, lastname, email, dateBirth, postalCode, city) VALUES (%s, %s, %s, %s, %s, %s)",
                       (user["firstname"], user["lastname"], user["email"], user["dateBirth"], user["postalCode"], user["city"]))
        connection.commit()
        return {"message": "User created"}
    except mysql.connector.Error as err:
        return {"error": err}
    
@api_router.delete("/users/{user_id}", status_code=200)
async def delete_user(user_id: int, user: User):
    try:
        serverPassword = bcrypt.hashpw(
            process.env.SERVER_PASSWORD.encode(), 
            bcrypt.gensalt()
        ).decode()
        isPasswordCorrect = bcrypt.checkpw(
            user["password"].encode(), 
            bcrypt.gensalt()
        ).decode()
        if isPasswordCorrect:
            cursor.execute("DELETE FROM users WHERE id = %s", (user_id))
            connection.commit()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            return {"message": "User deleted"}
           
    except mysql.connector.Error as err:
        return {"error": err}

app.include_router(api_router)
