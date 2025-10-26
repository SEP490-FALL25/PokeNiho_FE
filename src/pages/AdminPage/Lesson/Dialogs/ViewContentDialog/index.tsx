import { DialogContent, DialogHeader, DialogTitle } from '@ui/Dialog';
import { Button } from '@ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/Card';
import { Badge } from '@ui/Badge';
import { Separator } from '@ui/Separator';
import {
    FileText,
    Video,
    Image,
    File,
    Clock,
    HardDrive,
    Calendar,
    User,
    Eye,
    Edit,
    Download,
    X
} from 'lucide-react';

interface ContentItem {
    id: number
    title: string
    lessonId: number
    lessonTitle: string
    lessonSlug: string
    lessonLevel: number
    type: 'text' | 'video' | 'image' | 'audio' | 'document'
    size: string
    duration?: number
    isPublished: boolean
    createdAt: string
    description?: string
    fileUrl?: string
}

interface ViewContentDialogProps {
    content: ContentItem | null;
    onClose: () => void;
    onEdit?: (content: ContentItem) => void;
    onDelete?: (contentId: number) => void;
}

const ViewContentDialog = ({ content, onClose, onEdit, onDelete }: ViewContentDialogProps) => {
    if (!content) return null;

    const getTypeIcon = (type: string) => {
        const icons = {
            'text': FileText,
            'video': Video,
            'image': Image,
            'audio': File,
            'document': File
        }
        return icons[type as keyof typeof icons] || FileText
    }

    const getTypeBadge = (type: string) => {
        const types = {
            'text': { label: 'Text', color: 'bg-blue-500' },
            'video': { label: 'Video', color: 'bg-red-500' },
            'image': { label: 'Image', color: 'bg-green-500' },
            'audio': { label: 'Audio', color: 'bg-purple-500' },
            'document': { label: 'Document', color: 'bg-orange-500' }
        }
        return types[type as keyof typeof types] || { label: type, color: 'bg-gray-500' }
    }

    const TypeIcon = getTypeIcon(content.type);
    const typeInfo = getTypeBadge(content.type);

    const handleDownload = () => {
        if (content.fileUrl) {
            // TODO: Implement download functionality
            console.log('Downloading file:', content.fileUrl);
        }
    };

    const handlePreview = () => {
        if (content.fileUrl) {
            // TODO: Implement preview functionality
            window.open(content.fileUrl, '_blank');
        }
    };

    return (
        <DialogContent className="bg-gradient-to-br from-white to-gray-50 border-border max-w-4xl max-h-[95vh] overflow-hidden">
            <DialogHeader className="pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <TypeIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <DialogTitle className="text-2xl font-bold text-foreground">
                            {content.title}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {content.lessonTitle} • JLPT N{content.lessonLevel}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Badge className={`${typeInfo.color} text-white`}>
                            {typeInfo.label}
                        </Badge>
                        <Badge className={content.isPublished ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}>
                            {content.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                    </div>
                </div>
            </DialogHeader>

            <div className="overflow-y-auto max-h-[calc(95vh-200px)] pr-2">
                <div className="space-y-6">
                    {/* Content Details */}
                    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Eye className="h-5 w-5 text-primary" />
                                Content Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Title</label>
                                    <p className="text-sm text-muted-foreground">{content.title}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Type</label>
                                    <div className="flex items-center gap-2">
                                        <TypeIcon className="h-4 w-4" />
                                        <span className="text-sm">{typeInfo.label}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Lesson</label>
                                    <p className="text-sm text-muted-foreground">{content.lessonTitle}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">JLPT Level</label>
                                    <Badge className="bg-blue-100 text-blue-800">JLPT N{content.lessonLevel}</Badge>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Size</label>
                                    <div className="flex items-center gap-2">
                                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">{content.size}</span>
                                    </div>
                                </div>
                                {content.duration && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Duration</label>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">{content.duration}s</span>
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Created</label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">{content.createdAt}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Status</label>
                                    <Badge className={content.isPublished ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}>
                                        {content.isPublished ? 'Published' : 'Draft'}
                                    </Badge>
                                </div>
                            </div>
                            
                            {content.description && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Description</label>
                                    <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                                        {content.description}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* File Preview/Actions */}
                    {content.type !== 'text' && (
                        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <File className="h-5 w-5 text-primary" />
                                    File Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={handlePreview}
                                        className="flex items-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Preview
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleDownload}
                                        className="flex items-center gap-2"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center pt-4">
                <div className="text-xs text-muted-foreground">
                    Content ID: {content.id}
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-border text-foreground hover:bg-gray-50 h-10 px-6"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Close
                    </Button>
                    {onEdit && (
                        <Button
                            variant="outline"
                            onClick={() => onEdit(content)}
                            className="border-border text-foreground bg-transparent hover:bg-gray-50 h-10 px-6"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="destructive"
                            onClick={() => onDelete(content.id)}
                            className="h-10 px-6"
                        >
                            Delete
                        </Button>
                    )}
                </div>
            </div>
        </DialogContent>
    )
}

export default ViewContentDialog
