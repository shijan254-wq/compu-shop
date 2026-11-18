import { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/Button"
import { AlertTriangle } from "lucide-react"

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-extrabold mb-2">Kuna Hitilafu Imetokea</h1>
          <p className="text-muted-foreground mb-8 max-w-md">Samahani, mfumo umepata hitilafu isiyotarajiwa. Tafadhali jaribu kupakia upya ukurasa.</p>
          <Button size="lg" onClick={() => window.location.reload()} className="rounded-xl gradient-primary text-white border-0">
            Pakia Upya Ukurasa
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}