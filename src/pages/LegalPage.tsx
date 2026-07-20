import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { Plus, Minus } from "lucide-react";

export const LegalPage: React.FC = () => {
  const { currentView, pages } = useStore();
  const { faq, privacy, terms } = pages;

  // Track active FAQ accordion index
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaqIndex(activeFaqIndex === idx ? null : idx);
  };

  const renderContent = () => {
    switch (currentView) {
      case "faq":
        return (
          <div>
            <h1 className="details-title" style={{ marginBottom: "15px" }}>
              {faq.title}
            </h1>
            <p style={{ color: "var(--secondary-color)", marginBottom: "40px" }}>
              هل لديك استفسارات حول منتجاتنا، أو طلباتك، أو سياسات التوصيل؟ تصفح الإجابات بالأسفل.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {faq.list.map((item, idx) => {
                const isOpen = activeFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "var(--card-bg)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--border-radius)",
                      overflow: "hidden"
                    }}
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      style={{
                        width: "100%",
                        padding: "20px 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        textAlign: "right",
                        fontWeight: "600",
                        fontSize: "15px",
                        color: "var(--primary-color)"
                      }}
                    >
                      <span>{item.q}</span>
                      {isOpen ? (
                        <Minus size={16} style={{ color: "var(--accent-color)" }} />
                      ) : (
                        <Plus size={16} style={{ color: "var(--secondary-color)" }} />
                      )}
                    </button>
                    {isOpen && (
                      <div
                        className="animate-fade-in"
                        style={{
                          padding: "0 24px 20px",
                          color: "var(--secondary-color)",
                          fontSize: "14px",
                          borderTop: "1px dashed var(--border-color)",
                          paddingTop: "16px",
                          lineHeight: "1.6"
                        }}
                      >
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "privacy":
        return (
          <div style={{ maxWidth: "800px" }}>
            <h1 className="details-title" style={{ marginBottom: "24px" }}>
              {privacy.title}
            </h1>
            <div
              style={{
                color: "var(--secondary-color)",
                lineHeight: "1.8",
                fontSize: "15px",
                whiteSpace: "pre-line"
              }}
            >
              {privacy.content}
            </div>
          </div>
        );

      case "terms":
        return (
          <div style={{ maxWidth: "800px" }}>
            <h1 className="details-title" style={{ marginBottom: "24px" }}>
              {terms.title}
            </h1>
            <div
              style={{
                color: "var(--secondary-color)",
                lineHeight: "1.8",
                fontSize: "15px",
                whiteSpace: "pre-line"
              }}
            >
              {terms.content}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="container section-padding animate-fade-in">{renderContent()}</div>;
};
