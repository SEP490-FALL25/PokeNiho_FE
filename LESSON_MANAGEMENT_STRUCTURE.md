# 🎓 Lesson Management System Structure

## 📋 Tổng quan hệ thống

Hệ thống quản lý bài học được thiết kế theo mô hình phân cấp rõ ràng:

```
📚 Lesson Management
├── 📖 Lessons (Quản lý bài học chính)
├── 📝 Content (Nội dung bài học) 
├── 🎯 Exercises (Bài tập)
├── 📋 Question Sets (Bộ đề)
└── ❓ Questions (Ngân hàng câu hỏi)
```

## 🏗️ Cấu trúc phân cấp

### 1. **📖 Lessons (Bài học)**
- **Mục đích**: Quản lý bài học chính
- **Thông tin**: Title, Level JLPT, Thời gian ước tính, Trạng thái
- **Actions**: View, Edit, Delete, Publish, Copy

### 2. **📝 Content (Nội dung bài học)**
- **Mục đích**: Quản lý nội dung multimedia cho bài học
- **Loại nội dung**: Video, Audio, Document, Text, Image
- **Thông tin**: Size, Duration, Type, Status
- **Actions**: Upload, Preview, Edit, Delete

### 3. **🎯 Exercises (Bài tập)**
- **Mục đích**: Quản lý các bài tập trong bài học
- **Loại bài tập**: Multiple Choice, Fill in Blank, Listening, Speaking
- **Thông tin**: Difficulty, Question Count, Estimated Time
- **Actions**: Create, Edit, Preview, Assign to Lesson

### 4. **📋 Question Sets (Bộ đề)**
- **Mục đích**: Quản lý các bộ đề trong bài tập
- **Thông tin**: Question Count, Difficulty, Randomization
- **Actions**: Create from Question Bank, Preview, Edit

### 5. **❓ Questions (Ngân hàng câu hỏi)**
- **Mục đích**: Quản lý tất cả câu hỏi
- **Loại câu hỏi**: Multiple Choice, Fill in Blank, True/False, Matching
- **Thông tin**: Topic, Level, Points, Difficulty
- **Actions**: Create, Edit, Categorize, Bulk Operations

## 🔄 Workflow

```
1. Tạo bài học → 2. Thêm nội dung → 3. Tạo bài tập → 4. Tạo bộ đề → 5. Thêm câu hỏi
```

## 🔗 Data Relationships

### **Hierarchy Structure:**
```
📚 Lesson (Bài học)
├── 📝 Content (Nội dung) - belongs to Lesson
├── 🎯 Exercise (Bài tập) - belongs to Lesson
    └── 📋 Question Set (Bộ đề) - belongs to Exercise
        └── ❓ Question (Câu hỏi) - belongs to Question Set
```

### **Relationship Display:**
- **Content**: Hiển thị bài học nào (Lesson Title + JLPT Level)
- **Exercises**: Hiển thị bài học nào (Lesson Title + JLPT Level)  
- **Question Sets**: Hiển thị bài tập nào + bài học nào (Exercise → Lesson)
- **Questions**: Hiển thị bộ đề nào + bài tập nào + bài học nào (Question Set → Exercise → Lesson)

### **Visual Indicators:**
- 🏷️ **Badges**: JLPT Level, Type, Difficulty, Status
- 🔗 **Breadcrumbs**: Lesson → Exercise → Question Set
- 🎨 **Color coding**: Blue (Lesson), Green (Exercise), Purple (Question Set)

## 🎨 UI/UX Features

### Navigation
- **Tab-based navigation** cho 5 trang chính
- **Breadcrumb navigation** để theo dõi vị trí
- **Quick actions** để chuyển nhanh giữa các phần

### Filtering & Search
- **Search** theo tên, nội dung
- **Filter** theo type, difficulty, status
- **Sort** theo date, name, points

### Statistics
- **Dashboard cards** hiển thị thống kê
- **Real-time data** cho từng section
- **Progress tracking** cho completion rates

## 📁 File Structure

```
src/pages/AdminPage/Lesson/
├── Management/           # Trang chính với tabs (TẤT CẢ TRONG MỘT TRANG)
│   ├── LessonContent/    # Component cho tab Content
│   ├── Exercises/        # Component cho tab Exercises  
│   ├── QuestionSets/    # Component cho tab Question Sets
│   └── QuestionBank/    # Component cho tab Questions
└── LessonTypes/         # Loại bài học (riêng biệt)
```

## 🚀 Single Route Architecture

**Chỉ sử dụng 1 route duy nhất:**
- `/admin/lessons/management` - Trang chính với 5 tabs

**Không cần multiple routes vì:**
- Tất cả được tích hợp trong 1 trang
- Navigation bằng tabs thay vì routes
- Consistent UI/UX
- Dễ quản lý và maintain

## 🚀 Tính năng chính

### 1. **Unified Management**
- Tất cả trong một trang với tab navigation
- Breadcrumb để điều hướng
- Consistent UI/UX across all sections

### 2. **Smart Filtering**
- Filter theo multiple criteria
- Search across all content types
- Sort by various fields

### 3. **Bulk Operations**
- Select multiple items
- Bulk edit, delete, publish
- Import/Export functionality

### 4. **Real-time Updates**
- Live statistics
- Progress tracking
- Status updates

## 🔧 Technical Implementation

### Components
- **Tabs**: Navigation between sections
- **Cards**: Display items with actions
- **Filters**: Search and filter controls
- **Breadcrumb**: Navigation context
- **Stats**: Dashboard metrics

### State Management
- Local state for each section
- Shared state for navigation
- API integration for data

### Routing
- Separate routes for each section
- Deep linking support
- Navigation history

## 📊 Data Flow

```
API → Hooks → Components → UI
  ↓
State Management
  ↓
User Actions
  ↓
API Updates
```

## 🎯 Benefits

1. **Centralized Management**: Tất cả trong một nơi
2. **Clear Hierarchy**: Cấu trúc rõ ràng, dễ hiểu
3. **Efficient Workflow**: Workflow tối ưu cho content creation
4. **Scalable**: Dễ dàng mở rộng thêm tính năng
5. **User-friendly**: UI/UX thân thiện, dễ sử dụng

## 🔮 Future Enhancements

- **AI-powered content suggestions**
- **Automated question generation**
- **Advanced analytics**
- **Collaborative editing**
- **Version control**
- **Content templates**
