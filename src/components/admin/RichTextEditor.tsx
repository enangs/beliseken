"use client";

import { useRef, useCallback, useState } from "react";
import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code,
  Link2, Image, AlignLeft, AlignCenter, AlignRight,
  Undo2, Redo2, Type,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? "bg-brand/20 text-brand"
          : "text-brand-navy/60 hover:bg-gray-100 hover:text-brand-navy"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-brand-border mx-1" />;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis konten artikel di sini...",
  minHeight = 300,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleChange();
  }, []);

  const handleChange = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html === "<br>" ? "" : html);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/html") || e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
    handleChange();
  }, [handleChange]);

  const insertLink = useCallback(() => {
    if (linkUrl.trim()) {
      execCommand("createLink", linkUrl.trim());
      setLinkUrl("");
      setShowLinkInput(false);
    }
  }, [linkUrl, execCommand]);

  const insertImage = useCallback(() => {
    if (imageUrl.trim()) {
      execCommand("insertImage", imageUrl.trim());
      setImageUrl("");
      setShowImageInput(false);
    }
  }, [imageUrl, execCommand]);

  const formatBlock = useCallback((tag: string) => {
    execCommand("formatBlock", `<${tag}>`);
  }, [execCommand]);

  return (
    <div className="border border-brand-border rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-brand-border bg-gray-50/80">
        {/* Undo/Redo */}
        <ToolbarButton onClick={() => execCommand("undo")} title="Undo">
          <Undo2 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("redo")} title="Redo">
          <Redo2 size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Text format */}
        <ToolbarButton onClick={() => execCommand("bold")} title="Bold (Ctrl+B)">
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("italic")} title="Italic (Ctrl+I)">
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("underline")} title="Underline (Ctrl+U)">
          <Underline size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("strikeThrough")} title="Strikethrough">
          <Strikethrough size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton onClick={() => formatBlock("h1")} title="Heading 1">
          <Heading1 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatBlock("h2")} title="Heading 2">
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatBlock("h3")} title="Heading 3">
          <Heading3 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatBlock("p")} title="Paragraph">
          <Type size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton onClick={() => execCommand("insertUnorderedList")} title="Bullet List">
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("insertOrderedList")} title="Numbered List">
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatBlock("blockquote")} title="Quote">
          <Quote size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatBlock("pre")} title="Code Block">
          <Code size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton onClick={() => execCommand("justifyLeft")} title="Align Left">
          <AlignLeft size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("justifyCenter")} title="Align Center">
          <AlignCenter size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand("justifyRight")} title="Align Right">
          <AlignRight size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Link */}
        <ToolbarButton onClick={() => setShowLinkInput(!showLinkInput)} title="Insert Link">
          <Link2 size={15} />
        </ToolbarButton>

        {/* Image */}
        <ToolbarButton onClick={() => setShowImageInput(!showImageInput)} title="Insert Image">
          <Image size={15} />
        </ToolbarButton>
      </div>

      {/* Link input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border-b border-blue-200">
          <Link2 size={14} className="text-blue-500" />
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 px-2 py-1 text-sm border border-blue-200 rounded outline-none focus:border-blue-400"
            onKeyDown={(e) => e.key === "Enter" && insertLink()}
            autoFocus
          />
          <button type="button" onClick={insertLink} className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded hover:bg-blue-600">
            Insert
          </button>
          <button type="button" onClick={() => { setShowLinkInput(false); setLinkUrl(""); }} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700">
            Batal
          </button>
        </div>
      )}

      {/* Image input */}
      {showImageInput && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border-b border-green-200">
          <Image size={14} className="text-green-500" />
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="URL gambar (https://...)"
            className="flex-1 px-2 py-1 text-sm border border-green-200 rounded outline-none focus:border-green-400"
            onKeyDown={(e) => e.key === "Enter" && insertImage()}
            autoFocus
          />
          <button type="button" onClick={insertImage} className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded hover:bg-green-600">
            Insert
          </button>
          <button type="button" onClick={() => { setShowImageInput(false); setImageUrl(""); }} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700">
            Batal
          </button>
        </div>
      )}

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleChange}
        onPaste={handlePaste}
        className="prose prose-sm max-w-none px-4 py-3 outline-none min-h-[300px] focus:ring-2 focus:ring-brand/10"
        style={{ minHeight }}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value }}
      />

      {/* Placeholder CSS */}
      <style jsx>{`
        [data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [data-placeholder]:focus:empty::before {
          content: attr(data-placeholder);
          color: #d1d5db;
        }
      `}</style>
    </div>
  );
}
