// import "./css/as-featured-in.css"
import { optimizedUrl } from "@/lib/wp-media";

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
            <img 
              src={optimizedUrl(img.img, 256)} 
              alt={img.alt} 
              loading="lazy"
              width="150"
              height="60"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
