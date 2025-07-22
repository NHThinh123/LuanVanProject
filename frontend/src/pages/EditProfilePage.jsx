import React, { useEffect, useState } from "react";
import { Col, Divider, Form, notification, Row, Typography } from "antd";
import { useAuthContext } from "../contexts/auth.context";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useUniversity } from "../features/university/hooks/useUniversity";
import { useMajor } from "../features/major/hooks/useMajor";
import { useCourses } from "../features/course/hooks/useCourses";
import ProfileForm from "../features/profile/components/templates/ProfileForm";
import AddNewModal from "../components/organisms/AddNewModal";
import { useUserById } from "../features/user/hooks/useUserById";

const EditProfilePage = () => {
  const { user: current_user, isLoading: authLoading } = useAuthContext();
  const { user, isLoading: userLoading } = useUserById(current_user?._id);
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
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || null);
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Đồng bộ dữ liệu từ user
  useEffect(() => {
    setAvatarUrl(user?.avatar_url || null);
    setSelectedCourses(
      user?.interested_courses?.map((course) => course.course_name) || []
    );
    form.setFieldsValue({
      name: user?.full_name || "",
      university: user?.university_id?.university_name || "",
      major: user?.major_id?.major_name || "",
      startYear: user?.start_year?.toString() || "Khác",
      bio: user?.bio || "",
      courses:
        user?.interested_courses?.map((course) => course.course_name) || [],
    });
  }, [form, user]);

  useEffect(() => {
    if (updateError) {
      notification.error({
        message: "Lỗi",
        description: updateError.message,
      });
    }
  }, [updateError]);

  const universityDropdownRender = (menu) => (
    <div>
      {menu}
      <Divider style={{ margin: "8px 0" }} />
      <Typography.Link
        onClick={() => {
          showUniversityModal();
        }}
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
        onClick={() => {
          showMajorModal();
        }}
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
        onClick={() => {
          showCourseModal();
        }}
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
    if (values.name.trim()) {
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

    if (!user?._id) {
      notification.error({
        message: "Lỗi",
        description: "Không tìm thấy thông tin người dùng",
      });
      return;
    }

    const updateData = {
      full_name: values.name,
      university_id: selectedUniversity?.id,
      major_id: selectedMajor?.id,
      start_year:
        values.startYear === "Khác" ? null : parseInt(values.startYear),
      bio: values.bio,
      course_ids: selectedCourseIds,
    };

    if (avatarUrl) {
      updateData.avatar_url = avatarUrl;
    }

    handleUpdateUser(updateData);
  };

  const onUniversityModalOk = (values) => {
    if (values.name.trim()) {
      setNewUniversity(values.name);
      handleUniversityModalOk(values.name);
      form.setFieldsValue({ university: values.name });
      setUniversity(values.name);
    }
  };

  const onMajorModalOk = (values) => {
    if (values.name.trim()) {
      setNewMajor(values.name);
      handleMajorModalOk(values.name);
      form.setFieldsValue({ major: values.name });
      setMajor(values.name);
    }
  };

  if (
    authLoading ||
    universitiesLoading ||
    majorsLoading ||
    coursesLoading ||
    userLoading
  ) {
    return <div>Đang tải...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", padding: "24px" }}>
      <Typography.Title level={3} style={{ textAlign: "center" }}>
        Thông tin cá nhân
      </Typography.Title>
      <Row justify="center" align="middle">
        <Col span={24}>
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
            showAvatar
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            showBio
            showCourses
          />
        </Col>
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
          { name: "name", label: "Tên khóa học", required: true },
          { name: "code", label: "Mã khóa học", required: false },
        ]}
        minLength={3}
        maxLength={100}
      />
    </div>
  );
};

export default EditProfilePage;
