from fastapi import FastAPI
from models.surprise_model import get_surprise_recommendations, train_surprise_model
# from models.lightfm_model import get_lightfm_recommendations, train_lightfm_model
import uvicorn

app = FastAPI()

@app.get("/recommendations/surprise/{user_id}")
async def get_surprise_recommendations_endpoint(user_id: str, n: int = 10):
    recommendations = get_surprise_recommendations(user_id, n)
    return {"recommendations": recommendations}

# @app.get("/recommendations/lightfm/{user_id}")
# async def get_lightfm_recommendations_endpoint(user_id: str, n: int = 10):
#     recommendations = get_lightfm_recommendations(user_id, n)
#     return {"recommendations": recommendations}

@app.post("/train/surprise")
async def train_surprise_endpoint():
    train_surprise_model()
    return {"message": "Surprise model trained successfully"}

# @app.post("/train/lightfm")
# async def train_lightfm_endpoint():
#     train_lightfm_model()
#     return {"message": "LightFM model trained successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)