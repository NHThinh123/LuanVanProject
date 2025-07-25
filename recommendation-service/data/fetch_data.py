from bson import ObjectId
from pymongo import MongoClient
import pandas as pd
from dotenv import load_dotenv
import os
from fuzzywuzzy import fuzz
from datetime import datetime
from collections import defaultdict

load_dotenv()

# Kết nối MongoDB chung
client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_database()

# Bộ nhớ đệm trong phiên
keyword_cache = defaultdict(dict)

def get_user_post_interactions():
    collection = db["user_like_posts"]
    # Chỉ lấy các trường cần thiết
    interactions = collection.find({}, {"user_id": 1, "post_id": 1, "_id": 0})
    data = [(str(interaction["user_id"]), str(interaction["post_id"]), 1) for interaction in interactions]
    return pd.DataFrame(data, columns=["user_id", "post_id", "rating"])

def get_search_history(user_id, limit=3):
    collection = db["search_histories"]
    history = collection.find(
        {"user_id": ObjectId(user_id)},
        {"keyword": 1, "createdAt": 1, "_id": 0}
    ).sort("createdAt", -1).limit(limit)
    return [{"keyword": item["keyword"], "createdAt": item["createdAt"]} for item in history]

def get_post_metadata():
    collection = db["posts"]
    posts = collection.find(
        {"status": "accepted"},
        {"_id": 1, "title": 1, "content": 1, "user_id": 1, "course_id": 1}
    )
    data = [(str(post["_id"]), post.get("title", ""), post.get("content", ""),
             str(post["user_id"]), str(post.get("course_id", ""))) for post in posts]
    return pd.DataFrame(data, columns=["post_id", "title", "content", "user_id", "course_id"])

def get_following_users(user_id):
    collection = db["userfollows"]
    following = collection.find(
        {"user_id": ObjectId(user_id)},
        {"user_follow_id": 1, "_id": 0}
    )
    return [str(item["user_follow_id"]) for item in following]

def get_user_interest_courses(user_id):
    collection = db["user_interest_courses"]
    courses = collection.find(
        {"user_id": ObjectId(user_id)},
        {"course_id": 1, "_id": 0}
    )
    return [str(item["course_id"]) for item in courses]

async def calculate_keyword_relevance(post_id, keywords_with_time, post_metadata):
    # Kiểm tra bộ nhớ đệm trong phiên
    cache_key = f"{post_id}:{repr(keywords_with_time)}"
    if cache_key in keyword_cache:
        return keyword_cache[cache_key]

    post = post_metadata[post_metadata["post_id"] == post_id]
    if post.empty:
        return 0.0

    title = post["title"].iloc[0] or ""
    content = post["content"].iloc[0] or ""
    text = f"{title} {content}".lower()

    max_score = 0.0
    current_time = datetime.utcnow()

    for index, item in enumerate(keywords_with_time):
        keyword = item["keyword"].lower()
        created_at = item["createdAt"]
        # Tối ưu fuzzy matching bằng cách giới hạn độ dài văn bản
        score = fuzz.partial_ratio(keyword, text[:1000])
        time_diff = (current_time - created_at).total_seconds() / (24 * 3600)
        time_weight = max(0.1, 1.0 - (index * 0.2))
        weighted_score = score * time_weight
        max_score = max(max_score, weighted_score)

    result = max_score / 100.0
    keyword_cache[cache_key] = result  # Lưu vào bộ nhớ đệm
    return result

def ensure_indexes():
    db["user_like_posts"].create_index([("user_id", 1), ("post_id", 1)])
    db["search_histories"].create_index([("user_id", 1), ("createdAt", -1)])
    db["posts"].create_index([("status", 1)])
    db["userfollows"].create_index([("user_id", 1)])
    db["user_interest_courses"].create_index([("user_id", 1)])

# Gọi hàm tạo chỉ mục khi khởi động
ensure_indexes()