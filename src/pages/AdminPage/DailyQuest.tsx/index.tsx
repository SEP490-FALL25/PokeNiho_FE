import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@ui/Card";
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
import { useTranslation } from "react-i18next";
import { useGetDailyRequestList } from "@hooks/useDailyRequest";
import PaginationControls from "@ui/PaginationControls";
import FilterableTableHeader from "@ui/FilterableTableHeader";

// --- Định nghĩa kiểu dữ liệu từ API ---
interface DailyQuest {
    id: number;
    nameKey: string;
    descriptionKey: string;
    dailyRequestType: string;
    conditionValue: number;
    rewardId: number;
    isStreak: boolean;
    isActive: boolean;
    createdById: number;
    updatedById: number | null;
    deletedById: number | null;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    nameTranslation: string;
    descriptionTranslation: string;
}

// --- Dữ liệu giả lập cho rewards ---
const mockRewards = [
    { id: 1, name: "Gem x10" },
    { id: 2, name: "Exp x50" },
    { id: 3, name: "Stamina Refill S" },
    { id: 4, name: "Vé Quay x1" },
];

const DailyQuestManagement = () => {
    const { t } = useTranslation();

    // --- States ---
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
    const [, setEditingQuest] = useState<DailyQuest | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    const { data: dailyRequestList, isLoading } = useGetDailyRequestList({
        page: currentPage,
        limit: itemsPerPage,
        sortBy: "createdAt",
        sort: "desc",
        search: searchQuery || undefined,
    });

    // Filter options
    const statusOptions = [
        { value: "all", label: t('common.all') },
        { value: "active", label: t('common.active') },
        { value: "inactive", label: t('common.inactive') }
    ];

    const typeOptions = [
        { value: "all", label: t('common.all') },
        { value: "DAILY_LOGIN", label: "Daily Login" },
        { value: "STREAK_LOGIN", label: "Streak Login" },
        { value: "COMPLETE_LESSON", label: "Complete Lesson" },
        { value: "VOCABULARY_PRACTICE", label: "Vocabulary Practice" }
    ];

    const handleDelete = async (questId: number) => {
        if (window.confirm(t('dailyQuest.confirmDelete'))) {
            try {
                // TODO: Gọi API xóa quest
                console.log('Deleting quest:', questId);
                toast.success(t('dailyQuest.deleteSuccess'));
            } catch (error) {
                console.error("Lỗi khi xóa nhiệm vụ:", error);
                toast.error(t('dailyQuest.deleteError'));
            }
        }
    };

    const getConditionLabel = (type: string) => {
        switch (type) {
            case "DAILY_LOGIN": return "Daily Login";
            case "STREAK_LOGIN": return "Streak Login";
            case "COMPLETE_LESSON": return "Complete Lesson";
            case "VOCABULARY_PRACTICE": return "Vocabulary Practice";
            default: return type;
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
                                        <FilterableTableHeader
                                            title={t('common.name')}
                                            filterType="input"
                                            filterValue={searchQuery}
                                            onFilterChange={setSearchQuery}
                                            placeholder={t('dailyQuest.searchPlaceholder')}
                                        />
                                        <FilterableTableHeader
                                            title={t('common.condition') + ' ' + t('common.type')}
                                            filterType="select"
                                            filterOptions={typeOptions}
                                            filterValue={typeFilter}
                                            onFilterChange={setTypeFilter}
                                        />
                                        <TableHead className="text-muted-foreground">{t('common.value')}</TableHead>
                                        <TableHead className="text-muted-foreground">{t('common.reward')}</TableHead>
                                        <FilterableTableHeader
                                            title={t('common.status')}
                                            filterType="select"
                                            filterOptions={statusOptions}
                                            filterValue={statusFilter}
                                            onFilterChange={setStatusFilter}
                                        />
                                        <TableHead className="text-muted-foreground text-right">{t('common.actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dailyRequestList?.results && dailyRequestList.results.length > 0 ? (
                                        dailyRequestList.results.map((quest: DailyQuest) => (
                                            <TableRow key={quest.id} className="border-border hover:bg-muted/50">
                                                <TableCell className="font-medium text-foreground">{quest.nameTranslation}</TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {getConditionLabel(quest.dailyRequestType)}
                                                </TableCell>
                                                <TableCell className="text-foreground">{quest.conditionValue}</TableCell>
                                                <TableCell className="text-foreground">Reward ID: {quest.rewardId}</TableCell>
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
                    <CardFooter>
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={dailyRequestList?.pagination?.totalPage || 1}
                            totalItems={dailyRequestList?.pagination?.totalItem || 0}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                            isLoading={isLoading}
                        />
                    </CardFooter>
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