from lightfm import LightFM
from scipy.sparse import coo_matrix
from data.fetch_data import get_user_post_interactions
import numpy as np
import pickle
import os

MODEL_PATH = "saved_models/lightfm_model.pkl"


def train_lightfm_model():
    df = get_user_post_interactions()

    # Tạo ánh xạ user_id và post_id sang số nguyên
    user_id_map = {id: idx for idx, id in enumerate(df["user_id"].unique())}
    post_id_map = {id: idx for idx, id in enumerate(df["post_id"].unique())}

    # Tạo ma trận tương tác
    user_codes = df["user_id"].map(user_id_map)
    post_codes = df["post_id"].map(post_id_map)
    interactions = coo_matrix((df["rating"], (user_codes, post_codes)))

    # Huấn luyện mô hình
    model = LightFM(loss="warp", random_state=42)
    model.fit(interactions, epochs=30, num_threads=4)

    # Lưu mô hình và ánh xạ
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump((model, user_id_map, post_id_map), f)

    return model, user_id_map, post_id_map


def load_lightfm_model():
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            return pickle.load(f)
    return train_lightfm_model()


def get_lightfm_recommendations(user_id, n=10):
    model, user_id_map, post_id_map = load_lightfm_model()
    df = get_user_post_interactions()

    if user_id not in user_id_map:
        return []  # Xử lý cold start

    # Lấy user_code
    user_code = user_id_map[user_id]

    # Dự đoán
    scores = model.predict(user_code, np.arange(len(post_id_map)))
    top_indices = np.argsort(-scores)[:n]

    # Chuyển lại post_id gốc
    post_id_map = {v: k for k, v in post_id_map.items()}
    return [post_id_map[i] for i in top_indices]