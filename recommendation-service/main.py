from fastapi import FastAPI
from models.surprise_model import get_surprise_recommendations, train_surprise_model
import uvicorn

app = FastAPI()

@app.get("/recommendations/surprise/{user_id}")
async def get_recommendations(user_id: str, n: int = 10):
    recommendations = get_surprise_recommendations(user_id, n)
    return recommendations

@app.post("/train/surprise")
async def train_model():
    model = train_surprise_model()
    return {"message": "Model trained successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)