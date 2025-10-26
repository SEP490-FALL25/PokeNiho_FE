import React, { useState, useEffect } from 'react';
import { useQuestionBank } from '@hooks/useQuestionBank';
import { QUESTION_TYPE_LABELS, JLPT_LEVEL_LABELS, QuestionType, JLPTLevel } from '@constants/questionBank';
import { QuestionEntityType } from '@models/questionBank/entity';
import PaginationControls from '@ui/PaginationControls';

const QuestionBankManagement: React.FC = () => {
  const {
    questions,
    pagination,
    isLoading,
    filters,
    formData,
    isCreateDialogOpen,
    isEditDialogOpen,
    deleteQuestionId,
    isCreating,
    isUpdating,
    isDeleting,
    handleFilterChange,
    handlePageChange,
    handleCreateQuestion,
    handleEditQuestion,
    handleDeleteQuestion,
    openCreateDialog,
    openEditDialog,
    closeDialogs,
    setFormData,
    setDeleteQuestionId,
    getQuestionTypeLabel,
    getJLPTLevelLabel
  } = useQuestionBank();

  // Local state for search input with debounce
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFilterChange('search', searchInput);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchInput, handleFilterChange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Ngân hàng Câu hỏi</h1>
          <p className="text-gray-600">Quản lý và tổ chức các câu hỏi cho bài học</p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={filters.levelN?.toString() || ''}
                onChange={(e) => handleFilterChange('levelN', e.target.value ? parseInt(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả cấp độ</option>
                {Object.entries(JLPT_LEVEL_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <select
                value={filters.questionType || ''}
                onChange={(e) => handleFilterChange('questionType', e.target.value || undefined)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả loại câu hỏi</option>
                {Object.entries(QUESTION_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={openCreateDialog}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <span className="mr-2">+</span>
              Thêm câu hỏi
            </button>
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Câu hỏi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cấp độ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phiên âm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nghĩa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center">Đang tải...</td>
                  </tr>
                ) : questions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center">Không có câu hỏi nào</td>
                  </tr>
                ) : (
                  questions.map((question: QuestionEntityType) => (
                    <tr key={question.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{question.questionJp}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getQuestionTypeLabel(question.questionType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {getJLPTLevelLabel(question.levelN)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{question.pronunciation}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{question.meaning}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(question.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditDialog(question)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => setDeleteQuestionId(question.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPage > 1 && (
            <div className="mt-6">
              <PaginationControls
                currentPage={pagination.current}
                totalPages={pagination.totalPage}
                totalItems={pagination.totalItem}
                itemsPerPage={pagination.pageSize}
                onPageChange={handlePageChange}
                onItemsPerPageChange={(size) => handleFilterChange('limit', size)}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>

        {/* Create/Edit Dialog */}
        {(isCreateDialogOpen || isEditDialogOpen) && (
          <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {isCreateDialogOpen ? 'Thêm câu hỏi mới' : 'Chỉnh sửa câu hỏi'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Câu hỏi tiếng Nhật</label>
                  <input
                    type="text"
                    value={formData.questionJp}
                    onChange={(e) => setFormData(prev => ({ ...prev, questionJp: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại câu hỏi</label>
                    <select
                      value={formData.questionType}
                      onChange={(e) => setFormData(prev => ({ ...prev, questionType: e.target.value as QuestionType }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(QUESTION_TYPE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cấp độ JLPT</label>
                    <select
                      value={formData.levelN}
                      onChange={(e) => setFormData(prev => ({ ...prev, levelN: parseInt(e.target.value) as JLPTLevel }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(JLPT_LEVEL_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phiên âm</label>
                  <input
                    type="text"
                    value={formData.pronunciation}
                    onChange={(e) => setFormData(prev => ({ ...prev, pronunciation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nghĩa</label>
                  <textarea
                    value={formData.meaning}
                    onChange={(e) => setFormData(prev => ({ ...prev, meaning: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeDialogs}
                    className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={isCreateDialogOpen ? handleCreateQuestion : handleEditQuestion}
                    disabled={isCreating || isUpdating}
                    className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating || isUpdating ? 'Đang xử lý...' : (isCreateDialogOpen ? 'Tạo câu hỏi' : 'Cập nhật')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteQuestionId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeleteQuestionId(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteQuestion}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBankManagement;
