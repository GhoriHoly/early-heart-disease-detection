from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException  # NEW

from fastapi.security import OAuth2PasswordBearer  # NEW
from pydantic import BaseModel
import numpy as np
import joblib

# NEW (DB + Auth imports)
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta

app = FastAPI()

# -------------------- CORS --------------------

app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173"
   ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model = joblib.load("model/heart_disease_model.pkl")

 
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/heart_db" 

engine = create_engine(DATABASE_URL) 
SessionLocal = sessionmaker(bind=engine)  
Base = declarative_base()  


SECRET_KEY = "secret123"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(p): return pwd_context.hash(p)  
def verify_password(p, h): return pwd_context.verify(p, h) 

def create_token(data: dict): 
    data["exp"] = datetime.utcnow() + timedelta(hours=1)
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

oauth2 = OAuth2PasswordBearer(tokenUrl="login")  


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    password = Column(String)

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    age = Column(Integer)
    chol = Column(Integer)
    result = Column(String)


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        return db.query(User).filter(User.username == username).first()
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


class PatientData(BaseModel):
    age: int
    sex: int
    cp: int
    trestbps: int
    chol: int
    thalach: int
    exang: int
    oldpeak: float
    slope: int
    ca: int
    thal: int
    fbs: int | None = 0
    restecg: int | None = 0


@app.get("/")
def read_root():
    return {"message": "FastAPI backend is running"}


class UserCreate(BaseModel):
    username: str
    password: str

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="User exists")

    new_user = User(
        username=user.username,
        password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()

    return {"message": "User registered"}


@app.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"sub": db_user.username})
    return {"access_token": token}


@app.post("/predict")
def predict_heart_disease(
    data: PatientData,
    db: Session = Depends(get_db),                 
    token: Optional[str] = Depends(oauth2)                   
):

  
    features = np.array([[
        data.age,
        data.sex,
        data.cp,
        data.trestbps,
        data.chol,
        data.fbs,
        data.restecg,
        data.thalach,
        data.exang,
        data.oldpeak,
        data.slope,
        data.ca,
        data.thal
    ]])

    prediction = int(model.predict(features)[0])

    result_text = "High risk of heart disease" if prediction == 0 else "Low risk of heart disease"

  
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        user = db.query(User).filter(User.username == username).first()

        if user:
            pred = Prediction(
                user_id=user.id,
                age=data.age,
                chol=data.chol,
                result=result_text
            )
            db.add(pred)
            db.commit()
    except:
        pass  

    return {
        "prediction": prediction,
        "message": result_text
    }


@app.get("/history")
def get_history(user=Depends(get_current_user), db: Session = Depends(get_db)):
    data = db.query(Prediction).filter(Prediction.user_id == user.id).all()

    return [
        {
            "age": d.age,
            "chol": d.chol,
            "result": d.result
        }
        for d in data
    ]