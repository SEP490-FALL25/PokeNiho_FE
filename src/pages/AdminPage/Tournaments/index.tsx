"use client"

import { useState } from "react"
import { Card, CardContent } from "@ui/Card"
import { Badge } from "@ui/Badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/Dialog"
import { Trophy, Calendar, Users, Award, Plus, Search, Edit, Trash2, Eye } from "lucide-react"

export default function TournamentManagement() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [selectedTournament, setSelectedTournament] = useState<number | null>(null)

    const tournaments = [
        {
            id: 1,
            name: "Giải đấu mùa xuân 2024",
            description: "Giải đấu lớn nhất năm dành cho học viên tiếng Nhật",
            status: "ongoing",
            startDate: "2024-03-01",
            endDate: "2024-03-31",
            participants: 156,
            maxParticipants: 200,
            prize: "1,000,000 VND",
            level: "Intermediate",
        },
        {
            id: 2,
            name: "Pokemon Battle Championship",
            description: "Thi đấu Pokemon để giành giải thưởng lớn",
            status: "upcoming",
            startDate: "2024-04-15",
            endDate: "2024-04-30",
            participants: 45,
            maxParticipants: 100,
            prize: "500,000 VND",
            level: "Advanced",
        },
        {
            id: 3,
            name: "Beginner's Cup",
            description: "Giải đấu dành cho người mới bắt đầu",
            status: "completed",
            startDate: "2024-02-01",
            endDate: "2024-02-15",
            participants: 89,
            maxParticipants: 100,
            prize: "300,000 VND",
            level: "Beginner",
        },
        {
            id: 4,
            name: "Summer Vocabulary Challenge",
            description: "Thử thách từ vựng mùa hè",
            status: "upcoming",
            startDate: "2024-06-01",
            endDate: "2024-06-30",
            participants: 12,
            maxParticipants: 150,
            prize: "750,000 VND",
            level: "All Levels",
        },
    ]

    const stats = [
        { label: "Tổng giải đấu", value: "24", icon: Trophy, color: "text-yellow-400" },
        { label: "Đang diễn ra", value: "3", icon: Calendar, color: "text-blue-400" },
        { label: "Tổng người tham gia", value: "1,234", icon: Users, color: "text-green-400" },
        { label: "Giải thưởng tháng này", value: "5M VND", icon: Award, color: "text-purple-400" },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ongoing":
                return "bg-green-500/20 text-green-400 border-green-500/30"
            case "upcoming":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            case "completed":
                return "bg-gray-500/20 text-gray-400 border-gray-500/30"
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "ongoing":
                return "Đang diễn ra"
            case "upcoming":
                return "Sắp diễn ra"
            case "completed":
                return "Đã kết thúc"
            default:
                return status
        }
    }

    const getLevelColor = (level: string) => {
        switch (level) {
            case "Beginner":
                return "bg-green-500/10 text-green-400"
            case "Intermediate":
                return "bg-yellow-500/10 text-yellow-400"
            case "Advanced":
                return "bg-red-500/10 text-red-400"
            default:
                return "bg-blue-500/10 text-blue-400"
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Quản lý giải đấu</h1>
                    <p className="text-gray-400 mt-1">Quản lý tất cả giải đấu và cuộc thi</p>
                </div>
                <button
                    onClick={() => setShowAddDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tạo giải đấu
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
                        placeholder="Tìm kiếm giải đấu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="flex gap-2">
                    {["all", "ongoing", "upcoming", "completed"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${selectedStatus === status
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800"
                                }`}
                        >
                            {status === "all"
                                ? "Tất cả"
                                : status === "ongoing"
                                    ? "Đang diễn ra"
                                    : status === "upcoming"
                                        ? "Sắp diễn ra"
                                        : "Đã kết thúc"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tournaments Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {tournaments.map((tournament) => (
                    <div
                        key={tournament.id}
                        className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-white mb-2">{tournament.name}</h3>
                                <p className="text-gray-400 text-sm">{tournament.description}</p>
                            </div>
                            <Trophy className="w-6 h-6 text-yellow-400 ml-4" />
                        </div>

                        <div className="flex gap-2 mb-4">
                            <Badge className={`${getStatusColor(tournament.status)} border`}>
                                {getStatusText(tournament.status)}
                            </Badge>
                            <Badge className={getLevelColor(tournament.level)}>{tournament.level}</Badge>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Thời gian
                                </span>
                                <span className="text-white">
                                    {tournament.startDate} - {tournament.endDate}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Người tham gia
                                </span>
                                <span className="text-white">
                                    {tournament.participants}/{tournament.maxParticipants}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 flex items-center gap-2">
                                    <Award className="w-4 h-4" />
                                    Giải thưởng
                                </span>
                                <span className="text-yellow-400 font-semibold">{tournament.prize}</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Đăng ký</span>
                                <span>{Math.round((tournament.participants / tournament.maxParticipants) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedTournament(tournament.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                            >
                                <Eye className="w-4 h-4" />
                                Chi tiết
                            </button>
                            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm">
                                <Edit className="w-4 h-4" />
                            </button>
                            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors text-sm">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Tournament Dialog */}
            {showAddDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-4">Tạo giải đấu mới</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Tên giải đấu</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Mô tả</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Ngày bắt đầu</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Ngày kết thúc</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Số người tối đa</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Giải thưởng</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Cấp độ</label>
                                <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                    <option>All Levels</option>
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
                                Tạo giải đấu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tournament Details Dialog */}
            {selectedTournament && (
                <Dialog open={!!selectedTournament} onOpenChange={() => setSelectedTournament(null)}>
                    <DialogContent className="bg-gray-900 border-gray-800 max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-white">Chi tiết giải đấu</DialogTitle>
                        </DialogHeader>
                        <TournamentDetails tournamentId={selectedTournament} />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

function TournamentDetails({ tournamentId }: { tournamentId: number }) {
    const leaderboard = [
        { rank: 1, name: "Nguyễn Văn A", score: 1250, pokemon: "Charizard" },
        { rank: 2, name: "Trần Thị B", score: 1180, pokemon: "Pikachu" },
        { rank: 3, name: "Lê Văn C", score: 1120, pokemon: "Mewtwo" },
        { rank: 4, name: "Phạm Thị D", score: 1050, pokemon: "Blastoise" },
        { rank: 5, name: "Hoàng Văn E", score: 980, pokemon: "Venusaur" },
    ]

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-white">156</div>
                        <p className="text-sm text-gray-400">Người tham gia</p>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-white">1,234</div>
                        <p className="text-sm text-gray-400">Trận đấu</p>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-yellow-400">1M VND</div>
                        <p className="text-sm text-gray-400">Giải thưởng</p>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Bảng xếp hạng</h3>
                <div className="space-y-2">
                    {leaderboard.map((player) => (
                        <div
                            key={player.rank}
                            className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${player.rank === 1
                                            ? "bg-yellow-500 text-black"
                                            : player.rank === 2
                                                ? "bg-gray-400 text-black"
                                                : player.rank === 3
                                                    ? "bg-orange-600 text-white"
                                                    : "bg-gray-700 text-white"
                                        }`}
                                >
                                    {player.rank}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{player.name}</p>
                                    <p className="text-sm text-gray-400">{player.pokemon}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-white">{player.score}</p>
                                <p className="text-xs text-gray-400">điểm</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
