
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";
import { Camera, Upload, X } from "lucide-react";

export function ProfileSettings() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: { profilePhoto?: string }) => {
      return apiRequest("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Profile updated successfully" });
      setSelectedFile(null);
      setPreviewUrl(null);
    },
    onError: (error) => {
      console.error("Update profile error:", error);
      toast({ 
        title: "Error updating profile", 
        variant: "destructive" 
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({ 
          title: "Invalid file type", 
          description: "Please select an image file",
          variant: "destructive" 
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({ 
          title: "File too large", 
          description: "Please select an image smaller than 5MB",
          variant: "destructive" 
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      updateProfileMutation.mutate({ profilePhoto: base64String });
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleRemovePhoto = () => {
    updateProfileMutation.mutate({ profilePhoto: null });
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Profile Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and profile photo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage 
                  src={previewUrl || user.profilePhoto || undefined} 
                  alt="Profile" 
                />
                <AvatarFallback className="text-2xl bg-navy-100 text-navy-900">
                  {user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {(user.profilePhoto && !previewUrl) && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={handleRemovePhoto}
                  disabled={updateProfileMutation.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Upload a profile photo (max 5MB)
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, GIF
              </p>
            </div>
          </div>

          {selectedFile && (
            <div className="flex justify-center space-x-2">
              <Button
                onClick={handleUpload}
                disabled={updateProfileMutation.isPending}
                className="btn-navy"
              >
                <Upload className="w-4 h-4 mr-2" />
                {updateProfileMutation.isPending ? "Uploading..." : "Upload Photo"}
              </Button>
              <Button
                variant="outline"
                onClick={clearSelection}
                disabled={updateProfileMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          )}

          {!selectedFile && (
            <div className="flex justify-center">
              <Label htmlFor="photo-upload" className="cursor-pointer">
                <Button asChild className="btn-navy">
                  <span>
                    <Camera className="w-4 h-4 mr-2" />
                    Choose Photo
                  </span>
                </Button>
              </Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email Address</Label>
            <Input value={user.email} disabled />
          </div>
          <div>
            <Label>Role</Label>
            <Input value={user.role} disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
