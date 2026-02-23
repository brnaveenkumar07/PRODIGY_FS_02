# Shadcn UI Components

All shadcn/ui components have been installed and are ready to use. Import them from `@/components/ui/`.

## Installed Components (31 total)

### Form Components
- **Button** - `@/components/ui/button`
- **Input** - `@/components/ui/input`
- **Label** - `@/components/ui/label`
- **Textarea** - `@/components/ui/textarea`
- **Checkbox** - `@/components/ui/checkbox`
- **Switch** - `@/components/ui/switch`
- **Slider** - `@/components/ui/slider`
- **Select** - `@/components/ui/select`
- **Form** - `@/components/ui/form` (React Hook Form integration)

### Layout Components
- **Card** - `@/components/ui/card`
- **Separator** - `@/components/ui/separator`
- **Scroll Area** - `@/components/ui/scroll-area`
- **Aspect Ratio** - `@/components/ui/aspect-ratio`

### Dialog & Overlay Components
- **Dialog** - `@/components/ui/dialog`
- **Sheet** - `@/components/ui/sheet`
- **Popover** - `@/components/ui/popover`
- **Context Menu** - `@/components/ui/context-menu`
- **Dropdown Menu** - `@/components/ui/dropdown-menu`

### Navigation Components
- **Tabs** - `@/components/ui/tabs`
- **Breadcrumb** - `@/components/ui/breadcrumb`
- **Pagination** - `@/components/ui/pagination`
- **Command** - `@/components/ui/command`

### Data Display Components
- **Table** - `@/components/ui/table`
- **Badge** - `@/components/ui/badge`
- **Alert** - `@/components/ui/alert`
- **Avatar** - `@/components/ui/avatar`
- **Skeleton** - `@/components/ui/skeleton`
- **Progress** - `@/components/ui/progress`

### Expandable Components
- **Accordion** - `@/components/ui/accordion`
- **Collapsible** - `@/components/ui/collapsible`

### Utility Components
- **Tooltip** - `@/components/ui/tooltip`

## Additional Packages Installed

- **sonner** - Toast notifications library
- **react-hook-form** - Form state management
- **zod** - TypeScript-first schema validation
- **lucide-react** - Icon library

## Usage Examples

### Button
```tsx
import { Button } from "@/components/ui/button"

export function MyComponent() {
  return <Button>Click me</Button>
}
```

### Card
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
      <CardContent>Content here</CardContent>
    </Card>
  )
}
```

### Input
```tsx
import { Input } from "@/components/ui/input"

export function MyComponent() {
  return <Input placeholder="Enter text..." />
}
```

### Dialog
```tsx
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function MyComponent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
```

### Form with React Hook Form
```tsx
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function MyForm() {
  const form = useForm()
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Toast Notification
```tsx
import { toast } from "sonner"

export function MyComponent() {
  return (
    <button onClick={() => toast.success("Success message!")}>
      Show Toast
    </button>
  )
}
```

### Tooltip
```tsx
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function MyComponent() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Tooltip content</p>
      </TooltipContent>
    </Tooltip>
  )
}
```

## Documentation Links

- [Shadcn/ui Docs](https://ui.shadcn.com/docs/components/button)
- [Radix UI Docs](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Sonner Toast Docs](https://sonner.emilkowal.ski/)
- [Lucide Icons](https://lucide.dev/)
