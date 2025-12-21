import { Button } from "@openai/apps-sdk-ui/components/Button";

function App() {
  return (
    <div className="bg-surface text-primary flex min-h-screen items-center justify-center p-6">
      <div className="border-subtle bg-surface-2 w-full max-w-md space-y-4 rounded-2xl border p-6 shadow-lg">
        <div className="space-y-1">
          <p className="text-secondary text-sm tracking-wide uppercase">
            ChatGPT App
          </p>
          <h1 className="heading-lg">Hello, world</h1>
          <p className="text-secondary">
            Minimal starter using OpenAI Apps SDK UI + Tailwind 4 bundled as a
            single HTML file.
          </p>
        </div>
        <div className="flex gap-2">
          <Button color="primary" block>
            Say hello
          </Button>
          <Button variant="soft" color="secondary" block>
            Secondary
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
