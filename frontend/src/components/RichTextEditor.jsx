import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import api from '../api';

let suggestionApi;

const suggestion = {
  items: async ({ query }) => {
    // Cache the user list promise to avoid re-fetching on every keystroke
    if (!suggestionApi) {
        suggestionApi = api.get('/users').then(res => res.data);
    }
    const users = await suggestionApi;
    return users
      .filter(user => user.name.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5); // Show a maximum of 5 suggestions
  },
  render: () => {
    let component;
    let popup;

    return {
      onStart: props => {
        component = document.createElement('div');
        component.className = 'bg-white rounded-lg shadow-lg border border-slate-200 p-2 z-50'; // Added z-50
        // The popup library logic is complex and relies on a positioning library like Popper.js for robustness.
        // For simplicity in our project, we'll use a basic positioning calculation.
        const rect = props.clientRect();
        if (!rect) return;

        popup = document.body.appendChild(component);
        popup.style.position = 'absolute';
        popup.style.left = `${window.pageXOffset + rect.left}px`;
        popup.style.top = `${window.pageYOffset + rect.bottom + 5}px`; // Add a small offset
      },
      onUpdate(props) {
        if (!component) return;
        component.innerHTML = ''; // Clear previous items

        if (props.items.length === 0) {
            component.style.display = 'none';
            return;
        }

        component.style.display = 'block';
        
        props.items.forEach((item, index) => {
            const button = document.createElement('button');
            button.type = 'button'; // Prevent form submission
            button.className = `block w-full text-left p-2 rounded text-sm ${index === props.selectedIndex ? 'bg-slate-100' : 'hover:bg-slate-100'}`;
            button.textContent = item.name;
            button.onclick = () => props.command({ id: item.name });
            component.appendChild(button);
        });

        const rect = props.clientRect();
        if (rect && popup) {
            popup.style.left = `${window.pageXOffset + rect.left}px`;
            popup.style.top = `${window.pageYOffset + rect.bottom + 5}px`;
        }
      },
      onKeyDown({ event }) {
        if (event.key === 'Escape') {
          if (popup) popup.remove();
          return true;
        }
        // Let Tiptap's default suggestion keydown handler do its thing
        return false;
      },
      onExit() {
        if (popup) popup.remove();
        popup = null;
        component = null;
      },
    }
  },
};

export default function RichTextEditor({ content, onUpdate }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: 'bg-violet-100 text-violet-700 font-semibold rounded px-1',
        },
        suggestion,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[120px] rounded-md border border-slate-300 bg-slate-50 py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500',
      },
    },
  });

  return <EditorContent editor={editor} />;
}