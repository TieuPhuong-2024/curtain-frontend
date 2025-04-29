/**
 * Convert BlockNote content to HTML
 * @param {Array} content - The BlockNote content array
 * @returns {string} - The HTML string
 */
export const convertBlockNoteToHtml = (content) => {
  if (!content || !Array.isArray(content)) return '';
  
  let currentList = null;
  
  const convertInlineContent = (content) => {
    if (!content) return '';
    return content.map(node => {
      let text = node.text || '';
      if (node.styles) {
        if (node.styles.bold) text = `<strong>${text}</strong>`;
        if (node.styles.italic) text = `<em>${text}</em>`;
        if (node.styles.underline) text = `<u>${text}</u>`;
        if (node.styles.strike) text = `<del>${text}</del>`;
        if (node.styles.code) text = `<code>${text}</code>`;
      }
      return text;
    }).join('');
  };

  const blocks = content.map(block => {
    const blockContent = convertInlineContent(block.content);
    
    switch (block.type) {
      case 'paragraph':
        if (currentList) {
          currentList = null;
          return `</ul><p>${blockContent}</p>`;
        }
        return `<p>${blockContent}</p>`;
        
      case 'heading':
        const level = block.props?.level || 1;
        if (currentList) {
          currentList = null;
          return `</ul><h${level}>${blockContent}</h${level}>`;
        }
        return `<h${level}>${blockContent}</h${level}>`;
        
      case 'bulletListItem':
        if (currentList !== 'bullet') {
          const closePrevList = currentList ? '</ul>' : '';
          currentList = 'bullet';
          return `${closePrevList}<ul><li>${blockContent}</li>`;
        }
        return `<li>${blockContent}</li>`;
        
      case 'numberedListItem':
        if (currentList !== 'numbered') {
          const closePrevList = currentList ? '</ul>' : '';
          currentList = 'numbered';
          return `${closePrevList}<ol><li>${blockContent}</li>`;
        }
        return `<li>${blockContent}</li>`;
        
      case 'image':
        if (currentList) {
          currentList = null;
          return `</ul><img src="${block.props?.url || ''}" alt="${block.props?.caption || ''}" />`;
        }
        return `<img src="${block.props?.url || ''}" alt="${block.props?.caption || ''}" />`;
        
      default:
        return '';
    }
  });

  // Close any open list at the end
  if (currentList) {
    blocks.push(currentList === 'numbered' ? '</ol>' : '</ul>');
  }

  return blocks.join('');
};