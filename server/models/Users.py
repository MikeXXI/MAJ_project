from pydantic import BaseModel
from typing import Optional
from datetime import date

class User(BaseModel):
    id : int
    firstname : str
    lastname : str
    email : str
    dateBirth : date
    postalCode : str
    city : str

