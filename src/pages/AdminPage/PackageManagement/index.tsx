"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card"
import { Badge } from "@ui/Badge"
import { Package, DollarSign, Users, TrendingUp, Plus, Search, Edit, Trash2, Check } from "lucide-react"

export default function PackageManagement() {
    const [searchQuery, setSearchQuery] = useState("")
    const [showAddDialog, setShowAddDialog] = useState(false)

    const packages = [
        {
            id: 1,
            name: "Gói Cơ Bản",
            nameEn: "Basic Plan",
            price: 99000,
            duration: "1 tháng",
            subscribers: 234,
            status: "active",
            features: ["Truy cập 50 bài học", "5 Pokemon miễn phí", "Hỗ trợ email", "Tham gia giải đấu cơ bản"],
            color: "blue",
        },
        {
            id: 2,
            name: "Gói Tiêu Chuẩn",
            nameEn: "Standard Plan",
            price: 249000,
            duration: "3 tháng",
            subscribers: 456,
            status: "active",
            features: [
                "Truy cập 200 bài học",
                "15 Pokemon miễn phí",
                "Hỗ trợ ưu tiên",
                "Tham gia mọi giải đấu",
                "AI trợ giúp học tập",
            ],
            color: "purple",
        },
        {
            id: 3,
            name: "Gói Premium",
            nameEn: "Premium Plan",
            price: 499000,
            duration: "6 tháng",
            subscribers: 189,
            status: "active",
            features: [
                "Truy cập không giới hạn",
                "30 Pokemon miễn phí",
                "Hỗ trợ 24/7",
                "Giải đấu VIP",
                "AI cá nhân hóa",
                "Chứng chỉ hoàn thành",
            ],
            color: "yellow",
        },
        {
            id: 4,
            name: "Gói Doanh Nghiệp",
            nameEn: "Enterprise Plan",
            price: 2999000,
            duration: "1 năm",
            subscribers: 23,
            status: "active",
            features: [
                "Tất cả tính năng Premium",
                "Quản lý nhóm",
                "Báo cáo chi tiết",
                "API tích hợp",
                "Đào tạo riêng",
                "Tùy chỉnh nội dung",
            ],
            color: "red",
        },
    ]

    const stats = [
        { label: "Tổng gói dịch vụ", value: "4", icon: Package, color: "text-blue-400" },
        { label: "Doanh thu tháng này", value: "125M VND", icon: DollarSign, color: "text-green-400" },
        { label: "Tổng người đăng ký", value: "902", icon: Users, color: "text-purple-400" },
        { label: "Tăng trưởng", value: "+23%", icon: TrendingUp, color: "text-yellow-400" },
    ]

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; text: string; border: string }> = {
            blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
            purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
            yellow: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
            red: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
        }
        return colors[color] || colors.blue
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Quản lý gói dịch vụ</h1>
                    <p className="text-gray-400 mt-1">Quản lý các gói đăng ký và dịch vụ</p>
                </div>
                <button
                    onClick={() => setShowAddDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tạo gói mới
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

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm kiếm gói dịch vụ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {packages.map((pkg) => {
                    const colorClasses = getColorClasses(pkg.color)
                    return (
                        <div
                            key={pkg.id}
                            className={`bg-gray-900 border-2 ${colorClasses.border} rounded-lg p-6 hover:shadow-lg transition-all relative`}
                        >
                            {/* Popular Badge */}
                            {pkg.id === 2 && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-purple-600 text-white">Phổ biến nhất</Badge>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className={`text-xl font-bold ${colorClasses.text} mb-1`}>{pkg.name}</h3>
                                <p className="text-gray-400 text-sm">{pkg.nameEn}</p>
                            </div>

                            <div className="text-center mb-6">
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-3xl font-bold text-white">{pkg.price.toLocaleString()}</span>
                                    <span className="text-gray-400">VND</span>
                                </div>
                                <p className="text-gray-400 text-sm mt-1">{pkg.duration}</p>
                            </div>

                            <div className="space-y-3 mb-6">
                                {pkg.features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <Check className={`w-4 h-4 ${colorClasses.text} mt-0.5 flex-shrink-0`} />
                                        <span className="text-gray-300 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-gray-800">
                                <div className="flex items-center justify-between text-sm mb-4">
                                    <span className="text-gray-400">Người đăng ký</span>
                                    <span className="text-white font-semibold">{pkg.subscribers}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm">
                                        <Edit className="w-4 h-4" />
                                        Sửa
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors text-sm">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Subscribers Table */}
            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-white">Người đăng ký gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[
                            { name: "Nguyễn Văn A", package: "Gói Premium", date: "2024-03-15", amount: "499,000 VND" },
                            { name: "Trần Thị B", package: "Gói Tiêu Chuẩn", date: "2024-03-14", amount: "249,000 VND" },
                            { name: "Lê Văn C", package: "Gói Cơ Bản", date: "2024-03-14", amount: "99,000 VND" },
                            { name: "Phạm Thị D", package: "Gói Premium", date: "2024-03-13", amount: "499,000 VND" },
                            { name: "Hoàng Văn E", package: "Gói Doanh Nghiệp", date: "2024-03-12", amount: "2,999,000 VND" },
                        ].map((subscriber, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg"
                            >
                                <div>
                                    <p className="font-semibold text-white">{subscriber.name}</p>
                                    <p className="text-sm text-gray-400">{subscriber.package}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-white">{subscriber.amount}</p>
                                    <p className="text-sm text-gray-400">{subscriber.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Add Package Dialog */}
            {showAddDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-4">Tạo gói dịch vụ mới</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Tên gói (Tiếng Việt)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Tên gói (English)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Giá (VND)</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Thời hạn</label>
                                    <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                                        <option>1 tháng</option>
                                        <option>3 tháng</option>
                                        <option>6 tháng</option>
                                        <option>1 năm</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Màu chủ đạo</label>
                                <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                                    <option value="blue">Xanh dương</option>
                                    <option value="purple">Tím</option>
                                    <option value="yellow">Vàng</option>
                                    <option value="red">Đỏ</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Tính năng (mỗi dòng một tính năng)</label>
                                <textarea
                                    rows={6}
                                    placeholder="Truy cập 50 bài học&#10;5 Pokemon miễn phí&#10;Hỗ trợ email"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                />
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
                                Tạo gói
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
