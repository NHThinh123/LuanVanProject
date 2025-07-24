import React, { useState, useEffect, useRef } from "react";
import { Card, Select, Row, Col, Tabs } from "antd";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useStatistics } from "../features/statistic/hooks/useStatistics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Option } = Select;

const AdminChartPage = () => {
  const [range, setRange] = useState(28);
  const [activeTab, setActiveTab] = useState("posts");
  const chartRefs = useRef({});

  const { statistics, isLoading, error } = useStatistics({
    range,
    tab: activeTab,
  });

  const createChartData = (data, label, color) => ({
    labels: data?.map((item) => item.date) || [],
    datasets: [
      {
        label,
        data: data?.map((item) => item.count) || [],
        backgroundColor: color,
      },
    ],
  });

  const calculateTotal = (data) => {
    return data?.reduce((sum, item) => sum + item.count, 0) || 0;
  };

  const charts = [
    {
      key: "posts",
      title: "Biểu đồ Bài viết",
      data: createChartData(
        statistics.posts,
        "Bài viết",
        "rgba(75, 192, 192, 0.6)"
      ),
      total: calculateTotal(statistics.posts),
      totalLabel: "Tổng số bài viết",
    },
    {
      key: "likes",
      title: "Biểu đồ Lượt thích",
      data: createChartData(
        statistics.likes,
        "Lượt thích",
        "rgba(255, 99, 132, 0.6)"
      ),
      total: calculateTotal(statistics.likes),
      totalLabel: "Tổng số lượt thích",
    },
    {
      key: "tags",
      title: "Biểu đồ Thẻ",
      data: createChartData(statistics.tags, "Thẻ", "rgba(54, 162, 235, 0.6)"),
      total: calculateTotal(statistics.tags),
      totalLabel: "Tổng số thẻ",
    },
    {
      key: "users",
      title: "Biểu đồ Người dùng",
      data: createChartData(
        statistics.users,
        "Người dùng",
        "rgba(153, 102, 255, 0.6)"
      ),
      total: calculateTotal(statistics.users),
      totalLabel: "Tổng số người dùng",
    },
  ];

  // Hủy instance Chart.js khi component unmount
  useEffect(() => {
    return () => {
      Object.values(chartRefs.current).forEach((chart) => {
        if (chart) {
          chart.destroy();
        }
      });
      chartRefs.current = {};
    };
  }, []);

  // Xử lý khi tab thay đổi
  const handleTabChange = (activeKey) => {
    setActiveTab(activeKey);
    Object.values(chartRefs.current).forEach((chart) => {
      if (chart) {
        chart.update();
      }
    });
  };

  const tabItems = charts.map((chart) => ({
    key: chart.key,
    label: chart.title,
    children: (
      <Card loading={isLoading}>
        <Row gutter={[16, 16]}>
          <Col
            span={24}
            style={{
              display: "flex",
              justifyContent: "end",
              flex: 1,
            }}
          >
            <Card
              style={{
                textAlign: "center",
                marginBottom: 16,
                backgroundColor: "#f0f2f5",
                padding: "4px 16px",
              }}
            >
              <h3>
                {chart.totalLabel}: {chart.total}
              </h3>
            </Card>
          </Col>
          <Col span={24}>
            <div style={{ height: "400px" }}>
              {chart.data.labels.length > 0 && !isLoading ? (
                <Bar
                  ref={(el) => {
                    if (el) {
                      chartRefs.current[chart.key] = el.chartInstance;
                    } else {
                      delete chartRefs.current[chart.key];
                    }
                  }}
                  key={`${chart.key}-${range}`}
                  data={chart.data}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                      title: { display: true, text: chart.title },
                    },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                  height={400}
                />
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    height: "400px",
                    lineHeight: "400px",
                  }}
                >
                  {isLoading
                    ? "Đang tải dữ liệu..."
                    : "Không có dữ liệu để hiển thị"}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card>
    ),
  }));

  return (
    <div>
      <Row gutter={[16, 16]} justify="center">
        <Col span={20}>
          <h1 style={{ marginBottom: 20 }}>Biểu đồ thống kê</h1>
          <Select
            defaultValue={28}
            onChange={(value) => setRange(value)}
            style={{ minWidth: 150 }}
          >
            <Option value={7}>7 ngày</Option>
            <Option value={28}>28 ngày</Option>
            <Option value={365}>365 ngày</Option>
          </Select>
        </Col>
      </Row>
      {error && (
        <div style={{ color: "red", marginTop: 20, textAlign: "center" }}>
          Lỗi: {error.message || "Không thể tải dữ liệu thống kê"}
        </div>
      )}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }} justify="center">
        <Col span={20}>
          <Tabs
            items={tabItems}
            onChange={handleTabChange}
            defaultActiveKey="posts"
            destroyOnHidden
          />
        </Col>
      </Row>
    </div>
  );
};

export default AdminChartPage;
