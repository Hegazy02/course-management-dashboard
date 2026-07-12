import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv)$/i;

export const isYouTubeUrl = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

export const isValidCourseUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isPlayableUrl = (url: string): boolean => {
  return !!isYouTubeUrl(url) || VIDEO_EXTENSIONS.test(url);
};

export const embedUrl = (url: string, sanitizer: DomSanitizer): SafeResourceUrl => {
  const ytId = isYouTubeUrl(url);
  if (ytId) {
    return sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${ytId}`);
  }
  return sanitizer.bypassSecurityTrustResourceUrl(url);
};
