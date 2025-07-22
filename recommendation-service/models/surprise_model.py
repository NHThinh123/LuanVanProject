from surprise import SVD, Dataset, Reader
from surprise.model_selection import train_test_split
from data.fetch_data import get_user_post_interactions, get_search_history, get_post_metadata, \
    calculate_keyword_relevance, get_following_users, get_user_interest_courses
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


def get_surprise_recommendations(user_id, page=1, limit=10):
    model = load_surprise_model()
    df = get_user_post_interactions()
    post_metadata = get_post_metadata()

    # Lấy tất cả bài viết có status="accepted"
    all_posts = post_metadata["post_id"].tolist()
    print("All accepted posts:", all_posts)  # Debug log

    # Lấy danh sách người dùng đang theo dõi
    following_ids = get_following_users(user_id)
    print("Following users for user", user_id, ":", following_ids)  # Debug log

    # Lấy danh sách môn học yêu thích
    interest_course_ids = get_user_interest_courses(user_id)
    print("Interest courses for user", user_id, ":", interest_course_ids)  # Debug log

    # Lấy lịch sử tìm kiếm kèm thời gian
    keywords_with_time = get_search_history(user_id, limit=3)
    keywords = [item["keyword"] for item in keywords_with_time]
    print("Search history keywords for user", user_id, ":", keywords)  # Debug log

    # Tính điểm Surprise cho bài viết
    surprise_scores = []
    for post_id in all_posts:
        if post_id in df["post_id"].unique():
            score = model.predict(user_id, post_id).est
        else:
            score = 0.5
        surprise_scores.append((post_id, score))

    # Tính điểm từ khóa
    keyword_scores = [(post_id, calculate_keyword_relevance(post_id, keywords_with_time, post_metadata)) for post_id in
                      all_posts]

    # Tính điểm theo dõi
    following_scores = []
    for post_id in all_posts:
        post = post_metadata[post_metadata["post_id"] == post_id]
        if post.empty:
            following_score = 0.0
        else:
            post_user_id = post["user_id"].iloc[0]
            following_score = 1.0 if post_user_id in following_ids else 0.0
        following_scores.append((post_id, following_score))

    # Tính điểm môn học yêu thích
    course_scores = []
    for post_id in all_posts:
        post = post_metadata[post_metadata["post_id"] == post_id]
        if post.empty or not post["course_id"].iloc[0]:
            course_score = 0.0
        else:
            post_course_id = post["course_id"].iloc[0]
            course_score = 1.0 if post_course_id in interest_course_ids else 0.0
        course_scores.append((post_id, course_score))

    # Kết hợp điểm và nhân trọng số
    combined_scores = []
    for post_id in all_posts:
        surprise_score = next((score for pid, score in surprise_scores if pid == post_id), 0.0)
        keyword_score = next((score for pid, score in keyword_scores if pid == post_id), 0.0)
        following_score = next((score for pid, score in following_scores if pid == post_id), 0.0)
        course_score = next((score for pid, score in course_scores if pid == post_id), 0.0)

        # Nhân trọng số cho từng điểm số
        weighted_surprise = 0.6 * surprise_score
        weighted_keyword = 0.2 * keyword_score
        weighted_following = 0.1 * following_score
        weighted_course = 0.1 * course_score
        combined_score = weighted_surprise + weighted_keyword + weighted_following + weighted_course

        combined_scores.append({
            "post_id": post_id,
            "surprise_score": float(weighted_surprise),
            "keyword_score": float(weighted_keyword),
            "following_score": float(weighted_following),
            "course_score": float(weighted_course),
            "combined_score": float(combined_score)
        })

    # Sắp xếp theo combined_score giảm dần
    combined_scores.sort(key=lambda x: x["combined_score"], reverse=True)

    # Phân trang
    start = (page - 1) * limit
    end = start + limit
    paginated_recommendations = combined_scores[start:end]

    # Lấy tổng số bài viết
    total = len(combined_scores)

    # Dữ liệu trả về
    debug_info = {
        "all_posts": all_posts,
        "keywords": keywords,
        "following_ids": following_ids,
        "interest_course_ids": interest_course_ids
    }

    print("Final recommendations for user", user_id, ":", paginated_recommendations)  # Debug log
    print("Debug info:", debug_info)  # Debug log

    return {
        "user_id": user_id,
        "recommendations": paginated_recommendations,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit
        },
        "debug_info": debug_info
    }