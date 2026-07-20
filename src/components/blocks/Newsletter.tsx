import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";

export const Newsletter: React.FC = () => {
  const { homepage } = useStore();
  const { newsletter } = homepage;
  
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!newsletter.enabled) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
    setEmail("");
    setTimeout(() => setIsSubmitted(false), 5000); // reset state after 5 seconds
  };

  return (
    <section className="section-padding">
      <div className="container">
        <div className="newsletter-block">
          <h2 className="newsletter-title">{newsletter.title}</h2>
          <p className="newsletter-desc">{newsletter.description}</p>
          
          {isSubmitted ? (
            <div
              className="animate-fade-in"
              style={{
                color: "var(--accent-color)",
                fontWeight: "600",
                fontSize: "16px",
                padding: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "8px",
                maxWidth: "400px",
                margin: "0 auto"
              }}
            >
              ✓ شكراً لك! لقد انضممت بنجاح إلى قائمتنا البريدية الحصرية.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <input
                type="email"
                placeholder={newsletter.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                required
              />
              <button type="submit" className="btn btn-accent">
                {newsletter.buttonText}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
