/**
 * Slug for in-page heading anchors (Vietnamese-friendly via normalize).
 */
function slugifyHeading(text) {
  const base = text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return base.slice(0, 72) || 'muc';
}

/**
 * Adds stable ids to h2/h3 and builds a table of contents.
 *
 * @param {string} htmlContent - Sanitized HTML ready for dangerouslySetInnerHTML
 * @returns {{ html: string, toc: { id: string, text: string, level: number }[] }}
 */
export function preparePostContent(htmlContent) {
  if (!htmlContent) {
    return { html: '', toc: [] };
  }

  if (typeof document === 'undefined') {
    return { html: htmlContent, toc: [] };
  }

  const wrapper = document.createElement('div');
  wrapper.innerHTML = htmlContent;

  const toc = [];
  const usedIds = new Set();

  wrapper.querySelectorAll('h2, h3').forEach((el) => {
    const text = el.textContent?.trim();
    if (!text) return;

    let id = slugifyHeading(text);
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${slugifyHeading(text)}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    el.id = id;

    toc.push({
      id,
      text,
      level: el.tagName === 'H2' ? 2 : 3,
    });
  });

  return { html: wrapper.innerHTML, toc };
}

/**
 * @param {string} htmlContent - Raw or sanitized HTML
 * @param {number} wordsPerMinute
 */
export function getReadingMinutes(htmlContent, wordsPerMinute = 200) {
  if (!htmlContent) return 1;

  const text =
    typeof document !== 'undefined'
      ? (() => {
          const div = document.createElement('div');
          div.innerHTML = htmlContent;
          return div.textContent || '';
        })()
      : htmlContent.replace(/<[^>]+>/g, ' ');

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
