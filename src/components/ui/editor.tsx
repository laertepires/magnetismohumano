import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import { ListButton } from '@/components/tiptap-ui/list-button'

import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'

export default function Editor({ setContent }: { setContent?: (content: string) => void }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, TaskList, TaskItem.configure({ nested: true })],
    onUpdate: ({ editor }) => {
      if (setContent) {
        setContent(editor.getHTML())
      }
    },
  })

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="tiptap-button-group" data-orientation="horizontal">
        <ListButton type="bulletList" />
        <ListButton type="orderedList" />
        <ListButton type="taskList" />
      </div>

      <EditorContent editor={editor} role="presentation" />
    </EditorContext.Provider>
  )
}
