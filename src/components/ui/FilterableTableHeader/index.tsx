import { ChevronDown, Filter } from "lucide-react";
import { TableHead } from "@ui/Table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Input } from "@ui/Input";

interface FilterOption {
    value: string;
    label: string;
}

interface FilterableTableHeaderProps {
    title: string;
    filterType?: 'select' | 'input' | 'none';
    filterOptions?: FilterOption[];
    filterValue?: string;
    onFilterChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const FilterableTableHeader = ({
    title,
    filterType = 'none',
    filterOptions = [],
    filterValue = '',
    onFilterChange,
    placeholder,
    className = "text-muted-foreground"
}: FilterableTableHeaderProps) => {
    const renderFilter = () => {
        if (filterType === 'select' && filterOptions.length > 0) {
            return (
                <Select value={filterValue} onValueChange={onFilterChange}>
                    <SelectTrigger className="w-full h-8 bg-background border-border text-foreground text-xs">
                        <Filter className="h-3 w-3 mr-1" />
                        <SelectValue placeholder={placeholder} />
                        <ChevronDown className="h-3 w-3" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                        {filterOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-xs">
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        }

        if (filterType === 'input') {
            return (
                <Input
                    value={filterValue}
                    onChange={(e) => onFilterChange?.(e.target.value)}
                    placeholder={placeholder}
                    className="h-8 text-xs bg-background border-border text-foreground"
                />
            );
        }

        return null;
    };

    return (
        <TableHead className={className}>
            <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">{title}</span>
                {filterType !== 'none' && (
                    <div className="w-full">
                        {renderFilter()}
                    </div>
                )}
            </div>
        </TableHead>
    );
};

export default FilterableTableHeader;
