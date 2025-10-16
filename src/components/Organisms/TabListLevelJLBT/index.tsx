import { TabsList, TabsTrigger } from '@ui/Tabs'
import { cn } from '@utils/CN'

const TabListLevelJLBT = ({ className }: { className?: string }) => {
    return (
        <TabsList className={cn("bg-gray-100 rounded-lg p-1", className)}>
            <TabsTrigger value="all" className={cn("data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-md", className)}>Tất cả</TabsTrigger>
            <TabsTrigger value="5" className={cn("data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-md", className)}>N5</TabsTrigger>
            <TabsTrigger value="4" className={cn("data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-md", className)}>N4</TabsTrigger>
            <TabsTrigger value="3" className={cn("data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-md", className)}>N3</TabsTrigger>
        </TabsList>
    )
}

export default TabListLevelJLBT