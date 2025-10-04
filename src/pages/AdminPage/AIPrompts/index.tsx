"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card"
import { Badge } from "@ui/Badge"
import { Brain, Plus, Search, Edit, Trash2, Copy, Play, FileText, MessageSquare, Sparkles } from "lucide-react"

export default function AIPromptManagement() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null)

    const prompts = [
        {
            id: 1,
            name: "Trợ giúp học từ vựng",
            category: "vocabulary",
            description: "AI giúp học viên ghi nhớ từ vựng tiếng Nhật thông qua Pokemon",
            prompt:
                "Bạn là trợ lý học tiếng Nhật. Hãy giúp học viên ghi nhớ từ vựng bằng cách liên kết với Pokemon. Ví dụ: ピカチュウ (Pikachu) có 'ピカ' nghĩa là lấp lánh, phù hợp với Pokemon điện.",
            usageCount: 1234,
            status: "active",
            lastUsed: "2024-03-15",
        },
        {
            id: 2,
            name: "Giải thích ngữ pháp",
            category: "grammar",
            description: "Giải thích các cấu trúc ngữ pháp tiếng Nhật một cách dễ hiểu",
            prompt:
                "Bạn là giáo viên tiếng Nhật. Giải thích ngữ pháp một cách đơn giản, sử dụng ví dụ từ thế giới Pokemon để học viên dễ hiểu và ghi nhớ.",
            usageCount: 892,
            status: "active",
            lastUsed: "2024-03-14",
        },
        {
            id: 3,
            name: "Luyện hội thoại",
            category: "conversation",
            description: "Tạo các tình huống hội thoại thực tế cho học viên",
            prompt:
                "Tạo các tình huống hội thoại tiếng Nhật trong thế giới Pokemon. Học viên sẽ đóng vai trainer và bạn sẽ đóng vai các nhân vật khác.",
            usageCount: 567,
            status: "active",
            lastUsed: "2024-03-13",
        },
        {
            id: 4,
            name: "Đánh giá phát âm",
            category: "pronunciation",
            description: "Phân tích và đưa ra phản hồi về phát âm của học viên",
            prompt:
                "Phân tích phát âm tiếng Nhật của học viên. Chỉ ra điểm mạnh, điểm cần cải thiện và đưa ra bài tập luyện tập cụ thể.",
            usageCount: 345,
            status: "active",
            lastUsed: "2024-03-12",
        },
        {
            id: 5,
            name: "Tạo câu chuyện",
            category: "story",
            description: "Tạo câu chuyện tiếng Nhật với Pokemon để học viên đọc hiểu",
            prompt:
                "Viết một câu chuyện ngắn bằng tiếng Nhật về cuộc phiêu lưu của trainer và Pokemon. Sử dụng từ vựng và ngữ pháp phù hợp với trình độ của học viên.",
            usageCount: 678,
            status: "active",
            lastUsed: "2024-03-11",
        },
        {
            id: 6,
            name: "Kiểm tra hiểu biết",
            category: "quiz",
            description: "Tạo câu hỏi kiểm tra kiến thức tiếng Nhật",
            prompt:
                "Tạo các câu hỏi trắc nghiệm và tự luận để kiểm tra kiến thức tiếng Nhật của học viên. Câu hỏi liên quan đến Pokemon để tăng hứng thú.",
            usageCount: 456,
            status: "draft",
            lastUsed: "2024-03-10",
        },
    ]

    const categories = [
        { value: "all", label: "Tất cả", icon: Brain },
        { value: "vocabulary", label: "Từ vựng", icon: FileText },
        { value: "grammar", label: "Ngữ pháp", icon: MessageSquare },
        { value: "conversation", label: "Hội thoại", icon: MessageSquare },
        { value: "pronunciation", label: "Phát âm", icon: Sparkles },
        { value: "story", label: "Câu chuyện", icon: FileText },
        { value: "quiz", label: "Kiểm tra", icon: FileText },
    ]

    const stats = [
        { label: "Tổng prompts", value: "24", icon: Brain, color: "text-blue-400" },
        { label: "Đang hoạt động", value: "18", icon: Sparkles, color: "text-green-400" },
        { label: "Lượt sử dụng", value: "4,172", icon: Play, color: "text-purple-400" },
        { label: "Trung bình/ngày", value: "156", icon: MessageSquare, color: "text-yellow-400" },
    ]

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            vocabulary: "bg-blue-500/20 text-blue-400 border-blue-500/30",
            grammar: "bg-green-500/20 text-green-400 border-green-500/30",
            conversation: "bg-purple-500/20 text-purple-400 border-purple-500/30",
            pronunciation: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            story: "bg-pink-500/20 text-pink-400 border-pink-500/30",
            quiz: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        }
        return colors[category] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }

    const getStatusColor = (status: string) => {
        return status === "active"
            ? "bg-green-500/20 text-green-400 border-green-500/30"
            : "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Quản lý AI Prompts</h1>
                    <p className="text-gray-400 mt-1">Quản lý các prompt ngữ cảnh cho AI trợ giúp học tập</p>
                </div>
                <button
                    onClick={() => setShowAddDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tạo prompt mới
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                            </div>
                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm prompts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setSelectedCategory(cat.value)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${selectedCategory === cat.value
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800"
                                }`}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Prompts List */}
            <div className="space-y-4">
                {prompts.map((prompt) => (
                    <div
                        key={prompt.id}
                        className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-white">{prompt.name}</h3>
                                    <Badge className={`${getCategoryColor(prompt.category)} border`}>
                                        {categories.find((c) => c.value === prompt.category)?.label}
                                    </Badge>
                                    <Badge className={`${getStatusColor(prompt.status)} border`}>
                                        {prompt.status === "active" ? "Hoạt động" : "Nháp"}
                                    </Badge>
                                </div>
                                <p className="text-gray-400 text-sm">{prompt.description}</p>
                            </div>
                            <Brain className="w-6 h-6 text-blue-400 ml-4" />
                        </div>

                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
                            <p className="text-gray-300 text-sm font-mono leading-relaxed">{prompt.prompt}</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <Play className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-400">Sử dụng:</span>
                                    <span className="text-white font-semibold">{prompt.usageCount.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-400">Lần cuối:</span>
                                    <span className="text-white">{prompt.lastUsed}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm">
                                    <Copy className="w-4 h-4" />
                                    Sao chép
                                </button>
                                <button
                                    onClick={() => setSelectedPrompt(prompt.id)}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    Sửa
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors text-sm">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Prompt Dialog */}
            {showAddDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-4">Tạo AI Prompt mới</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Tên prompt</label>
                                <input
                                    type="text"
                                    placeholder="VD: Trợ giúp học từ vựng"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Danh mục</label>
                                <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                                    <option value="vocabulary">Từ vựng</option>
                                    <option value="grammar">Ngữ pháp</option>
                                    <option value="conversation">Hội thoại</option>
                                    <option value="pronunciation">Phát âm</option>
                                    <option value="story">Câu chuyện</option>
                                    <option value="quiz">Kiểm tra</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Mô tả</label>
                                <input
                                    type="text"
                                    placeholder="Mô tả ngắn gọn về prompt này"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Nội dung prompt</label>
                                <textarea
                                    rows={8}
                                    placeholder="Nhập nội dung prompt chi tiết..."
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Trạng thái</label>
                                <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                                    <option value="active">Hoạt động</option>
                                    <option value="draft">Nháp</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddDialog(false)}
                                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                Hủy
                            </button>
                            <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                Tạo prompt
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Prompt Dialog */}
            {selectedPrompt && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-4">Chỉnh sửa prompt</h2>
                        <div className="space-y-4">
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white text-sm">Thống kê sử dụng</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-gray-400 text-xs">Tổng lượt dùng</p>
                                            <p className="text-white font-bold text-lg">
                                                {prompts.find((p) => p.id === selectedPrompt)?.usageCount.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs">Lần cuối</p>
                                            <p className="text-white font-bold text-lg">
                                                {prompts.find((p) => p.id === selectedPrompt)?.lastUsed}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs">Trạng thái</p>
                                            <Badge className="bg-green-500/20 text-green-400 mt-1">Hoạt động</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Nội dung prompt</label>
                                <textarea
                                    rows={8}
                                    defaultValue={prompts.find((p) => p.id === selectedPrompt)?.prompt}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setSelectedPrompt(null)}
                                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                Hủy
                            </button>
                            <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
