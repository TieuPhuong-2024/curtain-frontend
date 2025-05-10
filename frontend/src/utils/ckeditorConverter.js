/**
 * Sanitizes HTML content from CKEditor for robust XSS protection
 * while preserving heading structure and important styling
 * 
 * @param {string} htmlContent - The HTML string from CKEditor
 * @returns {string} - The sanitized HTML string
 */
export const renderCKEditorContent = (htmlContent) => {
  if (!htmlContent) return '';
  
  try {
    // First process the HTML using DOM parsing to preserve structure
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Make sure heading elements have appropriate classes and retain styles
    // This ensures headings are properly styled when displayed
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
      const elements = doc.querySelectorAll(tag);
      elements.forEach(el => {
        // Add classes to ensure proper styling (these can be styled via CSS)
        el.classList.add(`heading-${tag}`);
        
        // Make sure heading keeps its semantic meaning
        if (!el.hasAttribute('role')) {
          el.setAttribute('role', 'heading');
          el.setAttribute('aria-level', tag.substring(1));
        }
      });
    });
    
    // Convert back to HTML string
    let processedHTML = new XMLSerializer().serializeToString(doc.body);
    // Remove <body> wrapper tags added by serializer
    processedHTML = processedHTML.replace(/<\/?body[^>]*>/gi, '');
    
    // Now apply security sanitization while preserving structure
    return processedHTML
      // Remove script tags and their content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove inline event handlers
      .replace(/on\w+\s*=\s*(["']).*?\1/gi, '')
      // Remove javascript: protocol links
      .replace(/javascript:\s*[^\s"']*?/gi, 'javascript:void(0)')
      // Remove data: urls from attributes except for images with safe mime types
      .replace(/data:[^\s"']*?/gi, (match) => {
        // Allow only safe image data URLs
        if (match.match(/data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,[a-zA-Z0-9+/]+=*/i)) {
          return match;
        }
        return 'data:void(0)';
      })
      // Prevent uncommon exploits with iframe sources
      .replace(/(<iframe[^>]*src\s*=\s*["'])(.*?)(["'][^>]*>)/gi, (match, p1, p2, p3) => {
        const allowedSources = ['https://www.youtube.com', 'https://player.vimeo.com', 'https://www.dailymotion.com'];
        const isAllowed = allowedSources.some(src => p2.startsWith(src));
        return isAllowed ? match : `${p1}about:blank${p3}`;
      });
  } catch (error) {
    console.error('Error sanitizing CKEditor content:', error);
    return '';
  }
};

/**
 * Extracts plain text from HTML content
 * 
 * @param {string} htmlContent - The HTML string from CKEditor
 * @returns {string} - Plain text without HTML tags
 */
export const extractTextFromEditor = (htmlContent) => {
  if (!htmlContent) return '';
  
  try {
    // Create a temporary DOM element to extract text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent || tempDiv.innerText || '';
  } catch (error) {
    console.error('Error extracting text from CKEditor content:', error);
    return '';
  }
};

/**
 * Extracts all image URLs from CKEditor content
 * 
 * @param {string} htmlContent - The HTML string from CKEditor
 * @returns {string[]} - Array of image URLs
 */
export const extractImagesFromEditor = (htmlContent) => {
  if (!htmlContent) return [];
  
  try {
    const images = [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const imgElements = tempDiv.querySelectorAll('img');
    imgElements.forEach(img => {
      if (img.src) {
        images.push(img.src);
      }
    });
    
    return images;
  } catch (error) {
    console.error('Error extracting images from CKEditor content:', error);
    return [];
  }
};

/**
 * Creates a word count summary from editor content
 * 
 * @param {string} htmlContent - The HTML string from CKEditor
 * @returns {Object} - Word and character count information
 */
export const getContentStats = (htmlContent) => {
  if (!htmlContent) return { words: 0, chars: 0, charsNoSpace: 0 };
  
  try {
    const text = extractTextFromEditor(htmlContent);
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s+/g, '').length;
    
    return { words, chars, charsNoSpace };
  } catch (error) {
    console.error('Error calculating content stats:', error);
    return { words: 0, chars: 0, charsNoSpace: 0 };
  }
};