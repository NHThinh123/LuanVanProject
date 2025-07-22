import React, { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/auth.context";
import { useAuth } from "../features/auth/hooks/useAuth";
import { Link } from "react-router-dom";
import { Divider, Form, Layout, notification, Row, Typography } from "antd";
import logo from "../assets/Logo/Logo.png";
import BoxCustom from "../components/atoms/BoxCustom";
import ProfileForm from "../features/profile/components/templates/ProfileForm";
import { useUniversity } from "../features/university/hooks/useUniversity";
import { useMajor } from "../features/major/hooks/useMajor";
import { useCourses } from "../features/course/hooks/useCourses";
import AddNewModal from "../components/organisms/AddNewModal";

const InformationPage = () => {
  const { user, isLoading: authLoading } = useAuthContext();
  const {
    handleUpdateUser,
    isLoading: updateLoading,
    error: updateError,
  } = useAuth();
  const {
    university,
    setUniversity,
    universities,
    universitiesLoading,
    isModalVisible: isUniversityModalVisible,
    setNewUniversity,
    onSelect: onSelectUniversity,
    onSearch: onSearchUniversity,
    filterOptions: filterUniversityOptions,
    showModal: showUniversityModal,
    handleModalOk: handleUniversityModalOk,
    handleModalCancel: handleUniversityModalCancel,
    createUniversityLoading,
  } = useUniversity();
  const {
    major,
    setMajor,
    majors,
    majorsLoading,
    isModalVisible: isMajorModalVisible,
    setNewMajor,
    onSelect: onSelectMajor,
    onSearch: onSearchMajor,
    filterOptions: filterMajorOptions,
    showModal: showMajorModal,
    handleModalOk: handleMajorModalOk,
    handleModalCancel: handleMajorModalCancel,
    createMajorLoading,
  } = useMajor();
  const { courses, loading: coursesLoading, addCourse } = useCourses();
  const [form] = Form.useForm();
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    if (updateError) {
      notification.error({
        message: updateError.message || "Cập nhật thông tin thất bại",
        description: "Vui lòng kiểm tra lại thông tin và thử lại.",
      });
    }
  }, [updateError]);

  useEffect(() => {
    setSelectedCourses(
      user?.interested_courses?.map((course) => course.course_name) || []
    );
    form.setFieldsValue({
      name: user?.full_name || "",
      university: user?.university_id?.university_name || "",
      major: user?.major_id?.major_name || "",
      startYear: user?.start_year?.toString() || "Khác",
      courses:
        user?.interested_courses?.map((course) => course.course_name) || [],
    });
  }, [form, user]);

  const universityDropdownRender = (menu) => (
    <div>
      {menu}
      <Divider style={{ margin: "8px 0" }} />
      <Typography.Link
        onClick={showUniversityModal}
        style={{ display: "block", textAlign: "center" }}
      >
        Không có trường của bạn, Thêm mới?
      </Typography.Link>
    </div>
  );

  const majorDropdownRender = (menu) => (
    <div>
      {menu}
      <Divider style={{ margin: "8px 0" }} />
      <Typography.Link
        onClick={showMajorModal}
        style={{ display: "block", textAlign: "center" }}
      >
        Không có ngành của bạn, Thêm mới?
      </Typography.Link>
    </div>
  );

  const courseDropdownRender = (menu) => (
    <div>
      {menu}
      <Divider style={{ margin: "8px 0" }} />
      <Typography.Link
        onClick={showCourseModal}
        style={{ display: "block", textAlign: "center" }}
      >
        Không có khóa học của bạn, Thêm mới?
      </Typography.Link>
    </div>
  );

  const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);

  const showCourseModal = () => {
    setIsCourseModalVisible(true);
  };

  const handleCourseModalOk = (values) => {
    if (values.name?.trim()) {
      addCourse({ course_name: values.name, course_code: values.code || "" });
      const newCourses = [...selectedCourses, values.name];
      setSelectedCourses(newCourses);
      form.setFieldsValue({ courses: newCourses });
      setIsCourseModalVisible(false);
    }
  };

  const handleCourseModalCancel = () => {
    setIsCourseModalVisible(false);
  };

  const onFinish = (values) => {
    const selectedUniversity = universities.find(
      (uni) => uni.name === values.university
    );
    const selectedMajor = majors.find((maj) => maj.name === values.major);
    const selectedCourseIds = courses
      .filter((course) => values.courses?.includes(course.course_name))
      .map((course) => course._id);

    handleUpdateUser({
      full_name: values.name,
      university_id: selectedUniversity?.id,
      major_id: selectedMajor?.id,
      start_year:
        values.startYear === "Khác" ? null : parseInt(values.startYear),
      course_ids: selectedCourseIds,
    });
  };

  const onUniversityModalOk = (values) => {
    if (values.name?.trim()) {
      setNewUniversity(values.name);
      handleUniversityModalOk(values.name);
      form.setFieldsValue({ university: values.name });
      setUniversity(values.name);
    }
  };

  const onMajorModalOk = (values) => {
    if (values.name?.trim()) {
      setNewMajor(values.name);
      handleMajorModalOk(values.name);
      form.setFieldsValue({ major: values.name });
      setMajor(values.name);
    }
  };

  if (authLoading || universitiesLoading || majorsLoading || coursesLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Link
        to={"/"}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <img src={logo} alt="Logo" style={{ height: 48, marginRight: 16 }} />
      </Link>
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <BoxCustom
          style={{
            width: "500px",
            backgroundColor: "#fff",
          }}
        >
          <Typography.Title
            level={2}
            style={{ textAlign: "center", fontWeight: "bolder" }}
          >
            Thông tin cá nhân
          </Typography.Title>
          <ProfileForm
            form={form}
            user={user}
            onFinish={onFinish}
            updateLoading={updateLoading}
            universityProps={{
              university,
              onSelect: onSelectUniversity,
              onSearch: onSearchUniversity,
              filterOptions: filterUniversityOptions,
              dropdownRender: universityDropdownRender,
            }}
            majorProps={{
              major,
              onSelect: onSelectMajor,
              onSearch: onSearchMajor,
              filterOptions: filterMajorOptions,
              dropdownRender: majorDropdownRender,
            }}
            courseProps={{
              courses: selectedCourses,
              onChange: (value) => setSelectedCourses(value),
              options: courses.map((course) => ({
                value: course.course_name,
                label: course.course_name,
              })),
              dropdownRender: courseDropdownRender,
            }}
            showCourses
          />
        </BoxCustom>
      </Row>
      <AddNewModal
        title="Thêm trường học mới"
        visible={isUniversityModalVisible}
        onOk={onUniversityModalOk}
        onCancel={handleUniversityModalCancel}
        loading={createUniversityLoading}
        fields={[{ name: "name", label: "Tên trường học", required: true }]}
        minLength={3}
        maxLength={100}
      />
      <AddNewModal
        title="Thêm ngành học mới"
        visible={isMajorModalVisible}
        onOk={onMajorModalOk}
        onCancel={handleMajorModalCancel}
        loading={createMajorLoading}
        fields={[{ name: "name", label: "Tên ngành học", required: true }]}
        minLength={3}
        maxLength={100}
      />
      <AddNewModal
        title="Thêm khóa học mới"
        visible={isCourseModalVisible}
        onOk={handleCourseModalOk}
        onCancel={handleCourseModalCancel}
        loading={createMajorLoading}
        fields={[
          { name: "code", label: "Mã khóa học", required: false },
          { name: "name", label: "Tên khóa học", required: true },
        ]}
        minLength={3}
        maxLength={100}
      />
    </Layout>
  );
};

export default InformationPage;
