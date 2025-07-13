from surprise import SVD, Dataset, Reader
from surprise.model_selection import train_test_split
from data.fetch_data import get_user_post_interactions, get_search_history, get_post_metadata, \
    calculate_keyword_relevance
import pickle
import os
import numpy as np

MODEL_PATH = "saved_models/surprise_model.pkl"


def train_surprise_model():
    df = get_user_post_interactions()
    reader = Reader(rating_scale=(0, 1))
    data = Dataset.load_from_df(df[["user_id", "post_id", "rating"]], reader)

    trainset, _ = train_test_split(data, test_size=0.2, random_state=42)

    model = SVD(n_factors=50, random_state=42)
    model.fit(trainset)

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    return model


def load_surprise_model():
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            return pickle.load(f)
    return train_surprise_model()


def get_surprise_recommendations(user_id, n=10):
    model = load_surprise_model()
    df = get_user_post_interactions()
    post_metadata = get_post_metadata()

    all_posts = df["post_id"].unique()

    keywords = get_search_history(user_id, limit=5)

    surprise_scores = [(post_id, model.predict(user_id, post_id).est) for post_id in all_posts]

    keyword_scores = [(post_id, calculate_keyword_relevance(post_id, keywords, post_metadata)) for post_id in all_posts]

    combined_scores = []
    for post_id in all_posts:
        surprise_score = next((score for pid, score in surprise_scores if pid == post_id), 0.0)
        keyword_score = next((score for pid, score in keyword_scores if pid == post_id), 0.0)
        combined_score = 0.7 * surprise_score + 0.3 * keyword_score
        combined_scores.append((post_id, combined_score))

    combined_scores.sort(key=lambda x: x[1], reverse=True)

    top_n = min(n, len(combined_scores))
    half_n = top_n // 2

    surprise_top = [(post_id, score) for post_id, score in surprise_scores]
    surprise_top.sort(key=lambda x: x[1], reverse=True)
    surprise_top = surprise_top[:half_n]

    keyword_top = [(post_id, score) for post_id, score in keyword_scores]
    keyword_top.sort(key=lambda x: x[1], reverse=True)
    keyword_top = [item for item in keyword_top if item[0] not in [x[0] for x in surprise_top]]
    keyword_top = keyword_top[:top_n - half_n]

    final_recommendations = []
    for i in range(max(len(surprise_top), len(keyword_top))):
        if i < len(surprise_top):
            final_recommendations.append(surprise_top[i])
        if i < len(keyword_top):
            final_recommendations.append(keyword_top[i])

    result = []
    for post_id, _ in final_recommendations[:top_n]:
        combined_score = next((score for pid, score in combined_scores if pid == post_id), 0.0)
        result.append({"post_id": post_id, "score": float(combined_score)})

    return result