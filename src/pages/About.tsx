import React from "react";
import { useStore } from "../context/StoreContext";

export const About: React.FC = () => {
  const { pages } = useStore();
  const { about } = pages;

  return (
    <div className="container section-padding animate-fade-in">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: about.image ? "1.2fr 1fr" : "1fr",
          gap: "50px",
          alignItems: "center"
        }}
      >
        {/* About Text Content */}
        <div>
          <h1 className="details-title" style={{ marginBottom: "24px" }}>
            {about.title}
          </h1>
          <div
            style={{
              color: "var(--secondary-color)",
              lineHeight: "1.8",
              fontSize: "15px",
              whiteSpace: "pre-line" // Renders line breaks properly
            }}
          >
            {about.content}
          </div>
        </div>

        {/* About image */}
        {about.image && (
          <div>
            <img
              src={about.image}
              alt="Our legacy brand story"
              style={{
                borderRadius: "var(--border-radius)",
                width: "100%",
                maxHeight: "500px",
                objectFit: "cover",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--border-color)"
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
