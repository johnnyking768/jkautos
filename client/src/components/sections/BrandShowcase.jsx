import { Link } from "react-router-dom";

const brands = ["Toyota", "Honda", "Mercedes-Benz", "BMW", "Lexus", "Ford", "Chevrolet", "Audi", "Porsche", "Ferrari", "Lamborghini", "Range Rover", "Bentley", "Rolls-Royce", "Bugatti", "McLaren", "Volkswagen", "Hyundai", "Kia", "Nissan"];

export default function BrandShowcase() {
  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">Curated marques</p>
        <h2>Shop By Brand</h2>
      </div>
      <div className="brand-marquee">
        <div className="brand-track">
          {[...brands, ...brands].map((brand, index) => (
            <Link key={`${brand}-${index}`} to={`/cars?brand=${encodeURIComponent(brand)}`} className="brand-card">
              <span>{brand}</span>
              <small>{(index % 8) + 2} cars</small>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
