import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Button } from "@ui/Button";
import { Input } from "@ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/Table";
import { Badge } from "@ui/Badge";
import { Search, Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@ui/DropdownMenu";
import HeaderAdmin from "@organisms/Header/Admin";
import { toast } from "react-toastify";
import { cn } from "@utils/CN";
import CreateDailyQuestDialog from "./CreateDailyQuest";
import { DAILY_REQUEST } from "@constants/dailyRequest";
import { useTranslation } from "react-i18next";

// --- Định nghĩa kiểu dữ liệu (Giữ nguyên) ---
interface TranslationInput {
    key: "en" | "ja" | "vi";
    value: string;
}

interface DailyQuest {
    id: string;
    conditionType: string;
    conditionValue: number;
    rewardId: number;
    rewardName?: string;
    isActive: boolean;
    nameTranslations: TranslationInput[];
    descriptionTranslations: TranslationInput[];
    createdAt?: string;
}

// --- Dữ liệu giả lập (Giữ nguyên) ---
const mockRewards = [
    { id: 1, name: "Gem x10" },
    { id: 2, name: "Exp x50" },
    { id: 3, name: "Stamina Refill S" },
    { id: 4, name: "Vé Quay x1" },
];

const mockDailyQuests: DailyQuest[] = [
    {
        id: "dq1",
        conditionType: "STREAK_LOGIN",
        conditionValue: 3,
        rewardId: 1,
        rewardName: "Gem x10",
        isActive: true,
        nameTranslations: [
            { key: "en", value: "3-Day Login Streak" },
            { key: "ja", value: "３日連続ログイン" },
            { key: "vi", value: "Chuỗi đăng nhập 3 ngày" },
        ],
        descriptionTranslations: [
            { key: "en", value: "Log in for 3 consecutive days." },
            { key: "ja", value: "３日間連続でログインする。" },
            { key: "vi", value: "Đăng nhập liên tục trong 3 ngày." },
        ],
        createdAt: "2025-10-20",
    },
    {
        id: "dq2",
        conditionType: "COMPLETE_LESSON",
        conditionValue: 1,
        rewardId: 2,
        rewardName: "Exp x50",
        isActive: true,
        nameTranslations: [
            { key: "en", value: "Complete a Lesson" },
            { key: "ja", value: "レッスンを完了する" },
            { key: "vi", value: "Hoàn thành 1 bài học" },
        ],
        descriptionTranslations: [
            { key: "en", value: "Finish any lesson." },
            { key: "ja", value: "任意のレッスンを完了する。" },
            { key: "vi", value: "Hoàn thành bất kỳ bài học nào." },
        ],
        createdAt: "2025-10-21",
    },
    {
        id: "dq3",
        conditionType: "VOCABULARY_PRACTICE",
        conditionValue: 5,
        rewardId: 3,
        rewardName: "Stamina Refill S",
        isActive: false,
        nameTranslations: [
            { key: "en", value: "Practice 5 Vocabs" },
            { key: "ja", value: "単語を５つ練習する" },
            { key: "vi", value: "Luyện tập 5 từ vựng" },
        ],
        descriptionTranslations: [
            { key: "en", value: "Practice 5 vocabulary words." },
            { key: "ja", value: "単語を５つ練習しましょう。" },
            { key: "vi", value: "Hãy luyện tập 5 từ vựng." },
        ],
        createdAt: "2025-10-22",
    },
];

const DailyQuestManagement = () => {
    const { t } = useTranslation();

    // --- States ---
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
    const [editingQuest, setEditingQuest] = useState<DailyQuest | null>(null);
    const [quests, setQuests] = useState<DailyQuest[]>(mockDailyQuests);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async (questId: string) => {
        if (window.confirm(t('dailyQuest.confirmDelete'))) {
            try {
                // TODO: Gọi API xóa quest
                setQuests(quests.filter((q) => q.id !== questId));
                toast.success(t('dailyQuest.deleteSuccess'));
            } catch (error) {
                console.error("Lỗi khi xóa nhiệm vụ:", error);
                toast.error(t('dailyQuest.deleteError'));
            }
        }
    };


    const openAddDialog = () => {
        setEditingQuest(null);
        setIsAddEditDialogOpen(true);
    };

    const closeDialog = () => {
        setIsAddEditDialogOpen(false);
        setEditingQuest(null);
    };


    // --- Các hàm tiện ích (Giữ nguyên) ---
    const filteredQuests = quests.filter((quest) => {
        const nameVi = quest.nameTranslations.find((t) => t.key === "vi")?.value.toLowerCase() || "";

        const rewardName = quest.rewardName?.toLowerCase() || "";
        const query = searchQuery.toLowerCase();
        return (
            nameVi.includes(query) ||
            rewardName.includes(query) ||
            quest.conditionType.toLowerCase().includes(query)
        );
    });


    const getQuestName = (quest: DailyQuest, lang: "vi" | "en" | "ja" = "vi") => {
        return quest.nameTranslations.find((t) => t.key === lang)?.value || "N/A";
    };

    const getConditionLabel = (conditionType: string) => {
        const condition = Object.values(DAILY_REQUEST.DAILY_REQUEST_TYPE).find(c => c.value === conditionType);
        return condition?.label || conditionType;
    };

    return (
        <>
            <HeaderAdmin title={t('dailyQuest.title')} description={t('dailyQuest.description')} />
            <div className="mt-24 p-8">
                {/* Bảng danh sách nhiệm vụ */}
                <Card className="bg-card border-border">
                    {/* CardHeader và CardContent chứa Table (Giữ nguyên) */}
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-foreground">{t('dailyQuest.title')}</CardTitle>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={openAddDialog}>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('dailyQuest.addQuest')}
                            </Button>
                        </div>
                        <div className="mt-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={t('dailyQuest.searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-background border-border text-foreground"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <p>{t('common.loading')}</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border hover:bg-muted/50">
                                        <TableHead className="text-muted-foreground">{t('common.name')}</TableHead>
                                        <TableHead className="text-muted-foreground">{t('common.condition')} {t('common.type')}</TableHead>
                                        <TableHead className="text-muted-foreground">{t('common.value')}</TableHead>
                                        <TableHead className="text-muted-foreground">{t('common.reward')}</TableHead>
                                        <TableHead className="text-muted-foreground">{t('common.status')}</TableHead>
                                        <TableHead className="text-muted-foreground text-right">{t('common.actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredQuests.length > 0 ? (
                                        filteredQuests.map((quest) => (
                                            <TableRow key={quest.id} className="border-border hover:bg-muted/50">
                                                <TableCell className="font-medium text-foreground">{getQuestName(quest, "vi")}</TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {getConditionLabel(quest.conditionType)}
                                                </TableCell>
                                                <TableCell className="text-foreground">{quest.conditionValue}</TableCell>
                                                <TableCell className="text-foreground">{quest.rewardName || `ID: ${quest.rewardId}`}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={cn(quest.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800")}
                                                    >
                                                        {quest.isActive ? t('common.active') : t('common.inactive')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-muted-foreground hover:text-foreground"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-card border-border">
                                                            <DropdownMenuItem
                                                                className="text-foreground hover:bg-muted cursor-pointer"
                                                            // onClick={() => handleEdit(quest)}
                                                            >
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                {t('common.edit')}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive hover:bg-destructive/10 cursor-pointer"
                                                                onClick={() => handleDelete(quest.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                {t('common.delete')}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                                {t('dailyQuest.noQuestsFound')}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Dialog component */}
            <CreateDailyQuestDialog
                isOpen={isAddEditDialogOpen}
                onClose={closeDialog}
                mockRewards={mockRewards}
            />
        </>
    );
};

export default DailyQuestManagement;