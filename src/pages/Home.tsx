import React from "react";
import { useStore } from "../context/StoreContext";
import { HeroBlock } from "../components/blocks/HeroBlock";
import { FeaturedProducts } from "../components/blocks/FeaturedProducts";
import { PromoBanner } from "../components/blocks/PromoBanner";
import { Testimonials } from "../components/blocks/Testimonials";
import { Newsletter } from "../components/blocks/Newsletter";

export const Home: React.FC = () => {
  const { homepage } = useStore();
  const { blockOrder } = homepage;

  const renderBlock = (blockType: string) => {
    switch (blockType) {
      case "hero":
        return <HeroBlock key="hero" />;
      case "featured":
        return <FeaturedProducts key="featured" />;
      case "promo":
        return <PromoBanner key="promo" />;
      case "testimonials":
        return <Testimonials key="testimonials" />;
      case "newsletter":
        return <Newsletter key="newsletter" />;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      {blockOrder ? (
        blockOrder.map((blockType) => renderBlock(blockType))
      ) : (
        <>
          <HeroBlock />
          <FeaturedProducts />
          <PromoBanner />
          <Testimonials />
          <Newsletter />
        </>
      )}
    </div>
  );
};
