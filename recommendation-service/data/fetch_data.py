from bson import ObjectId
from pymongo import MongoClient
import pandas as pd
from dotenv import load_dotenv
import os
from fuzzywuzzy import fuzz
from datetime import datetime

load_dotenv()

def get_user_post_interactions():
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client.get_database()
    collection = db["user_like_posts"]

    # Lấy dữ liệu tương tác
    interactions = collection.find({}, {"user_id": 1, "post_id": 1, "_id": 0})
    data = [(str(interaction["user_id"]), str(interaction["post_id"]), 1) for interaction in interactions]

    # Chuyển thành DataFrame
    df = pd.DataFrame(data, columns=["user_id", "post_id", "rating"])
    return df

def get_search_history(user_id, limit=3):
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client.get_database()
    collection = db["search_histories"]

    # Lấy 3 lịch sử tìm kiếm gần nhất với cả keyword và createdAt
    history = collection.find({"user_id": ObjectId(user_id)}).sort("createdAt", -1).limit(limit)
    keywords = [{"keyword": item["keyword"], "createdAt": item["createdAt"]} for item in history]
    return keywords

def get_post_metadata():
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client.get_database()
    collection = db["posts"]

    # Lấy tiêu đề, nội dung, user_id và course_id của bài viết
    posts = collection.find({"status": "accepted"}, {"_id": 1, "title": 1, "content": 1, "user_id": 1, "course_id": 1})
    data = [(str(post["_id"]), post["title"], post["content"], str(post["user_id"]), str(post.get("course_id", ""))) for post in posts]

    # Chuyển thành DataFrame
    df = pd.DataFrame(data, columns=["post_id", "title", "content", "user_id", "course_id"])
    return df

def get_following_users(user_id):
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client.get_database()
    collection = db["userfollows"]

    # Lấy danh sách user_follow_id
    following = collection.find({"user_id": ObjectId(user_id)}, {"user_follow_id": 1, "_id": 0})
    following_ids = [str(item["user_follow_id"]) for item in following]
    return following_ids

def get_user_interest_courses(user_id):
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client.get_database()
    collection = db["user_interest_courses"]

    # Lấy danh sách course_id từ user_interest_courses
    courses = collection.find({"user_id": ObjectId(user_id)}, {"course_id": 1, "_id": 0})
    course_ids = [str(item["course_id"]) for item in courses]
    return course_ids

def calculate_keyword_relevance(post_id, keywords_with_time, post_metadata):
    # Tìm bài viết trong metadata
    post = post_metadata[post_metadata["post_id"] == post_id]
    if post.empty:
        return 0.0

    title = post["title"].iloc[0] or ""
    content = post["content"].iloc[0] or ""
    text = f"{title} {content}".lower()

    # Tính điểm liên quan dựa trên fuzzy matching và trọng số thời gian
    max_score = 0.0
    current_time = datetime.utcnow()

    for index, item in enumerate(keywords_with_time):
        keyword = item["keyword"]
        created_at = item["createdAt"]

        # Tính điểm fuzzy matching
        score = fuzz.partial_ratio(keyword.lower(), text)

        # Tính trọng số thời gian (từ khóa mới nhất có trọng số cao nhất)
        time_diff = (current_time - created_at).total_seconds() / (24 * 3600)  # Chuyển thành số ngày
        time_weight = max(0.1, 1.0 - (index * 0.2))  # Trọng số giảm dần: 1.0, 0.8, 0.6, ...

        # Kết hợp điểm fuzzy và trọng số thời gian
        weighted_score = score * time_weight
        max_score = max(max_score, weighted_score)

    # Chuẩn hóa điểm số về [0, 1]
    return max_score / 100.0