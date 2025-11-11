// import "./css/as-featured-in.css"

interface FeaturedImage {
  img: string;
  alt: string;
}

interface AsFeaturedInProps {
  asFeatureInImages: FeaturedImage[];
}

export default function AsFeaturedIn({ asFeatureInImages }: AsFeaturedInProps) {
  return (
    <div className="as-featured-in">
      <p>As Featured In:</p>
      <div className="imgs-container">
        {asFeatureInImages.map((img, i) => (
          <div className="img-container" key={img.img + i}>
            <img src={img.img} alt={img.alt} loading="eager" fetchPriority="high"/>
          </div>
        ))}
      </div>
    </div>
  );
}
