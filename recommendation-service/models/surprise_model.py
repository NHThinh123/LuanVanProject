from surprise import SVD, Dataset, Reader
from surprise.model_selection import train_test_split
from data.fetch_data import get_user_post_interactions, get_search_history, get_post_metadata, \
    calculate_keyword_relevance, get_following_users, get_user_interest_courses
import pickle
import os
import numpy as np
from concurrent.futures import ThreadPoolExecutor, as_completed
import asyncio

MODEL_PATH = "saved_models/surprise_model.pkl"


def train_surprise_model():
    df = get_user_post_interactions()
    reader = Reader(rating_scale=(0, 1))
    data = Dataset.load_from_df(df[["user_id", "post_id", "rating"]], reader)
    trainset, _ = train_test_split(data, test_size=0.2, random_state=42)

    # Tối ưu tham số SVD
    model = SVD(n_factors=20, n_epochs=20, lr_all=0.005, reg_all=0.02, random_state=42)
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


async def calculate_surprise_score(model, user_id, post_id, df):
    loop = asyncio.get_event_loop()
    if post_id in df["post_id"].unique():
        score = await loop.run_in_executor(None, lambda: model.predict(user_id, post_id).est)
        return (post_id, score)
    return (post_id, 0.5)


async def calculate_following_score(post_id, following_ids, post_metadata):
    loop = asyncio.get_event_loop()
    post = post_metadata[post_metadata["post_id"] == post_id]
    if post.empty:
        return (post_id, 0.0)
    post_user_id = post["user_id"].iloc[0]
    return (post_id, 1.0 if post_user_id in following_ids else 0.0)


async def calculate_course_score(post_id, interest_course_ids, post_metadata):
    loop = asyncio.get_event_loop()
    post = post_metadata[post_metadata["post_id"] == post_id]
    if post.empty or not post["course_id"].iloc[0]:
        return (post_id, 0.0)
    post_course_id = post["course_id"].iloc[0]
    return (post_id, 1.0 if post_course_id in interest_course_ids else 0.0)


async def get_surprise_recommendations(user_id, page=1, limit=10):
    model = load_surprise_model()
    df = get_user_post_interactions()
    post_metadata = get_post_metadata()
    all_posts = post_metadata["post_id"].tolist()
    print("All accepted posts:", all_posts)

    following_ids = set(get_following_users(user_id))  # Chuyển sang set để tìm kiếm nhanh hơn
    print("Following users for user", user_id, ":", following_ids)

    interest_course_ids = set(get_user_interest_courses(user_id))  # Chuyển sang set
    print("Interest courses for user", user_id, ":", interest_course_ids)

    keywords_with_time = get_search_history(user_id, limit=3)
    keywords = [item["keyword"] for item in keywords_with_time]
    print("Search history keywords for user", user_id, ":", keywords)

    # Song song hóa tính toán điểm số
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor(max_workers=4) as executor:
        # Tính điểm Surprise
        surprise_tasks = [
            loop.run_in_executor(None, lambda pid=post_id: model.predict(user_id, pid).est if pid in df[
                "post_id"].unique() else 0.5)
            for post_id in all_posts
        ]
        surprise_scores = [(post_id, score) for post_id, score in zip(all_posts, await asyncio.gather(*surprise_tasks))]

        # Tính điểm từ khóa
        keyword_tasks = [
            calculate_keyword_relevance(post_id, keywords_with_time, post_metadata)
            for post_id in all_posts
        ]
        keyword_scores = [(post_id, score) for post_id, score in zip(all_posts, await asyncio.gather(*keyword_tasks))]

        # Tính điểm theo dõi
        following_tasks = [
            calculate_following_score(post_id, following_ids, post_metadata)
            for post_id in all_posts
        ]
        following_scores = await asyncio.gather(*following_tasks)

        # Tính điểm môn học
        course_tasks = [
            calculate_course_score(post_id, interest_course_ids, post_metadata)
            for post_id in all_posts
        ]
        course_scores = await asyncio.gather(*course_tasks)

    # Kết hợp điểm
    combined_scores = []
    for post_id in all_posts:
        surprise_score = next((score for pid, score in surprise_scores if pid == post_id), 0.0)
        keyword_score = next((score for pid, score in keyword_scores if pid == post_id), 0.0)
        following_score = next((score for pid, score in following_scores if pid == post_id), 0.0)
        course_score = next((score for pid, score in course_scores if pid == post_id), 0.0)

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

    # Sắp xếp và phân trang
    combined_scores.sort(key=lambda x: x["combined_score"], reverse=True)
    start = (page - 1) * limit
    end = start + limit
    paginated_recommendations = combined_scores[start:end]
    total = len(combined_scores)

    debug_info = {
        "all_posts": all_posts,
        "keywords": keywords,
        "following_ids": list(following_ids),
        "interest_course_ids": list(interest_course_ids)
    }

    print("Final recommendations for user", user_id, ":", paginated_recommendations)
    print("Debug info:", debug_info)

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