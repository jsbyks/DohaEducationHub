/**
 * Image API utilities for fetching from Pexels and Pixabay
 */

const PEXELS_API_KEY = 'jzGai41Nhr2xEulLec9pFE8OXvfjwCBaGu3LJSwabBcHNtlHW5p4PsTB';
const PIXABAY_API_KEY = '34290303-2de9d7303dd55bff8b1e916ac';

interface PexelsImage {
  id: number;
  url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  photographer: string;
  photographer_url: string;
  alt?: string;
}

interface PixabayImage {
  id: number;
  pageURL: string;
  largeImageURL: string;
  webformatURL: string;
  previewURL: string;
  user: string;
  userImageURL: string;
  tags: string;
}

export const imageApi = {
  /**
   * Search images on Pexels
   */
  async searchPexels(query: string, perPage: number = 15): Promise<PexelsImage[]> {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Pexels API request failed');
      }

      const data = await response.json();
      return data.photos || [];
    } catch (error) {
      console.error('Pexels search error:', error);
      return [];
    }
  },

  /**
   * Search images on Pixabay
   */
  async searchPixabay(query: string, perPage: number = 15): Promise<PixabayImage[]> {
    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&per_page=${perPage}&image_type=photo&orientation=horizontal`
      );

      if (!response.ok) {
        throw new Error('Pixabay API request failed');
      }

      const data = await response.json();
      return data.hits || [];
    } catch (error) {
      console.error('Pixabay search error:', error);
      return [];
    }
  },

  /**
   * Get a random featured image for a category
   */
  async getFeaturedImage(category: 'school' | 'education' | 'classroom' | 'students' | 'teacher' | 'learning' | 'books' | 'study'): Promise<string> {
    const queries = {
      school: 'modern school building',
      education: 'education learning',
      classroom: 'classroom students',
      students: 'happy students',
      teacher: 'teacher teaching',
      learning: 'children learning',
      books: 'books library',
      study: 'student studying',
    };

    try {
      // Try Pexels first
      const pexelsImages = await this.searchPexels(queries[category], 20);
      if (pexelsImages.length > 0) {
        const randomImage = pexelsImages[Math.floor(Math.random() * pexelsImages.length)];
        return randomImage.src.large;
      }

      // Fallback to Pixabay
      const pixabayImages = await this.searchPixabay(queries[category], 20);
      if (pixabayImages.length > 0) {
        const randomImage = pixabayImages[Math.floor(Math.random() * pixabayImages.length)];
        return randomImage.webformatURL;
      }

      // Ultimate fallback
      return this.getPlaceholderImage();
    } catch (error) {
      console.error('Failed to fetch featured image:', error);
      return this.getPlaceholderImage();
    }
  },

  /**
   * Get placeholder image
   */
  getPlaceholderImage(width: number = 1200, height: number = 600): string {
    return `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=${width}&h=${height}&fit=crop`;
  },

  /**
   * Get curriculum-specific images
   */
  async getCurriculumImage(curriculum: string): Promise<string> {
    const curriculumQueries: Record<string, string> = {
      British: 'british school education',
      American: 'american school classroom',
      IB: 'international baccalaureate school',
      Indian: 'indian school students',
      French: 'french school education',
      Arabic: 'arabic school students',
    };

    const query = curriculumQueries[curriculum] || 'international school';
    const images = await this.searchPexels(query, 10);

    if (images.length > 0) {
      return images[Math.floor(Math.random() * images.length)].src.large;
    }

    return this.getPlaceholderImage();
  },

  /**
   * Get blog category images
   */
  async getBlogCategoryImage(title: string): Promise<string> {
    // Extract keywords from title
    const keywords = title.toLowerCase();

    let query = 'education';
    if (keywords.includes('curriculum')) query = 'curriculum textbooks';
    else if (keywords.includes('fees') || keywords.includes('cost')) query = 'money education';
    else if (keywords.includes('school') && keywords.includes('choose')) query = 'school choice';
    else if (keywords.includes('prepare') || keywords.includes('new')) query = 'back to school';
    else if (keywords.includes('top') || keywords.includes('best')) query = 'best schools';
    else if (keywords.includes('waitlist')) query = 'school admission';

    const images = await this.searchPexels(query, 15);

    if (images.length > 0) {
      return images[Math.floor(Math.random() * images.length)].src.large;
    }

    return this.getPlaceholderImage();
  },

  /**
   * Get hero background images
   */
  async getHeroImage(theme: 'education' | 'school' | 'teacher' | 'community'): Promise<string> {
    const queries = {
      education: 'education technology modern',
      school: 'school building architecture',
      teacher: 'teacher students classroom',
      community: 'diverse students community',
    };

    const images = await this.searchPexels(queries[theme], 20);

    if (images.length > 0) {
      return images[Math.floor(Math.random() * images.length)].src.large2x;
    }

    return this.getPlaceholderImage(1920, 1080);
  },
};

/**
 * Cache layer for images
 */
class ImageCache {
  private cache: Map<string, string> = new Map();
  private readonly TTL = 1000 * 60 * 60 * 24; // 24 hours

  async get(key: string, fetcher: () => Promise<string>): Promise<string> {
    const cached = this.cache.get(key);
    if (cached) return cached;

    const image = await fetcher();
    this.cache.set(key, image);

    // Clear after TTL
    setTimeout(() => this.cache.delete(key), this.TTL);

    return image;
  }
}

export const imageCache = new ImageCache();
