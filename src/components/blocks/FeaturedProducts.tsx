import React from "react";
import { useStore } from "../../context/StoreContext";
import { ProductCard } from "../ProductCard";

export const FeaturedProducts: React.FC = () => {
  const { homepage, products } = useStore();
  const { featured } = homepage;

  if (!featured.enabled) return null;

  const featuredItems = products.filter((prod) => prod.featured).slice(0, featured.limit);

  return (
    <section className="section-padding" style={{ backgroundColor: "var(--bg-color)" }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 style={{ fontSize: "36px", marginBottom: "12px", color: "var(--primary-color)" }}>
            {featured.title}
          </h2>
          {featured.subtitle && (
            <p style={{ color: "var(--secondary-color)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
              {featured.subtitle}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {featuredItems.length === 0 ? (
          <div className="flex-center" style={{ minHeight: "200px", color: "var(--secondary-color)" }}>
            لا توجد منتجات مميزة مضافة حالياً.
          </div>
        ) : (
          <div className="products-grid">
            {featuredItems.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
