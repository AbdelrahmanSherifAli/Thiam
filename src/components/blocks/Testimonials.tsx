import React from "react";
import { useStore } from "../../context/StoreContext";
import { Star } from "lucide-react";

export const Testimonials: React.FC = () => {
  const { homepage } = useStore();
  const { testimonials } = homepage;

  if (!testimonials.enabled) return null;

  return (
    <section className="section-padding" style={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 style={{ fontSize: "32px", color: "var(--primary-color)" }}>
            {testimonials.title}
          </h2>
        </div>

        {/* List Grid */}
        <div className="testimonials-grid">
          {testimonials.list.map((item) => (
            <div key={item.id} className="testimonial-card">
              {/* Rating stars */}
              <div style={{ display: "flex", gap: "4px", color: "#fbbf24", marginBottom: "16px" }}>
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="#fbbf24" stroke="#fbbf24" />
                ))}
              </div>

              <p className="testimonial-text">"{item.text}"</p>

              <div className="testimonial-user">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="testimonial-avatar"
                />
                <div>
                  <h4 className="testimonial-name">{item.name}</h4>
                  <span className="testimonial-role">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
