import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@ui/Card";
import { Button } from "@ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/Table";
import { Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@ui/DropdownMenu";
import HeaderAdmin from "@organisms/Header/Admin";
import { toast } from "react-toastify";
import CreateRewardDialog from "./components/CreateRewardDialog";
import { useTranslation } from "react-i18next";
import { useGetRewardList, useDeleteReward } from "@hooks/useReward";
import PaginationControls from "@ui/PaginationControls";
import SortableTableHeader from "@ui/SortableTableHeader";
import FilterPanel from "@ui/FilterPanel";
import TableSkeleton from "@ui/TableSkeleton";

const RewardManagement = () => {
    const { t } = useTranslation();

    // --- States ---
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
    const [editingReward, setEditingReward] = useState<any | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [typeFilter, setTypeFilter] = useState("all");
    const [targetFilter, setTargetFilter] = useState("all");
    const [sortBy, setSortBy] = useState<string | undefined>("id");
    const [sort, setSort] = useState<"asc" | "desc" | undefined>("desc");

    const { data: rewardList, isLoading } = useGetRewardList({
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        sort,
        name: searchQuery || undefined,
        rewardType: typeFilter !== "all" ? typeFilter : undefined,
        rewardTarget: targetFilter !== "all" ? targetFilter : undefined,
    });

    const deleteRewardMutation = useDeleteReward();

    // Filter options
    const typeOptions = [
        { value: "all", label: t('reward.allTypes') },
        { value: "DAILY_REQUEST", label: "Daily Request" },
        { value: "LEVEL_UP", label: "Level Up" },
        { value: "ACHIEVEMENT", label: "Achievement" },
        { value: "SPECIAL_EVENT", label: "Special Event" }
    ];

    const targetOptions = [
        { value: "all", label: t('reward.allTargets') },
        { value: "EXP", label: "Experience Points" },
        { value: "GEM", label: "Gems" },
        { value: "STAMINA", label: "Stamina" },
        { value: "COIN", label: "Coins" },
        { value: "ITEM", label: "Items" }
    ];

    const handleDelete = async (rewardId: number) => {
        if (window.confirm(t('reward.confirmDelete'))) {
            try {
                await deleteRewardMutation.mutateAsync(rewardId);
                toast.success(t('reward.deleteSuccess'));
            } catch (error) {
                console.error("Error deleting reward:", error);
                toast.error(t('reward.deleteError'));
            }
        }
    };

    const handleEdit = (reward: any) => {
        setEditingReward(reward);
        setIsAddEditDialogOpen(true);
    };

    const handleSort = (columnKey: string) => {
        if (sortBy === columnKey) {
            setSort(prev => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(columnKey);
            setSort("asc");
        }
        setCurrentPage(1);
    };

    const handleClearAllFilters = () => {
        setSearchQuery("");
        setTypeFilter("all");
        setTargetFilter("all");
        setCurrentPage(1);
    };

    const openAddDialog = () => {
        setEditingReward(null);
        setIsAddEditDialogOpen(true);
    };

    const closeDialog = () => {
        setIsAddEditDialogOpen(false);
        setEditingReward(null);
    };

    const getRewardTypeLabel = (type: string) => {
        switch (type) {
            case "DAILY_REQUEST": return "Daily Request";
            case "LEVEL_UP": return "Level Up";
            case "ACHIEVEMENT": return "Achievement";
            case "SPECIAL_EVENT": return "Special Event";
            default: return type;
        }
    };

    const getRewardTargetLabel = (target: string) => {
        switch (target) {
            case "EXP": return "Experience Points";
            case "GEM": return "Gems";
            case "STAMINA": return "Stamina";
            case "COIN": return "Coins";
            case "ITEM": return "Items";
            default: return target;
        }
    };

    return (
        <>
            <HeaderAdmin title={t('reward.title')} description={t('reward.description')} />
            <div className="mt-24 p-8">
                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-foreground">{t('reward.title')}</CardTitle>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={openAddDialog}>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('reward.addReward')}
                            </Button>
                        </div>
                    </CardHeader>

                    {/* Filter Panel */}
                    <FilterPanel
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                        searchPlaceholder={t('reward.searchPlaceholder')}
                        filters={{
                            type: {
                                value: typeFilter,
                                onChange: setTypeFilter,
                                options: typeOptions,
                                placeholder: t('reward.filterByType')
                            },
                            status: {
                                value: "all",
                                onChange: () => { },
                                options: [{ value: "all", label: "All" }],
                                placeholder: "Status"
                            },
                            streak: {
                                value: "all",
                                onChange: () => { },
                                options: [{ value: "all", label: "All" }],
                                placeholder: "Streak"
                            },
                            reward: {
                                value: targetFilter,
                                onChange: setTargetFilter,
                                options: targetOptions,
                                placeholder: t('reward.filterByTarget')
                            }
                        }}
                        onClearAll={handleClearAllFilters}
                        showClearButton={true}
                    />

                    <CardContent>
                        {isLoading ? (
                            <TableSkeleton rows={itemsPerPage} columns={5} />
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border hover:bg-muted/50">
                                        <SortableTableHeader
                                            title={t('reward.nameKey')}
                                            sortKey="nameKey"
                                            currentSortBy={sortBy}
                                            currentSort={sort}
                                            onSort={handleSort}
                                        />
                                        <SortableTableHeader
                                            title={t('reward.rewardType')}
                                            sortKey="rewardType"
                                            currentSortBy={sortBy}
                                            currentSort={sort}
                                            onSort={handleSort}
                                        />
                                        <SortableTableHeader
                                            title={t('reward.rewardItem')}
                                            sortKey="rewardItem"
                                            currentSortBy={sortBy}
                                            currentSort={sort}
                                            onSort={handleSort}
                                        />
                                        <SortableTableHeader
                                            title={t('reward.rewardTarget')}
                                            sortKey="rewardTarget"
                                            currentSortBy={sortBy}
                                            currentSort={sort}
                                            onSort={handleSort}
                                        />
                                        <TableHead className="text-muted-foreground text-right">{t('common.actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rewardList?.results && rewardList.results.length > 0 ? (
                                        rewardList.results.map((reward: any) => (
                                            <TableRow key={reward.id} className="border-border hover:bg-muted/50">
                                                <TableCell className="font-medium text-foreground">{reward.nameKey}</TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {getRewardTypeLabel(reward.rewardType)}
                                                </TableCell>
                                                <TableCell className="text-foreground">{reward.rewardItem}</TableCell>
                                                <TableCell className="text-foreground">
                                                    {getRewardTargetLabel(reward.rewardTarget)}
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
                                                                onClick={() => handleEdit(reward)}
                                                            >
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                {t('common.edit')}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive hover:bg-destructive/10 cursor-pointer"
                                                                onClick={() => handleDelete(reward.id)}
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
                                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                                {t('reward.noRewardsFound')}
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
                            totalPages={rewardList?.pagination?.totalPage || 1}
                            totalItems={rewardList?.pagination?.totalItem || 0}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                            isLoading={isLoading}
                        />
                    </CardFooter>
                </Card>
            </div>

            {/* Dialog component */}
            <CreateRewardDialog
                isOpen={isAddEditDialogOpen}
                onClose={closeDialog}
                editingReward={editingReward}
            />
        </>
    );
};

export default RewardManagement;
