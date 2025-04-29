// BlogViewEdit.tsx
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, updateBlog } from '@/services/api'; // you need to create these APIs
import { Loader2, Save, Pencil } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  template: string;
  order: number;
  contents: { id: string; type: string; order: number; content: string }[];
}

interface BlogData {
  category: string;
  featured_image: string;
  is_published: boolean;
  tags: any[];
  author_id: any;
  title: string;
  description: string;
  chapters: Chapter[];
}

export const ViewBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogById(id!); 
        console.log(data);
        // const parsed = JSON.parse(data.blog_data_json);
        setBlogData(data);
      } catch (error) {
        console.error('Failed to fetch blog', error);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSave = async () => {
    if (!blogData) return;
  
    setSaving(true);
    try {
      // Prepare the blog data to send
      const updatePayload = {
        blog_data_json: JSON.stringify(blogData),
        title: blogData.title,
        description: blogData.description,
        author_id: blogData.author_id, // Ensure author_id is included
        tags: blogData.tags || [],
        is_published: blogData.is_published || false,
        featured_image: blogData.featured_image || "",
        category: blogData.category || "General"
      };
  
      // Call the updateBlog API with the correct structure
      await updateBlog(id!, updatePayload);
  
      setEditMode(false); // Switch to view mode after saving
    } catch (error) {
      console.error('Failed to save blog', error);
    } finally {
      setSaving(false);
    }
  };
  

  if (!blogData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">{editMode ? 'Edit Blog' : 'View Blog'}</h1>
        <div className="flex gap-2">
          {editMode ? (
            <>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save
                  
                </>
              )}
            </Button>
            <Button onClick={() => setEditMode(false)}>
            Cancel
         </Button>
         </>
          ) : (
            <div>
            <Button className="mr-4" onClick={() => setEditMode(true)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
            </div>
          )}
          
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="font-semibold">Title</label>
        {editMode ? (
          <Input
            value={blogData.title}
            onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
            className="mt-1"
          />
        ) : (
          <p className="mt-1">{blogData.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="font-semibold">Description</label>
        {editMode ? (
          <Textarea
            value={blogData.description}
            onChange={(e) => setBlogData({ ...blogData, description: e.target.value })}
            className="mt-1"
          />
        ) : (
          <p className="mt-1">{blogData.description || 'No description'}</p>
        )}
      </div>

      {/* Chapters */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Chapters</h2>
        {blogData.chapters.map((chapter, chapterIndex) => (
          <div key={chapter.id} className="border p-4 rounded-md mb-6">
            <div className="mb-2">
              <label className="font-semibold">Chapter Title</label>
              {editMode ? (
                <Input
                  value={chapter.title}
                  onChange={(e) => {
                    const updatedChapters = [...blogData.chapters];
                    updatedChapters[chapterIndex].title = e.target.value;
                    setBlogData({ ...blogData, chapters: updatedChapters });
                  }}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{chapter.title}</p>
              )}
            </div>

            {/* Contents inside chapter */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Contents</h3>
              {chapter.contents.map((content, contentIndex) => (
                <div key={content.id} className="mb-4">
                  <label className="font-medium">Content {contentIndex + 1}</label>
                  {editMode ? (
                    <Textarea
                      value={content.content}
                      onChange={(e) => {
                        const updatedChapters = [...blogData.chapters];
                        updatedChapters[chapterIndex].contents[contentIndex].content = e.target.value;
                        setBlogData({ ...blogData, chapters: updatedChapters });
                      }}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{content.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
