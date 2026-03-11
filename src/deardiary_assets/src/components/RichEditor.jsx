import React, { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';

const HEADINGS = [
    { label: 'Normal', value: 0 },
    { label: 'Heading 1', value: 1 },
    { label: 'Heading 2', value: 2 },
    { label: 'Heading 3', value: 3 },
    { label: 'Heading 4', value: 4 },
    { label: 'Heading 5', value: 5 },
    { label: 'Heading 6', value: 6 },
];

function ToolBtn({ onClick, active, title, children }) {
    return (
        <button
            type="button"
            title={title}
            onMouseDown={(e) => { e.preventDefault(); onClick(); }}
            style={{
                background: active ? '#1a56db' : 'transparent',
                color: active ? '#fff' : '#374151',
                border: 'none',
                borderRadius: 4,
                padding: '4px 7px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 600,
                minWidth: 28,
                height: 28,
            }}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <span style={{ width: 1, height: 20, background: '#d1d5db', margin: '0 4px', display: 'inline-block', flexShrink: 0 }} />;
}

function RichEditor({ onChange, disabled }) {
    const colorInputRef = useRef(null);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkValue, setLinkValue] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false }),
        ],
        content: '',
        editable: !disabled,
        onUpdate: ({ editor }) => {
            if (onChange) onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    const currentHeading = HEADINGS.find(h =>
        h.value === 0 ? !editor.isActive('heading') : editor.isActive('heading', { level: h.value })
    ) || HEADINGS[0];

    const handleHeadingChange = (e) => {
        const level = parseInt(e.target.value);
        if (level === 0) {
            editor.chain().focus().setParagraph().run();
        } else {
            editor.chain().focus().toggleHeading({ level }).run();
        }
    };

    const handleLink = () => {
        setLinkValue(editor.getAttributes('link').href || '');
        setShowLinkInput(v => !v);
    };

    const confirmLink = () => {
        if (linkValue === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            const href = linkValue.startsWith('http') ? linkValue : `https://${linkValue}`;
            editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
        }
        setShowLinkInput(false);
        setLinkValue('');
    };

    return (
        <div style={{
            border: '1.5px solid #93c5fd',
            borderRadius: 6,
            background: '#fff',
            overflow: 'hidden',
        }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                padding: '6px 8px',
                borderBottom: '1px solid #e5e7eb',
                background: '#fff',
            }}>
                {/* Undo / Redo */}
                <ToolBtn title="Undo" onClick={() => editor.chain().focus().undo().run()}>
                    <span className="material-icons" style={{ fontSize: 16 }}>undo</span>
                </ToolBtn>
                <ToolBtn title="Redo" onClick={() => editor.chain().focus().redo().run()}>
                    <span className="material-icons" style={{ fontSize: 16 }}>redo</span>
                </ToolBtn>

                <Divider />

                {/* Heading */}
                <select
                    value={currentHeading.value}
                    onChange={handleHeadingChange}
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{
                        border: '1px solid #d1d5db',
                        borderRadius: 4,
                        padding: '2px 6px',
                        fontSize: 13,
                        height: 28,
                        cursor: 'pointer',
                        color: '#374151',
                        background: '#fff',
                    }}
                >
                    {HEADINGS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
                </select>

                <Divider />

                {/* Color */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <button
                        type="button"
                        title="Text color"
                        onMouseDown={(e) => { e.preventDefault(); colorInputRef.current?.click(); }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 2,
                            background: 'transparent', border: '1px solid #d1d5db',
                            borderRadius: 4, padding: '3px 6px', cursor: 'pointer', height: 28,
                        }}
                    >
                        <span style={{
                            width: 16, height: 16, borderRadius: 2, display: 'inline-block',
                            background: editor.getAttributes('textStyle').color || '#1e3a5f',
                            border: '1px solid #9ca3af',
                        }} />
                        <span style={{ fontSize: 11, color: '#6b7280' }}>▾</span>
                    </button>
                    <input
                        ref={colorInputRef}
                        type="color"
                        defaultValue="#1e3a5f"
                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                    />
                </div>

                <Divider />

                {/* Bold / Italic / Underline */}
                <ToolBtn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
                    <b style={{ fontSize: 14 }}>B</b>
                </ToolBtn>
                <ToolBtn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
                    <i style={{ fontSize: 14 }}>I</i>
                </ToolBtn>
                <ToolBtn title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
                    <u style={{ fontSize: 14 }}>U</u>
                </ToolBtn>

                <Divider />

                {/* Alignment */}
                <ToolBtn title="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
                    <span className="material-icons" style={{ fontSize: 16 }}>format_align_left</span>
                </ToolBtn>
                <ToolBtn title="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
                    <span className="material-icons" style={{ fontSize: 16 }}>format_align_center</span>
                </ToolBtn>
                <ToolBtn title="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
                    <span className="material-icons" style={{ fontSize: 16 }}>format_align_right</span>
                </ToolBtn>

                <Divider />

                {/* Lists */}
                <ToolBtn title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                    <span className="material-icons" style={{ fontSize: 16 }}>format_list_bulleted</span>
                </ToolBtn>
                <ToolBtn title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                    <span className="material-icons" style={{ fontSize: 16 }}>format_list_numbered</span>
                </ToolBtn>

                <Divider />

                {/* Blockquote */}
                <ToolBtn title="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                    <span className="material-icons" style={{ fontSize: 16 }}>format_quote</span>
                </ToolBtn>

                {/* Horizontal rule */}
                <ToolBtn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    <span className="material-icons" style={{ fontSize: 16 }}>horizontal_rule</span>
                </ToolBtn>

                {/* Link */}
                <ToolBtn title="Link" active={editor.isActive('link')} onClick={handleLink}>
                    <span className="material-icons" style={{ fontSize: 16 }}>link</span>
                </ToolBtn>
            </div>

            {/* Inline link popover */}
            {showLinkInput && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 10px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb',
                }}>
                    <span className="material-icons" style={{ fontSize: 16, color: '#6b7280' }}>link</span>
                    <input
                        autoFocus
                        type="url"
                        value={linkValue}
                        onChange={(e) => setLinkValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') confirmLink(); if (e.key === 'Escape') setShowLinkInput(false); }}
                        placeholder="https://example.com"
                        style={{
                            flex: 1, border: '1px solid #d1d5db', borderRadius: 4,
                            padding: '3px 8px', fontSize: 13, outline: 'none',
                        }}
                    />
                    <button type="button" onClick={confirmLink} style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 10px', cursor: 'pointer', fontSize: 13 }}>Apply</button>
                    <button type="button" onClick={() => setShowLinkInput(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 18, lineHeight: 1 }}>×</button>
                </div>
            )}

            {/* Editor area */}
            <EditorContent
                editor={editor}
                style={{ minHeight: 200 }}
            />
        </div>
    );
}

export default RichEditor;
