import React, { useEffect, useState, useRef  } from "react";
import { ChevronDown, ChevronUp, Download, ArrowLeft, Search, User, Book, Award, Check, BookOpen, Globe, FileText, Clock, Calendar, FileSearch } from "lucide-react";
import styles from './CourseDisplay.module.css';
import { getCourseById } from "@/services/api.tsx";

interface ContentItem {
  id: string;
  type: string;
  order: number;
  content: {
    url?: string;
    filename?: string;
    text?: string;
    code?: string;
    [key: string]: any;
  };
  
}

interface Chapter {
  id: string;
  title: string;
  template: string;
  order: number;
  contents: ContentItem[];
}

interface Course {
  title: string;
  theme: string;
  chapters: Chapter[];
}

interface StudentData {
  name: string;
  email: string;
  enrollmentDate: string;
  assignedBy: string;
}

const CourseDisplay: React.FC = () => {
  const courseId = "680722091c717f2f59d41dac";
  const [course, setCourse] = useState<Course | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<{ [key: string]: boolean }>({});
  const [completedChapters, setCompletedChapters] = useState<{ [key: string]: boolean }>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [webSearchTerm, setWebSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("outline");
  const [currentTime, setCurrentTime] = useState(new Date());
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const handleSaveNotes = () => {
    const text = notesRef.current?.value || '';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'course-notes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearNotes = () => {
    if (notesRef.current) notesRef.current.value = '';
  };
  // Mock student data
  const studentData: StudentData = {
    name: "John Doe",
    email: "john.doe@example.com",
    enrollmentDate: "2025-03-15",
    assignedBy: "Prof. Jane Smith"
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(courseId);
        setCourse(data);
        
        // Initialize expanded state for first chapter
        if (data.chapters.length > 0) {
          setExpandedChapters({ [data.chapters[0].id]: true });
        }
      } catch (err) {
        console.error("Failed to fetch course:", err);
      }
    };
    fetchCourse();

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [courseId]);

  const toggleChapterExpansion = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const markChapterAsRead = (chapterId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleWebSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (webSearchTerm) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(webSearchTerm + " " + (course?.title || ""))}`, "_blank");
    }
  };

  const getDrivePreviewUrl = (url: string) => {
    return url.replace('export=download', 'export=view');
  };

  const getDirectImageUrl = (url: string) => {
    const match = url.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

  const calculateProgress = () => {
    if (!course) return 0;
    const totalChapters = course.chapters.length;
    const completedCount = Object.values(completedChapters).filter(Boolean).length;
    return Math.round((completedCount / totalChapters) * 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderContentItem = (content: ContentItem) => {
    switch (content.type) {
      case "text":
        return <p className={styles.textContent}>{content.content || "No text available"}</p>;
      case "link":
        return (
          <a 
            href={content.content.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.link}
          >
            {content.content || content.content.url}
          </a>
        );
      case "youtube":
        return (
          <div className={styles.videoContainer}>
            <iframe
              width="100%"
              height="400"
              src={content.content.replace("watch?v=", "embed/")}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      case "code":
        return (
          <pre className={styles.codeBlock}>
            <code>{content.content.code}</code>
          </pre>
        );
      case "image":
        return (
          <div className={styles.imageContent}>
            <div className={styles.imagePreview}>
              <iframe
                src={getDrivePreviewUrl(content.content.url || '')}
                title={content.content.filename || "Uploaded image"}
                className={styles.image}
                allow="autoplay; fullscreen"
              ></iframe>
            </div>
            <a
              href={content.content.url}
              download={content.content.filename}
              className={styles.downloadLink}
            >
              <Download size={16} /> Download Image
            </a>
          </div>
        );
      case "video":
        return (
          <div className={styles.videoContent}>
            <div className={styles.videoPreview}>
              <iframe
                src={getDrivePreviewUrl(content.content.url || '')}
                title={content.content.filename || "Uploaded video"}
                className={styles.videoFrame}
                allow="autoplay; fullscreen"
              ></iframe>
            </div>
            <a
              href={content.content.url}
              download={content.content.filename}
              className={styles.downloadLink}
            >
              <Download size={16} /> Download Video
            </a>
          </div>
        );
      case "pdf":
        return (
          <div className={styles.pdfContent}>
            <div className={styles.pdfPreview}>
              <iframe
                src={getDrivePreviewUrl(content.content.url || '')}
                title={content.content.filename || "PDF Preview"}
                className={styles.pdfFrame}
              ></iframe>
            </div>
            <a
              href={content.content.url}
              download={content.content.filename}
              className={styles.downloadLink}
            >
              <Download size={16} /> Download PDF
            </a>
          </div>
        );
      default:
        return <div className={styles.unsupported}>Unsupported content type: {content.type}</div>;
    }
  };

  if (!course) {
    return <div className={styles.loadingContainer}>Loading course...</div>;
  }

  return (
    <div className={styles.appContainer}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarContent}>
          <div className={styles.studentProfile}>
            <div className={styles.profileAvatar}>
              <User size={48} />
            </div>
            <h3>{studentData.name}</h3>
            <p>{studentData.email}</p>
            <div className={styles.currentTime}>
              <Clock size={16} />
              <span>{formatTime(currentTime)}</span>
            </div>
          </div>
          
          <div className={styles.courseProgress}>
            <h4>Course Progress</h4>
            <div className={styles.progressContainer}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <p>{calculateProgress()}% Complete</p>
          </div>
          
          <div className={styles.sidebarTabs}>
            <button 
              className={`${styles.tabButton} ${activeTab === "outline" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("outline")}
            >
              <BookOpen size={18} />
              <span>Outline</span>
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === "info" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("info")}
            >
              <FileText size={18} />
              <span>Info</span>
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === "web" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("web")}
            >
              <Globe size={18} />
              <span>Web Search</span>
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === "notes" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("notes")}
            >
              <FileSearch size={18} />
              <span>Notes</span>
            </button>
          </div>
          
          {activeTab === "outline" && (
            <div className={styles.courseOutline}>
              <h4>Course Outline</h4>
              <ul>
                {course.chapters.map((chapter, index) => (
                  <li 
                    key={chapter.id} 
                    className={`${styles.outlineItem} ${completedChapters[chapter.id] ? styles.completedChapter : ""}`}
                    onClick={() => {
                      toggleChapterExpansion(chapter.id);
                      // Auto-scroll to the chapter
                      document.getElementById(`chapter-${chapter.id}`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <div className={styles.outlineItemContent}>
                      <span className={styles.outlineChapterNumber}>{index + 1}</span>
                      <span className={styles.outlineChapterTitle}>{chapter.title}</span>
                    </div>
                    {completedChapters[chapter.id] && <Check size={16} className={styles.checkIcon} />}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {activeTab === "info" && (
            <div className={styles.courseInfo}>
              <div className={styles.infoCard}>
                <h4>Course Details</h4>
                <div className={styles.infoItem}>
                  <Book size={16} />
                  <span>{course.chapters.length} Chapters</span>
                </div>
                <div className={styles.infoItem}>
                  <Award size={16} />
                  <span>Assigned by: {studentData.assignedBy}</span>
                </div>
                <div className={styles.infoItem}>
                  <Calendar size={16} />
                  <span>Enrolled: {studentData.enrollmentDate}</span>
                </div>
                <div className={styles.infoItem}>
                  <Clock size={16} />
                  <span>Est. Completion: 4 weeks</span>
                </div>
              </div>
              
              <div className={styles.reminderCard}>
                <h4>Upcoming Deadlines</h4>
                <div className={styles.reminderItem}>
                  <span className={styles.reminderDate}>Apr 25, 2025</span>
                  <span className={styles.reminderTitle}>Assignment 1 Due</span>
                </div>
                <div className={styles.reminderItem}>
                  <span className={styles.reminderDate}>May 10, 2025</span>
                  <span className={styles.reminderTitle}>Final Project</span>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "web" && (
            <div className={styles.webSearch}>
              <h4>Search Web for Resources</h4>
              <form onSubmit={handleWebSearch}>
                <div className={styles.webSearchInputContainer}>
                  <input
                    type="text"
                    placeholder="Search related topics..."
                    value={webSearchTerm}
                    onChange={(e) => setWebSearchTerm(e.target.value)}
                    className={styles.webSearchInput}
                  />
                  <button type="submit" className={styles.webSearchButton}>
                    <Search size={18} />
                  </button>
                </div>
              </form>
              
              <div className={styles.suggestedSearches}>
                <h5>Suggested Searches:</h5>
                <div className={styles.searchTags}>
                  <button 
                    className={styles.searchTag}
                    onClick={() => setWebSearchTerm(`${course.title} examples`)}
                  >
                    Examples
                  </button>
                  <button 
                    className={styles.searchTag}
                    onClick={() => setWebSearchTerm(`${course.title} tutorial`)}
                  >
                    Tutorials
                  </button>
                  <button 
                    className={styles.searchTag}
                    onClick={() => setWebSearchTerm(`${course.title} exercises`)}
                  >
                    Exercises
                  </button>
                  <button 
                    className={styles.searchTag}
                    onClick={() => setWebSearchTerm(`${course.title} best practices`)}
                  >
                    Best Practices
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "notes" && (
            <div className={styles.notesSection}>
              <h4>Course Notes</h4>
      <textarea
        ref={notesRef}
        className={styles.notesTextarea}
        placeholder="Take notes here..."
        rows={10}
      ></textarea>
      <div className={styles.notesActions}>
        <button className={styles.saveNotesButton} onClick={handleSaveNotes}>
          Save Notes
        </button>
        <button className={styles.clearNotesButton} onClick={handleClearNotes}>
          Clear
        </button>
      </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button className={styles.menuToggle} onClick={toggleSidebar}>
              {sidebarOpen ? <ArrowLeft size={20} /> : <Book size={20} />}
            </button>
            <button className={styles.backButton}>
              <ArrowLeft size={20} /> Back to Dashboard
            </button>
          </div>
          <div className={styles.searchContainer}>
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search in course..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        
        <div className={styles.header}>
          <h1 className={styles.courseTitle}>{course.title}</h1>
          <div className={styles.courseBadges}>
            <span className={styles.courseBadge}>{course.theme}</span>
            <span className={styles.courseBadge}>{course.chapters.length} Chapters</span>
          </div>
        </div>

        {course.chapters.map((chapter, index) => (
          <div
            id={`chapter-${chapter.id}`}
            key={chapter.id}
            className={`${styles.chapterDisplay} ${completedChapters[chapter.id] ? styles.completedChapterCard : ""}`}
          >
            <div
              className={styles.chapterHeader}
              onClick={() => toggleChapterExpansion(chapter.id)}
            >
              <div className={styles.chapterHeaderLeft}>
                <span className={styles.chapterNumber}>{index + 1}</span>
                <h2 className={styles.chapterTitle}>{chapter.title}</h2>
                {completedChapters[chapter.id] && <Check size={20} className={styles.completedIcon} />}
              </div>
              
              <div className={styles.chapterHeaderRight}>
                <button 
                  className={`${styles.markReadButton} ${completedChapters[chapter.id] ? styles.marked : ''}`}
                  onClick={(e) => markChapterAsRead(chapter.id, e)}
                >
                  {completedChapters[chapter.id] ? 'Completed' : 'Mark as Read'}
                </button>
                <button className={styles.expandButton}>
                  {expandedChapters[chapter.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            {expandedChapters[chapter.id] && (
              <div className={styles.chapterContents}>
                {chapter.contents.map((contentItem) => (
                  <div key={contentItem.id} className={styles.contentItemWrapper}>
                    <div className={styles.contentItem}>
                      {renderContentItem(contentItem)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDisplay;