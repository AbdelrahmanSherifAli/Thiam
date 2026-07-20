import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught Error in Component:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = "#home";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          padding: "40px 20px",
          textAlign: "center",
          fontFamily: "'Cairo', sans-serif",
          direction: "rtl"
        }}>
          <div style={{
            backgroundColor: "#fef2f2",
            color: "#ef4444",
            padding: "16px 24px",
            borderRadius: "12px",
            marginBottom: "20px",
            maxWidth: "500px",
            border: "1px solid #fecaca"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px", color: "#991b1b" }}>
              عفواً! حدث خطأ غير متوقع في فتح هذه الصفحة
            </h3>
            <p style={{ fontSize: "13px", color: "#7f1d1d", margin: 0 }}>
              سنقوم بإعادة توجيهك للصفحة الرئيسية بشكل آمن دون توقف المتجر.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={this.handleReset}
              className="btn btn-primary"
              style={{ padding: "10px 20px", display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <Home size={16} />
              <span>العودة للرئيسية</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-secondary"
              style={{ padding: "10px 20px", display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <RefreshCw size={16} />
              <span>إعادة تحديث الصفحة</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
