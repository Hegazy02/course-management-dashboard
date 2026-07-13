import { DomSanitizer } from '@angular/platform-browser';
import { isYouTubeUrl, isValidCourseUrl, isPlayableUrl, embedUrl } from './handle-url';

describe('isYouTubeUrl', () => {
  it('should extract video ID from youtube.com/watch', () => {
    expect(isYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('should extract video ID from youtu.be short link', () => {
    expect(isYouTubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('should return null for non-YouTube URLs', () => {
    expect(isYouTubeUrl('https://vimeo.com/123456')).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(isYouTubeUrl('')).toBeNull();
  });
});

describe('isValidCourseUrl', () => {
  it('should return true for valid http URLs', () => {
    expect(isValidCourseUrl('http://example.com/video.mp4')).toBe(true);
  });

  it('should return true for valid https URLs', () => {
    expect(isValidCourseUrl('https://example.com/video.mp4')).toBe(true);
  });

  it('should return false for invalid strings', () => {
    expect(isValidCourseUrl('not-a-url')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidCourseUrl('')).toBe(false);
  });
});

describe('isPlayableUrl', () => {
  it('should return true for YouTube URLs', () => {
    expect(isPlayableUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
  });

  it('should return true for direct mp4 URLs', () => {
    expect(isPlayableUrl('https://example.com/video.mp4')).toBe(true);
  });

  it('should return true for webm URLs', () => {
    expect(isPlayableUrl('https://example.com/video.webm')).toBe(true);
  });

  it('should return false for unsupported extensions', () => {
    expect(isPlayableUrl('https://example.com/video.pdf')).toBe(false);
  });

  it('should return false for invalid URLs', () => {
    expect(isPlayableUrl('')).toBe(false);
  });
});

describe('embedUrl', () => {
  it('should return a sanitized YouTube embed URL', () => {
    const sanitizer = { bypassSecurityTrustResourceUrl: (url: string) => `trusted:${url}` } as unknown as DomSanitizer;
    const result = embedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', sanitizer);
    expect(result).toBe('trusted:https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('should return the original URL sanitized for non-YouTube URLs', () => {
    const sanitizer = { bypassSecurityTrustResourceUrl: (url: string) => `trusted:${url}` } as unknown as DomSanitizer;
    const result = embedUrl('https://example.com/video.mp4', sanitizer);
    expect(result).toBe('trusted:https://example.com/video.mp4');
  });
});
