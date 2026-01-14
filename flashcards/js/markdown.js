/**
 * markdown.js - Simple markdown parser for flashcard content
 * Converts markdown syntax to HTML for rich text display
 */

const MarkdownParser = {
    /**
     * Parse markdown text to HTML
     * @param {String} text - Markdown text to parse
     * @returns {String} HTML string
     */
    parse(text) {
        if (!text || typeof text !== 'string') return '<p>No content</p>';

        let html = text;
            
    // Preprocess content to remove decorative HTML patterns
    html = this.preprocessContent(html);
        

        // First escape HTML to prevent injection
        html = this.escapeHtml(html);

        // Code blocks (```code```)
        html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
            return '<pre><code>' + code.trim() + '</code></pre>';
        });

        // Inline code (`code`) - must be after code blocks
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Bold (**text** or __text__)
        html = html.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([^_]+?)__/g, '<strong>$1</strong>');

        // Italic (*text* or _text_) - but not within **text**
        html = html.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_\n]+?)_/g, '<em>$1</em>');

        // Links [text](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        // Headings - must be on own line
        html = html.replace(/^### ([^\n]+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## ([^\n]+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# ([^\n]+)$/gm, '<h1>$1</h1>');

        // Horizontal rule
        html = html.replace(/^---$/gm, '<hr />');

        // Numbered lists (1. item) - parse before bullet
        html = this.parseNumberedLists(html);

        // Unordered lists (- item or * item)
        html = this.parseUnorderedLists(html);

        // Line breaks - convert \n to <br />
        html = html.replace(/\n/g, '<br />');

        // Clean up multiple consecutive <br /> tags - replace 2+ with single <br />
        html = html.replace(/(<br \/>){2,}/g, '<br />');

        // Clean up multiple consecutive <hr /> tags
        html = html.replace(/(<hr \/>){2,}/g, '<hr />');

        // Remove <br /> immediately before or after <hr />
        html = html.replace(/<br \/><hr \/>|<hr \/><br \/>/g, '<hr />');

        return `<div class="markdown-content">${html}</div>`;
    },

    /**
     * Parse unordered lists
     * @param {String} html - HTML string with list markers
     * @returns {String} HTML with parsed lists
     */
    parseUnorderedLists(html) {
        // Split by line breaks that we haven't converted yet
        const lines = html.split('<br />');
        let inList = false;
        let result = [];

        for (let line of lines) {
            const trimmed = line.trim();
            if (trimmed.match(/^[-*]\s+/)) {
                if (!inList) {
                    result.push('<ul>');
                    inList = true;
                }
                const item = trimmed.replace(/^[-*]\s+/, '');
                result.push(`<li>${item}</li>`);
            } else {
                if (inList) {
                    result.push('</ul>');
                    inList = false;
                }
                if (trimmed) {
                    result.push(line);
                }
            }
        }

        if (inList) result.push('</ul>');
        return result.join('');
    },

    /**
     * Parse numbered lists
     * @param {String} html - HTML string with numbered list markers
     * @returns {String} HTML with parsed lists
     */
    parseNumberedLists(html) {
        const lines = html.split('<br />');
        let inList = false;
        let result = [];

        for (let line of lines) {
            const trimmed = line.trim();
            if (trimmed.match(/^\d+\.\s+/)) {
                if (!inList) {
                    result.push('<ol>');
                    inList = true;
                }
                const item = trimmed.replace(/^\d+\.\s+/, '');
                result.push(`<li>${item}</li>`);
            } else {
                if (inList) {
                    result.push('</ol>');
                    inList = false;
                }
                if (trimmed) {
                    result.push(line);
                }
            }
        }

        if (inList) result.push('</ol>');
        return result.join('');
    },

    /**
     * Escape HTML special characters
     * @param {String} text - Text to escape
     * @returns {String} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

     /**
   * Preprocess content to remove decorative HTML patterns
   * Removes: HTML tags, multiple br/hr tags, decorative dividers
   * @param {String} text - Text with decorative HTML patterns
   * @returns {String} Cleaned text
   */
  preprocessContent(text) {
    if (!text) return text;
    
    // Remove HTML tags but preserve content
    let cleaned = text.replace(/<[^>]*>/g, '');
    
    // Remove multiple consecutive spaces/newlines
    cleaned = cleaned.replace(/\s{2,}/g, ' ');
    
    // Remove leading/trailing whitespace
    cleaned = cleaned.trim();
    
    return cleaned;
  },

    /**
     * Strip markdown formatting and return plain text
     * Useful for preview or display without HTML
     * @param {String} text - Markdown text
     * @returns {String} Plain text
     */
    stripMarkdown(text) {
        if (!text) return '';
        return text
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .replace(/`([^`]+)`/g, '$1') // Remove inline code markers
            .replace(/\*\*([^*]+?)\*\*/g, '$1') // Remove bold
            .replace(/__([^_]+?)__/g, '$1')
            .replace(/\*([^*\n]+?)\*/g, '$1') // Remove italic
            .replace(/_([^_\n]+?)_/g, '$1')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // Remove link markdown
            .replace(/^[#\s]+/gm, '') // Remove headings
            .replace(/^---$/gm, '') // Remove hr
            .replace(/^\s*[-*]\s+/gm, '') // Remove list markers
            .replace(/^\s*\d+\.\s+/gm, '')
            .trim();
    }
};

// Log that module is loaded
console.log('✅ MarkdownParser module loaded');
