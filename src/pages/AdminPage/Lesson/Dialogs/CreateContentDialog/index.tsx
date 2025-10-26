import { DialogContent, DialogHeader, DialogTitle } from "@ui/Dialog";
import { Input } from "@ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/Select";
import { Button } from "@ui/Button";
import { Switch } from "@ui/Switch";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Badge } from "@ui/Badge";
import { Separator } from "@ui/Separator";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Video,
  Image,
  File,
  Upload,
  Save,
  Send,
  X,
  Clock,
  HardDrive,
  BookOpen,
} from "lucide-react";

interface CreateContentDialogProps {
  setIsAddDialogOpen: (value: boolean) => void;
  lessonId?: number;
  lessonTitle?: string;
  availableLessons?: Array<{
    id: number;
    title: string;
    level: number;
    slug: string;
  }>;
}

const CreateContentDialog = ({
  setIsAddDialogOpen,
  lessonId,
  lessonTitle,
  availableLessons = [],
}: CreateContentDialogProps) => {
  const { t } = useTranslation();

  // Mock lessons data - replace with actual API call
  const lessons =
    availableLessons.length > 0
      ? availableLessons
      : [
          { id: 1, title: "Basic Hiragana", level: 5, slug: "basic-hiragana" },
          { id: 2, title: "Basic Kanji", level: 4, slug: "basic-kanji" },
          { id: 3, title: "Greetings", level: 5, slug: "greetings" },
          { id: 4, title: "Numbers", level: 5, slug: "numbers" },
          { id: 5, title: "Family", level: 4, slug: "family" },
        ];

  const [formData, setFormData] = useState({
    title: "",
    type: "text" as "text" | "video" | "image" | "audio" | "document",
    description: "",
    file: null as File | null,
    duration: 0,
    isPublished: false,
    lessonId: lessonId || lessons[0]?.id || 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file: file,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (formData.type !== "text" && !formData.file) {
      newErrors.file = "File is required for this content type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isPublish: boolean = false) => {
    if (!validateForm()) {
      toast.error("Please check your information");
      return;
    }

    try {
      // TODO: Implement API call
      console.log("Creating content:", { ...formData, isPublished: isPublish });
      toast.success(
        isPublish
          ? "Content published successfully!"
          : "Content saved as draft!"
      );
      setIsAddDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create content");
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      text: FileText,
      video: Video,
      image: Image,
      audio: File,
      document: File,
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      text: "bg-blue-500",
      video: "bg-red-500",
      image: "bg-green-500",
      audio: "bg-purple-500",
      document: "bg-orange-500",
    };
    return colors[type as keyof typeof colors] || "bg-gray-500";
  };

  const TypeIcon = getTypeIcon(formData.type);

  return (
    <>
      <DialogContent className="bg-gradient-to-br from-white to-gray-50 border-border max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TypeIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                Add Content
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {lessonTitle && `For lesson: ${lessonTitle}`}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-200px)] pr-2">
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Content Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Title *
                  </label>
                  <Input
                    placeholder="Enter content title"
                    className="bg-background border-border text-foreground h-11 text-base"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Content Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Content Type *
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger className="bg-background border-border text-foreground h-11">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="text">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>Text</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          <span>Video</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="audio">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4" />
                          <span>Audio</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="image">
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          <span>Image</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="document">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4" />
                          <span>Document</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Lesson Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Select Lesson *
                  </label>
                  <Select
                    value={formData.lessonId.toString()}
                    onValueChange={(value) =>
                      handleInputChange("lessonId", parseInt(value))
                    }
                  >
                    <SelectTrigger className="bg-background border-border text-foreground h-11">
                      <SelectValue placeholder="Select a lesson" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {lessons.map((lesson) => (
                        <SelectItem
                          key={lesson.id}
                          value={lesson.id.toString()}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {lesson.title}
                            </span>
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              JLPT N{lesson.level}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Description *
                  </label>
                  <Input
                    placeholder="Enter content description"
                    className="bg-background border-border text-foreground h-11 text-base"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* File Upload */}
                {formData.type !== "text" && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      File *
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload or drag and drop
                      </p>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept={
                          formData.type === "video"
                            ? "video/*"
                            : formData.type === "audio"
                            ? "audio/*"
                            : formData.type === "image"
                            ? "image/*"
                            : "*"
                        }
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm">
                          Choose File
                        </Button>
                      </label>
                      {formData.file && (
                        <p className="text-xs text-green-600 mt-2">
                          Selected: {formData.file.name}
                        </p>
                      )}
                    </div>
                    {errors.file && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.file}
                      </p>
                    )}
                  </div>
                )}

                {/* Duration (for video/audio) */}
                {(formData.type === "video" || formData.type === "audio") && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Duration (seconds)
                    </label>
                    <Input
                      type="number"
                      placeholder="180"
                      className="bg-background border-border text-foreground h-11"
                      value={formData.duration}
                      onChange={(e) =>
                        handleInputChange(
                          "duration",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Publish Status */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Send className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <label
                        htmlFor="isPublished"
                        className="text-sm font-semibold text-foreground cursor-pointer"
                      >
                        Publish immediately
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Content will be visible to users immediately
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) =>
                      handleInputChange("isPublished", checked)
                    }
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between items-center pt-4">
          <div className="text-xs text-muted-foreground">* Required fields</div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-border text-foreground hover:bg-gray-50 h-10 px-6"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground bg-transparent hover:bg-gray-50 h-10 px-6"
              onClick={() => handleSubmit(false)}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 h-10 px-6 shadow-lg"
              onClick={() => handleSubmit(true)}
            >
              <Send className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </DialogContent>
    </>
  );
};

export default CreateContentDialog;
