/**
 * Image API utilities for fetching from Pexels and Pixabay
 */

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
        `/api/images/pexels?query=${encodeURIComponent(query)}&perPage=${perPage}`
      );

      if (!response.ok) {
        throw new Error('Pexels API request failed');
      }

      const data = await response.json();
      return data || [];
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
        `/api/images/pixabay?query=${encodeURIComponent(query)}&perPage=${perPage}`
      );

      if (!response.ok) {
        throw new Error('Pixabay API request failed');
      }

      const data = await response.json();
      return data || [];
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
      // Cache the image array and get a random selection each time
      const images = await imageCache.getRandomFromArray(`featured:${category}`, async () => {
        // Try Pexels first
        const pexelsImages = await this.searchPexels(queries[category], 20);
        if (pexelsImages.length > 0) {
          return pexelsImages;
        }

        // Fallback to Pixabay
        const pixabayImages = await this.searchPixabay(queries[category], 20);
        if (pixabayImages.length > 0) {
          return pixabayImages;
        }

        return [];
      }, 1);

      if (images.length > 0) {
        const image = images[0];
        // Handle both Pexels and Pixabay image formats
        if ('src' in image) {
          return (image as PexelsImage).src.large;
        } else {
          return (image as PixabayImage).webformatURL;
        }
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

    try {
      const images = await imageCache.getRandomFromArray(`curriculum:${curriculum}`, async (): Promise<PexelsImage[]> => {
        return await this.searchPexels(query, 10);
      }, 1);

      if (images.length > 0) {
        return images[0].src.large;
      }

      return this.getPlaceholderImage();
    } catch (error) {
      console.error('Failed to fetch curriculum image:', error);
      return this.getPlaceholderImage();
    }
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

    const cacheKey = `blog:${title.replace(/\s+/g, '-').toLowerCase().slice(0, 60)}`;

    try {
      const images = await imageCache.getRandomFromArray(cacheKey, async (): Promise<PexelsImage[]> => {
        return await this.searchPexels(query, 15);
      }, 1);

      if (images.length > 0) {
        return images[0].src.large;
      }

      return this.getPlaceholderImage();
    } catch (error) {
      console.error('Failed to fetch blog category image:', error);
      return this.getPlaceholderImage();
    }
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

    try {
      const images = await imageCache.getRandomFromArray(`hero:${theme}`, async (): Promise<PexelsImage[]> => {
        return await this.searchPexels(queries[theme], 20);
      }, 1);

      if (images.length > 0) {
        return images[0].src.large2x;
      }

      return this.getPlaceholderImage(1920, 1080);
    } catch (error) {
      console.error('Failed to fetch hero image:', error);
      return this.getPlaceholderImage(1920, 1080);
    }
  },

  /**
   * Get kindergarten-specific images with children
   */
  async getKindergartenImage(): Promise<string> {
    const queries = [
      'happy children playing kindergarten',
      'preschool kids learning',
      'toddlers nursery activities',
      'children playing educational toys',
      'kindergarten classroom kids'
    ];

    try {
      // Randomly select a query for variety
      const query = queries[Math.floor(Math.random() * queries.length)];

      const images = await imageCache.getRandomFromArray(`kindergarten:${query}`, async (): Promise<PexelsImage[]> => {
        // Try Pexels first
        const pexelsImages = await this.searchPexels(query, 15);
        if (pexelsImages.length > 0) {
          return pexelsImages;
        }

        // Fallback to Pixabay
        const pixabayImages = await this.searchPixabay(query, 15);
        if (pixabayImages.length > 0) {
          return pixabayImages;
        }

        return [];
      }, 1);

      if (images.length > 0) {
        const image = images[0];
        // Handle both Pexels and Pixabay image formats
        if ('src' in image) {
          return (image as PexelsImage).src.large;
        } else {
          return (image as PixabayImage).webformatURL;
        }
      }

      // Ultimate fallback
      return this.getPlaceholderImage();
    } catch (error) {
      console.error('Failed to fetch kindergarten image:', error);
      return this.getPlaceholderImage();
    }
  },
};

/**
 * Cache layer for images with global uniqueness tracking
 */
class ImageCache {
  private cache: Map<string, any> = new Map();
  private usedImages: Set<string> = new Set(); // Track used image IDs globally
  private readonly TTL = 1000 * 60 * 5; // 5 minutes for image arrays

  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    if (cached) return cached;

    const result = await fetcher();
    this.cache.set(key, result);

    // Clear after TTL
    setTimeout(() => this.cache.delete(key), this.TTL);

    return result;
  }

  // Get a unique image ID from either Pexels or Pixabay format
  private getImageId(image: PexelsImage | PixabayImage): string {
    return `${image.id}`;
  }

  // Get a random item from a cached array, ensuring uniqueness across all calls
  async getRandomFromArray<T extends PexelsImage | PixabayImage>(key: string, fetcher: () => Promise<T[]>, count: number = 1): Promise<T[]> {
    const array = await this.get<T[]>(key, fetcher);
    if (!Array.isArray(array) || array.length === 0) return [];

    // Filter out already used images
    const availableImages = array.filter(img => !this.usedImages.has(this.getImageId(img)));

    // If no unused images available, clear the used set and start fresh
    if (availableImages.length === 0) {
      console.log('All images used, resetting pool for key:', key);
      this.usedImages.clear();
      return this.getRandomFromArray(key, fetcher, count);
    }

    // Return random items without replacement
    const shuffled = [...availableImages].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, availableImages.length));

    // Mark these images as used
    selected.forEach(img => this.usedImages.add(this.getImageId(img)));

    return selected;
  }

  // Clear all used images (useful for testing or reset)
  clearUsedImages(): void {
    this.usedImages.clear();
  }

  // Get count of used images
  getUsedImagesCount(): number {
    return this.usedImages.size;
  }
}

export const imageCache = new ImageCache();