import { Search, Filter, X } from "lucide-react";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Button } from "@ui/Button";
import { Badge } from "@ui/Badge";

interface FilterOption {
    value: string;
    label: string;
}

interface FilterPanelProps {
    // Search
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;

    // Filters
    filters: {
        type: {
            value: string;
            onChange: (value: string) => void;
            options: FilterOption[];
            placeholder: string;
        };
        status: {
            value: string;
            onChange: (value: string) => void;
            options: FilterOption[];
            placeholder: string;
        };
        streak: {
            value: string;
            onChange: (value: string) => void;
            options: FilterOption[];
            placeholder: string;
        };
        reward: {
            value: string;
            onChange: (value: string) => void;
            options: FilterOption[];
            placeholder: string;
        };
    };

    // Actions
    onClearAll?: () => void;
    showClearButton?: boolean;
    className?: string;
}

const FilterPanel = ({
    searchValue,
    onSearchChange,
    searchPlaceholder = "Tìm kiếm...",
    filters,
    onClearAll,
    showClearButton = true,
    className = ""
}: FilterPanelProps) => {
    const hasActiveFilters =
        searchValue ||
        filters.type.value !== "all" ||
        filters.status.value !== "all" ||
        filters.streak.value !== "all" ||
        filters.reward.value !== "all";

    return (
        <div className={`px-6 py-4 border-b border-border bg-muted/20 ${className}`}>
            <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 bg-background border-border text-foreground"
                    />
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Select value={filters.type.value} onValueChange={filters.type.onChange}>
                        <SelectTrigger className="w-full bg-background border-border text-foreground">
                            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder={filters.type.placeholder} />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                            {filters.type.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.status.value} onValueChange={filters.status.onChange}>
                        <SelectTrigger className="w-full bg-background border-border text-foreground">
                            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder={filters.status.placeholder} />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                            {filters.status.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.streak.value} onValueChange={filters.streak.onChange}>
                        <SelectTrigger className="w-full bg-background border-border text-foreground">
                            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder={filters.streak.placeholder} />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                            {filters.streak.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.reward.value} onValueChange={filters.reward.onChange}>
                        <SelectTrigger className="w-full bg-background border-border text-foreground">
                            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder={filters.reward.placeholder} />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                            {filters.reward.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Active Filters & Clear Button */}
                {hasActiveFilters && showClearButton && (
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Bộ lọc đang hoạt động:</span>
                            {searchValue && (
                                <Badge variant="secondary" className="text-xs">
                                    Tìm kiếm: "{searchValue}"
                                </Badge>
                            )}
                            {filters.type.value !== "all" && (
                                <Badge variant="secondary" className="text-xs">
                                    Loại: {filters.type.options.find(opt => opt.value === filters.type.value)?.label}
                                </Badge>
                            )}
                            {filters.status.value !== "all" && (
                                <Badge variant="secondary" className="text-xs">
                                    Trạng thái: {filters.status.options.find(opt => opt.value === filters.status.value)?.label}
                                </Badge>
                            )}
                            {filters.streak.value !== "all" && (
                                <Badge variant="secondary" className="text-xs">
                                    Chuỗi: {filters.streak.options.find(opt => opt.value === filters.streak.value)?.label}
                                </Badge>
                            )}
                            {filters.reward.value !== "all" && (
                                <Badge variant="secondary" className="text-xs">
                                    Phần thưởng: {filters.reward.options.find(opt => opt.value === filters.reward.value)?.label}
                                </Badge>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClearAll}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Xóa tất cả
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterPanel;
