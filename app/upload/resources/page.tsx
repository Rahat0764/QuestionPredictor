import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadResource } from "@/app/actions/uploadResource"

export default function UploadResources() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Upload Resources (Textbooks, Notes)</h2>
      <form action={uploadResource} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Subject (optional)</label>
          <Input type="text" name="subject" placeholder="e.g., Chemistry" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Resource Name</label>
          <Input type="text" name="name" placeholder="Book title or note name" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Files (PDF or images)</label>
          <Input type="file" name="files" multiple accept="image/*,.pdf" required />
        </div>
        <Button type="submit" className="w-full">Upload & Extract Text</Button>
      </form>
    </div>
  )
}