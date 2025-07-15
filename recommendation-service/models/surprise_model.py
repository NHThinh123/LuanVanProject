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

    # Lấy tất cả bài viết có status="accepted"
    all_posts = post_metadata["post_id"].tolist()
    print("All accepted posts:", all_posts)  # Debug log

    keywords = get_search_history(user_id, limit=5)
    print("Search history keywords for user", user_id, ":", keywords)  # Debug log

    # Tính điểm Surprise cho bài viết
    surprise_scores = []
    for post_id in all_posts:
        if post_id in df["post_id"].unique():
            score = model.predict(user_id, post_id).est
        else:
            score = 0.5  # Điểm mặc định cho bài viết không có tương tác
        surprise_scores.append((post_id, score))

    # Tính điểm từ khóa
    keyword_scores = [(post_id, calculate_keyword_relevance(post_id, keywords, post_metadata)) for post_id in all_posts]

    # Kết hợp điểm
    combined_scores = []
    for post_id in all_posts:
        surprise_score = next((score for pid, score in surprise_scores if pid == post_id), 0.0)
        keyword_score = next((score for pid, score in keyword_scores if pid == post_id), 0.0)
        combined_score = 0.7 * surprise_score + 0.3 * keyword_score
        combined_scores.append({
            "post_id": post_id,
            "surprise_score": float(surprise_score),
            "keyword_score": float(keyword_score),
            "combined_score": float(combined_score)
        })

    # Sắp xếp theo combined_score giảm dần
    combined_scores.sort(key=lambda x: x["combined_score"], reverse=True)

    # Lấy top n bài viết
    result = combined_scores[:min(n, len(combined_scores))]

    # Tạo debug_info
    debug_info = {
        "all_posts": all_posts,
        "keywords": keywords
    }

    print("Final recommendations for user", user_id, ":", result)  # Debug log
    print("Debug info:", debug_info)  # Debug log

    return {
        "user_id": user_id,
        "recommendations": result,
        "debug_info": debug_info
    }