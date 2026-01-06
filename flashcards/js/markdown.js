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
        if (!text) return '';

        let html = this.escapeHtml(text);

        // Code blocks (```code```)
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

        // Inline code (`code`)
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Bold (**text** or __text__)
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

        // Italic (*text* or _text_)
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

        // Links [text](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        // Headings
        html = html.replace(/^### ([^\n]+)/gm, '<h3>$1</h3>');
        html = html.replace(/^## ([^\n]+)/gm, '<h2>$1</h2>');
        html = html.replace(/^# ([^\n]+)/gm, '<h1>$1</h1>');

        // Horizontal rule
        html = html.replace(/^---$/gm, '<hr />');

        // Numbered lists (1. item)
        html = this.parseNumberedLists(html);

        // Unordered lists (- item or * item)
        html = this.parseUnorderedLists(html);

        // Line breaks
        html = html.replace(/\n/g, '<br />');

        return `<div class="markdown-content">${html}</div>`;
    },

    /**
     * Parse unordered lists
     * @param {String} html - HTML string with list markers
     * @returns {String} HTML with parsed lists
     */
    parseUnorderedLists(html) {
        const lines = html.split('<br />');
        let inList = false;
        let result = [];

        for (let line of lines) {
            if (line.match(/^\s*[-*]\s+/)) {
                if (!inList) {
                    result.push('<ul>');
                    inList = true;
                }
                const item = line.replace(/^\s*[-*]\s+/, '');
                result.push(`<li>${item}</li>`);
            } else {
                if (inList) {
                    result.push('</ul>');
                    inList = false;
                }
                if (line.trim()) {
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
            if (line.match(/^\s*\d+\.\s+/)) {
                if (!inList) {
                    result.push('<ol>');
                    inList = true;
                }
                const item = line.replace(/^\s*\d+\.\s+/, '');
                result.push(`<li>${item}</li>`);
            } else {
                if (inList) {
                    result.push('</ol>');
                    inList = false;
                }
                if (line.trim()) {
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
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        // Don't escape markdown syntax characters during initial pass
        return text.replace(/[&<>"']/g, m => {
            // Preserve markdown special chars for later processing
            if (m === '<' || m === '>') return m; // Keep for potential HTML in markdown
            return map[m];
        });
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
            .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
            .replace(/__([^_]+)__/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1') // Remove italic
            .replace(/_([^_]+)_/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove link markdown
            .replace(/^[#\s]+/gm, '') // Remove headings
            .replace(/^---$/gm, '') // Remove hr
            .replace(/^\s*[-*]\s+/gm, '') // Remove list markers
            .replace(/^\s*\d+\.\s+/gm, '')
            .trim();
    }
};
