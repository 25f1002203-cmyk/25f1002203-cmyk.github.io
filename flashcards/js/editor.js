/**
 * editor.js - Editor toolbar and formatting helpers
 * Handles rich text formatting in textareas
 */

const EditorHelper = {
    /**
     * Insert text at cursor position in textarea
     * @param {HTMLTextAreaElement} textarea - Target textarea
     * @param {String} before - Text to insert before cursor
     * @param {String} after - Text to insert after cursor
     * @param {String} placeholder - Placeholder text if nothing selected
     */
    insertMarkdown(textarea, before, after = '', placeholder = 'text') {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end) || placeholder;

        const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
        textarea.value = newText;

        // Move cursor to appropriate position
        const newCursorPos = start + before.length + selectedText.length;
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);

        // Trigger input event for preview update
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    },

    /**
     * Setup editor toolbar for a textarea
     * @param {HTMLElement} container - Container with toolbar and textarea
     */
    setupToolbar(container) {
        const textarea = container.querySelector('.editor-textarea');
        if (!textarea) return;

        const toolbarBtns = container.querySelectorAll('.toolbar-btn');
        const previewBtn = container.querySelector('.preview-btn');
        const preview = container.querySelector('.markdown-preview');
        const charCount = container.parentElement.querySelector('.char-count');

        // Toolbar button handlers
        toolbarBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const format = btn.dataset.format;
                EditorHelper.applyFormat(textarea, format);
            });
        });

        // Preview button
        if (previewBtn && preview) {
            previewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const isHidden = preview.classList.contains('hidden');
                preview.classList.toggle('hidden');
                previewBtn.textContent = isHidden ? '✏️ Edit' : '👁️ Preview';
                if (!isHidden) {
                    EditorHelper.updatePreview(textarea, preview);
                }
            });
        }

        // Character counter
        if (charCount) {
            textarea.addEventListener('input', () => {
                charCount.textContent = `${textarea.value.length} / 5000`;
                if (preview && !preview.classList.contains('hidden')) {
                    EditorHelper.updatePreview(textarea, preview);
                }
            });
        }

        // Keyboard shortcuts
        textarea.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'b') {
                    e.preventDefault();
                    EditorHelper.applyFormat(textarea, 'bold');
                } else if (e.key === 'i') {
                    e.preventDefault();
                    EditorHelper.applyFormat(textarea, 'italic');
                }
            }
        });
    },

    /**
     * Apply markdown formatting
     * @param {HTMLTextAreaElement} textarea - Target textarea
     * @param {String} format - Format type (bold, italic, code, ul, ol, link)
     */
    applyFormat(textarea, format) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end) || 'text';

        let before = '';
        let after = '';
        let placeholder = 'text';

        switch (format) {
            case 'bold':
                before = '**';
                after = '**';
                placeholder = 'bold text';
                break;
            case 'italic':
                before = '*';
                after = '*';
                placeholder = 'italic text';
                break;
            case 'code':
                if (selectedText.includes('\n')) {
                    before = '```\n';
                    after = '\n```';
                    placeholder = 'code block';
                } else {
                    before = '`';
                    after = '`';
                    placeholder = 'code';
                }
                break;
            case 'ul':
                const ulLines = selectedText.split('\n');
                const ulFormatted = ulLines.map(line => `- ${line}`).join('\n');
                this.insertMarkdown(textarea, '', '', ulFormatted);
                return;
            case 'ol':
                const olLines = selectedText.split('\n');
                const olFormatted = olLines
                    .map((line, i) => `${i + 1}. ${line}`)
                    .join('\n');
                this.insertMarkdown(textarea, '', '', olFormatted);
                return;
            case 'link':
                before = '[';
                after = '](https://example.com)';
                placeholder = 'link text';
                break;
            default:
                return;
        }

        this.insertMarkdown(textarea, before, after, placeholder);
    },

    /**
     * Update preview panel with rendered markdown
     * @param {HTMLTextAreaElement} textarea - Source textarea
     * @param {HTMLElement} preview - Preview container
     */
    updatePreview(textarea, preview) {
        const markdown = textarea.value;
        const html = MarkdownParser.parse(markdown);
        preview.innerHTML = html;
    }
};

/**
 * Initialize all editor toolbars on page load
 */
function initializeEditors() {
    const editorContainers = document.querySelectorAll('.editor-container');
    editorContainers.forEach(container => {
        EditorHelper.setupToolbar(container.parentElement);
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEditors);
} else {
    initializeEditors();
}
