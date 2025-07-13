from pymongo import MongoClient
import pandas as pd
from dotenv import load_dotenv
import os
from fuzzywuzzy import fuzz

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


def get_search_history(user_id, limit=5):
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client.get_database()
    collection = db["search_history"]

    # Lấy lịch sử tìm kiếm gần nhất
    history = collection.find({"user_id": user_id}).sort("createdAt", -1).limit(limit)
    keywords = [item["keyword"] for item in history]
    return keywords


def get_post_metadata():
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client.get_database()
    collection = db["posts"]

    # Lấy tiêu đề và nội dung bài viết
    posts = collection.find({}, {"_id": 1, "title": 1, "content": 1})
    data = [(str(post["_id"]), post["title"], post["content"]) for post in posts]

    # Chuyển thành DataFrame
    df = pd.DataFrame(data, columns=["post_id", "title", "content"])
    return df


def calculate_keyword_relevance(post_id, keywords, post_metadata):
    # Tìm bài viết trong metadata
    post = post_metadata[post_metadata["post_id"] == post_id]
    if post.empty:
        return 0.0

    title = post["title"].iloc[0] or ""
    content = post["content"].iloc[0] or ""
    text = f"{title} {content}".lower()

    # Tính điểm liên quan dựa trên fuzzy matching
    max_score = 0
    for keyword in keywords:
        score = fuzz.partial_ratio(keyword.lower(), text)
        max_score = max(max_score, score)

    # Chuẩn hóa điểm số về [0, 1]
    return max_score / 100.0