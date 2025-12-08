from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow React frontend to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

@app.get("/ai")
def ai_example():
    # Replace this with your AI logic
    return {"prediction": "This is a dummy AI response"}
