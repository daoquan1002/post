import React, { useState } from 'react';
import { 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  BadgeCheck,
  ArrowLeft,
  X,
  EyeOff,
  Eye
} from 'lucide-react';

// Mock Data
const USER = {
  name: "Quan.",
  handle: "@daoquan1002",
  bio: "chia sẻ những công nghệ thú vị.",
  location: "Vietnam",
  link: "youtube.com/@Quan.-Technology",
  joined: "Tạo vào tháng 2 năm 2026",
  avatar: "https://pbs.twimg.com/profile_images/2016887496500756480/URJmaXBi_400x400.jpg",
  banner: "https://pbs.twimg.com/profile_banners/1489891540365635588/1769698425/1500x500"
};

const POSTS = [
  {
    id: 3,
    author: USER,
    content: "kamome sano / without you (2022 Remaster)",
    time: "27/02/2026",
    media: [
      { type: "audio", url: "https://raw.githubusercontent.com/daoquan1002/post/refs/heads/main/music/without you.flac" },
    ]
  },
  {
    id: 2,
    author: USER,
    content: "kamome sano / happy ending",
    time: "27/02/2026",
    media: [
      { type: "audio", url: "https://raw.githubusercontent.com/daoquan1002/post/refs/heads/main/music/Kamome Sano - happy ending.opus" },
    ]
  },
  {
    id: 1,
    author: USER,
    content: "a cute enanan, she adorable\n#ShinonomeEna",
    time: "26/02/2026",
    isSensitive: true,
    media: [
      { type: "image", url: "https://raw.githubusercontent.com/daoquan1002/post/refs/heads/main/images/20260226_081904.jpg" },
    ]
  }
];

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [revealedPosts, setRevealedPosts] = useState<number[]>([]);

  const toggleReveal = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealedPosts(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const activePost = selectedPost ? POSTS.find(p => p.id === selectedPost) : null;

  const renderContentWithLinks = (content: string) => {
    // Regex to match URLs and Hashtags
    const regex = /(https?:\/\/[^\s]+|#[^\s#]+)/g;
    
    // Split the content
    const parts = content.split(regex);
    
    return (
      <p className="mt-1 text-[15px] leading-relaxed text-[var(--color-on-surface)] whitespace-pre-wrap">
        {parts.map((part, index) => {
          if (part.match(/^https?:\/\/[^\s]+/)) {
            return (
              <a 
                key={index} 
                href={part} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {part}
              </a>
            );
          } else if (part.match(/^#[^\s#]+/)) {
            const searchQuery = encodeURIComponent(part);
            return (
              <a 
                key={index} 
                href={`https://www.google.com/search?q=${searchQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:underline cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                {part}
              </a>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </p>
    );
  };

  const renderMedia = (media: any[]) => {
    if (!media || media.length === 0) return null;

    const hasAudio = media.some(m => m.type === 'audio');

    const getGridClass = (length: number) => {
      if (hasAudio) return "grid-cols-1";
      if (length === 1) return "grid-cols-1";
      if (length === 2) return "grid-cols-2";
      if (length === 3) return "grid-cols-2";
      if (length >= 4) return "grid-cols-2";
      return "grid-cols-1";
    };

    const isGrid = media.length > 1 && !hasAudio;

    return (
      <div className={`mt-3 grid gap-1 rounded-2xl overflow-hidden border border-[var(--color-surface-container-high)] ${getGridClass(media.length)}`}>
        {media.map((item, index) => {
          const isFirstOfThree = media.length === 3 && index === 0;
          const colSpanClass = isFirstOfThree ? "col-span-2" : "";
          
          return (
            <div 
              key={index} 
              className={`relative bg-[var(--color-surface-container)] cursor-pointer ${colSpanClass}`}
              onClick={(e) => {
                if (item.type === 'image') {
                  e.stopPropagation();
                  setSelectedImage(item.url);
                }
              }}
            >
              {item.type === 'image' && (
                <img 
                  src={item.url} 
                  alt="Post media" 
                  className={`w-full h-full object-cover ${isGrid ? 'aspect-square' : 'max-h-[500px]'}`}
                  referrerPolicy="no-referrer"
                />
              )}
              {item.type === 'video' && (
                <video 
                  src={item.url} 
                  controls
                  className={`w-full h-full object-cover bg-black ${isGrid ? 'aspect-square' : 'max-h-[500px]'}`}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              {item.type === 'audio' && (
                <div className="p-4 w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                  <audio 
                    src={item.url} 
                    controls
                    className="w-full"
                  />
                </div>
              )}
              {item.type === 'youtube' && (
                <iframe 
                  src={item.url} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full aspect-video"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex justify-center">
      {/* Main Column */}
      <main className="w-full max-w-2xl border-x border-[var(--color-surface-container-high)] min-h-screen relative pb-24 sm:pb-0">
        
        {/* Post Detail View */}
        {activePost ? (
          <div className="absolute inset-0 bg-[var(--color-surface)] z-40 flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-surface-container-high)]">
              <div className="flex items-center gap-6 px-4 h-16">
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="p-2 -ml-2 rounded-full hover:bg-[var(--color-surface-container-high)] transition-colors text-[var(--color-on-surface)]"
                >
                  <ArrowLeft size={24} />
                </button>
                <h1 className="font-display font-bold text-xl leading-tight text-[var(--color-on-surface)]">Bài đăng</h1>
              </div>
            </header>
            
            <div className="p-4">
              <div className="flex gap-3 items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-surface-container)]">
                  <img 
                    src={activePost.author.avatar} 
                    alt={activePost.author.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[15px] text-[var(--color-on-surface)]">{activePost.author.name}</span>
                    <BadgeCheck size={16} className="text-[var(--color-primary)] fill-[var(--color-primary)]/20" />
                  </div>
                  <span className="font-google-sans text-[15px] text-[var(--color-on-surface-variant)]">{activePost.author.handle}</span>
                </div>
              </div>
              
              <div className="relative">
                {activePost.isSensitive && !revealedPosts.includes(activePost.id) && (
                  <div className="absolute inset-0 z-10 backdrop-blur-xl bg-[var(--color-surface)]/60 flex flex-col items-center justify-center rounded-xl border border-[var(--color-surface-container-high)]">
                    <EyeOff size={32} className="text-[var(--color-on-surface-variant)] mb-2" />
                    <p className="font-bold text-[var(--color-on-surface)] mb-1">Nội dung nhạy cảm</p>
                    <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">Bài viết này có thể chứa nội dung nhạy cảm.</p>
                    <button 
                      onClick={(e) => toggleReveal(activePost.id, e)}
                      className="px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                      Hiển thị
                    </button>
                  </div>
                )}
                
                <div className={activePost.isSensitive && !revealedPosts.includes(activePost.id) ? "opacity-0" : ""}>
                  <div className="text-[17px] leading-relaxed text-[var(--color-on-surface)] whitespace-pre-wrap">
                    {renderContentWithLinks(activePost.content)}
                  </div>
                  
                  {renderMedia(activePost.media)}
                </div>
              </div>
              
              <div className="mt-4 py-4 border-y border-[var(--color-surface-container-high)] text-[15px] text-[var(--color-on-surface-variant)]">
                <span>Đã đăng vào lúc {activePost.time}</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Top App Bar */}
            <header className="sticky top-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-surface-container-high)]">
              <div className="flex items-center h-14">
                <div className="ml-[20px] text-[var(--color-on-surface)] flex items-center">
                  <img 
                    src="https://raw.githubusercontent.com/daoquan1002/post/refs/heads/main/quan.-logo.png" 
                    alt="Quan." 
                    className="h-7"
                  />
                </div>
              </div>
            </header>

            {/* Profile Header */}
        <div className="relative">
          {/* Banner */}
          <div className="h-48 sm:h-56 w-full bg-[var(--color-surface-container)] relative overflow-hidden">
            <img 
              src={USER.banner} 
              alt="Profile banner" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Avatar & Edit Button */}
          <div className="flex justify-between items-end px-4 -mt-16 relative z-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-[var(--color-surface)] overflow-hidden bg-[var(--color-surface-container)] shadow-sm">
                <img 
                  src={USER.avatar} 
                  alt={USER.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="px-4 pt-3 pb-4">
            <div className="flex items-center gap-1">
              <h2 className="font-bold text-2xl text-[var(--color-on-surface)]">{USER.name}</h2>
              <BadgeCheck size={20} className="text-[var(--color-primary)] fill-[var(--color-primary)]/20" />
            </div>
            <p className="font-google-sans text-[var(--color-on-surface-variant)] text-base">{USER.handle}</p>
            
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-on-surface)]">
              {USER.bio}
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-[15px] text-[var(--color-on-surface-variant)]">
              <div className="flex items-center gap-1.5">
                <MapPin size={18} />
                <span>{USER.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <LinkIcon size={18} />
                <a href={`https://${USER.link}`} className="text-[var(--color-primary)] hover:underline">{USER.link}</a>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={18} />
                <span>{USER.joined}</span>
              </div>
            </div>
          </div>
          
          {/* Thin Divider */}
          <div className="h-[1px] w-full bg-[var(--color-surface-container-high)]"></div>
        </div>

        {/* Feed */}
        <div className="divide-y divide-[var(--color-surface-container-high)]">
          {POSTS.map(post => (
            <article 
              key={post.id} 
              onClick={() => setSelectedPost(post.id)}
              className="p-4 hover:bg-[var(--color-surface-container)]/30 transition-colors cursor-pointer"
            >
              <div className="flex gap-3">
                {/* Post Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--color-surface-container)]">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-bold text-[15px] text-[var(--color-on-surface)] truncate">{post.author.name}</span>
                      <BadgeCheck size={16} className="text-[var(--color-primary)] fill-[var(--color-primary)]/20 flex-shrink-0" />
                      <span className="font-google-sans text-[15px] text-[var(--color-on-surface-variant)] truncate">{post.author.handle}</span>
                      <span className="text-[15px] text-[var(--color-on-surface-variant)]">·</span>
                      <span className="text-[15px] text-[var(--color-on-surface-variant)] hover:underline">{post.time}</span>
                    </div>
                  </div>

                  <div className="relative mt-1">
                    {post.isSensitive && !revealedPosts.includes(post.id) && (
                      <div className="absolute inset-0 z-10 backdrop-blur-xl bg-[var(--color-surface)]/60 flex flex-col items-center justify-center rounded-xl border border-[var(--color-surface-container-high)] -mx-2 px-2">
                        <EyeOff size={24} className="text-[var(--color-on-surface-variant)] mb-2" />
                        <p className="font-bold text-[var(--color-on-surface)] text-sm mb-1">Nội dung nhạy cảm</p>
                        <button 
                          onClick={(e) => toggleReveal(post.id, e)}
                          className="px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
                        >
                          Hiển thị
                        </button>
                      </div>
                    )}
                    
                    <div className={post.isSensitive && !revealedPosts.includes(post.id) ? "opacity-0" : ""}>
                      <div>
                        {renderContentWithLinks(post.content)}
                      </div>

                      {renderMedia(post.media)}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-8 border-t border-[var(--color-surface-container-high)] py-6 px-4 text-center">
          <p className="text-sm text-[var(--color-on-surface-variant)] opacity-70">
            Đã cập nhật: 27/02/2026
          </p>
          <p className="font-cabin text-sm text-[var(--color-on-surface-variant)] opacity-70 mt-1">
            Quan. Works
          </p>
        </footer>
        </>
        )}
      </main>

      {/* Image Overlay */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center backdrop-blur-sm cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X size={24} />
          </button>
          <img 
            src={selectedImage} 
            alt="Full screen media" 
            className="max-w-full max-h-full object-contain cursor-default"
            onClick={(e) => e.stopPropagation()}
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
}
