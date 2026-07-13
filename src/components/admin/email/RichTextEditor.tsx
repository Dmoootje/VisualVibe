"use client";

import { useCallback, useEffect } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Eraser,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  PenLine,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// TipTap-editor voor de e-mailclient: bewust compacte werkbalk, geen
// Word-achtige overdaad. Geplakte inhoud wordt door het ProseMirror-schema
// gefilterd en server-side nogmaals gesanitized.

const TEXT_COLORS = [
  { label: "Standaard", value: "" },
  { label: "Oranje", value: "#ff7500" },
  { label: "Rood", value: "#dc2626" },
  { label: "Groen", value: "#16a34a" },
  { label: "Blauw", value: "#2563eb" },
  { label: "Grijs", value: "#6b7280" },
];

function ToolButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "rounded p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30",
        active && "bg-white/15 text-white",
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  signatureHtml,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  signatureHtml?: string;
  placeholder?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https", "mailto"],
        },
      }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ["paragraph", "heading"] }),
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "vv-email-editor prose prose-invert prose-sm max-w-none min-h-[180px] px-3 py-2 focus:outline-none",
        "aria-label": placeholder ?? "Berichtinhoud",
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
  });

  // Externe resets (bv. concept openen) doorvoeren zonder cursor te verstoren.
  useEffect(() => {
    if (!editor) return;
    if (value && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value ? value.length : 0]);

  const setLink = useCallback((current: Editor) => {
    const previous = current.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link (https://...)", previous ?? "https://");
    if (url === null) return;
    if (!url.trim()) {
      current.chain().focus().unsetLink().run();
      return;
    }
    if (!/^(https?:\/\/|mailto:)/i.test(url.trim())) {
      window.alert("Gebruik een volledige link die met https:// of mailto: begint.");
      return;
    }
    current.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }, []);

  if (!editor) {
    return <div className="min-h-[220px] animate-pulse rounded-lg bg-white/[0.04]" aria-hidden="true" />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-white/10 px-1.5 py-1">
        <ToolButton label="Ongedaan maken" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Opnieuw uitvoeren" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 className="h-4 w-4" />
        </ToolButton>
        <span className="mx-1 h-4 w-px bg-white/10" aria-hidden="true" />
        <ToolButton label="Vet" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Cursief" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Onderstrepen" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <Underline className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Doorhalen" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-4 w-4" />
        </ToolButton>

        <span className="mx-1 h-4 w-px bg-white/10" aria-hidden="true" />
        <select
          value={(editor.getAttributes("textStyle").color as string) ?? ""}
          onChange={(event) => {
            const color = event.target.value;
            if (color) editor.chain().focus().setColor(color).run();
            else editor.chain().focus().unsetColor().run();
          }}
          className="rounded border border-white/10 bg-[#141414] px-1 py-1 text-xs text-white/70 focus:outline-none focus:ring-1 focus:ring-amber-500/70"
          aria-label="Tekstkleur"
          title="Tekstkleur"
        >
          {TEXT_COLORS.map((color) => (
            <option key={color.value} value={color.value}>
              {color.label}
            </option>
          ))}
        </select>

        <span className="mx-1 h-4 w-px bg-white/10" aria-hidden="true" />
        <ToolButton
          label={editor.isActive("link") ? "Link bewerken" : "Link invoegen"}
          active={editor.isActive("link")}
          onClick={() => setLink(editor)}
        >
          <Link2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Link verwijderen" disabled={!editor.isActive("link")} onClick={() => editor.chain().focus().unsetLink().run()}>
          <Link2Off className="h-4 w-4" />
        </ToolButton>

        <span className="mx-1 h-4 w-px bg-white/10" aria-hidden="true" />
        <ToolButton label="Opsomming" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Genummerde lijst" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Horizontale lijn" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-4 w-4" />
        </ToolButton>

        <span className="mx-1 h-4 w-px bg-white/10" aria-hidden="true" />
        <ToolButton
          label="Links uitlijnen"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Centreren"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Rechts uitlijnen"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" />
        </ToolButton>

        <span className="mx-1 h-4 w-px bg-white/10" aria-hidden="true" />
        <ToolButton
          label="Opmaak wissen"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          <Eraser className="h-4 w-4" />
        </ToolButton>
        {signatureHtml ? (
          <ToolButton
            label="Handtekening invoegen"
            onClick={() => editor.chain().focus().insertContent(`<p></p>${signatureHtml}`).run()}
          >
            <PenLine className="h-4 w-4" />
          </ToolButton>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-white/[0.02] text-white/90">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
