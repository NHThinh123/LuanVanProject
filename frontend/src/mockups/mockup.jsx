export const topics = [
  "Dành cho bạn",
  "Đang theo dõi",
  "Tân sinh viên",
  "Công nghệ thông tin",
  "Kinh nghiệm học tập",
  "Khác",
];

export const searchHistory = [
  "Lập trình web",
  "Học máy",
  "Phát triển ứng dụng di động",
  "Thiết kế UX/UI",
  "Khoa học dữ liệu",
];

export const user = {
  name: "Colin Myers",
  avatar: "https://bom.edu.vn/upload/2025/03/hinh-anh-dai-dien-dep-1.webp",
  followers: 1200,
  following: 300,
  bio: "Software developer and tech enthusiast. Sharing insights on coding, AI, and the future of technology.",
  postCount: 50,
  joinDate: "2023-01-15",
};
export const posts = [
  {
    id: 1,
    title: "Xcode 26 is here, with Code Intelligence",
    content: "How does it stack up against Cursor and AI Agent-based workflow?",
    image:
      "https://cdn.tgdd.vn/Files/2018/09/14/1117277/tri-tue-nhan-tao-ai-la-gi-ung-dung-nhu-the-nao-trong-cuoc-song--6.jpg",
    likes: 309,
    comments: 10,
    date: "2d ago",
    author: {
      name: "Colin Myers",
      avatar:
        "https://i.pinimg.com/736x/6e/af/1a/6eaf1a844ae4b6fa6eeb6ff17f468cc0.jpg",
    },
  },
  {
    id: 2,
    title:
      "Why clients pay me 10x more than developers who are better at coding than me",
    content:
      "Last week I charged $15,000 for work a better coder would do for $1,500 and I think you should learn these skills now that we have AI to do the coding for us.",
    image:
      "https://parametric-architecture.com/wp-content/uploads/2024/01/What-is-AI-web.jpg",
    likes: 3900,
    comments: 61,
    date: "Jun 2",
    author: {
      name: "Giulio Serafini",
      avatar: "https://m.yodycdn.com/blog/anh-dai-dien-hai-yodyvn77.jpg",
    },
  },
];

export const postPopular = [
  {
    id: 1,
    title: "Are You Closer to Podcasters Than Your Friends?",
    date: "Jun 4",
    author: {
      name: "Colin Myers",
      avatar: "https://m.yodycdn.com/blog/anh-dai-dien-hai-yodyvn77.jpg",
    },
  },
  {
    id: 2,
    title:
      "Struggling To Make Up My Mind on the Over-Commercialization of Pride",
    date: "3d ago",
    author: {
      name: "Giulio Serafini",
      avatar: "https://bom.edu.vn/upload/2025/03/hinh-anh-dai-dien-dep-1.webp",
    },
  },
  {
    id: 3,
    title:
      "Want to just start writing? Join the 'Write with Medium' June micro-challenge",
    date: "Jun 3",
    author: {
      name: "Colin Myers",
      avatar: "https://m.yodycdn.com/blog/anh-dai-dien-hai-yodyvn77.jpg",
    },
  },
];

export const featuredUser = [
  {
    name: "Colin Myers",
    avatar: "https://bom.edu.vn/upload/2025/03/hinh-anh-dai-dien-dep-1.webp",
    followers: 1200,
    bio: "Software developer and tech enthusiast. Sharing insights on coding, AI, and the future of technology. Passionate about open-source projects and community building. Loves to explore new technologies and share knowledge with others.",
  },
  {
    name: "Giulio Serafini",
    avatar:
      "https://i.pinimg.com/736x/6e/af/1a/6eaf1a844ae4b6fa6eeb6ff17f468cc0.jpg",
    followers: 950,
    bio: "Tech entrepreneur and AI advocate. Passionate about building innovative solutions that make a difference.",
  },
];

export const postDetail = {
  id: 1,
  title:
    "Why clients pay me 10x more than developers who are better at coding than me",
  content:
    "How does it stack up against Cursor and AI Agent-based workflow? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  image:
    "https://cdn.tgdd.vn/Files/2018/09/14/1117277/tri-tue-nhan-tao-ai-la-gi-ung-dung-nhu-the-nao-trong-cuoc-song--6.jpg",
  author: {
    name: "Giulio Serafini",
    avatar: "https://m.yodycdn.com/blog/anh-dai-dien-hai-yodyvn77.jpg",
    followers: 950,
  },
  likeCounts: 309,
  commentCounts: 10,
  comments: [
    {
      id: 1,
      author: {
        name: "John Doe",
        avatar:
          "https://i.pinimg.com/736x/d0/eb/c7/d0ebc736a1a914c333814ab7a64182c0.jpg",
        followers: 150,
      },
      content: "Great post! Really enjoyed reading it.",
      likeCounts: 5,
      date: "1d ago",
      replyCounts: 2,
    },
    {
      id: 2,
      author: {
        name: "Jane Smith",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQJZScF5xB5GB_KwsKfT2TKhrhQz3kLrOWcmoEy9fDzpPQwi_-Rc_OhgXOqljJtmwHGF4&usqp=CAU",
        followers: 200,
      },
      content: "I found this very insightful, thanks for sharing!",
      likeCounts: 10,
      replyCounts: 1,
      date: "2d ago",
    },
  ],
  date: "2d ago",
};
