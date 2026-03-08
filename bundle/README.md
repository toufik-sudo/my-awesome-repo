# Bundle (Iframe Embed)

This folder contains everything needed to embed the AI Agent Builder as an iframe or widget in any frontend application.

## Build the Bundle

```bash
# From the project root
npm run build:bundle
```

This outputs a self-contained build to `dist-bundle/`.

## Usage

### Option 1: Iframe (simplest)

```html
<iframe
  src="path/to/dist-bundle/index.html"
  width="100%"
  height="700"
  style="border: none; border-radius: 12px;"
  allow="microphone"
></iframe>
```

### Option 2: Mount as Widget (advanced)

```html
<div id="agent-builder"></div>
<script type="module">
  import { mount } from './dist-bundle/agent-builder.js';
  
  const unmount = mount(document.getElementById('agent-builder'));
  
  // Call unmount() when you want to remove it
</script>
```

### Option 3: React Component Wrapper

```tsx
import { useEffect, useRef } from 'react';

export function AgentBuilderEmbed() {
  const ref = useRef<HTMLIFrameElement>(null);
  
  return (
    <iframe
      ref={ref}
      src="/agent-builder/index.html"
      className="w-full h-[700px] border-none rounded-xl"
      allow="microphone"
      title="AI Agent Builder"
    />
  );
}
```

## Configuration

- `vite.bundle.config.ts` (root) — Vite build config for the bundle
- `src/embed.tsx` — Entry point with `mount()` export
- All paths are relative (`base: "./"`) so the bundle is portable

## Notes

- The bundle is fully self-contained (CSS + JS + assets)
- Microphone permission needed if using speech-to-text
- The `allow="microphone"` attribute enables STT in iframe mode
